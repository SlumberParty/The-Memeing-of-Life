const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  top: String,
  image: {
    type: String,
    required: true 
  },
  bottom: String
});

const Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;
