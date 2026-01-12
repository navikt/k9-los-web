import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Chips } from '@navikt/ds-react';

type groupObject = {
	label: string;
	value: string;
	group?: string;
};

interface Props {
	values: groupObject[];
	remove: (value: string) => void;
	removeAllValues: () => void;
}

const Group = ({ group, chips, remove }: { group: string; chips: Props['values']; remove: Props['remove'] }) => {
	const [open, setOpen] = useState(false);

	return (
		<div className={open ? `bg-white rounded-md p-1.5 pt-0 pl-0 w-full` : ''}>
			<Button
				className="!p-1"
				size="small"
				type="button"
				icon={!open ? <ChevronDownIcon /> : <ChevronUpIcon />}
				variant="tertiary"
				onClick={() => setOpen(!open)}
			>
				{`${group} (${chips.length})`}
			</Button>
			{open && (
				<div className="p-2">
					<Chips size="small">
						{chips.map((v) => (
							<Chips.Removable variant="action" key={v.value} onClick={() => remove(v.value)}>
								{v.label}
							</Chips.Removable>
						))}
					</Chips>
				</div>
			)}
		</div>
	);
};

export const SelectedValues = ({ values, remove, removeAllValues }: Props) => {
	const getUniqueGroups = () => {
		const groups = values.map((group) => group.group);
		return [...new Set(groups)].sort();
	};
	const groups = getUniqueGroups();
	if (!values || !values.length) {
		return null;
	}
	return (
		<div>
			<div className="flex flex-wrap gap-2 mt-3">
				{groups.map((group) => (
					<Group key={group} group={group} chips={values.filter((v) => v.group === group)} remove={remove} />
				))}
			</div>
			<Button
				icon={<TrashIcon />}
				variant="primary"
				size="small"
				type="button"
				className="mt-3"
				onClick={removeAllValues}
			>
				Fjern alle
			</Button>
		</div>
	);
};
