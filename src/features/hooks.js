import { useMemo, useSyncExternalStore } from 'react';
import {
	GAME_MODE,
	GAME_MODE_MAP,
	GAME_MODE_TRANSFORM,
	GAME_STATE,
	GAME_STATE_CATEGORY,
	MAP_RANKING_STATUS_MAP,
	PLAY_GRADE,
	TOKENS,
	TOKEN_FORMATTERS,
} from '@/features/enums';
import { useTokensManager } from '@/features/manager';

// ---------------------

export function getGameStateCategory(state) {
	switch (state) {
		case GAME_STATE.PLAYING: {
			return GAME_STATE_CATEGORY.PLAYING;
		}
		case GAME_STATE.SONG_SELECT:
		case GAME_STATE.SONG_SELECT_EDIT:
		case GAME_STATE.MULTIPLAYER_ROOM:
		case GAME_STATE.MULTIPLAYER_SONG_SELECT:
		case GAME_STATE.EDITING_MAP:
		case GAME_STATE.PROCESSING_BEATMAPS: {
			return GAME_STATE_CATEGORY.SONG_SELECT;
		}
		case GAME_STATE.RESULTS_SCREEN:
		case GAME_STATE.MULTIPLAYER_RESULTS_SCREEN: {
			return GAME_STATE_CATEGORY.RESULT_SCREEN;
		}
		case GAME_STATE.NOT_RUNNING: {
			return GAME_STATE_CATEGORY.NOT_RUNNING;
		}
		case GAME_STATE.CONNECTING: {
			return GAME_STATE_CATEGORY.CONNECTING;
		}
		case GAME_STATE.UNKNOWN:
		case null: {
			return GAME_STATE.UNKNOWN;
		}
		default: {
			return GAME_STATE_CATEGORY.IDLE;
		}
	}
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

// ---------------------

export function useOsuToken(token) {
	if (!token) throw new Error('Token not provided');
	const manager = useTokensManager();

	const subscribe = useMemo(() => {
		return manager.subscribe(token);
	}, [token, manager]);

	let value = useSyncExternalStore(subscribe, manager.getToken(token), manager.getServerToken(token));
	return value;
}
export function useOsuFormattedToken(token) {
	let value = useOsuToken(token);

	let result = useMemo(() => {
		let formatter = TOKEN_FORMATTERS[token] ?? ((v) => v);
		return formatter(value);
	}, [value, token]);

	return result;
}

// GAME ---------------------

/**
 * @returns {Boolean | null}
 */
export function useOsuGameIsRunning() {
	return useOsuFormattedToken(TOKENS.GAME_IS_RUNNING);
}
/**
 * @returns {Boolean | null}
 */
export function useOsuGameIsInterfaceVisible() {
	return useOsuFormattedToken(TOKENS.GAME_IS_INTERFACE_VISIBLE);
}
/**
 * @returns {Boolean | null}
 */
export function useOsuGameIsChatVisible() {
	return useOsuFormattedToken(TOKENS.GAME_IS_CHAT_VISIBLE);
}
/**
 * @returns {{
 *      state: number | null,
 *      category: number | null
 * }}
 */
export function useOsuGameState() {
	const state = useOsuFormattedToken(TOKENS.GAME_STATE);
	return {
		state,
		category: getGameStateCategory(state),
	};
}
/**
 * @returns {{
 *      mode: number | null,
 *      modeText: string | null
 * }}
 */
export function useOsuGameMode() {
	const rawMode = useOsuFormattedToken(TOKENS.GAME_MODE);
	const mode = GAME_MODE_TRANSFORM[rawMode] ?? null;
	return {
		mode,
		modeText: GAME_MODE_MAP[mode] ?? null,
	};
}

// SKIN ---------------------

/**
 * @returns {string | null}
 */
export function useOsuSkinName() {
	return useOsuFormattedToken(TOKENS.SKIN_NAME);
}
/**
 * @returns {string | null}
 */
export function useOsuSkinFile() {
	return useOsuFormattedToken(TOKENS.SKIN_SRC);
}

// USER ---------------------

/**
 * @returns {string | null}
 */
export function useOsuUserUsername() {
	return useOsuFormattedToken(TOKENS.USER_USERNAME);
}
/**
 * @returns {string | null}
 */
export function useOsuUserCountry() {
	return useOsuFormattedToken(TOKENS.USER_USERNAME);
}
/**
 * @returns {number | null}
 */
export function useOsuUserId() {
	return useOsuFormattedToken(TOKENS.USER_USERNAME);
}
/**
 * @returns {boolean | null}
 */
export function useOsuUserIsConnected() {
	return useOsuFormattedToken(TOKENS.USER_IS_CONNECTED);
}

// MAP ---------------------

/**
 * @returns {number | null}
 */
export function useOsuMapId() {
	return useOsuFormattedToken(TOKENS.MAP_ID);
}
/**
 * @returns {number | null}
 */
export function useOsuMapSetId() {
	return useOsuFormattedToken(TOKENS.MAP_SET_ID);
}
/**
 * @returns {string | null}
 */
export function useOsuMapMD5() {
	return useOsuFormattedToken(TOKENS.MAP_MD5);
}
/**
 * @returns {{
 *      status: number | null,
 *      statusText: string | null,
 * }}
 */
export function useOsuMapRankedStatus() {
	const status = useOsuFormattedToken(TOKENS.MAP_RANKING_STATUS);
	return {
		status,
		statusText: MAP_RANKING_STATUS_MAP[status] ?? null,
	};
}

/**
 * @returns {number | null}
 */
export function useOsuMapFirstObjectTime() {
	return useOsuFormattedToken(TOKENS.MAP_TIME_FIRST_OBJECT);
}
/**
 * @returns {number | null}
 */
export function useOsuMapCurrentTime() {
	return useOsuFormattedToken(TOKENS.MAP_TIME_CURRENT) * 1000;
}
/**
 * @returns {number | null}
 */
export function useOsuMapFullTime() {
	return useOsuFormattedToken(TOKENS.MAP_TIME_FULL);
}
/**
 * @returns {number | null}
 */
export function useOsuMapAudioTime() {
	return useOsuFormattedToken(TOKENS.MAP_TIME_AUDIO);
}
/**
 * @returns {number | null}
 */
export function useOsuMapRemainingTime() {
	return useOsuFormattedToken(TOKENS.MAP_TIME_REMAINING);
}

/**
 * @returns {string | null}
 */
export function useOsuMapArtist(original) {
	return useOsuFormattedToken(original ? TOKENS.MAP_ARTIST_ORIGINAL : TOKENS.MAP_ARTIST);
}
/**
 * @returns {string | null}
 */
export function useOsuMapTitle(original) {
	return useOsuFormattedToken(original ? TOKENS.MAP_TITLE_ORIGINAL : TOKENS.MAP_TITLE);
}
/**
 * @returns {string | null}
 */
export function useOsuMapMapper() {
	return useOsuFormattedToken(TOKENS.MAP_MAPPER);
}
/**
 * @returns {string | null}
 */
export function useOsuMapDifficulty() {
	return useOsuFormattedToken(TOKENS.MAP_DIFFICULTY);
}
/**
 * @returns {string | null}
 */
export function useOsuMapSource() {
	return useOsuFormattedToken(TOKENS.MAP_MAPPER);
}
/**
 * @returns {string[] | null}
 */
export function useOsuMapTags() {
	return useOsuFormattedToken(TOKENS.MAP_TAGS);
}

/**
 * @returns {number | null}
 */
export function useOsuMapAR() {
	return useOsuFormattedToken(TOKENS.MAP_AR);
}
/**
 * @returns {number | null}
 */
export function useOsuMapCS() {
	return useOsuFormattedToken(TOKENS.MAP_CS);
}
/**
 * @returns {number | null}
 */
export function useOsuMapOD() {
	return useOsuFormattedToken(TOKENS.MAP_OD);
}
/**
 * @returns {number | null}
 */
export function useOsuMapHP() {
	return useOsuFormattedToken(TOKENS.MAP_HP);
}
/**
 * @returns {number | null}
 */
export function useOsuMapStars() {
	return useOsuFormattedToken(TOKENS.MAP_STARS);
}

/**
 * @returns {number | null}
 */
export function useOsuMapCurrentBPM() {
	return useOsuFormattedToken(TOKENS.MAP_BPM_CURRENT);
}
/**
 * @returns {number | null}
 */
export function useOsuMapMinBPM() {
	return useOsuFormattedToken(TOKENS.MAP_BPM_MIN);
}
/**
 * @returns {number | null}
 */
export function useOsuMapMaxBPM() {
	return useOsuFormattedToken(TOKENS.MAP_BPM_MAX);
}

/**
 * @returns {number | null}
 */
export function useOsuMapMaxCombo() {
	return useOsuFormattedToken(TOKENS.MAP_COMBO_MAX);
}

/**
 * @returns {string | null}
 */
export function useOsuMapBackgroundSource() {
	const dir = useOsuToken(TOKENS.MAP_FOLDER);
	const file = useOsuToken(TOKENS.MAP_BG);
	return dir && file ? dir + '\\' + file : null;
}

/**
 * @returns {number | null}
 */
export function useOsuMap100AccPP() {
	const { mode } = useOsuGameMode();
	return useOsuFormattedToken(mode === GAME_MODE.MANIA ? TOKENS.MAP_PP_100_MANIA : TOKENS.MAP_PP_100);
}
/**
 * @returns {number | null}
 */
export function useOsuMap99p9AccPP() {
	return useOsuFormattedToken(TOKENS.MAP_PP_99_9);
}
/**
 * @returns {number | null}
 */
export function useOsuMap99AccPP() {
	return useOsuFormattedToken(TOKENS.MAP_PP_99);
}
/**
 * @returns {number | null}
 */
export function useOsuMap98AccPP() {
	return useOsuFormattedToken(TOKENS.MAP_PP_98);
}
/**
 * @returns {number | null}
 */
export function useOsuMap97AccPP() {
	return useOsuFormattedToken(TOKENS.MAP_PP_97);
}
/**
 * @returns {number | null}
 */
export function useOsuMap96AccPP() {
	return useOsuFormattedToken(TOKENS.MAP_PP_96);
}
/**
 * @returns {number | null}
 */
export function useOsuMap95AccPP() {
	return useOsuFormattedToken(TOKENS.MAP_PP_95);
}

export function useOsuMapProgress(adjustTimeBySpeedMods = false) {
	const { category } = useOsuGameState();
	const mods = useOsuPlayMods();

	const currentTime = useOsuMapCurrentTime();
	const startTime = useOsuMapFirstObjectTime();
	const endTime = useOsuMapFullTime();
	const audioTime = useOsuMapAudioTime();

	let divider = useMemo(() => {
		if (!mods) return 1;
		if (category === GAME_STATE_CATEGORY.PLAYING && adjustTimeBySpeedMods) {
			if (mods.includes('DT') || mods.includes('NC')) return 1.5;
			else if (mods.includes('HT')) return 0.75;
		}
		return 1;
	}, [category, mods, adjustTimeBySpeedMods]);

	let percent = Math.max(0, Math.min(1, (currentTime - startTime) / (endTime - startTime)));

	let isAfterEnd = currentTime > endTime;
	let isBeforeStart = currentTime < startTime;

	let negativeTime = isAfterEnd ? currentTime - audioTime : isBeforeStart ? currentTime - startTime : endTime - currentTime;
	let positiveTime = Math.max(0, endTime - currentTime);

	let positiveFormatted = formatTime(positiveTime / divider, true);
	let negativeFormatted = formatTime(negativeTime / divider, false);

	return {
		percent,
		isAfterEnd,
		isBeforeStart,

		positive: positiveFormatted,
		positiveFormatted,
		positiveRaw: positiveTime,

		negative: negativeFormatted,
		negativeFormatted,
		negativeRaw: negativeTime,

		divider,
	};
}

/**
 * @returns {boolean | null}
 */
export function useOsuMapIsBreak() {
	return useOsuFormattedToken(TOKENS.MAP_IS_BREAK);
}

// PLAY ---------------------

/**
 * @returns {number | null}
 */
export function useOsuPlayScore() {
	return useOsuFormattedToken(TOKENS.PLAY_SCORE);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayAccuracy() {
	return useOsuFormattedToken(TOKENS.PLAY_ACCURACY);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayComboCurrent() {
	return useOsuFormattedToken(TOKENS.PLAY_COMBO_CURRENT);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayComboMax() {
	return useOsuFormattedToken(TOKENS.PLAY_COMBO_MAX);
}

/**
 * @returns {number | null}
 */
export function useOsuPlayHP() {
	return useOsuFormattedToken(TOKENS.PLAY_HP);
}

/**
 * @returns {number | null}
 */
export function useOsuPlay300s() {
	return useOsuFormattedToken(TOKENS.PLAY_300);
}
/**
 * @returns {number | null}
 */
export function useOsuPlay100s() {
	return useOsuFormattedToken(TOKENS.PLAY_100);
}
/**
 * @returns {number | null}
 */
export function useOsuPlay50s() {
	return useOsuFormattedToken(TOKENS.PLAY_50);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayMisses() {
	return useOsuFormattedToken(TOKENS.PLAY_0);
}
/**
 * @returns {number | null}
 */
export function useOsuPlaySliderBreaks() {
	return useOsuFormattedToken(TOKENS.PLAY_SLIDER_BREAKS);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayGekis() {
	return useOsuFormattedToken(TOKENS.PLAY_GEKI);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayKatsus() {
	return useOsuFormattedToken(TOKENS.PLAY_KATSU);
}

/**
 * @returns {number | null}
 */
export function useOsuPlayUnstableRate() {
	return useOsuFormattedToken(TOKENS.PLAY_UNSTABLE_RATE);
}

/**
 * @returns {number | null}
 */
export function useOsuPlayPPCurrent() {
	return useOsuFormattedToken(TOKENS.PLAY_PP_CURRENT);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayPPIfFC() {
	const { mode } = useOsuGameMode();
	return useOsuFormattedToken(mode === GAME_MODE.MANIA ? TOKENS.MAP_PP_100_MANIA : TOKENS.PLAY_PP_IF_FC);
}
/**
 * @returns {number | null}
 */
export function useOsuPlayPPMax() {
	return useOsuFormattedToken(TOKENS.PLAY_PP_MAX);
}

/**
 * @returns {{
 *      grade: number | null,
 *      gradeText: string | null,
 * }}
 */
export function useOsuPlayGradeCurrent() {
	const grade = useOsuFormattedToken(TOKENS.PLAY_GRADE_CURRENT);
	return {
		grade,
		gradeText: PLAY_GRADE[grade],
	};
}
/**
 * @returns {{
 *     grade: number | null,
 *     gradeText: string | null,
 * }}
 */
export function useOsuPlayGradeIfFC() {
	const grade = useOsuFormattedToken(TOKENS.PLAY_GRADE_IF_FC);
	return {
		grade,
		gradeText: PLAY_GRADE[grade],
	};
}

/**
 * @returns {string[] | null}
 */
export function useOsuPlayMods() {
	return useOsuFormattedToken(TOKENS.PLAY_MODS_ARRAY);
}
