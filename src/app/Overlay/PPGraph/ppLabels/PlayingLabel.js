import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import { useOsuPlayPPCurrent, useOsuPlayPPIfFC } from '@/features/hooks';

export default function PpPlayingLabel({ visible = false }) {
	const currentPP = useOsuPlayPPCurrent();
	const ifFcPP = useOsuPlayPPIfFC();

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			<Odometer key={'currentPP'} value={Math.round(currentPP)} duration={250} className={styles.PpDigit} />{' '}
			<span className={styles.White}>pp</span> <span>{'>>'}</span>{' '}
			<Odometer key={'ifFcPP'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} />{' '}
			<span className={styles.White}>pp</span>
		</div>
	);
}
