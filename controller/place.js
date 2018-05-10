const express = require('express');
const router = express.Router();
const place = require('../models/place');
const comb = require('../models/combination');
const buyToken = require('../models/buy_token');
const admins = require('../config/admin');
const smtpCongig = require('../config/smtp');
const nodemailer = require('nodemailer');
const asyncForEach = require('../utils/asyncForEach');

let smtp = nodemailer.createTransport(`smtps://${smtpCongig.smtp_email}:${smtpCongig.smtp_password}@${smtpCongig.smtp_host}`);

router.put('/place', async (req, res) => {
	const body = req.body;
	if (body) {
		try {
			const places = body.places;
			if (places.length) {
				let updatedPlaces = [];
				places.forEach(async(item) => {
					const combination = await comb.findCombByIdComb(body.id_comb);
					if (combination) {
						const savePlaces = await place.reservePlaces(item.id_place, body.id_bus, combination.start_date, combination.end_date, item.place_number, body.firstName, body.lastName, body.phone);
						const createdToken = await buyToken.createToken(item.id_place);

						if (savePlaces && createdToken) {
							await asyncForEach(admins, async (adminItem) => {
								smtp.sendMail({
										from : smtpCongig.smtp_email,
										to : adminItem,
										subject : 'Подтверждение бронирования',
										html:
										`<b>Информция о пассажире:</b> ${body.firstName} ${body.lastName}, телефон: ${body.phone}<br />` +
										`<b>Станция назначения:</b> ${combination.comb_from} - ${combination.comb_to}<br />` +
										`<b>Время:</b> ${combination.start_date} - ${combination.end_date}<br />` +
										`<b>Номер места:</b> ${item.place_number}<br />` +
										`<b>Цена места:</b> ${item.price}<br />` +
										`<b>Нажмите чтоб забранировать место для юзера</b>: <a href=\'http://localhost:3000/buy/?token=${createdToken.newToken.buy_token}\'>тут</a><br />`,
									},
									(error, success) => {
										if (error){
											console.log(error)
										} else if (success) {
											console.log(success)
										}
									});
							});
							res.status(200).json({message: 'success'})
						}
					}
				});
			}
		}catch (e) {
			res.status(403).json({error: 'Something went wrong!'})
		}
	} else {
		res.status(403).json({error: 'Body is empty'})
	}
});

module.exports = router;
