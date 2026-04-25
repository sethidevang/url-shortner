const { Url, Visit, Domain } = require('../models');
const useragent = require('useragent');
const geoip = require('geoip-lite');

exports.handleRedirect = async (req, res) => {
    try {
        const { shortId } = req.params;
        const host = req.get('host');
        let urlEntry;

        // --- CUSTOM DOMAIN LOGIC ---
        const defaultHost = process.env.DEFAULT_HOST || 'localhost:8001';
        
        if (host !== defaultHost) {
            const domainEntry = await Domain.findOne({ where: { domainName: host, isVerified: true } });
            if (domainEntry) {
                // If it's a valid domain, look for the link tied to THIS specific domain
                urlEntry = await Url.findOne({ where: { shortId, domainId: domainEntry.id } });
            }
        }

        // If it's the main app domain (defaultHost), look for links where domainId is null
        if (!urlEntry && host === defaultHost) {
            urlEntry = await Url.findOne({ where: { shortId, domainId: null } });
        }

        // Fallback to global search if not found via custom domain
        if (!urlEntry) {
            urlEntry = await Url.findOne({ where: { shortId } });
        }

        if (!urlEntry) {
            return res.status(404).render('404', { title: '404 - Not Found' });
        }

        // --- CHECK EXPIRY & LIMITS ---
        if (urlEntry.expiresAt && new Date() > urlEntry.expiresAt) {
            return res.status(410).render('404', { title: 'Link Expired', message: 'This link has expired.' });
        }

        if (urlEntry.clickLimit) {
            const clickCount = await Visit.count({ where: { urlId: urlEntry.id } });
            if (clickCount >= urlEntry.clickLimit) {
                return res.status(410).render('404', { title: 'Limit Reached', message: 'This link has reached its click limit.' });
            }
        }

        // --- TRACKING LOGIC ---
        // On localhost, req.ip is often ::1 or 127.0.0.1. We mock a public IP for testing geo charts.
        let ip = req.ip;
        if (ip === '::1' || ip === '127.0.0.1' || ip.includes('127.0.0.1')) {
            ip = '1.1.1.1'; // This will show as Australia/USA in your charts for testing
        }
        
        const geo = geoip.lookup(ip);
        const agent = useragent.parse(req.headers['user-agent']);

        const isBot = /bot|crawler|spider|crawling/i.test(req.headers['user-agent']);

        // Save Visit data asynchronously (don't block the redirect)
        Visit.create({
            urlId: urlEntry.id,
            ip: ip,
            browser: agent.family,
            os: agent.os.family,
            device: agent.device.family === 'Other' ? 'Desktop' : agent.device.family,
            country: geo ? geo.country : 'Unknown',
            city: geo ? geo.city : 'Unknown',
            isBot: isBot,
        }).catch(err => console.error('Tracking Error:', err));

        // Perform Redirect
        return res.redirect(urlEntry.redirectUrl);
    } catch (error) {
        console.error('Redirect Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
