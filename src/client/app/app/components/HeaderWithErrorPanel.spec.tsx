import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import { unitTestHandlers } from '../../../mocks/unitTestHandlers';
import HeaderWithErrorPanel from './HeaderWithErrorPanel';

const server = setupServer(...unitTestHandlers);
describe('<HeaderWithErrorPanel>', () => {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());
	it('skal vise lenker for rettskilde i header men ingen avdelinger når det ikke er noen', async () => {
		act(() => {
			renderWithAllProviders(<HeaderWithErrorPanel />);
		});
		await waitFor(() => {
			expect(screen.getByText('Z123456')).toBeVisible();
		});
	});
});
