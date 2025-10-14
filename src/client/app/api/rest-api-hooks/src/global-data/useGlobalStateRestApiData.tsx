import { useQueryClient } from '@tanstack/react-query';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import apiPaths from 'api/apiPaths';

/**
 * Hook som bruker respons som allerede er hentet fra backend. For å kunne bruke denne
 * må kodeverk først være hentet via Tanstack Query (f.eks. i AppConfigResolver)
 */
function useGlobalStateRestApiData<T>(key: RestApiGlobalStatePathsKeys): T {
	const queryClient = useQueryClient();

	// Map RestApiGlobalStatePathsKeys til faktiske API paths
	const apiPathMap = {
		[RestApiGlobalStatePathsKeys.KODEVERK]: apiPaths.kodeverk,
	};

	const apiPath = apiPathMap[key];
	return queryClient.getQueryData<T>([apiPath]);
}

export default useGlobalStateRestApiData;
