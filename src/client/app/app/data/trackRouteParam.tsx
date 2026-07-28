/* eslint-disable @typescript-eslint/no-explicit-any */
import { Params, useLocation, useParams } from 'react-router';
import { Location } from 'history';
import { parseQueryString } from 'utils/urlUtils';

const defaultConfig = {
	paramName: '',
	parse: (a: unknown) => a,
	isQueryParam: false,
};

interface Config {
	paramName?: string;
	parse?: (a: any) => any;
	isQueryParam?: boolean;
}

const mapMatchToParam = (params: Params, location: Location, trackingConfig: Required<Config>) => {
	const newParams = trackingConfig.isQueryParam ? parseQueryString(location.search) : params;
	return trackingConfig.parse(newParams[trackingConfig.paramName]);
};

function useTrackRouteParam(config: Config): { location: Location; selected: string | undefined } {
	const trackingConfig = { ...defaultConfig, ...config };

	const location = useLocation();
	const params = useParams();

	const paramFromUrl = mapMatchToParam(params, location, trackingConfig);
	return {
		location,
		selected: paramFromUrl,
	};
}

export default useTrackRouteParam;
