const combination = require('../models/combination');
const place = require('../models/place');
const bus = require('../models/bus');

const clearRowsByNowDate = async function (req, res, next) {
	await combination.clearCombinstionsByDate();
	await place.clearPlacesByDate();
	await bus.clearBusesByDate();
	next()
};

module.exports = clearRowsByNowDate;
