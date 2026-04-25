const { Url, Visit, User, Project, Domain } = require('../models');
const QRCode = require('qrcode');

exports.createUrl = async (req, res) => {
    try {
        const { redirectUrl, customId, projectId, expiresAt, clickLimit, domainId } = req.body;
        if (!redirectUrl) return res.status(400).json({ error: 'URL is required' });

        const { nanoid } = await import('nanoid');
        const shortId = customId || nanoid(6);

        const urlEntry = await Url.create({
            shortId,
            redirectUrl,
            userId: req.user.id,
            projectId: projectId || null,
            expiresAt: expiresAt || null,
            clickLimit: clickLimit || null,
            domainId: domainId || null
        });

        const fullUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
        const qrCode = await QRCode.toDataURL(fullUrl);

        res.status(201).json({ ...urlEntry.toJSON(), qrCode, fullUrl });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Short ID already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getUserUrls = async (req, res) => {
    try {
        const { projectId, page } = req.query;
        const limit = 7;
        const offset = (page ? (parseInt(page) - 1) * limit : 0);

        const whereClause = { userId: req.user.id };
        if (projectId) whereClause.projectId = projectId;

        const urls = await Url.findAll({
            where: whereClause,
            include: [
                { model: Visit },
                { model: Project, attributes: ['name'] },
                { model: Domain, attributes: ['domainName'] }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        // Attach clickCount for the frontend
        const result = urls.map(u => ({
            ...u.toJSON(),
            clickCount: u.Visits ? u.Visits.length : 0
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUrlById = async (req, res) => {
    try {
        const url = await Url.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [
                { model: Visit },
                { model: Domain, attributes: ['domainName'] },
                { model: Project, attributes: ['name'] }
            ]
        });
        if (!url) return res.status(404).json({ error: 'Link not found' });
        res.json(url);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBurnerLink = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const { nanoid } = await import('nanoid');
        const shortId = nanoid(8);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

        const systemUser = await User.findOne({ where: { email: 'system@shorten.io' } });

        const urlEntry = await Url.create({
            shortId,
            redirectUrl: url,
            expiresAt,
            userId: systemUser ? systemUser.id : null
        });

        const fullUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
        const qrCode = await QRCode.toDataURL(fullUrl);

        res.status(201).json({ ...urlEntry.toJSON(), qrCode, fullUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
