const mongoose = require("../../database");

const MatterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true
    },
    school: {
      type: String,
      require: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      require: true
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Matter = mongoose.model("Matter", MatterSchema);

module.exports = Matter;
