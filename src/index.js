import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.scss';
import 'libs/odometer-theme-default.css';

import Overlay from 'Overlay';
import { JSONConfigProvider } from 'config';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<JSONConfigProvider>
			<Overlay />
		</JSONConfigProvider>
	</React.StrictMode>
);
