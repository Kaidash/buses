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
        return { ...newComb, id: result.insertId}
      } else {
        throw ('can not find result in createBus')
      }
    },
    error => { throw (error) }
  )
};
module.exports = createComb;
