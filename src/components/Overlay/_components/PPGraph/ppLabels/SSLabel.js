'use client';

import Odometer from 'react-odometerjs';
import styles from './Base.module.scss';
import classNames from 'classnames';
import useConfigs from '../../../../Configurator/context';
import { useMemo } from 'react';
import { useOsuMapFcPP } from '../../../../../socket';

export default function PpSSLabel({ visible = false }) {
	const [config] = useConfigs();
	const ifFcPP = useOsuMapFcPP(0, { duration: 250 });

	let splitSsIndex = useMemo(() => config.ssPhrase.indexOf('{pp}'), [config]);

	return (
		<div
			className={classNames(styles.Pp, {
				[styles.PpVisible]: visible,
			})}
		>
			{splitSsIndex === -1 ? (
				config.ssPhrase
			) : (
				<>
					{config.ssPhrase.substring(0, splitSsIndex)}
					<Odometer key={'ifFcPPResult'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} />
					{config.ssPhrase.substring(splitSsIndex + 4)}
				</>
			)}
		</div>
	);
}
