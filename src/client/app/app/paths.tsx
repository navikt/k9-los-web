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
