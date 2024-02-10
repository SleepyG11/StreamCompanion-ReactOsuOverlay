import { ConfigsProvider } from './components/Configurator/context';
import Overlay from './components/Overlay';

function App() {
	return (
		<ConfigsProvider>
			<Overlay />
		</ConfigsProvider>
	);
}

export default App;
