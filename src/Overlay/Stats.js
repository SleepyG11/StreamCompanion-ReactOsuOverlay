import { useEffect, useMemo } from 'react';
import { useTransitionValue } from 'react-transition-value';
import classNames from 'classnames';

import useOsuToken, { useOsuStateType, useOsuTransitionToken } from 'socket';
import TOKENS from 'enums/TOKENS';
import useJSONConfig from 'config';

import styles from './Stats.module.scss';

export default function OverlayStats() {
	const config = useJSONConfig();

	const state = useOsuStateType();
	const gameMode = useOsuToken(TOKENS.GAME_MODE);

	const sr = useOsuTransitionToken(TOKENS.MAP_STARS, 0, { throttle: true, duration: 500 });
	const cs = useOsuTransitionToken(TOKENS.MAP_CS, 0, { throttle: true, duration: 500 });
	const ar = useOsuTransitionToken(TOKENS.MAP_AR, 0, { throttle: true, duration: 500 });
	const od = useOsuTransitionToken(TOKENS.MAP_OD, 0, { throttle: true, duration: 500 });
	const hp = useOsuTransitionToken(TOKENS.MAP_HP, 0, { throttle: true, duration: 500 });

	const [divider, setDivider] = useTransitionValue(10, {
		duration: 250,
	});

	useEffect(() => {
		setDivider([cs, ar, od, hp].some((v) => v > 10) ? 11 : 10);
	}, [cs, ar, od, hp, setDivider]);

	const isTaikoOrMania = gameMode === 'Taiko' || gameMode === 'OsuMania';

	// ------------------

	const srBar = useMemo(() => {
		let formattedSr;
		if (sr < 1000) {
			formattedSr = sr.toPrecision(3).substring(0, 4);
		} else if (sr < 10000) {
			let [first, second] = sr.toString().split('');
			formattedSr = first + '.' + second + 'k';
		} else if (sr < 1000000) {
			formattedSr = Math.round(sr / 1000) + 'k';
		} else {
			formattedSr = Math.round(sr / 1000000) + 'm';
		}
		return (
			<div className={styles.Item} style={{ '--color': '255 204 34' }}>
				<p className={styles.ItemName}>SR</p>
				<div className={styles.ItemProgress} style={{ '--progress': (sr / 10) * 100 + '%' }} />
				<p className={styles.ItemValue}>{formattedSr}</p>
			</div>
		);
	}, [sr]);

	const csBar = useMemo(
		() => (
			<div
				className={classNames(styles.Item, {
					[styles.ItemOvercap]: cs > config.csTopThreshold,
					[styles.ItemLowcap]: cs < config.csBottomThreshold,
				})}
			>
				<p className={styles.ItemName}>CS</p>
				<div className={styles.ItemProgress} style={{ '--progress': (cs / divider) * 100 + '%' }} />
				<p className={styles.ItemValue}>{cs.toPrecision(3).substring(0, 4)}</p>
			</div>
		),
		[cs, divider, config]
	);

	const arBar = useMemo(
		() => (
			<div
				className={classNames(styles.Item, {
					[styles.ItemOvercap]: ar > config.arTopThreshold,
					[styles.ItemLowcap]: ar < config.arBottomThreshold,
				})}
			>
				<p className={styles.ItemName}>AR</p>
				<div className={styles.ItemProgress} style={{ '--progress': (ar / divider) * 100 + '%' }} />
				<p className={styles.ItemValue}>{ar.toPrecision(3).substring(0, 4)}</p>
			</div>
		),
		[ar, divider, config]
	);

	const odBar = useMemo(
		() => (
			<div
				className={classNames(styles.Item, {
					[styles.ItemOvercap]: od >= config.odTopThreshold,
					[styles.ItemLowcap]: od < config.odBottomThreshold,
				})}
			>
				<p className={styles.ItemName}>OD</p>
				<div className={styles.ItemProgress} style={{ '--progress': (od / divider) * 100 + '%' }} />
				<p className={styles.ItemValue}>{od.toPrecision(3).substring(0, 4)}</p>
			</div>
		),
		[od, divider, config]
	);

	const hpBar = useMemo(
		() => (
			<div
				className={classNames(styles.Item, {
					[styles.ItemOvercap]: hp > config.hpTopThreshold,
					[styles.ItemLowcap]: hp < config.hpBottomThreshold,
				})}
			>
				<p className={styles.ItemName}>HP</p>
				<div className={styles.ItemProgress} style={{ '--progress': (hp / divider) * 100 + '%' }} />
				<p className={styles.ItemValue}>{hp.toPrecision(3).substring(0, 4)}</p>
			</div>
		),
		[hp, divider, config]
	);

	// ------------------

	return (
		<>
			<div
				className={classNames(styles.List, {
					[styles.ListVisible]: ['songSelect', 'resultScreen', 'playing'].includes(state),
					[styles.ListOnPlaying]: state === 'playing',
					[styles.ListCurrent]: isTaikoOrMania,
				})}
			>
				{srBar}
				{odBar}
				{hpBar}
			</div>
			<div
				className={classNames(styles.List, {
					[styles.ListVisible]: ['songSelect', 'resultScreen', 'playing'].includes(state),
					[styles.ListOnPlaying]: state === 'playing',
					[styles.ListCurrent]: !isTaikoOrMania,
				})}
			>
				{srBar}
				{csBar}
				{arBar}
				{odBar}
				{hpBar}
			</div>
		</>
	);
}
