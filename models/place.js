const db     = require('./db');
// Create a new place
const createPlace = async function({ id_bus, id_comb, status, price, place_number}) {
  const newPlace = {
    id_bus: id_bus,
    id_comb: id_comb,
    status: status,
    price: price,
    place_number: place_number
  };
  return await db.query('INSERT INTO places ( id_bus, id_comb, status, price, place_number) values (?,?,?,?,?)',
    [newPlace.id_bus, newPlace.id_comb, newPlace.status, newPlace.price, newPlace.place_number]
  ).then((result) => {
      if (result) {
        return { ...newPlace, id: result.insertId}
      } else {
        throw ('can not find result in createPlace')
      }
    },
    error => { throw (error) }
  )
};
module.exports = createPlace;
