const axios = require('axios');
const alphaApikey = process.env.ALPHA_API_KEY;

//I guess best way would be store on a key-value db and compare each time new dates are requested
//also the data on our db would be allready in a suitable chart format
module.exports = async () => {
	try {
		const { data } = await axios.get(
			`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=ILS&apikey=${alphaApikey}`
		);
		const fetchedCryptoData = data['Time Series (Digital Currency Daily)'];
		return fetchedCryptoData;
	} catch (error) {
		console.log(error);
	}
};
