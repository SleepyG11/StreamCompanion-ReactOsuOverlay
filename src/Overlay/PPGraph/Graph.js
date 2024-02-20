import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { XAxis, YAxis, Scatter, ScatterChart } from 'recharts';

import useOsuToken, { useOsuStateType, useOsuMapMaxFcPP, useOsuMapFcPP, useOsuMapCurrentPP } from 'socket';

import TOKENS from 'enums/TOKENS';

import styles from './Graph.module.scss';

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
	const [reloaded, setReloaded] = useState(false);
	const [fade, setFade] = useState(false);

	const [maxPPDots, setMaxPPDots] = useState([]);
	const [ppDots, setPPDots] = useState([]);

	const state = useOsuStateType();

	const mapId = useOsuToken(TOKENS.MAP_ID);
	const currentTime = useOsuToken(TOKENS.MAP_TIME_CURRENT);
	const fullTime = useOsuToken(TOKENS.MAP_TIME_FULL);
	const firstObjTime = useOsuToken(TOKENS.MAP_TIME_FIRST_OBJECT);
	const ifFcPP = useOsuMapFcPP(0, { duration: 500 });
	const fullFcPP = useOsuMapMaxFcPP(0, { duration: 500 });
	const currentPP = useOsuMapCurrentPP(0, { duration: 500 });

	// ----------------------

	const updater = useMemo(() => {
		return throttle((cT, fcPp, cPp) => {
			setReloaded(false);
			setMaxPPDots((d) => {
				let lastElement = d[d.length - 1];
				if (lastElement && lastElement.y === fcPp && d.length > 1) {
					lastElement.x = cT;
					return [...d];
				}
				if (d.length > 500) d = halfArray(d);
				return [...d, { x: cT, y: fcPp }];
			});
			setPPDots((d) => {
				let lastElement = d[d.length - 1];
				if (lastElement && lastElement.y === cPp && d.length > 1) {
					lastElement.x = cT;
					return [...d];
				}
				if (d.length > 500) d = halfArray(d);
				return [...d, { x: cT, y: cPp }];
			});
		}, 500);
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
			updater(currentTime, Math.round(ifFcPP), Math.round(currentPP));
		}
		// eslint-disable-next-line
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

	// ----------------------

	const maxPpScatter = useMemo(
		() => (
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
		),
		[maxPPDots, fade]
	);
	const ppScatter = useMemo(
		() => (
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
		),
		[ppDots, fade]
	);
	const xAxis = useMemo(
		() => <XAxis key={'x'} type='number' dataKey='x' hide domain={[firstObjTime, fullTime]} />,
		[firstObjTime, fullTime]
	);
	const yAxis = useMemo(() => <YAxis key={'y'} type='number' dataKey='y' hide domain={[0, fullFcPP]} />, [fullFcPP]);

	return (
		<ScatterChart
			width={300}
			height={48}
			className={classNames(styles.Chart, {
				[styles.ChartVisible]: visible,
			})}
		>
			{xAxis}
			{yAxis}
			{maxPpScatter}
			{ppScatter}
		</ScatterChart>
	);
}
