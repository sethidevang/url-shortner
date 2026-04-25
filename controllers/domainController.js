const { Domain } = require('../models');

exports.addDomain = async (req, res) => {
    try {
        const { domainName } = req.body;
        // Basic validation
        if (!domainName || !domainName.includes('.')) {
            return res.status(400).json({ error: 'Invalid domain name' });
        }

        const domain = await Domain.create({
            domainName: domainName.toLowerCase(),
            userId: req.user.id,
            isVerified: true // Auto-verify for now in MVP
        });
        res.status(201).json(domain);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Domain already registered' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getDomains = async (req, res) => {
    try {
        const domains = await Domain.findAll({ where: { userId: req.user.id } });
        res.json(domains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDomain = async (req, res) => {
    try {
        const { id } = req.params;
        await Domain.destroy({ where: { id, userId: req.user.id } });
        res.json({ message: 'Domain removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
