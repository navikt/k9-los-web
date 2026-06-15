import React, { createContext, useContext, useMemo, useState } from 'react';

export type NyVisning = {
	nyVisning: boolean;
	setNyVisning: (verdi: boolean) => void;
};

export const NyVisningContext = createContext<NyVisning>({
	nyVisning: false,
	setNyVisning: () => undefined,
});

export const useNyVisning = (): NyVisning => useContext(NyVisningContext);

export const NyVisningProvider = ({ children }: { children: React.ReactNode }) => {
	const [nyVisning, setNyVisning] = useState(false);
	const value = useMemo(() => ({ nyVisning, setNyVisning }), [nyVisning]);
	return <NyVisningContext.Provider value={value}>{children}</NyVisningContext.Provider>;
};

export default NyVisningContext;
