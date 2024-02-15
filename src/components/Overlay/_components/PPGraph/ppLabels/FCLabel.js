'use client';

import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import useConfigs from '../../../../Configurator/context';
import { useMemo } from 'react';
import { useOsuMapFcPP } from '../../../../../socket';

export default function PpFcLabel({ visible = false }) {
	const [config] = useConfigs();
	const ifFcPP = useOsuMapFcPP(0, { duration: 250 });

	let splitFcIndex = useMemo(() => config.fcPhrase.indexOf('{pp}'), [config]);

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			{splitFcIndex === -1 ? (
				config.fcPhrase
			) : (
				<>
					{config.fcPhrase.substring(0, splitFcIndex)}
					<Odometer key={'ifFcPPResult'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} />
					{config.fcPhrase.substring(splitFcIndex + 4)}
				</>
			)}
		</div>
	);
}
