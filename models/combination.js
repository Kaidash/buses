const mysql = require('mysql');
const db     = require('./db');
// Create a new combination
const createComb = async function({ id_bus, comb_from, comb_to, start_date, end_date}) {
  const newComb = {
    id_bus: id_bus,
    comb_from: comb_from,
    comb_to: comb_to,
    start_date: start_date,
    end_date: end_date
  };
  return await db.query('INSERT INTO combinations ( id_bus, comb_from, comb_to, start_date, end_date) values (?,?,?,?,?)',
    [newComb.id_bus, newComb.comb_from, newComb.comb_to, newComb.start_date, newComb.end_date]
  ).then((result) => {
      if (result) {
        return { ...newComb, id_comb: result.insertId}
      } else {
        throw ('can not find result in createBus')
      }
    },
    error => { console.error(error) }
  )
};
// Search combinations
const searchComb = async function(comb_from, comb_to, start_date, end_date) {
    return await db.query(`SELECT *, name FROM combinations INNER JOIN buses ON combinations.id_bus = buses.id_bus
    WHERE comb_from = ${mysql.escape(comb_from)} AND comb_to = ${mysql.escape(comb_to)} 
    AND start_date >= ${mysql.escape(start_date)} AND start_date <= ${mysql.escape(end_date)}`
    ).then((results) => {
            if (results) {
                console.log(results, 'RESULTS COMB SEATCH');
                return results;
            } else {
                throw ('can not find result in createBus')
            }
        },
        error => { throw (error) }
    )
};
// Find combination dates
const findCombByIdComb = async function(id_comb) {
	return await db.query('SELECT * FROM combinations WHERE id_comb = ?',
        [id_comb]
	).then((results) => {
			if (results) {
				return results[0];
			} else {
				throw ('can not find result in findCombByIdComb')
			}
		},
		error => { throw (error) }
	)
};

// Clear combinations if now() date is !== start date
const clearCombinstionsByDate = async function () {
	return await db.query('DELETE FROM combinations WHERE start_date <= NOW()').then((results) => {
			if (results) {
				return true
			} else {
				throw ('can not cleat combination')
			}
		},
		error => {
			console.error(error);
			throw (error)
		}
	)
};
module.exports = {
    createComb: createComb,
    searchComb: searchComb,
	findCombByIdComb: findCombByIdComb,
	clearCombinstionsByDate: clearCombinstionsByDate
};
