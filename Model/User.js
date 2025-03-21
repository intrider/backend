const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  shopName: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  AadharNo:{
    type: String,
    required: false,
    unique:true,
  },
  shopLocation:{
    type: String,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;