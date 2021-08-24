const path = require("path");
const { networkInterfaces } = require("os");
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const PouchDB = require("pouchdb");
const PersistentPouchDB = PouchDB.defaults({
  name: "villosum_db",
  adapter: "leveldb",
  prefix: "./db/",
});
const QRCode = require("qrcode");

const _port = 80;

const corsOptions = {
  origin: true,
  credentials: true,
};

const api = express();
api.use(compression());
api.use(express.json());
api.use("/api/", cors(corsOptions));
api.options("/api/", cors(corsOptions)); // enable pre-flight requests

// Database
api.use("/api/v1/db", require("express-pouchdb")(PersistentPouchDB));

// Start up Express JS
api.listen(_port, () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (!net.internal && net.family == "IPv4") {
        QRCode.toString(net.address, { type: "terminal" }, (err, url) => {
          console.log(
            'Database hosted at ' + net.address + '\n' +
            '\n' +
            'Enter the address in the client settings.' +
            '\n\n' +
            url);
        });
      }
    }
  }
});
