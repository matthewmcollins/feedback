//Figure out what set of credentials to return
if (proces.env.NODE_ENV === "production") {
  //return prod keys
  module.exports = require("./prod");
} else {
  //return dev keys
  module.exports = require("./dev");
}
