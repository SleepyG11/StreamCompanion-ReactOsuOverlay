import classNames from 'classnames';
import { useMemo } from 'react';

import DonutProgress from './DonutProgress';
import styles from './PlayPanel.module.scss';
import Odometer from 'react-odometerjs';
import useJSONConfig from '@/features/config';
import { useOsuGameState, useOsuMapProgress, useOsuPlayMisses, useOsuPlayMods } from '@/features/hooks';
import { GAME_STATE_CATEGORY } from '@/features/enums';

const MODS_TO_DISPLAY = ['AP', 'AU', 'CN', 'DT', 'EZ', 'FL', 'HD', 'HR', 'HT', 'NC', 'NF', 'PF', 'RX', 'SD', 'SO', 'TP', 'NM'];

export default function OverlayPlayPanel() {
	const config = useJSONConfig();

	const { category: stateCategory } = useOsuGameState();
	const progress = useOsuMapProgress(config.adjustTimeBySpeedMods);
	const mods = useOsuPlayMods();
	const missesCount = useOsuPlayMisses();

	let modsArray = useMemo(() => {
		return mods ? mods.filter((mod) => MODS_TO_DISPLAY.includes(mod)) : [];
	}, [mods]);

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: stateCategory === GAME_STATE_CATEGORY.PLAYING,
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
			<div className={classNames(styles.Item, styles.ItemMisses)}>
				<Odometer value={missesCount} duration={250} />
			</div>
			<div className={classNames(styles.Item, styles.ItemTime)}>
				{config.useNegativeTimeInPlayTimer ? progress.negative : progress.positive}
			</div>
			<DonutProgress color={'255 255 255'} size={24} width={3.75} />
		</div>
	);
}
