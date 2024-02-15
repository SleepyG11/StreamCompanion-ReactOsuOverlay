import useOsuToken, { TOKENS, useOsuStateType, useOsuTransitionToken } from '../../../socket';
import classNames from 'classnames';
import styles from './Stats.module.scss';
import { useTransitionValue } from 'react-transition-value';
import { useEffect, useMemo } from 'react';
import useConfigs from '../../Configurator/context';

export default function OverlayStats() {
	const [config] = useConfigs();
	const state = useOsuStateType();

	const gameMode = useOsuToken(TOKENS.GAMEMODE);
	const sr = useOsuTransitionToken(TOKENS.MAP_STARS, 0, { throttleZero: true, duration: 500 });
	const cs = useOsuTransitionToken(TOKENS.MAP_CS, 0, { throttleZero: true, duration: 500 });
	const ar = useOsuTransitionToken(TOKENS.MAP_AR, 0, { throttleZero: true, duration: 500 });
	const od = useOsuTransitionToken(TOKENS.MAP_OD, 0, { throttleZero: true, duration: 500 });
	const hp = useOsuTransitionToken(TOKENS.MAP_HP, 0, { throttleZero: true, duration: 500 });

	const [divider, setDivider] = useTransitionValue(10, {
		duration: 250,
	});

	useEffect(() => {
		setDivider([cs, ar, od, hp].some((v) => v > 10) ? 11 : 10);
	}, [cs, ar, od, hp, setDivider]);

	let formattedSr = useMemo(() => {
		if (sr < 1000) {
			return sr.toPrecision(3).substring(0, 4);
		}
		if (sr < 10000) {
			let [first, second] = sr.toString().split('');
			return first + '.' + second + 'k';
		}
		if (sr < 1000000) {
			return Math.round(sr / 1000) + 'k';
		}
		return Math.round(sr / 1000000) + 'm';
	}, [sr]);

	const isTaikoOrMania = gameMode === 'Taiko' || gameMode === 'OsuMania';

	const srResult = (
		<div className={styles.Item} style={{ '--color': '255 204 34' }}>
			<p className={styles.ItemName}>SR</p>
			<div className={styles.ItemProgress} style={{ '--progress': (sr / 10) * 100 + '%' }} />
			<p className={styles.ItemValue}>{formattedSr}</p>
		</div>
	);
	const csResult = (
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
	);

	const arResult = (
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
	);
	const odResult = (
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
	);

	const hpResult = (
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
	);

	return (
		<>
			<div
				className={classNames(styles.List, {
					[styles.ListVisible]: ['songSelect', 'resultScreen', 'playing'].includes(state),
					[styles.ListOnPlaying]: state === 'playing',
					[styles.ListCurrent]: isTaikoOrMania,
				})}
			>
				{srResult}
				{odResult}
				{hpResult}
			</div>
			<div
				className={classNames(styles.List, {
					[styles.ListVisible]: ['songSelect', 'resultScreen', 'playing'].includes(state),
					[styles.ListOnPlaying]: state === 'playing',
					[styles.ListCurrent]: !isTaikoOrMania,
				})}
			>
				{srResult}
				{csResult}
				{arResult}
				{odResult}
				{hpResult}
			</div>
		</>
	);
}
