import classNames from 'classnames';

import styles from './SongPlayer.module.scss';
import { formatTime, useOsuGameState, useOsuMapAudioTime, useOsuMapCurrentTime } from '@/features/hooks';
import { GAME_STATE_CATEGORY } from '@/features/enums';

export default function OverlaySongPlayer() {
	const { category: state } = useOsuGameState();

	const currentTime = useOsuMapCurrentTime();
	const audioTime = useOsuMapAudioTime();

	let formattedAudioTime = formatTime(audioTime);
	let formattedCurrentTime = formatTime(currentTime);
	let percent = (currentTime / audioTime) * 100 + '%';

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: state === GAME_STATE_CATEGORY.IDLE && audioTime,
			})}
		>
			<div className={styles.Line}>
				<p>{formattedCurrentTime}</p>
				<p>{formattedAudioTime}</p>
			</div>
			<div className={styles.Progress} style={{ '--progress': percent }} />
		</div>
	);
}
