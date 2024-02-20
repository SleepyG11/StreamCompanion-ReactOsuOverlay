import classNames from 'classnames';
import useOsuToken, { useOsuStateType } from 'socket';

import TOKENS from 'enums/TOKENS';
import { formatTime } from 'enums/FORMATTERS';

import styles from './SongPlayer.module.scss';

export default function OverlaySongPlayer() {
	const state = useOsuStateType();

	const currentTime = useOsuToken(TOKENS.MAP_TIME_CURRENT);
	const audioTime = useOsuToken(TOKENS.MAP_TIME_AUDIO);

	let formattedAudioTime = formatTime(audioTime);
	let formattedCurrentTime = formatTime(currentTime);
	let percent = (currentTime / audioTime) * 100 + '%';

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: state === 'idle' && audioTime,
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
