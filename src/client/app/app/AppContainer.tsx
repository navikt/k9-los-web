import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppIndex from 'app/AppIndex';
import { BrowserRouter } from 'react-router';
import { config } from 'utils/reactQueryConfig';

const queryClient = new QueryClient(config);
const AppContainer = () => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<AppIndex />
		</BrowserRouter>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);

export default AppContainer;
