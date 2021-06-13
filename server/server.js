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
let currentNisAmount = 3.9;

app.use(cors());

const fetchNewData = async (currentDate) => {
	const { data } = await axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=${alphaApikey}`);
	const currentCurrency = data['Time Series (Digital Currency Daily)']?.currentDate;
	if (currentCurrency) return currentCurrency;
	return null;
};

const fetchCurrentILSCurrency = async () => {
	const { data } = await axios.get('https://api.fastforex.io/fetch-one?from=USD&to=ILS&api_key=add3dd4364-0696f3064b-qumozl');
	return data;
};

(async () => {
	const { result } = await fetchCurrentILSCurrency();
	console.log(result);
	currentNisAmount = result.ILS;
	console.log(currentNisAmount);
	app.get('/crypto-data/:requestDate', async (req, res) => {
		const { requestDate } = req.params;
		if (!moment(new Date(requestDate), 'YYYY-MM-DD').isValid()) {
			return res.status(400).send({ message: 'bad request date' });
		}

		const formatedDate = moment(new Date(requestDate)).format('YYYY-MM-DD');
		console.log(formatedDate);

		if (!cryptoData[formatedDate]) {
			const response = await fetchNewData(formatedDate);
			if (!response) return res.status(400).send({ message: 'no records for this date' });

			cryptoData[formatedDate] = response;
		}
		try {
			const dataMap = [];
			for (let [key, value] of Object.entries(cryptoData[formatedDate])) {
				if (key.includes('USD') && !key.includes('market')) {
					dataMap.push({
						state: key.split(' ')[1],
						valueUSD: value,
						valueNIS: (currentNisAmount * value).toFixed(2).toString(),
					});
				}
			}
			// const foundDataCenter = await DataCenter.findOne({ centerId });
			return res.status(200).send(dataMap);
		} catch (error) {
			return res.status(500).send({ message: error });
		}
	});

	app.listen(PORT, () => {
		console.log('server started on port 5000');
	});
})();
