const mongoose = require("mongoose");
const { Schema } = mongoose; //destructoring - same as const {Schema} = mongoose;
const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 } //user starts with 0 credits
});

//will create this collection if it does not exist, else just will know about it
//loads a schema into mongoose
mongoose.model("users", userSchema);
