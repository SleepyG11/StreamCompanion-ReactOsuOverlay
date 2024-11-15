window.CONFIG = {
	streamCompanionHref: 'http://localhost:20727',

	// When map's certain stat has value less than provided number, it's color will be changed to blue.
	// CS [Default: 2]
	csBottomThreshold: 2,
	// AR [Default: 5]
	arBottomThreshold: 5,
	// OD [Default: 5]
	odBottomThreshold: 5,
	// HP [Default: 2]
	hpBottomThreshold: 2,

	// When map's certain stat has value greater than provided number, it's color will be changed to red.
	// CS [Default: 5]
	csTopThreshold: 5,
	// AR [Default: 9.5]
	arTopThreshold: 9.5,
	// OD [Default: 9.5]
	odTopThreshold: 9.5,
	// HP [Default: 5]
	hpTopThreshold: 5,

	// Determine type of time displayed in play timer:
	// `false`: from audio start to last note as positive
	// `true`: from audio start to first note as negative, then to last note as positive, then to audio end as negative
	// [Default: false]
	useNegativeTimeInPlayTimer: false,

	// Display original song title and artist instead of latin. [Default: false]
	useOriginalLanguageForSongArtistAndTitle: false,

	// When HalfTime, DoubleTime or Nightcore mods used, adjust play timer to display real time (i.e. increased by 25% for HT or decreased by 25% for DT/NC). [Default: false]
	adjustTimeBySpeedMods: false,

	// Display phrase instead of PP counter when Full Combo is reached. [Default: false]
	showFcPhrase: false,
	// Phrase to display. {pp} macros can be used to insert score PP. [Default: '{pp} pp FC!']
	fcPhrase: '{pp} pp FC, not bad!',

	// Display phrase instead of PP counter when SS grade is reached. [Default: false]
	showSsPhrase: false,
	// Phrase to display. {pp} macros can be used to insert score PP. [Default: '{pp} pp SS!']
	ssPhrase: 'Wow! {pp} pp SS!',

	// Hide overlay when chat is opened (i.e. chat menu, multiplayer menu or multiplayer lobby) [Default: false]
	hideWhenChatOpened: false,
	// Hide overlay when Cinema mode is applied [Default: false]
	hideWhenCinemaMode: false,
	// Hide overlay when in-game interface is hidden (by Shift + Tab) [Default: false]
	hideWhenIngameInterfaceHidden: false,
};
