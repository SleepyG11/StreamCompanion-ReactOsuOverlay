'use client';

import { useEffect, useMemo, useState } from 'react';
import useOsuToken, { TOKENS, useOsuStateType, useOsuMapMaxFcPP, useOsuMapFcPP, useOsuMapCurrentPP } from '../../../../socket';
import { XAxis, YAxis, Scatter, ScatterChart } from 'recharts';
import styles from './Graph.module.scss';
import classNames from 'classnames';

function RenderNoShape() {
	return null;
}

// Thanks https://learn.javascript.ru/task/throttle?ysclid=lsoxpufcb39705838
function throttle(func, ms) {
	let isThrottled = false;
	let savedArgs;
	let savedThis;

	function wrapper() {
		if (isThrottled) {
			// (2)
			savedArgs = arguments;
			savedThis = this;
			return;
		}

		func.apply(this, arguments); // (1)

		isThrottled = true;

		setTimeout(function () {
			isThrottled = false; // (3)
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs);
				savedArgs = savedThis = null;
			}
		}, ms);
	}

	return wrapper;
}
function halfArray(array) {
	let result = [];
	for (let i = 0; i < array.length; i = i + 2) {
		result.push(array[i]);
	}
	return result;
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
	const fullFcPP = useOsuMapMaxFcPP(0, { duration: 500 });
	const mapId = useOsuToken(TOKENS.MAP_ID);
	const currentPP = useOsuMapCurrentPP(0, { duration: 500 });

	const updater = useMemo(() => {
		return throttle((cT, fcPp, cPp) => {
			setReloaded(false);
			setMaxPPDots((d) => {
				let lastElement = d[d.length - 1];
				if (lastElement && lastElement.y === fcPp && d.length > 1) {
					lastElement.x = cT;
					return [...d];
				}
				if (d.length > 600) d = halfArray(d);
				return [...d, { x: cT, y: fcPp }];
			});
			setPPDots((d) => {
				let lastElement = d[d.length - 1];
				if (lastElement && lastElement.y === cPp && d.length > 1) {
					lastElement.x = cT;
					return [...d];
				}
				if (d.length > 600) d = halfArray(d);
				return [...d, { x: cT, y: cPp }];
			});
		}, 400);
	}, []);

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
			updater(currentTime, ~~ifFcPP, ~~currentPP);
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

	useEffect(() => {
		console.log('Mounted');
		return () => {
			console.log('Unmounted');
		};
	}, []);

	const maxPpScatter = useMemo(() => {
		return (
			<Scatter
				key={'maxPp'}
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
		);
	}, [maxPPDots, fade]);

	const ppScatter = useMemo(() => {
		return (
			<Scatter
				key={'currentPp'}
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
		);
	}, [ppDots, fade]);

	let result = useMemo(() => {
		return (
			<ScatterChart
				width={300}
				height={48}
				className={classNames(styles.Chart, {
					[styles.ChartVisible]: visible,
				})}
			>
				<XAxis key={'x'} type='number' dataKey='x' hide domain={[firstObjTime, fullTime]} />
				<YAxis key={'y'} type='number' dataKey='y' hide domain={[0, fullFcPP]} />
				{maxPpScatter}
				{ppScatter}
			</ScatterChart>
		);
	}, [maxPpScatter, ppScatter, visible, firstObjTime, fullTime, fullFcPP]);

	return result;
}
