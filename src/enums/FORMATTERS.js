import { GRADES, STATUS } from 'enums/OSU';
import TOKENS from 'enums/TOKENS';

const FORMATTERS = {
	[TOKENS.INTERFACE_ENABLED]: Boolean,
	[TOKENS.CHAT_ENABLED]: Boolean,

	[TOKENS.GAME_STATE]: (v) => Number(v) || STATUS.NULL,

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
		return GRADES[v];
	},
	[TOKENS.PLAY_GRADE_IF_FC]: (v) => {
		if (v === null) return v;
		return GRADES[v];
	},
};

export default FORMATTERS;

// -----------------------------

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
