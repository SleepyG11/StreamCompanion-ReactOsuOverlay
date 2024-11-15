import { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './index.module.scss';
import Graph from './Graph';
import PpResultLabel from './ppLabels/ResultLabel';
import PpFcLabel from './ppLabels/FCLabel';
import PpSSLabel from './ppLabels/SSLabel';
import PpSongSelectLabel from './ppLabels/SongSelectLabel';
import PpPlayingLabel from './ppLabels/PlayingLabel';
import useJSONConfig from '@/features/config';
import { useOsuGameState, useOsuPlayGradeCurrent, useOsuPlayMisses, useOsuPlaySliderBreaks } from '@/features/hooks';
import { GAME_STATE_CATEGORY, PLAY_GRADE } from '@/features/enums';

export default function OverlayPPGraph() {
	const config = useJSONConfig();

	const { category: stateCategory } = useOsuGameState();
	const misses = useOsuPlayMisses();
	const sliderBrakes = useOsuPlaySliderBreaks();
	const { grade } = useOsuPlayGradeCurrent();

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(
			[GAME_STATE_CATEGORY.SONG_SELECT, GAME_STATE_CATEGORY.PLAYING, GAME_STATE_CATEGORY.RESULT_SCREEN].includes(stateCategory)
		);
	}, [stateCategory]);

	let isFc = !misses && !sliderBrakes;
	let isSS = grade === PLAY_GRADE.SS || grade === PLAY_GRADE.SSH;

	let shouldShowFcPhrase = config.showFcPhrase && config.fcPhrase && isFc;
	let shouldShowSSPhrase = config.showSsPhrase && config.ssPhrase && isSS;

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: visible,
			})}
		>
			<PpResultLabel visible={stateCategory === GAME_STATE_CATEGORY.RESULT_SCREEN && !shouldShowFcPhrase && !shouldShowSSPhrase} />
			<PpFcLabel visible={stateCategory === GAME_STATE_CATEGORY.RESULT_SCREEN && shouldShowFcPhrase && !shouldShowSSPhrase} />
			<PpSSLabel visible={stateCategory === GAME_STATE_CATEGORY.RESULT_SCREEN && shouldShowSSPhrase} />
			<PpSongSelectLabel visible={stateCategory === GAME_STATE_CATEGORY.SONG_SELECT} />
			<PpPlayingLabel visible={stateCategory === GAME_STATE_CATEGORY.PLAYING} />
			<Graph key={'graph'} visible={visible} />
		</div>
	);
}
