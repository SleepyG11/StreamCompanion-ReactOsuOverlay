import { useOsuMapProgress } from '@/features/hooks';
import styles from './DonutProgress.module.scss';

export default function DonutProgress({ size = 80, width = 8, color, displayLabel = false }) {
	let radius = (size - width) / 2;
	let progress = useOsuMapProgress();

	let center = radius + width / 2;

	return (
		<div className={styles.Container}>
			{displayLabel && <p className={styles.Label}>{progress.negative}</p>}
			<svg
				width={2 * center}
				height={2 * center}
				xmlns='http://www.w3.org/2000/svg'
				className={styles.Svg}
				style={{
					transform: 'rotate(-90deg)',
					'--color': color,
				}}
			>
				<circle
					className={styles.PercentCircle}
					strokeDasharray={2 * Math.PI * progress.percent * radius + ' 999999'}
					r={radius}
					cy={center}
					cx={center}
					strokeWidth={width}
					fill='none'
				/>
				<circle className={styles.FullCircle} r={radius} cy={center} cx={center} strokeWidth={width} fill='none' />
			</svg>
		</div>
	);
}
