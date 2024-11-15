import { useRef, createContext, useContext, useEffect } from 'react';
import ReconnectingWebSocket from '@/libs/reconnecting-websocket';

// ----------------------------

function removeFromArray(array, item) {
	let index = array.indexOf(item);
	if (index !== -1) array.splice(index, 1);
	return array;
}

// ----------------------------

class TokensManager {
	constructor(href) {
		this.href = href;

		this.listeners = [];
		this.tokens = {};
		this.tokensRequests = {};

		this.initSocket = () => {
			this.socket = new ReconnectingWebSocket(this.getSocketUrl(), null, {
				automaticOpen: false,
				reconnectInterval: 3000,
			});
			this.socket.onmessage = (e) => {
				this.tokens = Object.assign({}, this.tokens, JSON.parse(e.data));
				this.listeners.forEach((listener) => listener());
			};
			this.socket.onopen = () => {
				this.socket.send(JSON.stringify(Object.keys(this.tokensRequests)));
			};
			this.updateRequest = null;
		};

		this.initSocket();
	}

	connect() {
		console.log('Connecting');
		this.initSocket();
		this.socket.open();
	}
	disconnect() {
		console.log('Closing');
		this.socket.close();
	}

	getSocketUrl() {
		let url = new URL(this.href);
		url.protocol = 'ws:';
		url.pathname = url.pathname + 'tokens';
		url.searchParams.append('updatesPerSecond', 10);
		url.searchParams.append('bulkUpdates', 'MainPipeline,LiveTokens');
		return url.toString();
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

// ----------------------------

const context = createContext();

export function TokensManagerProvider({ href, children }) {
	const managerRef = useRef();
	if (!managerRef.current) {
		managerRef.current = new TokensManager(href);
	}

	useEffect(() => {
		managerRef.current.connect();
		return () => {
			managerRef.current.disconnect();
		};
	}, []);

	return <context.Provider value={managerRef.current}>{children}</context.Provider>;
}

export function useTokensManager() {
	return useContext(context);
}
