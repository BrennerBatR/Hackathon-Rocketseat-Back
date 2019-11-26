const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true
    },
    /*  type: {
    type: String,
    required: true,
    lowercase: true
  }, */
    password: {
      type: String,
      require: true,
      select: false
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", async function(next) {
  const hash = await bcrypt.hash(this.password, 10); //(10 = quantas vezes vai encriptar)
  this.password = hash;

  next();
}); 
const User = mongoose.model("User", UserSchema);

module.exports = User;
