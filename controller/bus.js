const express = require('express');
const router = express.Router();
const createBus = require('../models/bus');
const place = require('../models/place');
const comb = require('../models/combination');

router.get('/bus', async (req, res) => {
    const comb_from = req.query.comb_from;
    const comb_to = req.query.comb_to;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    if (comb_from && comb_to && start_date) {
        try {
            const combinations = await comb.searchComb(comb_from, comb_to, start_date, end_date);
            if (combinations.length) {
                res.status(200).json({combinations: combinations})
            } else {
                res.status(200).json({combinations: []})
            }
        } catch (e) {
            console.log(e);
            res.status(403).json({error: 'searchComb is wrong'})
        }
    }
});

router.post('/bus', async (req, res) => {
    if (req.body.name) {
        try {
            const newBus = await createBus(req.body);
            if (newBus) {
                if (req.body.combinations.length) {
                    let places = [];
                    let combinations = [];
                    for (let combItem of req.body.combinations) {
                        const combination = await comb.createComb({id_bus: newBus.id_bus, ...combItem});
                            if (combination) {
                                combinations.push(combination);
                                console.log(combination, 'combination');
                                for (let countIndex = 1; countIndex <= Number(req.body.places); countIndex++) {
                                    const placeItem = await place.createPlace(
                                        {
                                            id_bus: newBus.id_bus,
                                            id_comb: combination.id_comb,
                                            status: 0,
                                            price: 0,
                                            place_number: countIndex,
                                            start_date: combination.start_date,
                                            end_date: combination.end_date
                                        });
                                    if (placeItem) {
                                        places.push(placeItem)
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
