import { useEffect, useMemo } from 'react';
import { useTransitionValue } from 'react-transition-value';
import classNames from 'classnames';

import styles from './Stats.module.scss';
import useJSONConfig from '@/features/config';
import { useOsuGameMode, useOsuGameState, useOsuMapAR, useOsuMapCS, useOsuMapHP, useOsuMapOD, useOsuMapStars } from '@/features/hooks';
import { useTransition } from '@/features/transition';
import { GAME_MODE, GAME_STATE_CATEGORY } from '@/features/enums';

export default function OverlayStats() {
	const config = useJSONConfig();

	const { category: stateCategory } = useOsuGameState();
	const { mode } = useOsuGameMode();

	const sr = useTransition(useOsuMapStars());
	const cs = useTransition(useOsuMapCS());
	const ar = useTransition(useOsuMapAR());
	const od = useTransition(useOsuMapOD());
	const hp = useTransition(useOsuMapHP());

	const [divider, setDivider] = useTransitionValue(10, {
		duration: 250,
	});

	useEffect(() => {
		setDivider([cs, ar, od, hp].some((v) => v > 10) ? 11 : 10);
	}, [cs, ar, od, hp, setDivider]);

	const isTaikoOrMania = mode === GAME_MODE.TAIKO || mode === GAME_MODE.MANIA;

	// ------------------

	const srBar = useMemo(() => {
		let formattedSr;
		if (!sr) {
			formattedSr = '0';
		} else if (sr < 1000) {
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
					[styles.ListVisible]: [
						GAME_STATE_CATEGORY.SONG_SELECT,
						GAME_STATE_CATEGORY.RESULT_SCREEN,
						GAME_STATE_CATEGORY.PLAYING,
					].includes(stateCategory),
					[styles.ListOnPlaying]: stateCategory === GAME_STATE_CATEGORY.PLAYING,
					[styles.ListCurrent]: isTaikoOrMania,
				})}
			>
				{srBar}
				{odBar}
				{hpBar}
			</div>
			<div
				className={classNames(styles.List, {
					[styles.ListVisible]: [
						GAME_STATE_CATEGORY.SONG_SELECT,
						GAME_STATE_CATEGORY.RESULT_SCREEN,
						GAME_STATE_CATEGORY.PLAYING,
					].includes(stateCategory),
					[styles.ListOnPlaying]: stateCategory === GAME_STATE_CATEGORY.PLAYING,
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
