import { Location, To } from 'react-router';
import { formatQueryString, parseQueryString } from 'utils/urlUtils';

const emptyQueryString = (queryString: string) => queryString === '?' || !queryString;

const updateQueryParams = (queryString: string, nextParams: Record<string, string>) => {
	const prevParams = emptyQueryString(queryString) ? {} : parseQueryString(queryString);
	return formatQueryString({
		...prevParams,
		...nextParams,
	});
};

export const getPanelLocationCreator =
	(location: Location) =>
	(avdelingslederPanel: string): To => ({
		pathname: location.pathname,
		hash: location.hash,
		search: updateQueryParams(location.search, { fane: avdelingslederPanel }),
	});
