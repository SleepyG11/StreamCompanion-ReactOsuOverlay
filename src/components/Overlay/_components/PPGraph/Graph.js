'use client';

import { useEffect, useState } from 'react';
import useOsuToken, { TOKENS, useOsuStateType, useOsuMapMaxFcPP, useOsuMapFcPP } from '../../../../socket';
import { XAxis, YAxis, Scatter, ScatterChart } from 'recharts';
import styles from './Graph.module.scss';
import classNames from 'classnames';

function RenderNoShape() {
	return null;
}

export default function Graph({ visible = false }) {
	const [maxPPDots, setMaxPPDots] = useState([]);
	const [ppDots, setPPDots] = useState([]);
	const [reloaded, setReloaded] = useState(false);
	const [fade, setFade] = useState(false);

	const state = useOsuStateType();

	const currentTime = useOsuToken(TOKENS.MAP_TIME_CURRENT);
	const fullTime = useOsuToken(TOKENS.MAP_TIME_FULL);
	const firstObjTime = useOsuToken(TOKENS.MAP_TIME_FIRST_OBJECT);
	const ifFcPP = useOsuMapFcPP(0, { duration: 500 });
	const fullFcPP = useOsuMapMaxFcPP(0, { duration: 250 });
	const mapId = useOsuToken(TOKENS.MAP_ID);
	const currentPP = useOsuToken(TOKENS.PLAY_PP_CURRENT, 0, { duration: 250 });

	useEffect(() => {
		if (state !== 'playing') return;
		if (currentTime > fullTime) {
			return;
		} else if (currentTime < firstObjTime) {
			if (reloaded) return;
			setReloaded(true);
			setFade(true);
			setTimeout(() => {
				setFade(false);
				setMaxPPDots([]);
				setPPDots([]);
			}, 500);
		} else {
			setReloaded(false);
			setMaxPPDots((d) => [...d, { x: currentTime, y: ifFcPP }]);
			setPPDots((d) => [...d, { x: currentTime, y: currentPP }]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTime]);

	useEffect(() => {
		if (state !== 'resultScreen') {
			setReloaded(true);
			setFade(true);
			setTimeout(() => {
				setFade(false);
				setMaxPPDots([]);
				setPPDots([]);
			}, 500);
		}
	}, [state]);

	useEffect(() => {
		setMaxPPDots([]);
		setPPDots([]);
	}, [mapId]);

	return (
		<ScatterChart
			width={300}
			height={48}
			className={classNames(styles.Chart, {
				[styles.ChartVisible]: visible,
			})}
		>
			<XAxis type='number' dataKey='x' hide domain={[firstObjTime, fullTime]} />
			<YAxis type='number' dataKey='y' hide domain={[0, fullFcPP]} />
			<Scatter
				isAnimationActive={false}
				line
				lineJointType={'linear'}
				name='Grid'
				data={maxPPDots}
				fill='rgb(255, 204, 34, 0.6)'
				strokeWidth={3}
				className={classNames(styles.Line, {
					[styles.LineHidden]: fade,
				})}
				shape={<RenderNoShape />}
			/>
			<Scatter
				isAnimationActive={false}
				line
				lineJointType={'linear'}
				name='Grid'
				data={ppDots}
				fill='rgb(255, 255, 255, 0.6)'
				strokeWidth={3}
				className={classNames(styles.Line, {
					[styles.LineHidden]: fade,
				})}
				shape={<RenderNoShape />}
			/>
		</ScatterChart>
	);
}
