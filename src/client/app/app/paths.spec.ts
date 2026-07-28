import { Location } from 'react-router';
import { getPanelLocationCreator } from './paths';

const lagLocation = (search: string): Location => ({
	pathname: '/avdelingsleder',
	search,
	hash: '',
	state: null,
	key: 'test',
});

describe('getPanelLocationCreator', () => {
	it('setter fane-parameteren', () => {
		const lenke = getPanelLocationCreator(lagLocation(''))('nokkeltall');

		expect(lenke).toEqual({
			pathname: '/avdelingsleder',
			hash: '',
			search: '?fane=nokkeltall',
		});
	});

	it('beholder øvrige query-parametere', () => {
		const lenke = getPanelLocationCreator(lagLocation('?sok=ABC12'))('reservasjoner');

		expect(lenke).toHaveProperty('search', '?sok=ABC12&fane=reservasjoner');
	});

	it('overskriver eksisterende fane uten å duplisere den', () => {
		const lenke = getPanelLocationCreator(lagLocation('?fane=nokkeltall&sok=ABC12'))('saksbehandlere');

		expect(lenke).toHaveProperty('search', '?fane=saksbehandlere&sok=ABC12');
	});

	it('beholder pathname og hash', () => {
		const location = { ...lagLocation('?fane=nokkeltall'), hash: '#seksjon' };

		expect(getPanelLocationCreator(location)('lagredesok')).toMatchObject({
			pathname: '/avdelingsleder',
			hash: '#seksjon',
		});
	});

	it('koder verdier som inneholder spesialtegn', () => {
		const lenke = getPanelLocationCreator(lagLocation('?errormessage=Fant+ikke+sak%3A+266'))('nokkeltall');

		expect(lenke).toHaveProperty('search', '?errormessage=Fant+ikke+sak%3A+266&fane=nokkeltall');
	});
});
