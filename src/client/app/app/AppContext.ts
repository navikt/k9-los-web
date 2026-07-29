import type { Oppgavefelt } from 'filter/filterTsTypes';
import { createContext } from 'react';

interface AppContextTypes {
	felter: Oppgavefelt[];
}

const AppContext = createContext<AppContextTypes>(null);

export default AppContext;
