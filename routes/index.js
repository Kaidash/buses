const auth = require('../utils/auth');
const place = require('../models/place');
const buyToken = require('../models/buy_token');
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

    // confirm buy place from email
	app.get('/buy', async (req, res, next) => {
		const token = req.query.token;
        try {
			if (token) {
				const tokenRow  = await buyToken.getToken(token);
				console.log(tokenRow.id_place, 'tokenRow');
				if (tokenRow) {
					const placeRow = await place.getPlacesByPlaceId(tokenRow.id_place);
					console.log(placeRow, 'placeRow');
					if (placeRow && placeRow.buyed === 0) {
						const buyedStatus = await place.buyPlaces(placeRow);
						console.log(buyedStatus, 'buyedStatus');
						if (buyedStatus) {
						    await buyToken.deleteToken(token);
							res.redirect('/successBuy')
						} else {
							console.error('Place did not buy');
							res.redirect('/404')
						}
					} else {
						console.error('Place already buyed');
						res.redirect('/404')
					}
				} else {
					console.error('Can not find place');
					res.redirect('/404')
				}
			} else {
				console.error('Token is empty');
				res.redirect('/404')
			}
		} catch (e) {
			console.error('Something went wrong');
			res.redirect('/404')
		}
	});

    app.get('/admin', auth.requireLogin, (req, res, next) => {
        res.render('admin', {user: req.user});
    });

	app.get('/successBuy', (req, res, next) => {
		res.render('successBuy');
	});

	app.get('/404', (req, res, next) => {
		res.render('404');
	});
	app.get('/error', (req, res, next) => {
		res.render('error');
	});
};
