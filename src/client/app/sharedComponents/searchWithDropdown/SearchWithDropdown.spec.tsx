import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
	updateSelection: vi.fn<(values: string[]) => void>(),
	selectedValues: [],
};

describe('SearchWithDropdown', () => {
	it('viser riktig ledetekst uten grupper', () => {
		render(<SearchWithDropdown {...defaultProps} />);
		expect(screen.getByLabelText('Search label')).toBeInTheDocument();
	});

	it('viser valgte forslag uten grupper', async () => {
		const user = userEvent.setup();
		render(<SearchWithDropdown {...defaultProps} selectedValues={['Value 1']} />);
		await user.click(screen.getByRole('button', { name: 'Group 1 (1)' }));
		expect((await screen.findAllByText('Label 1')).length).toBeGreaterThanOrEqual(1);
	});

	it('viser riktig ledetekst med grupper', () => {
		render(<SearchWithDropdown {...defaultProps} groups={['Group 1', 'Group 2']} heading="Select items" />);
		expect(screen.getByLabelText('Search label')).toBeInTheDocument();
	});

	it('viser gruppene når groups er satt', async () => {
		const user = userEvent.setup();
		render(<SearchWithDropdown {...defaultProps} groups={['Group 1', 'Group 2']} heading="Select items" />);
		await user.click(screen.getByLabelText('Search label'));
		expect(screen.getByText('Group 1')).toBeInTheDocument();
		expect(screen.getByText('Group 2')).toBeInTheDocument();
	});
});
