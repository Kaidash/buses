const buyToken = require('../models/buy_token');

const tokenChecker = async function (req, res, next) {
	await buyToken.clearTokensByDate();
	next()
};

module.exports = tokenChecker;
