const db = require('./db');

// Create a new bus
const createBus = async function (name, start_date, end_date) {
	const newBus = {
		name: name,
		start_date: start_date,
		end_date: end_date
	};
	return await db.query('INSERT INTO buses ( name, start_date_bus, end_date_bus ) values (?, ?, ?)',
		[name, start_date, end_date]
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

// Clear buses by now date
const clearBusesByDate = async function() {
	return await db.query(`DELETE FROM buses WHERE end_date_bus <= NOW()`).then((results) => {
			if (results) {
				return results[0]
			} else {
				throw ('can not delete bus')
			}
		},
		error => {
			console.log(error);
			throw (error)
		}
	)
};

module.exports = {
	createBus: createBus,
	getBusById: getBusById,
	clearBusesByDate: clearBusesByDate
};
