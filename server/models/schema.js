const mongoose = require('mongoose');
const { Schema } = mongoose;

const cryptoSchema = new Schema({});

const CryptoData = mongoose.model('cryptodata', cryptoSchema);

module.exports = CryptoData;
