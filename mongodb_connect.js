const mongoose = require('mongoose');
const _ = require('lodash');

// all mongodb connections
const clients = {};

const reconnectTries = 3;
const reconnectInterval = 5000;
let connectionTimeout;


function throwTimeoutError() {
	connectionTimeout = setTimeout(() => {
		throw new Error();
	}, 16000);
	// (reconnectTries * reconnectInterval) + buffer
}


function instanceEventListeners({ conn }) {
	conn.on('connected', () => {
		console.log('Database - Connection status: connected');
		clearTimeout(connectionTimeout);
	});
	conn.on('disconnected', () => {
		console.log('Database - Connection status: disconnected');
		throwTimeoutError();
	});
	conn.on('reconnected', () => {
		console.log('Database - Connection status: reconnected');
		clearTimeout(connectionTimeout);
	});
	conn.on('close', () => {
		console.log('Database - Connection status: close ');
		clearTimeout(connectionTimeout);
	});
}


module.exports.init = () => {
	const mongoInstance = mongoose.createConnection(`${process.env.MONGODB_CONN_STR}`, {
		useNewUrlParser: true,
		keepAlive: true,
		autoReconnect: true,
		reconnectTries: reconnectTries,
		reconnectInterval: reconnectInterval,
	});

	clients.mongoInstance = mongoInstance;
	instanceEventListeners({ conn: mongoInstance });
};

module.exports.closeConnections = () => _.forOwn(clients, (conn) => conn.close());


module.exports.getClients = () => clients;

