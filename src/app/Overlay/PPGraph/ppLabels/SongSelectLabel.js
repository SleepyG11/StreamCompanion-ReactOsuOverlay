import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import { useOsuMap100AccPP } from '@/features/hooks';

export default function PpSongSelectLabel({ visible = false }) {
	const fullFcPP = useOsuMap100AccPP();

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			<span>{'Up to '}</span>
			<Odometer key={'mapFcPP'} value={Math.round(fullFcPP)} duration={250} className={styles.PpDigit} />
			<span className={styles.White}> pp</span>
		</div>
	);
}
