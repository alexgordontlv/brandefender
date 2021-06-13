require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const convertDataToChart = require('./utilities/functions/datatochart');
const fetchNewCryptoData = require('./utilities/functions/fetchnewdata');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

(async () => {
	const cryptoData = await fetchNewCryptoData();

	app.get('/crypto-data/:requestDate', async (req, res) => {
		const { requestDate } = req.params;
		const formatedDate = moment(new Date(requestDate)).format('YYYY-MM-DD');

		if (!moment(new Date(requestDate), 'YYYY-MM-DD').isValid() || !cryptoData[formatedDate]) {
			return res.status(400).send(new Error());
		}
		const chartFormatData = convertDataToChart(cryptoData[formatedDate]);
		return res.status(200).send(chartFormatData);
	});

	app.listen(PORT, () => {
		console.log('server started on port 5000');
	});
})();
