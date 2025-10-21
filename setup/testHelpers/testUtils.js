import React from 'react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { config } from 'utils/reactQueryConfig';

export const renderWithAllProviders = (ui, { ...renderOptions } = {}) => {
	const queryClient = new QueryClient(config);
	const Wrapper = ({ children }) => (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<div id="app">{children}</div>
			</QueryClientProvider>
		</BrowserRouter>
	);
	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
