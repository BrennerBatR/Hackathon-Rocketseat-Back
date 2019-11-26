const express = require("express");
const authMiddleware = require("../middlewares/auth");
const School = require("../models/School");

const router = express.Router();

router.use(authMiddleware); //verificara o token primeiro

router.get("/", (req, res) => {
  res.send({
    user: req.userId
  });
});

router.post("/", async (req, res) => {
  try {
    const school = await School.create(req.body);
    return res.send(await school.save());
  } catch (err) {
    return res.status(500).send({ error: "Error creating new school" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const schools = await School.find().populate(["user", "modules"]); //populate coloca os dados do usuario na busca
    return res.send(schools);
  } catch (err) {
    return res.status(500).send({ error: "Error get all schools" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate([
      "user",
      "modules"
    ]);

    if (school === null)
      return res.status(404).send({ error: "School not found" });

    return res.send(school);
  } catch (err) {
    return res.status(500).send({ error: "Error get school" });
  }
});

router.put("/:schoolId", async (req, res) => {
  try {
    const { title, description, modules } = req.body;
    const school = await School.findByIdAndUpdate(
      req.params.schoolId,
      {
        title,
        description
      },
      { new: true }
    );

    await school.save();

    return res.send(school);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error creating new school" });
  }
});

router.delete("/:schoolId", async (req, res) => {
  try {
    var school = await School.findByIdAndRemove(req.params.schoolId).populate(
      "user"
    );
    if (school === null)
      return res.status(404).send({ error: "School not found" });
    return res.send({ success: "School deleted" });
  } catch (err) {
    return res.status(500).send({ error: "Error deleting school" });
  }
});

module.exports = app => app.use("/schools", router);
