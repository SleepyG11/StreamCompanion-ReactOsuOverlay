import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './index.module.scss';

import OverlaySongPlayer from './SongPlayer';
import OverlaySongMeta from './SongMeta';
import OverlayStats from './Stats';
import OverlayPlayPanel from './PlayPanel';
import OverlayPPGraph from './PPGraph';
import OverlayNoSettingsWarning from './NoSettingsWarning';
import classNames from 'classnames';
import { CONFIG_STATUS, GAME_STATE, GAME_STATE_CATEGORY } from '@/features/enums';
import {
	useOsuGameIsChatVisible,
	useOsuGameIsInterfaceVisible,
	useOsuGameState,
	useOsuMapBackgroundSource,
	useOsuPlayMods,
} from '@/features/hooks';
import useJSONConfig from '@/features/config';

const DEFAULT_BG_URL = 'default-bg.jpg';

export default function Overlay() {
	const { category: state } = useOsuGameState();
	const mapBg = useOsuMapBackgroundSource();
	const bgCache = useRef(null);
	const config = useJSONConfig();

	const mods = useOsuPlayMods();
	const isChatOpened = useOsuGameIsChatVisible();
	const isInterfaceVisible = useOsuGameIsInterfaceVisible();

	const [bgList, setBgList] = useState([DEFAULT_BG_URL]);

	useEffect(() => {
		if (mapBg === bgCache.current) return;
		bgCache.current = mapBg;
		if (mapBg === null) {
			setBgList((l) => {
				let last = l[l.length - 1];
				return last === DEFAULT_BG_URL ? l : [last, DEFAULT_BG_URL];
			});
		} else {
			let url = `${config.streamCompanionHref}/Songs/${encodeURI(mapBg.replace(/\\/g, '/'))}?${Date.now()}`;
			let img = new Image();
			img.onerror = () => {};
			img.onload = () => {
				setBgList((l) => [l[l.length - 1], url]);
			};
			img.src = url;
		}
	}, [mapBg, config.streamCompanionHref]);

	const isContainerHidden = useMemo(() => {
		if (state === GAME_STATE_CATEGORY.CONNECTING) return false;
		if (config.hideWhenCinemaMode && mods && mods.includes('CN') && state === GAME_STATE_CATEGORY.PLAYING) return true;
		if (config.hideWhenIngameInterfaceHidden && !isInterfaceVisible && state === GAME_STATE_CATEGORY.PLAYING) return true;
		if (config.hideWhenChatOpened && isChatOpened) return true;
		return false;
	}, [config, state, isChatOpened, isInterfaceVisible, mods]);

	return (
		<div
			className={classNames(styles.Container, {
				[styles.ContainerHidden]: isContainerHidden,
			})}
		>
			<div className={styles.Bgs}>
				{bgList.map((url, index) => {
					return <img key={url} src={url} className={styles.Bg} style={{ zIndex: index + 1 }} alt='' />;
				})}
			</div>
			<div className={styles.Content}>
				{state !== GAME_STATE.CONNECTING && config.__CONFIG_STATUS__ !== CONFIG_STATUS.LOADING && (
					<div className={styles.ContentFixer}>
						<OverlayNoSettingsWarning show={config.__CONFIG_STATUS__ === CONFIG_STATUS.ERROR} />
						<OverlaySongPlayer />
						<OverlaySongMeta />
						<OverlayStats />
						<OverlayPlayPanel />
						<OverlayPPGraph />
					</div>
				)}
			</div>
		</div>
	);
}
