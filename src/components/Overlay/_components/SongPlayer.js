import classNames from 'classnames';
import useOsuToken, { TOKENS, formatTime, useOsuStateType } from '../../../socket';
import styles from './SongPlayer.module.scss';

export default function OverlaySongPlayer() {
	const state = useOsuStateType();

	const currentTime = useOsuToken(TOKENS.MAP_TIME_CURRENT);
	const audioTime = useOsuToken(TOKENS.MAP_TIME_AUDIO);

	const formattedAudioTime = formatTime(audioTime);
	const formattedCurrentTime = formatTime(currentTime);

	const percent = (currentTime / audioTime) * 100 + '%';

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
