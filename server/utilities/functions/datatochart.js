module.exports = (data) => {
	let assignObj = {};
	for (let [key, value] of Object.entries(data)) {
		let stateName = key.split(' ')[1];
		if (key.includes('ILS')) {
			if (!assignObj[stateName]) {
				assignObj[stateName] = { state: { stateName }, ILS: Number(value).toFixed(2).toString() };
			}
		}
		if (key.includes('USD') && !key.includes('market')) {
			assignObj[stateName] = { ...assignObj[stateName], state: stateName, USD: Number(value).toFixed(2).toString() };
		}
	}
	return Object.values(assignObj);
};
