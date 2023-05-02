const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: [true, "Email Exist"],
      },

      name: {
        type: String,
        required: [true, "Please provide a name!"],
        // unique: false,
      },
    
      password: {
        type: String,
        required: [true, "Please provide a password!"],
        // unique: false,
      },

      friends:{
        type: Array
      },

      friendReqs:{
        type: Array
      },

      pendingReqs:{
        type: Array
      },
      imgProfile:
      {
          type:String
      },
      badges:{
        type: Array
      },
      lifetimeHours: {
        type: Number
      },
      currentStreak: {
        type: Number
      },
      longestStreak: {
        type: Number
      }
  })

  module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);

  