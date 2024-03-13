import { useEffect, useMemo, useRef, useState } from 'react';
import useOsuToken, { useOsuBackgroundDir, useOsuStateType } from 'socket';
import SOCKET from 'enums/SOCKET';

import styles from './index.module.scss';

import OverlaySongPlayer from './SongPlayer';
import OverlaySongMeta from './SongMeta';
import OverlayStats from './Stats';
import OverlayPlayPanel from './PlayPanel';
import OverlayPPGraph from './PPGraph';
import useJSONConfig from '../config';
import OverlayNoSettingsWarning from './NoSettingsWarning';
import TOKENS from 'enums/TOKENS';
import classNames from 'classnames';

const DEFAULT_BG_URL = 'default-bg.jpg';

export default function Overlay() {
	const state = useOsuStateType();
	const mapBg = useOsuBackgroundDir();
	const bgCache = useRef(null);
	const config = useJSONConfig();

	const mods = useOsuToken(TOKENS.MAP_MODS_ARRAY);
	const isChatOpened = useOsuToken(TOKENS.CHAT_ENABLED);
	const isInterfaceVisible = useOsuToken(TOKENS.INTERFACE_ENABLED);

	const [bgList, setBgList] = useState([DEFAULT_BG_URL]);

	useEffect(() => {
		if (mapBg === bgCache.current) return;
		bgCache.current = mapBg;
		if (mapBg === 'undefined\\undefined') {
			setBgList((l) => {
				let last = l[l.length - 1];
				return last === DEFAULT_BG_URL ? l : [last, DEFAULT_BG_URL];
			});
		} else {
			let url = `${SOCKET.URL}/Songs/${encodeURI(mapBg.replace(/\\/g, '/'))}?${Date.now()}`;
			let img = new Image();
			img.onerror = () => {
				setBgList((l) => {
					let last = l[l.length - 1];
					return last === DEFAULT_BG_URL ? l : [last, DEFAULT_BG_URL];
				});
			};
			img.onload = () => {
				setBgList((l) => [l[l.length - 1], url]);
			};
			img.src = url;
		}
	}, [mapBg]);

	const isContainerHidden = useMemo(() => {
		if (state === 'connecting') return false;
		if (config.hideWhenCinemaMode && mods.split(',').includes('CN') && state === 'playing') return true;
		if (config.hideWhenIngameInterfaceHidden && !isInterfaceVisible && state === 'playing') return true;
		if (config.hideWhenChatOpened && isChatOpened) return true;
		return false;
	}, [config, state, isChatOpened, isInterfaceVisible, mods]);

	return (
		<>
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
					{state !== 'connecting' && config.__CONFIG_STATUS__ !== 'loading' && (
						<div className={styles.ContentFixer}>
							<OverlayNoSettingsWarning show={config.__CONFIG_STATUS__ === 'error'} />
							<OverlaySongPlayer />
							<OverlaySongMeta />
							<OverlayStats />
							<OverlayPlayPanel />
							<OverlayPPGraph />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
