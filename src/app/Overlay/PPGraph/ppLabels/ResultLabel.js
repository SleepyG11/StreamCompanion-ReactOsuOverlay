import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import { useOsuMap100AccPP, useOsuPlayPPIfFC } from '@/features/hooks';

export default function PpResultLabel({ visible = false }) {
	const ifFcPP = useOsuPlayPPIfFC();
	const fullFcPP = useOsuMap100AccPP();

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			<Odometer key={'ifFcPPResult'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} />{' '}
			<span className={styles.White}>pp</span> <span>{'>>'}</span>{' '}
			<Odometer key={'fullFcPPResult'} value={Math.round(fullFcPP)} duration={250} className={styles.PpDigit} />{' '}
			<span className={styles.White}>pp</span>
		</div>
	);
}
