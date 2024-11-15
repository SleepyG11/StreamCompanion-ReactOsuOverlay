import { createContext, useContext, useEffect, useState } from 'react';
import { CONFIG_STATUS } from './enums';

const DEFAULT_CONFIG = {
	__CONFIG_STATUS__: CONFIG_STATUS.LOADING,

	streamCompanionHref: 'http://localhost:20727',

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
		if (window.CONFIG) {
			setConfig({
				...DEFAULT_CONFIG,
				...window.CONFIG,
				__CONFIG_STATUS__: CONFIG_STATUS.LOADED,
			});
		} else {
			setConfig({
				...DEFAULT_CONFIG,
				__CONFIG_STATUS__: CONFIG_STATUS.ERROR,
			});
		}
	}, []);

	return <context.Provider value={config}>{children}</context.Provider>;
}

export default function useJSONConfig() {
	return useContext(context);
}
