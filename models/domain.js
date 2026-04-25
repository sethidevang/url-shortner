const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Domain = sequelize.define('Domain', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    domainName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isLowercase: true,
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
});

module.exports = Domain;
