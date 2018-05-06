const db     = require('./db');
const mysql = require('mysql');
// Create a new place
const createPlace = async function({ id_bus, id_comb, status, price, place_number, start_date, end_date}) {
  const newPlace = {
    id_bus: id_bus,
    id_comb: id_comb,
    status: status,
    price: price,
    place_number: place_number
  };
  return await db.query('INSERT INTO places ( id_bus, id_comb, status, price, place_number, start_date, end_date) values (?,?,?,?,?,?,?)',
    [id_bus, id_comb, status, price, place_number, start_date, end_date ]
  ).then((result) => {
      if (result) {
        return { ...newPlace, id_place: result.insertId}
      } else {
        throw ('can not find result in createPlace')
      }
    },
    error => { throw (error) }
  )
};

const reservePlaces = async function(id_place, id_bus, start_date, end_date, place_number, firstName, lastName, phone) {
	return await db.query(`
	UPDATE places
	SET status = ${mysql.escape('1')}, first_name = ${mysql.escape(firstName)}, last_name = ${mysql.escape(lastName)},
	phone = ${mysql.escape(phone)}
    WHERE place_number = ${mysql.escape(place_number)} AND id_bus = ${mysql.escape(id_bus)}
    AND (start_date = ${mysql.escape(start_date)} AND end_date = ${mysql.escape(end_date)}
    OR start_date = ${mysql.escape(start_date)}
    OR end_date = ${mysql.escape(end_date)}
    OR start_date > ${mysql.escape(start_date)} AND end_date <= ${mysql.escape(end_date)})
     `
	).then(() => {
		return true;
		},
		error => { throw (error) }
	)
};
// Get place
const getPlaces = async function(id_bus, id_comb) {
	return await db.query(`SELECT * FROM places WHERE id_bus = ${mysql.escape(id_bus)}
	AND id_comb = ${mysql.escape(id_comb)}`
	).then((results) => {
			if (results) {
				return results
			} else {
				throw ('can not find result in getPlaces')
			}
		},
		error => { throw (error) }
	)
};
module.exports = {
	createPlace: createPlace,
	getPlaces: getPlaces,
	reservePlaces: reservePlaces
};
