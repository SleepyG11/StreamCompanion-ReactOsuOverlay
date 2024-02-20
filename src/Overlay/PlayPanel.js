import classNames from 'classnames';
import { useMemo } from 'react';

import useJSONConfig from 'config';
import useOsuToken, { useOsuMapProgress, useOsuStateType } from 'socket';

import TOKENS from 'enums/TOKENS';

import DonutProgress from './DonutProgress';
import styles from './PlayPanel.module.scss';

const MODS_TO_DISPLAY = ['AP', 'AT', 'CN', 'DT', 'EZ', 'FL', 'HD', 'HR', 'HT', 'NC', 'NF', 'PF', 'RX', 'SD', 'SO', 'TP', 'NM'];

export default function OverlayPlayPanel() {
	const config = useJSONConfig();

	const state = useOsuStateType();
	const progress = useOsuMapProgress();
	const mods = useOsuToken(TOKENS.MAP_MODS_ARRAY);
	const missesCount = useOsuToken(TOKENS.PLAY_0);

	let modsArray = useMemo(() => {
		return mods.split(',').filter((mod) => MODS_TO_DISPLAY.includes(mod));
	}, [mods]);

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: state === 'playing',
			})}
		>
			<div
				className={classNames(styles.Mods, {
					[styles.Mods4]: modsArray.length > 3,
				})}
			>
				{modsArray.map((mod) => (
					<img key={mod} src={`mods/${mod}.png`} alt='mod' />
				))}
			</div>
			<div className={classNames(styles.Item, styles.ItemMisses)}>{missesCount}</div>
			<div className={classNames(styles.Item, styles.ItemTime)}>
				{config.useNegativeTimeInPlayTimer ? progress.negative : progress.positive}
			</div>
			<DonutProgress color={'255 255 255'} size={24} width={3.75} />
		</div>
	);
}
