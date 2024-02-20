import { useEffect, useRef, useState } from 'react';
import { useOsuBackgroundDir, useOsuStateType } from 'socket';
import SOCKET from 'enums/SOCKET';

import styles from './index.module.scss';

import OverlaySongPlayer from './SongPlayer';
import OverlaySongMeta from './SongMeta';
import OverlayStats from './Stats';
import OverlayPlayPanel from './PlayPanel';
import OverlayPPGraph from './PPGraph';

const DEFAULT_BG_URL = 'default-bg.jpg';

export default function Overlay() {
	const state = useOsuStateType();
	const mapBg = useOsuBackgroundDir();
	const bgCache = useRef(null);

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

	return (
		<>
			<div className={styles.Container}>
				<div className={styles.Bgs}>
					{bgList.map((url, index) => {
						return <img key={url} src={url} className={styles.Bg} style={{ zIndex: index + 1 }} alt='' />;
					})}
				</div>
				<div className={styles.Content}>
					{state !== 'connecting' && (
						<div className={styles.ContentFixer}>
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
