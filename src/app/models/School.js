const mongoose = require("../../database");

const SchoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    cnpj: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const School = mongoose.model("School", SchoolSchema);

module.exports = School;
