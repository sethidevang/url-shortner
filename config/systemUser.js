const { User } = require('../models');

const initSystemUser = async () => {
    try {
        const [systemUser, created] = await User.findOrCreate({
            where: { email: 'system@shorten.io' },
            defaults: {
                name: 'GHOST_SYSTEM',
                password: 'SYSTEM_PROTECTED_ACCOUNT_' + Math.random(), // Secure random pass
                email: 'system@shorten.io'
            }
        });
        
        if (created) {
            console.log('✅ Ghost System User Created.');
        }
        return systemUser.id;
    } catch (error) {
        console.error('Error creating system user:', error);
    }
};

module.exports = { initSystemUser };
