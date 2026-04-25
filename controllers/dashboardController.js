const { Url, Visit, Project, Domain } = require('../models');
const { Sequelize } = require('sequelize');
const QRCode = require('qrcode');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 7;
        const offset = (page - 1) * limit;

        const whereClause = { userId };
        if (projectId) whereClause.projectId = projectId;

        // 1. Fetch Global Stats
        const allUrls = await Url.findAll({
            where: whereClause,
            include: [{ model: Visit }]
        });

        let totalClicks = 0;
        let botClicks = 0;
        allUrls.forEach(u => {
            if (u.Visits) {
                totalClicks += u.Visits.length;
                botClicks += u.Visits.filter(v => v.isBot).length;
            }
        });

        // 2. Fetch Paginated Links
        const urls = await Url.findAll({
            where: whereClause,
            include: [
                { model: Project, attributes: ['name'] },
                { model: Domain, attributes: ['domainName'] },
                { model: Visit, attributes: ['id'] }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        // 3. Analytics (Always global to user or project)
        const deviceData = await Visit.findAll({
            attributes: [
                [Sequelize.fn('COALESCE', Sequelize.col('device'), 'Unknown'), 'device'],
                [Sequelize.fn('COUNT', Sequelize.col('Visit.id')), 'count']
            ],
            include: [{ model: Url, where: whereClause, attributes: [] }],
            group: ['device'],
        });

        const countryData = await Visit.findAll({
            attributes: [
                [Sequelize.fn('COALESCE', Sequelize.col('country'), 'Local'), 'country'],
                [Sequelize.fn('COUNT', Sequelize.col('Visit.id')), 'count']
            ],
            include: [{ model: Url, where: whereClause, attributes: [] }],
            group: ['country'],
            order: [[Sequelize.literal('count'), 'DESC']],
            limit: 5,
        });

        // 4. Sidebar Data
        const projects = await Project.findAll({
            where: { userId },
            attributes: [
                'id', 'name',
                [Sequelize.literal('(SELECT COUNT(*) FROM "Urls" WHERE "Urls"."projectId" = "Project"."id")'), 'urlCount']
            ]
        });
        const domains = await Domain.findAll({ where: { userId } });

        const getCountryInfo = (code) => {
            const countries = { 'US': '🇺🇸 USA', 'IN': '🇮🇳 India', 'GB': '🇬🇧 UK', 'CA': '🇨🇦 Canada' };
            return countries[code] || `📍 ${code || 'Local'}`;
        };

        res.json({
            summary: {
                totalUrls: allUrls.length,
                totalClicks,
                botClicks,
                realClicks: totalClicks - botClicks,
                totalPages: Math.ceil(allUrls.length / limit),
                currentPage: page
            },
            urls: urls.map(u => ({
                ...u.toJSON(),
                clickCount: u.Visits ? u.Visits.length : 0
            })),
            deviceData: deviceData.map(d => ({
                device: d.get('device') || 'Other',
                count: parseInt(d.get('count'))
            })),
            countryData: countryData.map(c => ({
                country: getCountryInfo(c.get('country')),
                count: parseInt(c.get('count'))
            })),
            projects,
            domains
        });
    } catch (error) {
        console.error('DASHBOARD ERROR:', error);
        res.status(500).json({ error: error.message });
    }
};
