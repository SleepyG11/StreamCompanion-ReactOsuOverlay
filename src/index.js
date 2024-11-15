import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.scss';

import Overlay from '@/app/Overlay';
import useJSONConfig, { JSONConfigProvider } from '@/features/config';
import { TokensManagerProvider } from './features/manager';

function App() {
	const config = useJSONConfig();
	return (
		<TokensManagerProvider href={config.streamCompanionHref}>
			<Overlay />
		</TokensManagerProvider>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<JSONConfigProvider>
		<App />
	</JSONConfigProvider>
);
