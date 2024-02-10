import { useEffect, useRef, useState } from 'react';
import { useOsuBackgroundDir, useOsuStateType } from '../../socket';
import { config } from '../../libs/consts';

import styles from './index.module.scss';

import OverlaySongPlayer from './_components/SongPlayer';
import OverlaySongMeta from './_components/SongMeta';
import OverlayStats from './_components/Stats';
import OverlayPlayPanel from './_components/PlayPanel';
import OverlayPPGraph from './_components/PPGraph';

const defaultBgUrl = 'default-bg.jpg';

export default function Overlay() {
	const state = useOsuStateType();
	const mapBg = useOsuBackgroundDir();
	const bgCache = useRef(null);

	const [bgList, setBgList] = useState([defaultBgUrl]);

	useEffect(() => {
		if (mapBg === bgCache.current) return;
		bgCache.current = mapBg;
		if (mapBg === 'undefined\\undefined') {
			setBgList((l) => {
				let last = l[l.length - 1];
				return last === defaultBgUrl ? l : [last, defaultBgUrl];
			});
		} else {
			let url = `${config.getUrl()}/Songs/${encodeURI(mapBg.replace(/\\/g, '/'))}?${Date.now()}`;
			let img = new Image();
			img.onerror = () => {
				setBgList((l) => {
					let last = l[l.length - 1];
					return last === defaultBgUrl ? l : [last, defaultBgUrl];
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
