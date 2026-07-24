import { createRoot } from 'react-dom/client';
import AppContainer from 'app/AppContainer';

const app = document.getElementById('app');
if (app === null) {
	throw new Error('No app element');
}
const root = createRoot(app);

root.render(<AppContainer />);
