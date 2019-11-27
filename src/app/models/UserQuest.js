const mongoose = require("../../database");

const UserQuestSchema = new mongoose.Schema(
  {
    correct: {
      type: Boolean,
      require: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true
    },
    quest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
      require: true
    }
  },
  {
    timestamps: true
  }
);

const UserQuest = mongoose.model("UserQuest", UserQuestSchema);

module.exports = UserQuest;
