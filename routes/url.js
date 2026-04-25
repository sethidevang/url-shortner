const express = require('express');
const { createUrl, getUserUrls, createBurnerLink, getUrlById } = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public/Semi-public: Optional protection if we want to track who created it
router.post('/', (req, res, next) => {
    // If token exists, use protect, otherwise continue as guest
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
}, createUrl);
router.post('/burner', createBurnerLink);

// Private: Only for logged in users
router.get('/my-urls', protect, getUserUrls);
router.get('/:id', protect, getUrlById);

module.exports = router;