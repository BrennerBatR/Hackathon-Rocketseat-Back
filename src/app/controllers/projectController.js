const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Project = require('../models/Project')
const Task = require('../models/Task')

const router = express.Router();

router.use(authMiddleware); //verificara o token primeiro

router.get('/', (req, res) => {
    res.send({
        user: req.userId //caso precise de mais dados no retorno de authenticação, colocá-las na criação do token 
    });
});


router.post('/', async (req, res) => {
    try {

        const { title, description, tasks } = req.body;
        const project = await Project.create({ title, description, user: req.userId }); //req.userid é preenchido na verificação do token

        await Promise.all(tasks.map(async task => { //inserindo as tasks no project (primise all esepra tudo executar pra depois salvar)
            const projectTask = new Task({ ...task, project: project._id });
            await projectTask.save();

            project.tasks.push(projectTask);
        }));


        await project.save();

        return res.send({ project });

    } catch (err) {
        return res.status(500).send({ error: 'Error creating new project' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']); //populate coloca os dados do usuario na busca
        return res.send({ projects });

    } catch (err) {
        return res.status(500).send({ error: 'Error get all projects' });
    }
});

router.get('/', async (req, res) => {
    try {
        const projectId = req.query.projectId;
        const project = await Project.findById(projectId).populate(['user', 'tasks']); //populate coloca os dados do usuario na busca

        if (project === null)
            return res.status(404).send({ error: 'Project not found' });

        return res.send({ project });

    } catch (err) {
        return res.status(500).send({ error: 'Error get project' });
    }
});

router.put('/:projectId', async (req, res) => {
    try {

        const { title, description, tasks } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.projectId,
            {
                title,
                description
            }, { new: true });//retorna os valores atualizados

        project.tasks = [];
        await Task.remove({ project: project._id });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });
            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Error creating new project' });
    }
});

router.delete('/:projectId', async (req, res) => {
    try {

        var project = await Project.findByIdAndRemove(req.params.projectId).populate('user'); //populate coloca os dados do usuario na busca
        if (project === null)
            return res.status(404).send({ error: 'Project not found' });
        return res.send({ success: 'Project deleted' });

    } catch (err) {
        return res.status(500).send({ error: 'Error deleting project' });
    }
});

module.exports = app => app.use('/projects', router);
