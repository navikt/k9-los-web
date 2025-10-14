import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { config } from 'utils/reactQueryConfig';
import defaultMessages from '../../src/client/app/sprak/nb_NO.json';

export const renderWithAllProviders = (ui, { ...renderOptions } = {}) => {
	const queryClient = new QueryClient(config);
	const Wrapper = ({ children }) => (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<IntlProvider locale="nb-NO" defaultLocale="nb-NO" messages={defaultMessages}>
					<div id="app">{children}</div>
				</IntlProvider>
			</QueryClientProvider>
		</BrowserRouter>
	);
	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
