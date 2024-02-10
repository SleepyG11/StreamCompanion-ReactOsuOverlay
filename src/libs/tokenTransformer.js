function getToken(tokenName, tokens, rws) {
	if (tokens.hasOwnProperty(tokenName)) return tokens[tokenName];

	rws.AddToken(tokenName);
	return '';
}

function transformTokens(tokens, rws) {
	return {
		settings: {
			get showInterface() {
				return getToken('ingameInterfaceIsEnabled', tokens, rws);
			},
		},
		menu: {
			get state() {
				return getToken('rawStatus', tokens, rws);
			},
			get skinFolder() {
				return getToken('skin', tokens, rws);
			},
			get gameMode() {
				return getToken('gameMode', tokens, rws);
			},
			get isChatEnabled() {
				return getToken('chatIsEnabled', tokens, rws);
			},
			bm: {
				time: {
					get firstObj() {
						return getToken('firstHitObjectTime', tokens, rws);
					},
					get current() {
						return getToken('time', tokens, rws) * 1000;
					},
					get full() {
						return getToken('totaltime', tokens, rws);
					},
					get mp3() {
						return getToken('totalAudioTime', tokens, rws);
					},
				},
				get id() {
					return getToken('mapid', tokens, rws);
				},
				get set() {
					return getToken('mapsetid', tokens, rws);
				},
				get md5() {
					return getToken('md5', tokens, rws);
				},
				get rankedStatus() {
					return getToken('rankedStatus', tokens, rws);
				},
				metadata: {
					get artist() {
						return getToken('artistRoman', tokens, rws);
					},
					get title() {
						return getToken('titleRoman', tokens, rws);
					},
					get mapper() {
						return getToken('creator', tokens, rws);
					},
					get difficulty() {
						return getToken('diffName', tokens, rws);
					},
				},
				stats: {
					get AR() {
						return getToken('mAR', tokens, rws);
					},
					get CS() {
						return getToken('mCS', tokens, rws);
					},
					get OD() {
						return getToken('mOD', tokens, rws);
					},
					get HP() {
						return getToken('mHP', tokens, rws);
					},
					get SR() {
						return getToken('liveStarRating', tokens, rws);
					},
					BPM: {
						get min() {
							return getToken('minBpm', tokens, rws);
						},
						get max() {
							return getToken('maxBpm', tokens, rws);
						},
					},
					get fullSR() {
						return getToken('mStars', tokens, rws);
					},
					get memoryAR() {
						return getToken('AR', tokens, rws);
					},
					get memoryCS() {
						return getToken('CS', tokens, rws);
					},
					get memoryOD() {
						return getToken('OD', tokens, rws);
					},
					get memoryHP() {
						return getToken('HP', tokens, rws);
					},
				},
				path: {
					get full() {
						return getToken('dir', tokens, rws) + '\\' + getToken('backgroundImageFileName', tokens, rws);
					},
					get folder() {
						return getToken('dir', tokens, rws);
					},
					get file() {
						return getToken('osuFileName', tokens, rws);
					},
					get bg() {
						return getToken('backgroundImageFileName', tokens, rws);
					},
					get audio() {
						return getToken('mp3Name', tokens, rws);
					},
				},
			},
			mods: {
				get num() {
					return getToken('modsEnum', tokens, rws);
				},
				get str() {
					let mods = getToken('mods', tokens, rws);
					return mods === 'None' ? 'NM' : mods.replace(/,/g, '').replace(/SV2/g, 'v2');
				},
			},
			pp: {
				get 100() {
					return getToken('osu_mSSPP', tokens, rws);
				},
				get 99() {
					return getToken('osu_m99PP', tokens, rws);
				},
				get 98() {
					return getToken('osu_m98PP', tokens, rws);
				},
				get 97() {
					return getToken('osu_m97PP', tokens, rws);
				},
				get 96() {
					return getToken('osu_m96PP', tokens, rws);
				},
				get 95() {
					return getToken('osu_m95PP', tokens, rws);
				},
				get strains() {
					return getToken('mapStrains', tokens, rws);
				},
			},
		},
		gameplay: {
			get gameMode() {
				return getToken('gameMode', tokens, rws);
			},
			get name() {
				return getToken('username', tokens, rws);
			},
			get score() {
				return getToken('score', tokens, rws);
			},
			get accuracy() {
				return getToken('acc', tokens, rws);
			},
			combo: {
				get current() {
					return getToken('combo', tokens, rws);
				},
				get max() {
					return getToken('currentMaxCombo', tokens, rws);
				},
			},
			hp: {
				get normal() {
					return getToken('playerHp', tokens, rws);
				},
				get smooth() {
					return getToken('playerHpSmooth', tokens, rws);
				},
			},
			hits: {
				get 300() {
					return getToken('c300', tokens, rws);
				},
				get geki() {
					return getToken('geki', tokens, rws);
				},
				get 100() {
					return getToken('c100', tokens, rws);
				},
				get katu() {
					return getToken('katsu', tokens, rws);
				},
				get 50() {
					return getToken('c50', tokens, rws);
				},
				get 0() {
					return getToken('miss', tokens, rws);
				},
				get sliderBreaks() {
					return getToken('sliderBreaks', tokens, rws);
				},
				grade: {
					get current() {
						return window.overlay.osuGrade[getToken('grade', tokens, rws)];
					},
					get maxThisPlay() {
						return window.overlay.osuGrade[getToken('maxGrade', tokens, rws)];
					},
				},
				get unstableRate() {
					return getToken('unstableRate', tokens, rws);
				},
				get hitErrorArray() {
					return getToken('hitErrors', tokens, rws);
				},
			},
			pp: {
				get current() {
					return getToken('ppIfMapEndsNow', tokens, rws);
				},
				get fc() {
					return getToken('noChokePp', tokens, rws);
				},
				get maxThisPlay() {
					return getToken('ppIfRestFced', tokens, rws);
				},
			},
			get rawKeyOverlay() {
				return getToken('keyOverlay', tokens, rws);
			},
			cachedKeyOverlay: null,
			get keyOverlay() {
				return this.cachedKeyOverlay !== null
					? this.cachedKeyOverlay
					: (this.cachedKeyOverlay = convertSCKeyOverlay(this.rawKeyOverlay));
			},
			get rawLeaderboard() {
				return getToken('leaderBoardPlayers', tokens, rws);
			},
			get rawLeaderboardMainPlayer() {
				return getToken('leaderBoardMainPlayer', tokens, rws);
			},
			cachedLeaderboard: null,
			get leaderboard() {
				return this.cachedLeaderboard !== null
					? this.cachedLeaderboard
					: (this.cachedLeaderboard = convertSCLeaderBoard(this.rawLeaderboard, this.rawLeaderboardMainPlayer));
			},
			resultsScreen: {
				get 300() {
					return getToken('c300', tokens, rws);
				},
				get 100() {
					return getToken('c100', tokens, rws);
				},
				get 50() {
					return getToken('c50', tokens, rws);
				},
				get 0() {
					return getToken('miss', tokens, rws);
				},
				get geki() {
					return getToken('geki', tokens, rws);
				},
				get katu() {
					return getToken('katsu', tokens, rws);
				},
				get name() {
					return getToken('username', tokens, rws);
				},
				get score() {
					return getToken('score', tokens, rws);
				},
				get maxCombo() {
					return getToken('combo', tokens, rws);
				},
				mods: {
					get num() {
						return getToken('modsEnum', tokens, rws);
					},
					get str() {
						return getToken('mods', tokens, rws).replace(/,/g, '');
					},
				},
			},
			//TODO: tourney will have to be done at some other time
			tourney: {
				manager: {
					ipcState: 0,
					bestOF: 0,
					teamName: {
						left: '',
						right: '',
					},
					stars: {
						left: 0,
						right: 0,
					},
					bools: {
						scoreVisible: false,
						starsVisible: false,
					},
					chat: null,
					gameplay: {
						score: {
							left: 0,
							right: 0,
						},
					},
				},
				ipcClients: null,
			},
		},
	};
}

function convertSCKeyOverlay(rawKeyOverlay) {
	let keys = JSON.parse(rawKeyOverlay || '{}');

	return {
		k1: {
			isPressed: keys.K1Pressed,
			count: keys.K1Count,
		},
		k2: {
			isPressed: keys.K2Pressed,
			count: keys.K2Count,
		},
		m1: {
			isPressed: keys.M1Pressed,
			count: keys.M1Count,
		},
		m2: {
			isPressed: keys.M2Pressed,
			count: keys.M2Count,
		},
	};
}

function convertSCLeaderBoard(rawPlayers, rawMainPlayer) {
	let players = JSON.parse(rawPlayers || '[]');
	let mainPlayer = JSON.parse(rawMainPlayer || '{}');

	return {
		hasLeaderboard: players.length > 0,
		isVisible: mainPlayer.IsLeaderboardVisible || false,
		ourplayer: convertSCPlayerSlot(mainPlayer),
		slots: players.map((p) => convertSCPlayerSlot(p)),
	};
}

function convertSCPlayerSlot(player) {
	return {
		name: player.Username,
		score: player.Score,
		combo: player.Combo,
		maxCombo: player.MaxCombo,
		mods: player.Mods ? player.Mods.Value : 0, //TODO: this should be returning mod string instead of enum
		h300: player.Hit300,
		h100: player.Hit100,
		h50: player.Hit50,
		h0: player.HitMiss,
		team: player.Team,
		position: player.Position,
		isPassing: player.IsPassing,
	};
}
function ApplyConstChanges() {
	//gosu doesn't provide HD/FL info in grades
	window.overlay.osuGrade[0] = `SS`;
	window.overlay.osuGrade[1] = `S`;
}
function CreateProxiedReconnectingWebSocket(url) {
	ApplyConstChanges();
	const tokensCache = {};

	let proxy = {
		//onopen,
		//onclose,
		//onerror,
		//onmessage,
	};

	//Requesting only basic tokens to bootstrap everything on first map event
	const tokenNames = ['md5', 'modsEnum', 'gameMode', 'mapid', 'mapsetid', 'username'];

	let rws = watchTokens(
		tokenNames,
		(values) => {
			Object.assign(tokensCache, values);
			proxy.onmessage({ data: transformTokens(tokensCache, rws) });
		},
		'MainPipeline,LiveTokens',
		10
	);

	let origOnOpen = rws.onopen;

	rws.onopen = (ev) => {
		origOnOpen(ev);
		proxy.onopen(ev);
	};
	rws.onclose = (ev) => proxy.onclose(ev);
	rws.onerror = (ev) => proxy.onerror(ev);
	//rws.onmessage = (ev) => proxy.onmessage(ev);

	return proxy;
}
