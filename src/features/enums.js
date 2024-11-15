function numberOrZero(v) {
	return v == null ? 0 : Number(v);
}
function booleanOrNull(v) {
	return v == null ? null : Boolean(v);
}
function stringOrNull(v) {
	return v == null ? null : String(v);
}

// ---------------------

export const CONFIG_STATUS = {
	LOADING: -1,
	ERROR: 0,
	LOADED: 1,
};
export const CONFIG_STATUS_MAP = Object.fromEntries(Object.entries(CONFIG_STATUS).map((entry) => entry.reverse()));

// ---------------------

export const GAME_STATE = {
	CONNECTING: -3,
	UNKNOWN: -2,
	NOT_RUNNING: -1,
	MAIN_MENU: 0,
	EDITING_MAP: 1,
	PLAYING: 2,
	GAME_SHUTDOWN_ANIMATION: 3,
	SONG_SELECT_EDIT: 4,
	SONG_SELECT: 5,
	RESULTS_SCREEN: 7,
	GAME_STARTUP_ANIMATION: 10,
	MULTIPLAYER_ROOMS: 11,
	MULTIPLAYER_ROOM: 12,
	MULTIPLAYER_SONG_SELECT: 13,
	MULTIPLAYER_RESULTS_SCREEN: 14,
	OSU_DIRECT: 15,
	RANKING_TAG_COOP: 17,
	RANKING_TEAM: 18,
	PROCESSING_BEATMAPS: 19,
	TOURNEY: 22,
};
export const GAME_STATE_MAP = Object.fromEntries(Object.entries(GAME_STATE).map((entry) => entry.reverse()));

export const GAME_STATE_CATEGORY = {
	CONNECTING: -3,
	UNKNOWN: -2,
	NOT_RUNNING: -1,
	IDLE: 0,
	SONG_SELECT: 1,
	PLAYING: 2,
	RESULT_SCREEN: 3,
};
export const GAME_STATE_CATEGORY_MAP = Object.fromEntries(Object.entries(GAME_STATE_CATEGORY).map((entry) => entry.reverse()));

export const GAME_MODE = {
	OSU: 0,
	TAIKO: 1,
	CATCH: 2,
	MANIA: 3,
};
export const GAME_MODE_TRANSFORM = {
	Osu: GAME_MODE.OSU,
	Taiko: GAME_MODE.TAIKO,
	CatchTheBeat: GAME_MODE.CATCH,
	OsuMania: GAME_MODE.MANIA,
};
export const GAME_MODE_MAP = Object.fromEntries(Object.entries(GAME_STATE_CATEGORY).map((entry) => entry.reverse()));

// export const USER_STATUS = {
//     UNKNOWN: -2,
// 	LISTENING: 1,
// 	PLAYING: 2,
// 	WATCHING: 3,
// 	EDITING: 4,
// 	RESULTS_SCREEN: 5,
// }
// export const USER_STATUS_TRANSFORM = {
//     Listening: USER_STATUS.LISTENING,
//     Playing: USER_STATUS.PLAYING,
//     Watching: USER_STATUS.WATCHING,
//     ResultsScreen: USER_STATUS.RESULTS_SCREEN,
//     Editing: USER_STATUS.EDITING,
// }
// export const USER_STATUS_MAP = Object.fromEntries(Object.entries(USER_STATUS).map(entry => entry.reverse()));

// ---------------------

export const MAP_RANKING_STATUS = {
	NOT_SUBMITTED: 1,
	UNRANKED: 2,
	RANKED: 4,
	QUALIFIED: 6,
	LOVED: 7,
};
export const MAP_RANKING_STATUS_MAP = Object.fromEntries(Object.entries(MAP_RANKING_STATUS).map((entry) => entry.reverse()));

// ---------------------

export const PLAY_GRADE = {
	SSH: 0,
	SH: 1,
	SS: 2,
	S: 3,
	A: 4,
	B: 5,
	C: 6,
	D: 7,
	F: 8,
};
export const PLAY_GRADE_MAP = Object.fromEntries(Object.entries(PLAY_GRADE).map((entry) => entry.reverse()));

export const PLAY_RANKING_FILTER = {
	LOCAL: 0,
	TOP: 1,
	SELECTED_MODS: 2,
	FRIENDS: 3,
	COUNTRY: 4,
};
export const PLAY_RANKING_FILTER_MAP = Object.fromEntries(Object.entries(PLAY_RANKING_FILTER).map((entry) => entry.reverse()));

// ---------------------

export const TOKENS = {
	GAME_IS_RUNNING: 'osuIsRunning',
	GAME_IS_INTERFACE_VISIBLE: 'ingameInterfaceIsEnabled',
	GAME_IS_CHAT_VISIBLE: 'chatIsEnabled',
	GAME_STATE: 'rawStatus',
	GAME_MODE: 'gameMode',

	// SKIN

	SKIN_NAME: 'skin',
	SKIN_SRC: 'skinPath',

	// USER

	USER_USERNAME: 'username',
	USER_COUNTRY: 'country',
	USER_ID: 'banchoId',
	USER_IS_CONNECTED: 'banchoIsConnected',
	USER_STATUS: 'status',

	// MAP

	MAP_ID: 'mapid',
	MAP_SET_ID: 'mapsetid',
	MAP_MD5: 'md5',
	MAP_RANKING_STATUS: 'rankedStatus',

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
	MAP_SOURCE: 'source',
	MAP_TAGS: 'tags',

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

	MAP_PP_100_MANIA: 'mania_1_000_000PP',
	MAP_PP_100: 'osu_mSSPP',
	MAP_PP_99_9: 'osu_m99_9PP',
	MAP_PP_99: 'osu_m99PP',
	MAP_PP_98: 'osu_m98PP',
	MAP_PP_97: 'osu_m97PP',
	MAP_PP_96: 'osu_m96PP',
	MAP_PP_95: 'osu_m95PP',

	MAP_IS_BREAK: 'isBreakTime',

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

	PLAY_MODS: 'mods',
	PLAY_MODS_RAW: 'modsEnum',
	PLAY_MODS_ARRAY: 'mods',
};
export const TOKEN_FORMATTERS = {
	[TOKENS.GAME_IS_RUNNING]: booleanOrNull,
	[TOKENS.GAME_IS_INTERFACE_VISIBLE]: booleanOrNull,
	[TOKENS.GAME_IS_CHAT_VISIBLE]: booleanOrNull,
	[TOKENS.GAME_STATE]: numberOrZero,
	[TOKENS.GAME_MODE]: stringOrNull,

	// SKIN

	[TOKENS.SKIN_NAME]: stringOrNull,
	[TOKENS.SKIN_SRC]: stringOrNull,

	// USER

	[TOKENS.USER_USERNAME]: stringOrNull,
	[TOKENS.USER_COUNTRY]: stringOrNull,
	[TOKENS.USER_ID]: numberOrZero,
	[TOKENS.USER_IS_CONNECTED]: booleanOrNull,
	[TOKENS.USER_STATUS]: numberOrZero,

	// MAP

	[TOKENS.MAP_ID]: numberOrZero,
	[TOKENS.MAP_SET_ID]: numberOrZero,
	[TOKENS.MAP_MD5]: stringOrNull,
	[TOKENS.MAP_RANKING_STATUS]: numberOrZero,

	[TOKENS.MAP_TIME_FIRST_OBJECT]: numberOrZero,
	[TOKENS.MAP_TIME_CURRENT]: numberOrZero,
	[TOKENS.MAP_TIME_FULL]: numberOrZero,
	[TOKENS.MAP_TIME_AUDIO]: numberOrZero,
	[TOKENS.MAP_TIME_REMAINING]: numberOrZero,

	[TOKENS.MAP_ARTIST]: stringOrNull,
	[TOKENS.MAP_ARTIST_ORIGINAL]: stringOrNull,
	[TOKENS.MAP_TITLE]: stringOrNull,
	[TOKENS.MAP_TITLE_ORIGINAL]: stringOrNull,
	[TOKENS.MAP_MAPPER]: stringOrNull,
	[TOKENS.MAP_DIFFICULTY]: (v) => {
		if (v == null) return null;
		return String(v);
	},
	[TOKENS.MAP_SOURCE]: stringOrNull,
	[TOKENS.MAP_TAGS]: (v) => {
		if (v == null) return null;
		return String(v).split(' ');
	},
	[TOKENS.MAP_TAGS_ARRAY]: (v) => {
		if (v == null) return null;
		return String(v).split(' ');
	},
	[TOKENS.MAP_TAGS_RAW]: stringOrNull,

	[TOKENS.MAP_AR]: numberOrZero,
	[TOKENS.MAP_CS]: numberOrZero,
	[TOKENS.MAP_OD]: numberOrZero,
	[TOKENS.MAP_HP]: numberOrZero,
	[TOKENS.MAP_STARS]: numberOrZero,

	[TOKENS.MAP_BPM]: numberOrZero,
	[TOKENS.MAP_BPM_CURRENT]: numberOrZero,
	[TOKENS.MAP_BPM_MIN]: numberOrZero,
	[TOKENS.MAP_BPM_MAX]: numberOrZero,

	[TOKENS.MAP_COMBO_MAX]: numberOrZero,

	[TOKENS.MAP_BG]: stringOrNull,
	[TOKENS.MAP_FILE]: stringOrNull,
	[TOKENS.MAP_FOLDER]: stringOrNull,
	[TOKENS.MAP_AUDIO]: stringOrNull,
	[TOKENS.MAP_FULL]: stringOrNull,

	[TOKENS.MAP_PP_100_MANIA]: numberOrZero,
	[TOKENS.MAP_PP_99_9]: numberOrZero,
	[TOKENS.MAP_PP_100]: numberOrZero,
	[TOKENS.MAP_PP_99]: numberOrZero,
	[TOKENS.MAP_PP_98]: numberOrZero,
	[TOKENS.MAP_PP_97]: numberOrZero,
	[TOKENS.MAP_PP_96]: numberOrZero,
	[TOKENS.MAP_PP_95]: numberOrZero,

	[TOKENS.MAP_IS_BREAK]: booleanOrNull,

	// PLAY

	[TOKENS.PLAY_SCORE]: numberOrZero,
	[TOKENS.PLAY_ACCURACY]: numberOrZero,
	[TOKENS.PLAY_COMBO_CURRENT]: numberOrZero,
	[TOKENS.PLAY_COMBO_MAX]: numberOrZero,

	[TOKENS.PLAY_HP]: numberOrZero,

	[TOKENS.PLAY_300]: numberOrZero,
	[TOKENS.PLAY_100]: numberOrZero,
	[TOKENS.PLAY_50]: numberOrZero,
	[TOKENS.PLAY_0]: numberOrZero,
	[TOKENS.PLAY_MISSES]: numberOrZero,
	[TOKENS.PLAY_SLIDER_BREAKS]: numberOrZero,
	[TOKENS.PLAY_GEKI]: numberOrZero,
	[TOKENS.PLAY_KATSU]: numberOrZero,

	[TOKENS.PLAY_UNSTABLE_RATE]: numberOrZero,

	[TOKENS.PLAY_PP_CURRENT]: numberOrZero,
	[TOKENS.PLAY_PP_IF_FC]: numberOrZero,
	[TOKENS.PLAY_PP_MAX]: numberOrZero,
	[TOKENS.PLAY_PP_SIMULATED]: numberOrZero,

	[TOKENS.PLAY_GRADE_CURRENT]: numberOrZero,
	[TOKENS.PLAY_GRADE_IF_FC]: numberOrZero,

	[TOKENS.PLAY_MODS]: (v) => {
		if (v == null) return null;
		return v === 'None' ? ['NM'] : v.replace('SV2', 'V2').split(',');
	},
	[TOKENS.PLAY_MODS_ARRAY]: (v) => {
		if (v == null) return null;
		return v === 'None' ? ['NM'] : v.replace('SV2', 'V2').split(',');
	},
	[TOKENS.PLAY_MODS_RAW]: numberOrZero,
};

// ---------------------
