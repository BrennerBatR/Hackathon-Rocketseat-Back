const mongoose = require("../../database");

const QuestSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      require: true
    },
    answer: {
      type: String,
      require: true
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      require: true
    }
  },
  {
    timestamps: true
  }
);

const Quest = mongoose.model("Quest", QuestSchema);

module.exports = Quest;
