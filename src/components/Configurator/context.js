import { createContext, useContext, useEffect, useState } from 'react';

const defaultConfig = {
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

/**
 * @type {Context<[configs: object, setConfigs: object => void]>}
 */
const context = createContext([{}, () => {}]);

export function ConfigsProvider({ children }) {
	const [config, setConfig] = useState(defaultConfig);

	useEffect(() => {
		fetch('./settings.json')
			.then((r) => r.json())
			.then(setConfig);
	}, []);

	function updateConfig(v) {}

	return <context.Provider value={[config, updateConfig]}>{children}</context.Provider>;
}

export default function useConfigs() {
	return useContext(context);
}
