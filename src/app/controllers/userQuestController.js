const express = require("express");
const authMiddleware = require("../middlewares/auth");
const UserQuest = require("../models/UserQuest");

const router = express.Router();

router.use(authMiddleware); //verificara o token primeiro

router.get("/", (req, res) => {
  res.send({
    user: req.userId
  });
});

router.post("/", async (req, res) => {
  try {
    const userQuest = await UserQuest.create(req.body);
    return res.send(await userQuest.save());
  } catch (err) {
    return res.status(500).send({ error: "Error creating new userQuest" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const userQuests = await UserQuest.find().populate(["user", "quest"]); //populate coloca os dados do usuario na busca
    return res.send(userQuests);
  } catch (err) {
    return res.status(500).send({ error: "Error get all userQuests" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userQuest = await UserQuest.findById(req.params.id).populate([
      "user",
      "modules"
    ]);

    if (userQuest === null)
      return res.status(404).send({ error: "UserQuest not found" });

    return res.send(userQuest);
  } catch (err) {
    return res.status(500).send({ error: "Error get userQuest" });
  }
});

router.put("/:userQuestId", async (req, res) => {
  try {
    const { title, description, modules } = req.body;
    const userQuest = await UserQuest.findByIdAndUpdate(
      req.params.userQuestId,
      {
        title,
        description
      },
      { new: true }
    );

    await userQuest.save();

    return res.send(userQuest);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error creating new userQuest" });
  }
});

router.delete("/:userQuestId", async (req, res) => {
  try {
    var userQuest = await UserQuest.findByIdAndRemove(req.params.userQuestId).populate(
      "user"
    );
    if (userQuest === null)
      return res.status(404).send({ error: "UserQuest not found" });
    return res.send({ success: "UserQuest deleted" });
  } catch (err) {
    return res.status(500).send({ error: "Error deleting userQuest" });
  }
});

module.exports = app => app.use("/userQuests", router);
