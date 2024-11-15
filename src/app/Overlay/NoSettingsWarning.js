import { useEffect, useState } from 'react';
import styles from './NoSettingsWarning.module.scss';
import classNames from 'classnames';

export default function OverlayNoSettingsWarning({ show }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (show) setVisible(true);
		let t = setTimeout(() => {
			setVisible(false);
		}, 2000);
		return () => clearTimeout(t);
		// eslint-disable-next-line
	}, []);

	return (
		<p
			className={classNames(styles.Label, {
				[styles.LabelVisible]: visible,
			})}
		>
			settings.json not loaded, fallback to default
		</p>
	);
}
