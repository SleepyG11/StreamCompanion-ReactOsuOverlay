import { createContext, useContext, useEffect, useState } from 'react';

const DEFAULT_CONFIG = {
	__CONFIG_STATUS__: 'loading',

	csBottomThreshold: 2,
	arBottomThreshold: 5,
	odBottomThreshold: 5,
	hpBottomThreshold: 2,

	csTopThreshold: 5,
	arTopThreshold: 9.5,
	odTopThreshold: 9.5,
	hpTopThreshold: 5,

	useNegativeTimeInPlayTimer: false,
	useOriginalLanguageForSongArtistAndTitle: false,
	adjustTimeBySpeedMods: false,

	showFcPhrase: false,
	fcPhrase: '{pp} pp FC!',

	showSsPhrase: false,
	ssPhrase: '{pp} pp SS!',

	hideWhenChatOpened: false,
	hideWhenCinemaMode: false,
	hideWhenIngameInterfaceHidden: false,
};

const context = createContext(DEFAULT_CONFIG);

export function JSONConfigProvider({ children }) {
	const [config, setConfig] = useState(DEFAULT_CONFIG);

	useEffect(() => {
		setConfig({
			...DEFAULT_CONFIG,
			__CONFIG_STATUS__: 'loading',
		});
		let controller = new AbortController();
		fetch('./settings.json', { signal: controller.signal })
			.then((r) => r.json())
			.then((j) => {
				setConfig({
					...DEFAULT_CONFIG,
					...j,
					__CONFIG_STATUS__: 'loaded',
				});
			})
			.catch((e) => {
				if (e.message === 'The user aborted a request.') return;
				setConfig({
					...DEFAULT_CONFIG,
					__CONFIG_STATUS__: 'error',
				});
				console.error(e);
			});
		return () => {
			controller.abort();
		};
	}, []);

	return <context.Provider value={config}>{children}</context.Provider>;
}

export default function useJSONConfig() {
	return useContext(context);
}
