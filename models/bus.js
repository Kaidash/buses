const db = require('./db');

// Create a new bus
const createBus = async function (name) {
	const newBus = {
		name: name
	};
	return await db.query('INSERT INTO buses ( name ) values (?)',
		[name]
	).then((result) => {
			if (result) {
				return {...newBus, id_bus: result.insertId}
			} else {
				console.error('can not find result in createBus');
				throw ('can not find result in createBus')
			}
		},
		error => {
		console.log(error);
			throw (error)
		}
	)
};

// Create a new bus
const getBusById = async function (id_bus) {
	return await db.query('SELECT * FROM users WHERE id_bus = ?', [id_bus]).then((results) => {
			if (results) {
				return results[0]
			} else {
				throw ('can not find bus by id')
			}
		},
		error => {
			throw (error)
		}
	)
};
module.exports = {
	createBus: createBus,
	getBusById: getBusById
};
