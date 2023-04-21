const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchame = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'manager']
    },
    hashedResetCode: String,
    expiredResetCode: Date,
    verifiyResetCode: Boolean,
  },
  { timestamps: true }
);

userSchame.methods.createJWT = function () {
  return jwt.sign({
    userId: this._id
  }, process.env.SECERT_JWT,
    {
      expiresIn: process.env.EXPIRED_JWT
    }
  )
};

userSchame.methods.hashPass = async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.save();
};

userSchame.methods.comparePassword = function (checkPass) {
  return bcrypt.compare(checkPass, this.password);
};

module.exports = mongoose.model('User', userSchame);

