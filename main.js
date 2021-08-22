const path = require("path");
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const PouchDB = require("pouchdb");
const PersistentPouchDB = PouchDB.defaults({
  name: "villosum_db",
  adapter: "leveldb",
  prefix: "./db/",
});

const _port = 80;
const _client_folder = "/client/dist/client";

const corsOptions = {
  origin: true,
  credentials: true
};

const api = express();
api.use(compression());
api.use(express.json());
api.use("/api/", cors(corsOptions));
api.options("/api/", cors(corsOptions)); // enable pre-flight requests

// Database
api.use("/api/v1/db", require("express-pouchdb")(PersistentPouchDB));

// Serve static files
api.get("*.*", express.static(__dirname + _client_folder, { maxAge: "10y" }));

// Serve client
api.all("*", (req, res) => {
  res.status(200).sendFile("/", { root: __dirname + _client_folder });
});

// Start up Express JS
api.listen(_port, () => {
  console.log("Listening on http://localhost:" + _port);
});
