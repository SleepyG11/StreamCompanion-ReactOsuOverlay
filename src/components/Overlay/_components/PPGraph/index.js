'use client';

import { useEffect, useState } from 'react';
import useOsuToken, { TOKENS, useOsuStateType } from '../../../../socket';
import classNames from 'classnames';

import styles from './index.module.scss';
import useConfigs from '../../../Configurator/context';
import Graph from './Graph';
import PpResultLabel from './ppLabels/ResultLabel';
import PpFcLabel from './ppLabels/FCLabel';
import PpSSLabel from './ppLabels/SSLabel';
import PpSongSelectLabel from './ppLabels/SongSelectLabel';
import PpPlayingLabel from './ppLabels/PlayingLabel';

export default function OverlayPPGraph() {
	const [config] = useConfigs();

	const state = useOsuStateType();
	const misses = useOsuToken(TOKENS.PLAY_0);
	const sliderBrakes = useOsuToken(TOKENS.PLAY_SLIDER_BREAKS);
	const grade = useOsuToken(TOKENS.PLAY_GRADE_CURRENT);

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(['songSelect', 'playing', 'resultScreen'].includes(state));
	}, [state]);

	let isFc = !misses && !sliderBrakes;
	let isSS = grade === 'SS' || grade === 'SSH';

	let shouldShowFcPhrase = config.showFcPhrase && config.fcPhrase && isFc;
	let shouldShowSSPhrase = config.showSsPhrase && config.ssPhrase && isSS;

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: visible,
			})}
		>
			<PpResultLabel visible={state === 'resultScreen' && !shouldShowFcPhrase && !shouldShowSSPhrase} />
			<PpFcLabel visible={state === 'resultScreen' && shouldShowFcPhrase && !shouldShowSSPhrase} />
			<PpSSLabel visible={state === 'resultScreen' && shouldShowSSPhrase} />
			<PpSongSelectLabel visible={state === 'songSelect'} />
			<PpPlayingLabel visible={state === 'playing'} />
			<Graph key={'graph'} visible={visible} />
		</div>
	);
}
