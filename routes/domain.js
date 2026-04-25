const express = require('express');
const { addDomain, getDomains, deleteDomain } = require('../controllers/domainController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addDomain);
router.get('/', protect, getDomains);
router.delete('/:id', protect, deleteDomain);

module.exports = router;
