const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Visit = sequelize.define('Visit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    urlId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    ip: {
        type: DataTypes.STRING,
    },
    browser: {
        type: DataTypes.STRING,
    },
    os: {
        type: DataTypes.STRING,
    },
    device: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    isBot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    updatedAt: false, // Visits are immutable
});

module.exports = Visit;
