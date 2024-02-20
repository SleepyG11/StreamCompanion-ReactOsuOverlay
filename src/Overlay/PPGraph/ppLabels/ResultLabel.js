import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import { useOsuMapFcPP, useOsuMapMaxFcPP } from 'socket';

export default function PpResultLabel({ visible = false }) {
	const ifFcPP = useOsuMapFcPP(0, { duration: 250 });
	const fullFcPP = useOsuMapMaxFcPP(0, { duration: 250 });

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			<Odometer key={'ifFcPPResult'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} /> pp <span>{'>>'}</span>{' '}
			<Odometer key={'fullFcPPResult'} value={Math.round(fullFcPP)} duration={250} className={styles.PpDigit} /> pp
		</div>
	);
}
