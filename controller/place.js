const express = require('express');
const router = express.Router();
const place = require('../models/place');
const comb = require('../models/combination');

router.put('/place', async (req, res) => {
	const body = req.body;
	if (body) {
		console.log(body);
		const places = body.places;
		if (places.length) {
			let updatedPlaces = [];
			places.forEach(async(item) => {
				const combination = await comb.findCombByIdComb(body.id_comb);
				if (combination) {
					const savePlaces = await place.reservePlaces(item.id_place, body.id_bus, combination.start_date, combination.end_date, item.place_number, body.firstName, body.lastName, body.phone);
					if (savePlaces) {
						updatedPlaces.push((item))
					}
				}
			});
			console.log(updatedPlaces, 'updatedPlaces')
		}
	} else {

	}
});

module.exports = router;
