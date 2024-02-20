import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import { useOsuMapMaxFcPP } from 'socket';

export default function PpSongSelectLabel({ visible = false }) {
	const fullFcPP = useOsuMapMaxFcPP(0, { duration: 250 });

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			<span>{'Up to '}</span>
			<Odometer key={'mapFcPP'} value={Math.round(fullFcPP)} duration={250} className={styles.PpDigit} /> pp
		</div>
	);
}
