const path = require('path');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const { ExpressPeerServer } = require('peer');

const _port = 4201;

const corsOptions = {
  origin: true,
  credentials: true
};

const memoryStore = new session.MemoryStore();


const api = express();
api.use(session({
  secret: '9f7fa3b4-b6ea-4992-a51a-8b289ece0e09',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
const keycloak = new Keycloak({
  store: memoryStore
});
api.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));
api.use(compression());
api.use(express.json());
api.use('/api/', cors(corsOptions));
api.options('/api/', cors(corsOptions)); // enable pre-flight requests

// Stores active peer ids per user. Old ids are removed/invalidated by the client, which tries connecting to them.
// Map<userId: string, peers: Array<string>>
let peers = {};

// Start up Express JS
const server = api.listen(_port, () => {
  console.log('Listening on http://localhost:' + _port);
});

const peerServer = ExpressPeerServer(server, {
  path: '/myapp'
});

peerServer.on('connection', client => {
});

api.use('/peerjs', peerServer);

api.post('/api/v1/peers', keycloak.protect('user'), (req, res) => {
  let userId = req.kauth.grant.access_token.content.sub;
  if (!req.body.id) res.send(400);
  if (!peers[userId]) peers[userId] = new Set();
  if (!peers[userId].has(req.body.id)) {
    peers[userId].add(req.body.id);
  }
  res.json({ 
    peers: Array.from(peers[userId])
  });
});

api.delete('/api/v1/peers/:id', keycloak.protect('user'), (req, res) => {
  let userId = req.kauth.grant.access_token.content.sub;
  if (!peers[userId]) res.sendStatus(200);
  if (peers[userId].has(req.params.id)) peers[userId].delete(req.params.id);
  res.sendStatus(200);
});

api.get('/user', keycloak.protect('user'), (req, res) => {
  console.log(req.kauth.grant.access_token.content.sub);
  res.send('Hello User');
});