import { useEffect, useMemo, useSyncExternalStore } from 'react';
import ReconnectingWebSocket from '../libs/reconnecting-websocket';
import { config, osuGrade, osuStatus, rawOsuStatus } from '../libs/consts';
import { useTransitionValue } from 'react-transition-value';
import useConfigs from '../components/Configurator/context';

function removeFromArray(array, item) {
	let index = array.indexOf(item);
	if (index !== -1) array.splice(index, 1);
	return array;
}
export function formatTime(ms = 0, onlyPositive = false) {
	let isNegative = !onlyPositive && ms < 0;
	let secs = Math.floor(Math.abs(ms) / 1000);
	let mins = Math.floor(secs / 60);
	let hours = Math.floor(mins / 60);
	return (
		(isNegative ? '-' : '') +
		[hours, String(mins % 60).padStart(hours ? 2 : 1, 0), String(secs % 60).padStart(2, 0)].filter(Boolean).join(':')
	);
}
function createSocket() {
	let url = new URL(`${config.getWs()}/tokens`);
	url.searchParams.append('updatesPerSecond', 10);
	url.searchParams.append('bulkUpdates', 'MainPipeline,LiveTokens');
	return new ReconnectingWebSocket(url.href, null, {
		automaticOpen: false,
		reconnectInterval: 3000,
	});
}

// ---------------------------

export const TOKENS = {
	INTERFACE_ENABLED: 'ingameInterfaceIsEnabled',
	CHAT_ENABLED: 'chatIsEnabled',

	STATE: 'rawStatus',
	SKIN_FOLDER: 'skin',
	GAMEMODE: 'gameMode',

	USERNAME: 'username',
	COUNTRY: 'country',

	// MAP

	MAP_ID: 'mapid',
	MAP_SET_ID: 'mapsetid',
	MAP_MD5: 'md5',
	MAP_RANKED_STATUS: 'rankedStatus',

	MAP_TIME_FIRST_OBJECT: 'firstHitObjectTime',
	MAP_TIME_CURRENT: 'time',
	MAP_TIME_FULL: 'totaltime',
	MAP_TIME_AUDIO: 'totalAudioTime',
	MAP_TIME_REMAINING: 'remainingTime',

	MAP_ARTIST: 'artistRoman',
	MAP_ARTIST_ORIGINAL: 'artistUnicode',
	MAP_TITLE: 'titleRoman',
	MAP_TITLE_ORIGINAL: 'titleUnicode',
	MAP_MAPPER: 'creator',
	MAP_DIFFICULTY: 'diffName',

	MAP_AR: 'mAR',
	MAP_CS: 'mCS',
	MAP_OD: 'mOD',
	MAP_HP: 'mHP',
	MAP_STARS: 'mStars',

	MAP_BPM: 'bpm',
	MAP_BPM_CURRENT: 'bpm',
	MAP_BPM_MIN: 'minBpm',
	MAP_BPM_MAX: 'maxBpm',

	MAP_COMBO_MAX: 'maxCombo',

	MAP_BG: 'backgroundImageFileName',
	MAP_FILE: 'osuFileName',
	MAP_FOLDER: 'dir',
	MAP_AUDIO: 'mp3Name',
	MAP_FULL: 'dirFull',

	MAP_MODS_RAW: 'modsEnum',
	MAP_MODS_ARRAY: 'mods',

	MAP_PP_100_MANIA: 'mania_1_000_000PP',
	MAP_PP_100: 'osu_mSSPP',
	MAP_PP_99: 'osu_m99PP',
	MAP_PP_98: 'osu_m98PP',
	MAP_PP_97: 'osu_m97PP',
	MAP_PP_96: 'osu_m96PP',
	MAP_PP_95: 'osu_m95PP',

	// PLAY

	PLAY_SCORE: 'score',
	PLAY_ACCURACY: 'acc',
	PLAY_COMBO_CURRENT: 'combo',
	PLAY_COMBO_MAX: 'currentMaxCombo',

	PLAY_HP: 'playerHp',

	PLAY_300: 'c300',
	PLAY_100: 'c100',
	PLAY_50: 'c50',
	PLAY_0: 'miss',
	PLAY_MISSES: 'miss',
	PLAY_SLIDER_BREAKS: 'sliderBreaks',
	PLAY_GEKI: 'geki',
	PLAY_KATSU: 'katsu',

	PLAY_UNSTABLE_RATE: 'unstableRate',

	PLAY_PP_CURRENT: 'ppIfMapEndsNow',
	PLAY_PP_IF_FC: 'ppIfRestFced',
	PLAY_PP_MAX: 'osu_mSSPP',
	PLAY_PP_SIMULATED: 'simulatedPp',

	PLAY_GRADE_CURRENT: 'grade',
	PLAY_GRADE_IF_FC: 'maxGrade',
};
export const FORMATTERS = {
	[TOKENS.INTERFACE_ENABLED]: Boolean,
	[TOKENS.CHAT_ENABLED]: Boolean,

	[TOKENS.STATE]: (v) => Number(v) || osuStatus.Null,

	// [TOKENS.MAP_TIME_FIRST_OBJECT]: Number,
	[TOKENS.MAP_TIME_CURRENT]: (v) => (v !== null ? v * 1000 : null),

	[TOKENS.PLAY_COMBO_CURRENT]: Number,
	[TOKENS.PLAY_COMBO_MAX]: Number,

	[TOKENS.MAP_COMBO_MAX]: Number,
	// [TOKENS.MAP_TIME_AUDIO]: Number,
	// [TOKENS.MAP_TIME_FULL]: Number,
	// [TOKENS.MAP_TIME_REMAINING]: Number,

	// [TOKENS.MAP_AR]: Number,
	// [TOKENS.MAP_CS]: Number,
	// [TOKENS.MAP_OD]: Number,
	// [TOKENS.MAP_HP]: Number,
	// [TOKENS.MAP_STARS]: Number,

	// [TOKENS.MAP_BPM]: Number,
	// [TOKENS.MAP_BPM_CURRENT]: Number,
	// [TOKENS.MAP_BPM_MIN]: Number,
	// [TOKENS.MAP_BPM_MAX]: Number,

	// [TOKENS.MAP_MODS_RAW]: Number,
	// [TOKENS.MAP_MODS_PARSED]: (v) => {
	// 	if (!v) return v;
	// 	return v === 'None' ? 'NM' : v.replace(/,/g, '').replace(/SV2/g, 'v2');
	// },
	[TOKENS.MAP_MODS_ARRAY]: (v) => {
		if (!v) return '';
		return v === 'None' ? 'NM' : v.replace(/SV2/g, 'V2');
	},

	[TOKENS.PLAY_GRADE_CURRENT]: (v) => {
		if (v === null) return v;
		return osuGrade[v];
	},
	[TOKENS.PLAY_GRADE_IF_FC]: (v) => {
		if (v === null) return v;
		return osuGrade[v];
	},
};

// ---------------------------

class TokensManager {
	constructor() {
		this.socket = createSocket();

		this.listeners = [];
		/**
		 * @type {{[token: string]: any}}
		 */
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
		if (this.socket.readyState !== WebSocket.OPEN) return;
		if (this.updateRequest) return;
		this.updateRequest = window.requestAnimationFrame(() => {
			this.socket.send(JSON.stringify(Object.keys(this.tokensRequests)));
			this.updateRequest = null;
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
		if (this.tokensRequests[key]) this.tokensRequests[key]--;
		if (this.tokensRequests[key]) return;
		delete this.tokensRequests[key];
		this.updateTokensToWatch();
	}
}
const tokensManager = new TokensManager();

// ---------------------------

export default function useOsuToken(key) {
	let value = useOsuRawToken(
		key,
		FORMATTERS[key] ??
			function (v) {
				return v;
			}
	);
	return value;
}
export function useOsuRawToken(key, format = (v) => v) {
	if (!key) throw new Error('Token name not provided');

	const subscribe = useMemo(() => {
		return tokensManager.subscribe(key);
	}, [key]);

	let value = useSyncExternalStore(subscribe, tokensManager.getToken(key), tokensManager.getServerToken(key));
	return format(value);
}
export function useOsuTransitionToken(key, from = 0, options = { duration: 500, throttleZero: false }) {
	let rawValue = useOsuToken(key);
	let [value, setValue] = useTransitionValue(from, options);

	useEffect(() => {
		setValue(Number(rawValue) || 0);
	}, [rawValue, setValue]);

	if (options.throttleZero && value < 0.01) return 0;
	return value;
}
export function useAllOsuTokens() {
	const subscribe = useMemo(() => {
		return tokensManager.subscribe();
	}, []);

	let value = useSyncExternalStore(subscribe, tokensManager.getAllTokens(), tokensManager.getAllServerTokens());
	return value;
}

// ---------------------------

export function useOsuBackgroundDir() {
	let dir = useOsuToken(TOKENS.MAP_FOLDER);
	let file = useOsuToken(TOKENS.MAP_BG);
	return (dir ?? undefined) + '\\' + (file ?? undefined);
}
export function useOsuMapProgress() {
	let [config] = useConfigs();
	let state = useOsuStateType();
	let mods = useOsuToken(TOKENS.MAP_MODS_ARRAY);
	let currentTime = useOsuToken(TOKENS.MAP_TIME_CURRENT);
	let startTime = useOsuToken(TOKENS.MAP_TIME_FIRST_OBJECT);
	let endTime = useOsuToken(TOKENS.MAP_TIME_FULL);
	let audioTime = useOsuToken(TOKENS.MAP_TIME_AUDIO);

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
	let state = useOsuToken(TOKENS.STATE);

	switch (state) {
		case rawOsuStatus.Playing: {
			return 'playing';
		}
		case rawOsuStatus.SongSelect:
		case rawOsuStatus.SongSelectEdit:
		case rawOsuStatus.MultiplayerRoom:
		case rawOsuStatus.MultiplayerSongSelect:
		case rawOsuStatus.EditingMap:
		case rawOsuStatus.ProcessingBeatmaps: {
			return 'songSelect';
		}
		case rawOsuStatus.ResultsScreen:
		case rawOsuStatus.MultiplayerResultsscreen: {
			return 'resultScreen';
		}
		case rawOsuStatus.NotRunning: {
			return 'off';
		}
		case rawOsuStatus.Connecting: {
			return 'connecting';
		}
		default: {
			return 'idle';
		}
	}
}
export function useOsuMapMaxFcPP(from = 0, options = { duration: 500, throttleZero: false }) {
	const gameMode = useOsuToken(TOKENS.GAMEMODE);
	const value = useOsuToken(gameMode === 'OsuMania' ? TOKENS.MAP_PP_100_MANIA : TOKENS.MAP_PP_100, from, options);
	return value;
}
export function useOsuMapFcPP(from = 0, options = { duration: 500, throttleZero: false }) {
	const gameMode = useOsuToken(TOKENS.GAMEMODE);
	const value = useOsuToken(gameMode === 'OsuMania' ? TOKENS.PLAY_PP_SIMULATED : TOKENS.PLAY_PP_IF_FC, from, options);
	return value;
}

export function useOsuMapCurrentPP(from = 0, options = { duration: 500, throttleZero: false }) {
	const value = useOsuToken(TOKENS.PLAY_PP_CURRENT, from, options);
	return value;
}
