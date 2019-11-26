const mongoose = require("../../database");

const ModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true
    },
    matter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matter",
      require: true
    }
  },
  {
    timestamps: true
  }
);

const Module = mongoose.model("Module", ModuleSchema);

module.exports = Module;
