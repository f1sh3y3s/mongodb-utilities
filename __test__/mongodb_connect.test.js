const mongodb = require('./../mongodb_connect');

process.env.MONGODB_CONN_STR = 'mongodb://localhost:27017/test-mongodb';

mongodb.init();

console.dir(mongodb.getClients());

mongodb.closeConnections();