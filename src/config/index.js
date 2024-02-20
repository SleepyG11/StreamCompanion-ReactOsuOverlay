import { createContext, useContext, useEffect, useState } from 'react';

const DEFAULT_CONFIG = {
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
	fcPhrase: '{pp} pp',

	showSsPhrase: false,
	ssPhrase: '{pp} pp',
};

const context = createContext({});

export function JSONConfigProvider({ children }) {
	const [config, setConfig] = useState(DEFAULT_CONFIG);

	useEffect(() => {
		let controller = new AbortController();
		fetch('./settings.json', { signal: controller.signal })
			.then((r) => r.json())
			.then(setConfig)
			.catch(console.error);
		return () => {
			controller.abort();
		};
	}, []);

	return <context.Provider value={config}>{children}</context.Provider>;
}

export default function useJSONConfig() {
	return useContext(context);
}
