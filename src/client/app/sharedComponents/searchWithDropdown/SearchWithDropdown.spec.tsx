import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchWithDropdown, { SearchWithDropdownProps } from './SearchWithDropdown';

const suggestions = [
	{ label: 'Label 1', value: 'Value 1', group: 'Group 1' },
	{ label: 'Label 2', value: 'Value 2', group: 'Group 1' },
	{ label: 'Label 3', value: 'Value 3', group: 'Group 2' },
	{ label: 'Label 4', value: 'Value 4', group: 'Group 2' },
];

const defaultProps: SearchWithDropdownProps = {
	label: 'Search label',
	suggestions,
	updateSelection: jest.fn(),
	selectedValues: [],
};

describe('SearchWithDropdown', () => {
	beforeEach(() => {
		render(<SearchWithDropdown {...defaultProps} />);
	});

	it('renders the correct label', () => {
		expect(screen.getByLabelText('Search label')).toBeInTheDocument();
	});

	it('renders selected suggestions correctly', async () => {
		render(<SearchWithDropdown {...defaultProps} selectedValues={['Value 1']} />);
		screen.getByRole('button', { name: 'Group 1 (1)' }).click();
		expect((await screen.findAllByText('Label 1')).length).toBeGreaterThanOrEqual(1);
	});
});
