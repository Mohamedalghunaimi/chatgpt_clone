
const ImageKit = require("imagekit");
require("dotenv").config()
const imagekit = new ImageKit({
  publicKey: process.env.public_key,
  privateKey: process.env.private_key,
  urlEndpoint: process.env.URL_endpoint
});
module.exports = {
    imagekit
}