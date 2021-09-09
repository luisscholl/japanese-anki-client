const path = require("path");
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const Keycloak = require("keycloak-connect");
const session = require("express-session");
const { ExpressPeerServer } = require("peer");
const environment = require("./environment.json");
const CognitoExpress = require("cognito-express");

const _port = 4201;

const corsOptions = {
  origin: true,
  credentials: true,
};

const api = express();
api.use(compression());
api.use(express.json());
api.use("/", cors(corsOptions));
api.options("/", cors(corsOptions)); // enable pre-flight requests

if (environment.auth.provider === "keycloak") {
  var memoryStore = new session.MemoryStore();
  api.use(
    session({
      secret: "9f7fa3b4-b6ea-4992-a51a-8b289ece0e09",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );
  var keycloak = new Keycloak({
    store: memoryStore,
  });
  api.use(
    keycloak.middleware({
      logout: "/logout",
      admin: "/",
    })
  );
} else if (environment.auth.provider === "cognito") {
  var cognitoExpress = new CognitoExpress(environment.auth.config);
}

// Stores active peer ids per user. Old ids are removed/invalidated by the client, which tries connecting to them.
// Map<res.locals.user: string, peers: Array<string>>
let peers = {};

// Start up Express JS
const server = api.listen(_port, () => {
  console.log("Listening on http://localhost:" + _port);
});

const peerServer = ExpressPeerServer(server, {
  path: "/myapp",
});

peerServer.on("connection", (client) => {});

api.use("/v1/peerjs", peerServer);

if (environment.auth.provider === "keycloak") {
  api.use("/", keycloak.protect("user"), (req, res, next) => {
    res.locals.user = req.kauth.grant.access_token.content.sub;
    next();
  });
} else if (environment.auth.provider === "cognito") {
  api.use("/", (req, res, next) => {
    // substr(7) removes 'Bearer '
    let accessToken = req.headers.authorization && req.headers.authorization.substr(7);
    if (!accessToken) return res.sendStatus(401);
    cognitoExpress.validate(accessToken, (err, response) => {
      if (err) {
        console.error(err);
        return res.sendStatus(401);
      }
      res.locals.user = response;
      console.log(res.locals.user);
      next();
    });
  });
}

api.post("/v1/peers", (req, res) => {
  if (!req.body.id) res.send(400);
  if (!peers[res.locals.user]) peers[res.locals.user] = new Set();
  if (!peers[res.locals.user].has(req.body.id)) {
    peers[res.locals.user].add(req.body.id);
  }
  res.json({
    peers: Array.from(peers[res.locals.user]),
  });
});

api.delete("/v1/peers/:id", (req, res) => {
  if (!peers[res.locals.user]) res.sendStatus(200);
  if (peers[res.locals.user].has(req.params.id)) peers[res.locals.user].delete(req.params.id);
  res.sendStatus(200);
});