const mongoose = require('mongoose');
const { Schema } = mongoose;

const dataCenterSchema = new Schema({
	centerId: String,
	centerName: String,
	information: [{ informationName: String, infoType: String, data: [Schema.Types.Mixed] }],
});

const DataCenter = mongoose.model('dataCenter', dataCenterSchema);

module.exports = DataCenter;
