const auth = require('../utils/auth');
const place = require('../models/place');
// Main routes for app
module.exports = function (app) {
    app.get('/', (req, res, next) => {
        res.render('index');
    });

    app.get('/bus', async (req, res, next) => {
        const id_bus = req.query.id_bus;
        const id_comb = req.query.id_comb;
        if (id_bus && id_comb) {
            const places = await place.getPlaces(id_bus, id_comb);
			res.render('bus', {id_bus: id_bus, id_comb: id_comb, places: places});
		} else {
            res.redirect('/')
        }
    });

    app.get('/admin', auth.requireLogin, (req, res, next) => {
        res.render('admin', {user: req.user});
    });
};
