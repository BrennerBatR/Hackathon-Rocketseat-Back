const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Quest = require("../models/Quest");

const router = express.Router();

router.use(authMiddleware); //verificara o token primeiro

router.get("/", (req, res) => {
  res.send({
    user: req.userId
  });
});

router.post("/", async (req, res) => {
  try {
    const quest = await Quest.create(req.body);
    return res.send(await quest.save());
  } catch (err) {
    return res.status(500).send({ error: "Error creating new quest" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const quests = await Quest.find().populate(["user", "modules"]); //populate coloca os dados do usuario na busca
    return res.send(quests);
  } catch (err) {
    return res.status(500).send({ error: "Error get all quests" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id).populate([
      "user",
      "modules"
    ]);

    if (quest === null)
      return res.status(404).send({ error: "Quest not found" });

    return res.send(quest);
  } catch (err) {
    return res.status(500).send({ error: "Error get quest" });
  }
});

router.put("/:questId", async (req, res) => {
  try {
    const { title, description, modules } = req.body;
    const quest = await Quest.findByIdAndUpdate(
      req.params.questId,
      {
        title,
        description
      },
      { new: true }
    );

    await quest.save();

    return res.send(quest);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error creating new quest" });
  }
});

router.delete("/:questId", async (req, res) => {
  try {
    var quest = await Quest.findByIdAndRemove(req.params.questId).populate(
      "user"
    );
    if (quest === null)
      return res.status(404).send({ error: "Quest not found" });
    return res.send({ success: "Quest deleted" });
  } catch (err) {
    return res.status(500).send({ error: "Error deleting quest" });
  }
});

module.exports = app => app.use("/quests", router);
