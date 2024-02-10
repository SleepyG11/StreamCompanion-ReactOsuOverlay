'use client';

import { useEffect, useMemo, useState } from 'react';
import useOsuToken, { TOKENS, useOsuStateType } from '../../../socket';
import { XAxis, YAxis, Scatter, ScatterChart } from 'recharts';
import classNames from 'classnames';
import Odometer from 'react-odometerjs';

import styles from './PPGraph.module.scss';
import useConfigs from '../../Configurator/context';
function RenderNoShape() {
	return null;
}

export default function OverlayPPGraph() {
	const [config] = useConfigs();
	const state = useOsuStateType();
	const currentTime = useOsuToken(TOKENS.MAP_TIME_CURRENT);
	const fullTime = useOsuToken(TOKENS.MAP_TIME_FULL);
	const firstObjTime = useOsuToken(TOKENS.MAP_TIME_FIRST_OBJECT);
	const mapId = useOsuToken(TOKENS.MAP_ID);
	const fullFcPP = useOsuToken(TOKENS.MAP_PP_100);
	const maxPlayCombo = useOsuToken(TOKENS.PLAY_COMBO_MAX);
	const maxCombo = useOsuToken(TOKENS.MAP_COMBO_MAX);
	const grade = useOsuToken(TOKENS.PLAY_GRADE_CURRENT);
	const currentPP = useOsuToken(TOKENS.PLAY_PP_CURRENT, 0, { duration: 250 });
	const ifFcPP = useOsuToken(TOKENS.PLAY_PP_IF_FC, 0, { duration: 500 });
	const mapFcPP = useOsuToken(TOKENS.MAP_PP_100, 0, { duration: 500 });

	const [maxPPDots, setMaxPPDots] = useState([]);
	const [ppDots, setPPDots] = useState([]);
	const [reloaded, setReloaded] = useState(false);
	const [fade, setFade] = useState(false);
	const [visible, setVisible] = useState(false);

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
		setVisible(['songSelect', 'playing', 'resultScreen'].includes(state));

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

	let result = useMemo(() => {
		return (
			<ScatterChart width={300} height={48} className={styles.Chart}>
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
	}, [ppDots, maxPPDots, firstObjTime, fullTime, fade, fullFcPP]);

	let isFc = maxPlayCombo === maxCombo;
	let isSS = grade === 'SS' || grade === 'SSH';

	let shouldShowFcPhrase = config.showFcPhrase && config.fcPhrase && isFc;
	let shouldShowSSPhrase = config.showSsPhrase && config.ssPhrase && isSS;

	let splitFcIndex = config.fcPhrase.indexOf('{pp}');
	let splitSsIndex = config.ssPhrase.indexOf('{pp}');

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerVisible]: visible,
			})}
		>
			<div
				className={classNames(styles.Pp, {
					[styles.PpVisible]: state === 'resultScreen' && !shouldShowFcPhrase && !shouldShowSSPhrase,
				})}
			>
				<Odometer key={'ifFcPPResult'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} /> pp{' '}
				<span>{'>>'}</span>{' '}
				<Odometer key={'fullFcPPResult'} value={Math.round(fullFcPP)} duration={250} className={styles.PpDigit} /> pp
			</div>
			<div
				className={classNames(styles.Pp, {
					[styles.PpVisible]: state === 'resultScreen' && shouldShowFcPhrase && !shouldShowSSPhrase,
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
			<div
				className={classNames(styles.Pp, {
					[styles.PpVisible]: state === 'resultScreen' && shouldShowSSPhrase,
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
			<div
				className={classNames(styles.Pp, {
					[styles.PpVisible]: state === 'songSelect',
				})}
			>
				<span>{'Up to '}</span>
				<Odometer key={'mapFcPP'} value={Math.round(mapFcPP)} duration={250} className={styles.PpDigit} /> pp
			</div>
			<div
				className={classNames(styles.Pp, {
					[styles.PpVisible]: state === 'playing',
				})}
			>
				<Odometer key={'currentPP'} value={Math.round(currentPP)} duration={250} className={styles.PpDigit} /> pp{' '}
				<span>{'>>'}</span> <Odometer key={'ifFcPP'} value={Math.round(ifFcPP)} duration={250} className={styles.PpDigit} /> pp
			</div>
			{result}
		</div>
	);
}
