import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import styles from './SongMeta.module.scss';
import { useOsuGameState, useOsuMapArtist, useOsuMapDifficulty, useOsuMapTitle } from '@/features/hooks';
import { GAME_STATE_CATEGORY } from '@/features/enums';
import useJSONConfig from '@/features/config';

const containerStates = {
	[GAME_STATE_CATEGORY.IDLE]: styles.ContainerMainMenu,
};

const longOverflowPoint = 550 - 12 * 2;
const shortOverflowPoint = 300;

export default function OverlaySongMeta() {
	const config = useJSONConfig();

	const shortTitleRef = useRef();
	const longTitleRef = useRef();
	const artistRef = useRef();
	const difficultyRef = useRef();

	const [titleOverflow, setTitleOverflow] = useState({ artist: false, diff: false, long: false, short: false });

	const { category: state } = useOsuGameState();
	const prevStateRef = useRef(state);

	const songTitle = useOsuMapTitle(config.useOriginalLanguageForSongArtistAndTitle);
	const songArtist = useOsuMapArtist(config.useOriginalLanguageForSongArtistAndTitle);
	const songDifficulty = useOsuMapDifficulty();

	function recalculateOverflows() {
		setTitleOverflow({
			artist: artistRef.current.scrollWidth > longOverflowPoint,
			diff: difficultyRef.current.scrollWidth > shortOverflowPoint,
			long: longTitleRef.current.scrollWidth > longOverflowPoint,
			short: shortTitleRef.current.scrollWidth > shortOverflowPoint,
		});
	}

	useEffect(recalculateOverflows, [songTitle]);
	useEffect(() => {
		let interval = setInterval(recalculateOverflows, 2500);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let prevState = prevStateRef.current;
		prevStateRef.current = state;
		if (prevState !== GAME_STATE_CATEGORY.IDLE && prevState !== GAME_STATE_CATEGORY.SONG_SELECT) return;

		let target;
		switch (state) {
			case GAME_STATE_CATEGORY.IDLE: {
				target = longTitleRef.current;
				break;
			}
			case GAME_STATE_CATEGORY.SONG_SELECT: {
				target = shortTitleRef.current;
				break;
			}
			default:
				return;
		}
		let element = target.firstChild;
		element.style.animation = 'none';
		// eslint-disable-next-line
		element.offsetHeight;
		element.style.animation = null;
	}, [state]);

	return (
		<div className={classNames(styles.Container, containerStates[state])}>
			<div className={styles.TopRow}>
				<div
					ref={artistRef}
					className={classNames(styles.Artist, {
						[styles.LongTitleOverflow]: titleOverflow.artist,
					})}
				>
					<span className={styles.LongTitleLabel}> {songArtist}</span>
				</div>
			</div>
			<div className={styles.MiddleRow}>
				<div
					ref={shortTitleRef}
					className={classNames(styles.ShortTitle, {
						[styles.ShortTitleOverflow]: titleOverflow.short,
					})}
				>
					<span className={styles.ShortTitleLabel}>
						{songArtist} - {songTitle}
					</span>
				</div>
				<div
					ref={longTitleRef}
					className={classNames(styles.LongTitle, {
						[styles.LongTitleOverflow]: titleOverflow.long,
					})}
				>
					<span className={styles.LongTitleLabel}>{songTitle}</span>
				</div>
			</div>
			<div className={styles.BottomRow}>
				<div
					ref={difficultyRef}
					className={classNames(styles.Difficulty, {
						[styles.ShortTitleOverflow]: titleOverflow.diff,
					})}
				>
					<span className={styles.ShortTitleLabel}>
						{'['}
						{songDifficulty}
						{']'}
					</span>
				</div>
			</div>
		</div>
	);
}
