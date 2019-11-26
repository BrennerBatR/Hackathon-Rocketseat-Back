const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Matter = require("../models/Matter");
const Module = require("../models/Module");

const router = express.Router();

router.use(authMiddleware); //verificara o token primeiro

router.get("/", (req, res) => {
  res.send({
    user: req.userId //caso precise de mais dados no retorno de authenticação, colocá-las na criação do token
  });
});

router.post("/", async (req, res) => {
  try {
    const { title, school } = req.body;
    if (modules == null || modules.lenght == 0)
      return res.status(400).send({ error: "Modules can't be null" });
    const matter = await Matter.create({
      title,
      school
    }); //req.userid é preenchido na verificação do token

    await Promise.all(
      modules.map(async module => {
        //inserindo as modules no matter (primise all esepra tudo executar pra depois salvar)
        const matterModule = new Module({ ...module, matter: matter._id });
        await matterModule.save();

        matter.modules.push(matterModule);
      })
    );

    await matter.save();

    return res.send({ matter });
  } catch (err) {
    return res.status(500).send({ error: "Error creating new matter" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const matters = await Matter.find().populate(["user", "modules"]); //populate coloca os dados do usuario na busca
    return res.send({ matters });
  } catch (err) {
    return res.status(500).send({ error: "Error get all matters" });
  }
});

router.get("/", async (req, res) => {
  try {
    const matterId = req.query.matterId;
    const matter = await Matter.findById(matterId).populate([
      "user",
      "modules"
    ]); //populate coloca os dados do usuario na busca

    if (matter === null)
      return res.status(404).send({ error: "Matter not found" });

    return res.send({ matter });
  } catch (err) {
    return res.status(500).send({ error: "Error get matter" });
  }
});

router.put("/:matterId", async (req, res) => {
  try {
    const { title, description, modules } = req.body;
    const matter = await Matter.findByIdAndUpdate(
      req.params.matterId,
      {
        title,
        description
      },
      { new: true }
    ); //retorna os valores atualizados

    matter.modules = [];
    await Module.remove({ matter: matter._id });

    await Promise.all(
      modules.map(async module => {
        const matterModule = new Module({ ...module, matter: matter._id });
        await matterModule.save();

        matter.modules.push(matterModule);
      })
    );

    await matter.save();

    return res.send({ matter });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error creating new matter" });
  }
});

router.delete("/:matterId", async (req, res) => {
  try {
    var matter = await Matter.findByIdAndRemove(req.params.matterId).populate(
      "user"
    ); //populate coloca os dados do usuario na busca
    if (matter === null)
      return res.status(404).send({ error: "Matter not found" });
    return res.send({ success: "Matter deleted" });
  } catch (err) {
    return res.status(500).send({ error: "Error deleting matter" });
  }
});

module.exports = app => app.use("/matters", router);
