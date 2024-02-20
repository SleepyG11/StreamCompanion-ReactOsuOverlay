import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import useOsuToken, { useOsuStateType } from 'socket';
import useJSONConfig from 'config';
import TOKENS from 'enums/TOKENS';

import styles from './SongMeta.module.scss';

const containerStates = {
	idle: styles.ContainerMainMenu,
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

	const state = useOsuStateType();
	const prevStateRef = useRef(state);

	const romanSongTitle = useOsuToken(TOKENS.MAP_TITLE);
	const originalSongTitle = useOsuToken(TOKENS.MAP_TITLE_ORIGINAL);
	const romanSongArtist = useOsuToken(TOKENS.MAP_ARTIST);
	const originalSongArtist = useOsuToken(TOKENS.MAP_ARTIST_ORIGINAL);
	const songDifficulty = useOsuToken(TOKENS.MAP_DIFFICULTY);

	let songTitle = config.useOriginalLanguageForSongArtistAndTitle ? originalSongTitle : romanSongTitle;
	let songArtist = config.useOriginalLanguageForSongArtistAndTitle ? originalSongArtist : romanSongArtist;

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
		if (prevState !== 'idle' && prevState !== 'songSelect') return;

		let target;
		switch (state) {
			case 'idle': {
				target = longTitleRef.current;
				break;
			}
			case 'songSelect': {
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
