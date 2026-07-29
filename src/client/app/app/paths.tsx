import type { Location, To } from 'react-router';

/**
 * Lager en lenke til et avdelingslederpanel.
 *
 * Øvrige query-parametere beholdes, slik at f.eks. `?sok=` overlever at man
 * bytter fane.
 */
export const getPanelLocationCreator =
	(location: Location) =>
	(avdelingslederPanel: string): To => {
		const søkeparametere = new URLSearchParams(location.search);
		søkeparametere.set('fane', avdelingslederPanel);

		return {
			pathname: location.pathname,
			hash: location.hash,
			search: `?${søkeparametere}`,
		};
	};
