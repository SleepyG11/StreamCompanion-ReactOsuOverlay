const TOKENS = {
	INTERFACE_ENABLED: 'ingameInterfaceIsEnabled',
	CHAT_ENABLED: 'chatIsEnabled',

	GAME_STATE: 'rawStatus',
	GAME_MODE: 'gameMode',
	SKIN_FOLDER: 'skin',

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

export default TOKENS;
