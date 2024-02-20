const SOCKET = {
	// SCHEME: 'http', // window.location.protocol.slice(0, -1),
	// HOST: 'localhost', // window.location.hostname,
	// PORT: 20727, // window.location.port,
	SCHEME: window.location.protocol.slice(0, -1),
	HOST: window.location.hostname,
	PORT: window.location.port,
	get URL() {
		return `${SOCKET.SCHEME}://${SOCKET.HOST}:${SOCKET.PORT}`;
	},
	get WS() {
		return `ws://${SOCKET.HOST}:${SOCKET.PORT}`;
	},
};

export default SOCKET;
