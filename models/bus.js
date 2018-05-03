const db     = require('./db');

// Create a new bus
const createBus = async function({ name }) {
  const newBus = {
    name: name
  };
  return await db.query('INSERT INTO buses ( name ) values (?)',
    [newBus.name]
  ).then((result) => {
    if (result) {
      return { ...newBus, id: result.insertId}
    } else {
      throw ('can not find result in createBus')
    }
  },
    error => { throw (error) }
  )
};
module.exports = createBus;
