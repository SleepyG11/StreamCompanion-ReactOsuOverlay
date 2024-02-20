import ReconnectingWebSocket from 'libs/reconnecting-websocket';
import SOCKET from 'enums/SOCKET';

// ----------------------------

function removeFromArray(array, item) {
	let index = array.indexOf(item);
	if (index !== -1) array.splice(index, 1);
	return array;
}

// ----------------------------

function getSocketUrl() {
	let url = new URL(`${SOCKET.WS}/tokens`);
	url.searchParams.append('updatesPerSecond', 10);
	url.searchParams.append('bulkUpdates', 'MainPipeline,LiveTokens');
	return url;
}

// ----------------------------

export default class TokensManager {
	constructor() {
		this.socket = new ReconnectingWebSocket(getSocketUrl(), null, {
			automaticOpen: false,
			reconnectInterval: 3000,
		});

		this.listeners = [];
		this.tokens = {};
		this.tokensRequests = {};

		this.socket.onmessage = (e) => {
			this.tokens = Object.assign({}, this.tokens, JSON.parse(e.data));
			this.listeners.forEach((listener) => listener());
		};
		this.socket.onopen = () => {
			this.socket.send(JSON.stringify(Object.keys(this.tokensRequests)));
		};
		this.socket.open();

		this.updateRequest = null;
	}

	updateTokensToWatch() {
		if (this.updateRequest) return;
		this.updateRequest = window.requestAnimationFrame(() => {
			this.updateRequest = null;
			if (this.socket.readyState !== WebSocket.OPEN) return;
			this.socket.send(JSON.stringify(Object.keys(this.tokensRequests)));
		});
	}

	getToken(key) {
		return () => this.tokens[key] ?? null;
	}
	getServerToken(key) {
		return () => null;
	}

	getAllTokens() {
		return () => this.tokens;
	}
	getAllServerTokens() {
		return () => this.tokens;
	}

	subscribe(key) {
		return (listener) => {
			this.listeners.push(listener);
			if (key) {
				if (!this.tokensRequests[key]) {
					this.tokensRequests[key] = 1;
					this.updateTokensToWatch();
				} else {
					this.tokensRequests[key]++;
				}
			}
			return () => this.unsubscribe(listener, key);
		};
	}
	unsubscribe(listener, key) {
		removeFromArray(this.listeners, listener);
		if (!key) return;
		if (this.tokensRequests[key] > 1) {
			this.tokensRequests[key]--;
		} else {
			delete this.tokensRequests[key];
			this.updateTokensToWatch();
		}
	}
}
