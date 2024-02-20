import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import { useOsuMapCurrentPP, useOsuMapFcPP } from 'socket';

export default function PpPlayingLabel({ visible = false }) {
	const currentPP = useOsuMapCurrentPP(0, { duration: 250 });
	const ifFcPP = useOsuMapFcPP(0, { duration: 250 });

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			<Odometer key={'currentPP'} value={Math.round(currentPP)} duration={250} className={styles.PpDigit} /> pp <span>{'>>'}</span>{' '}
			<Odometer key={'ifFcPP'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} /> pp
		</div>
	);
}
