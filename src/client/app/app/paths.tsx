import querystring from 'query-string';
import { formatQueryString, parseQueryString } from 'utils/urlUtils';
import { Location } from './locationTsType';

const emptyQueryString = (queryString) => queryString === '?' || !queryString;

const updateQueryParams = (queryString, nextParams) => {
	const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
	return formatQueryString({
		...prevParams,
		...nextParams,
	});
};

const getLocationWithQueryParams = (location, queryParams) => ({
	...location,
	search: updateQueryParams(location.search, queryParams),
});

export const getPanelLocationCreator = (location: Location) => (avdelingslederPanel: string) =>
	getLocationWithQueryParams(location, { fane: avdelingslederPanel });

export const getK9sakHref = (k9sakUrl: string, saksnummer: string, behandlingId?: string | number) => {
	if (behandlingId) {
		return querystring.stringifyUrl({
			url: `${k9sakUrl}/fagsak/${saksnummer}/behandling/${behandlingId}/`,
			query: { fakta: 'default', punkt: 'default' },
		});
	}

	return `${k9sakUrl}/fagsak/${saksnummer}/`;
};

export const getK9punsjRef = (k9punsjUrl: string, journalpostId: string) => `${k9punsjUrl}/${journalpostId}`;
