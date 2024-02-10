import classNames from 'classnames';
import useOsuToken, { TOKENS, useOsuMapProgress, useOsuStateType } from '../../../socket';
import DonutProgress from './DonutProgress';
import styles from './PlayPanel.module.scss';
import { Fragment } from 'react';
import useConfigs from '../../Configurator/context';

const MODS_TO_DISPLAY = ['AP', 'AT', 'CN', 'DT', 'EZ', 'FL', 'HD', 'HR', 'HT', 'NC', 'NF', 'PF', 'RX', 'SD', 'SO', 'TP', 'NM'];

export default function OverlayPlayPanel() {
	const [config] = useConfigs();
	const state = useOsuStateType();
	const mods = useOsuToken(TOKENS.MAP_MODS_ARRAY);
	const modsArray = mods.split(',');
	const validModsCount = modsArray.reduce((acc, mod) => acc + MODS_TO_DISPLAY.includes(mod), 0);

	const progress = useOsuMapProgress();

	const missesCount = useOsuToken(TOKENS.PLAY_0);

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: state === 'playing',
			})}
		>
			<div
				className={classNames(styles.Mods, {
					[styles.Mods4]: validModsCount > 3,
				})}
			>
				{modsArray.map((mod) => {
					if (MODS_TO_DISPLAY.includes(mod)) return <img key={mod} src={`mods/${mod}.png`} alt='mod' />;
					return <Fragment key={mod} />;
				})}
			</div>
			<div className={classNames(styles.Item, styles.ItemMisses)}>{missesCount}</div>
			<div className={classNames(styles.Item, styles.ItemTime)}>
				{config.useNegativeTimeInPlayTimer ? progress.negative : progress.positive}
			</div>
			<DonutProgress color={'255 255 255'} size={24} width={3.75} />
		</div>
	);
}
