require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const DataCenter = require('./models/schema');
const axios = require('axios');
const moment = require('moment');
const cryptoData = require('./cryptodata/cryptodata');
const dbURI = process.env.MONGO_DB_CREDENTIALS;
const PORT = process.env.PORT || 5000;
const alphaApikey = process.env.ALPHA_API_KEY;
const fetchNewData = async (currentDate) => {
	const response = await axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=${alphaApikey}`);
	cryptoData[currentDate] = response.data['Time Series (Digital Currency Daily)'][currentDate];
};

(async () => {
	app.use(cors());
	app.use(express.static(path.join(__dirname, '..', 'build')));
	app.use(express.static('public'));

	app.get('/crypto-data/:requestDate', async (req, res) => {
		const { requestDate } = req.params;

		if (!moment(new Date(requestDate), 'YYYY-MM-DD').isValid()) {
			return res.status(400).send({ message: 'bad request date' });
		}

		const formatedDate = moment(new Date(requestDate)).format('YYYY-MM-DD');
		console.log(formatedDate);

		// if (!cryptoData.dates[currentDate]) {
		// 	fetchNewData(currentDate);
		// 	console.log('2', cryptoData.dates[currentDate]);
		// }
		try {
			// const foundDataCenter = await DataCenter.findOne({ centerId });
			return res.status(200).send(cryptoData[formatedDate]);
		} catch (error) {
			return res.status(500).send({ message: error });
		}
	});

	app.use((req, res) => {
		res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
	});

	app.listen(PORT, () => {
		console.log('server started on port 5000');
	});
})();
