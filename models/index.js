const User = require('./user');
const Url = require('./url');
const Visit = require('./visit');
const Project = require('./project');
const Domain = require('./domain');
const { sequelize } = require('../config/db');

// Associations
User.hasMany(Url, { foreignKey: 'userId', onDelete: 'CASCADE' });
Url.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(Url, { foreignKey: 'projectId', onDelete: 'SET NULL' });
Url.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Domain, { foreignKey: 'userId', onDelete: 'CASCADE' });
Domain.belongsTo(User, { foreignKey: 'userId' });

Url.hasMany(Visit, { foreignKey: 'urlId', onDelete: 'CASCADE' });
Visit.belongsTo(Url, { foreignKey: 'urlId' });

const initModels = async () => {
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized with Database.');
};

Domain.hasMany(Url, { foreignKey: 'domainId' });
Url.belongsTo(Domain, { foreignKey: 'domainId' });

module.exports = { User, Url, Visit, Project, Domain, initModels };
