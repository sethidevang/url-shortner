const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Url = sequelize.define('Url', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    shortId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    redirectUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    clickLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    domainId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Url;
