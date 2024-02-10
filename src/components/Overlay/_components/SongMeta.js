import classNames from 'classnames';
import useOsuToken, { TOKENS, useOsuStateType } from '../../../socket';

import styles from './SongMeta.module.scss';
import { useEffect, useRef, useState } from 'react';
import useConfigs from '../../Configurator/context';

const containerStates = {
	idle: styles.ContainerMainMenu,
};

const longOverflowPoint = 550 - 12 * 2;
const shortOverflowPoint = 300;

export default function OverlaySongMeta() {
	const [config] = useConfigs();
	const shortTitleRef = useRef();
	const longTitleRef = useRef();
	const artistRef = useRef();
	const difficultyRef = useRef();

	const [titleOverflow, setTitleOverflow] = useState({ artist: false, diff: false, long: false, short: false });

	const state = useOsuStateType();
	const prevStateRef = useRef(state);

	const romanSongTitle = useOsuToken(TOKENS.MAP_TITLE);
	const originalSongTitle = useOsuToken(TOKENS.MAP_TITLE_ORIGINAL);
	const songTitle = config.useOriginalLanguageForSongArtistAndTitle ? originalSongTitle : romanSongTitle;
	const romanSongArtist = useOsuToken(TOKENS.MAP_ARTIST);
	const originalSongArtist = useOsuToken(TOKENS.MAP_ARTIST_ORIGINAL);
	const songArtist = config.useOriginalLanguageForSongArtistAndTitle ? originalSongArtist : romanSongArtist;
	const songDifficulty = useOsuToken(TOKENS.MAP_DIFFICULTY);

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
		let interval = setInterval(recalculateOverflows, 1000);
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
