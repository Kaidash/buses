const db     = require('./db');
const uuidV4 = require('uuid/v4');
const mysql = require('mysql');
const moment = require('moment');
// Gets a random id for this user
const generateToken= function() {
	return uuidV4();
};

// Create a new buy token
const getToken = async function (token) {
	return await db.query('SELECT * FROM buy_token WHERE buy_token = ?', [token]).then((results) => {
			if (results) {
				return results[0]
			} else {
				throw ('can not find result in createToken')
			}
		},
		error => { throw (error) }
	)
};

// Create a new buy token
const createToken = async function (id_place) {
	const token = generateToken();
	const newToken = {
		id_place: id_place,
		buy_token: token
	};
	return await db.query('INSERT INTO buy_token ( buy_token, id_place) values (?,?)',
		[token, id_place]
	).then((result) => {
			if (result) {
				return { newToken }
			} else {
				throw ('can not find result in createToken')
			}
		},
		error => { throw (error) }
	)
};

// delete token
const deleteToken = async function (token) {
	return await db.query('DELETE FROM buy_token WHERE buy_token = ?', [token]).then((results) => {
			if (results) {
				return true
			} else {
				throw ('can not find result in createToken')
			}
		},
		error => {
		console.error(error);
			throw (error)
		}
	)
};

// delete token by date
const clearTokensByDate = async function () {
	return await db.query('DELETE FROM buy_token WHERE create_at <= DATE_SUB(NOW(), INTERVAL 1 DAY)').then((results) => {
			if (results) {
				return true
			} else {
				throw ('can not find result in createToken')
			}
		},
		error => {
			console.error(error);
			throw (error)
		}
	)
};

module.exports = {
	getToken: getToken,
	createToken: createToken,
	deleteToken: deleteToken,
	clearTokensByDate: clearTokensByDate
};
