const { Project } = require('../models');

exports.createProject = async (req, res) => {
    try {
        const { name } = req.body;
        const project = await Project.create({
            name,
            userId: req.user.id
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { userId: req.user.id }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
