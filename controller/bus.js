const express = require('express');
const router = express.Router();
const createBus = require('../models/bus');
const createComb = require('../models/combination');
const createPlace = require('../models/place');
const asyncForEach = require('../utils/asyncForEach');
const asyncForEachByNumber = require('../utils/asyncForEachByNumber');
router.post('/bus', async (req, res) => {
    if (req.body.name) {
        try {
            const newBus = await createBus(req.body);
            if (newBus) {
                if (req.body.combinations.length) {
                    let places = [];
                    let combinations = [];
                    for (let comb of req.body.combinations) {
                        const combination = await createComb({id_bus: newBus.id, ...comb});
                            if (combination) {
                                combinations.push(combination);
                                for (let countIndex = 0; countIndex <= Number(req.body.places); countIndex++) {
                                    const place = await createPlace(
                                        {
                                            id_bus: newBus.id,
                                            id_comb: combination.id,
                                            status: 0,
                                            price: 0,
                                            place_number: countIndex
                                        });
                                    if (place) {
                                        places.push(place)
                                    } else {
                                        res.status(403).json({error: 'Places is empty'})
                                    }
                                }
                            } else {
                                res.status(403).json({error: 'Combinations is empty1'})
                            }
                    }
                    if (places.length) {
                        res.status(200).json({
                            combinations: combinations,
                            places: places
                        })
                    } else {
                        res.status(403).json({error: 'Places is empty3'})
                    }
                } else {
                    res.status(403).json({error: 'Combinations is empty3'})
                }
            }
        } catch (e) {
            res.status(403).json({error: 'Something went wrong'})
        }
    }
});

module.exports = router;
