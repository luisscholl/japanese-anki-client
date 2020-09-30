const Datastore = require('nedb');

let _db;

function getDb() {
  if (_db) return _db;
  console.log(`Loading database from ${__dirname}/notes.db`)
  _db = {};
  _db.notes = new Datastore({ filename: __dirname + '/storage/notes.db', autoload: true });
  return _db;
}

module.exports = {
  getDb
}