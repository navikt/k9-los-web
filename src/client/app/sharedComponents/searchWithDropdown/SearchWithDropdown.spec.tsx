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
	it('renders the correct label (ungrouped)', () => {
		render(<SearchWithDropdown {...defaultProps} />);
		expect(screen.getByLabelText('Search label')).toBeInTheDocument();
	});

	it('renders selected suggestions correctly (ungrouped)', async () => {
		render(<SearchWithDropdown {...defaultProps} selectedValues={['Value 1']} />);
		await userEvent.click(screen.getByRole('button', { name: 'Group 1 (1)' }));
		expect((await screen.findAllByText('Label 1')).length).toBeGreaterThanOrEqual(1);
	});

	it('renders the correct label (grouped)', () => {
		render(
			<SearchWithDropdown
				{...defaultProps}
				groups={['Group 1', 'Group 2']}
				heading="Select items"
			/>,
		);
		expect(screen.getByLabelText('Search label')).toBeInTheDocument();
	});

	it('renders groups when groups prop is provided', async () => {
		render(
			<SearchWithDropdown
				{...defaultProps}
				groups={['Group 1', 'Group 2']}
				heading="Select items"
			/>,
		);
		await userEvent.click(screen.getByLabelText('Search label'));
		expect(screen.getByText('Group 1')).toBeInTheDocument();
		expect(screen.getByText('Group 2')).toBeInTheDocument();
	});
});
