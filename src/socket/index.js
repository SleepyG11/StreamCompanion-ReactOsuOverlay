import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useTransitionValue } from 'react-transition-value';
import TokensManager from './manager';

import TOKENS from 'enums/TOKENS';
import { STATUS_RAW } from 'enums/OSU';

import FORMATTERS, { formatTime } from 'enums/FORMATTERS';
import useJSONConfig from 'config';

// ---------------------------

const tokensManager = new TokensManager();

// ---------------------------

export function useOsuRawToken(key, format = (v) => v) {
	if (!key) throw new Error('Token name not provided');

	const subscribe = useMemo(() => {
		return tokensManager.subscribe(key);
	}, [key]);

	let value = useSyncExternalStore(subscribe, tokensManager.getToken(key), tokensManager.getServerToken(key));
	return format(value);
}

export default function useOsuToken(key) {
	return useOsuRawToken(key, FORMATTERS[key] ?? ((v) => v));
}
export function useOsuTransitionToken(key, from = 0, options = { duration: 500, throttle: false }) {
	let rawValue = useOsuToken(key);
	let targetValue = Number(rawValue);
	let [value, setValue] = useTransitionValue(from, options);

	useEffect(() => {
		setValue(targetValue);
	}, [targetValue, setValue]);

	if (options.throttle && Math.abs(value - targetValue) < 0.01) return targetValue;
	return value;
}
export function useAllOsuTokens() {
	const subscribe = useMemo(() => {
		return tokensManager.subscribe();
	}, []);

	return useSyncExternalStore(subscribe, tokensManager.getAllTokens(), tokensManager.getAllServerTokens());
}

// ---------------------------

export function useOsuBackgroundDir() {
	const dir = useOsuToken(TOKENS.MAP_FOLDER);
	const file = useOsuToken(TOKENS.MAP_BG);
	return (dir ?? undefined) + '\\' + (file ?? undefined);
}
export function useOsuMapProgress() {
	const config = useJSONConfig();

	const state = useOsuStateType();
	const mods = useOsuToken(TOKENS.MAP_MODS_ARRAY);
	const currentTime = useOsuToken(TOKENS.MAP_TIME_CURRENT);
	const startTime = useOsuToken(TOKENS.MAP_TIME_FIRST_OBJECT);
	const endTime = useOsuToken(TOKENS.MAP_TIME_FULL);
	const audioTime = useOsuToken(TOKENS.MAP_TIME_AUDIO);

	let divider = useMemo(() => {
		if (state === 'playing' && config.adjustTimeBySpeedMods) {
			if (mods.includes('DT') || mods.includes('NC')) return 1.5;
			else if (mods.includes('HT')) return 0.75;
		}
		return 1;
	}, [state, config, mods]);

	let percent = Math.max(0, Math.min(1, (currentTime - startTime) / (endTime - startTime)));

	let isAfterEnd = currentTime > endTime;
	let isBeforeStart = currentTime < startTime;

	let negativeTime = isAfterEnd ? currentTime - audioTime : isBeforeStart ? currentTime - startTime : endTime - currentTime;
	let positiveTime = Math.max(0, endTime - currentTime);

	return {
		percent,
		isAfterEnd,
		isBeforeStart,
		positiveRaw: positiveTime,
		positive: formatTime(positiveTime / divider, true),
		negativeRaw: negativeTime,
		negative: formatTime(negativeTime / divider),
		divider,
	};
}
export function useOsuStateType() {
	const state = useOsuToken(TOKENS.GAME_STATE);

	switch (state) {
		case STATUS_RAW.PLAYING: {
			return 'playing';
		}
		case STATUS_RAW.SONG_SELECT:
		case STATUS_RAW.SONG_SELECT_EDIT:
		case STATUS_RAW.MULTIPLAYER_ROOM:
		case STATUS_RAW.MULTIPLAYER_SONG_SELECT:
		case STATUS_RAW.EDITING_MAP:
		case STATUS_RAW.PROCESSING_BEATMAPS: {
			return 'songSelect';
		}
		case STATUS_RAW.RESULTS_SCREEN:
		case STATUS_RAW.MULTIPLAYER_RESULTS_SCREEN: {
			return 'resultScreen';
		}
		case STATUS_RAW.NOT_RUNNING: {
			return 'off';
		}
		case STATUS_RAW.CONNECTING: {
			return 'connecting';
		}
		default: {
			return 'idle';
		}
	}
}
export function useOsuMapMaxFcPP(from = 0, options = { duration: 500, throttle: false }) {
	const gameMode = useOsuToken(TOKENS.GAME_MODE);
	return useOsuToken(gameMode === 'OsuMania' ? TOKENS.MAP_PP_100_MANIA : TOKENS.MAP_PP_100, from, options);
}
export function useOsuMapFcPP(from = 0, options = { duration: 500, throttle: false }) {
	const gameMode = useOsuToken(TOKENS.GAME_MODE);
	return useOsuToken(gameMode === 'OsuMania' ? TOKENS.PLAY_PP_SIMULATED : TOKENS.PLAY_PP_IF_FC, from, options);
}
export function useOsuMapCurrentPP(from = 0, options = { duration: 500, throttle: false }) {
	return useOsuToken(TOKENS.PLAY_PP_CURRENT, from, options);
}
