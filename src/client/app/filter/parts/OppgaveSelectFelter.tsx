import React, { FunctionComponent, useContext } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuHamburgerIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { WithNodeId } from 'filter/filterFrontendTypes';
import { EnkelSelectFelt, Oppgavefelt } from 'filter/filterTsTypes';
import { addEnkelSelectFelt, moveSelectFelt, removeSelectFelt, updateSelectFelt } from 'filter/queryUtils';

const toOption = (feltdefinisjon: Oppgavefelt) => ({
	value: feltdefinisjon.kode,
	label: feltdefinisjon.visningsnavn,
});

const SortableField: FunctionComponent<{
	felt: WithNodeId<EnkelSelectFelt>;
	select: WithNodeId<EnkelSelectFelt>[];
	felter: Oppgavefelt[];
	onUpdate: (felt: WithNodeId<EnkelSelectFelt>, newValue: string) => void;
	onRemove: (felt: WithNodeId<EnkelSelectFelt>) => void;
}> = ({ felt, select, felter, onUpdate, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const valgtFelt = felter.find((f) => f.kode === felt.kode);
	const selectedOption = valgtFelt ? [toOption(valgtFelt)] : [];

	const valgteFelterFraAndreRader = select
		.filter((s) => s._nodeId !== felt._nodeId && s.kode)
		.map((s) => s.kode);
	const tilgjengeligeFelter = felter.filter((f) => !valgteFelterFraAndreRader.includes(f.kode));

	return (
		<div ref={setNodeRef} style={style} className="flex items-center gap-2">
			<button
				type="button"
				className="shrink-0 flex items-center cursor-grab text-ax-neutral-700 hover:text-ax-neutral-1000"
				style={{ appearance: 'none', background: 'none', border: 'none', padding: 0 }}
				{...attributes}
				{...listeners}
			>
				<MenuHamburgerIcon aria-hidden height="1.5rem" width="1.5rem" />
			</button>
			<div className="min-w-0 grow">
				<UNSAFE_Combobox
					hideLabel
					label="Velg felt"
					options={felter.map(toOption)}
					selectedOptions={selectedOption}
					filteredOptions={tilgjengeligeFelter.map(toOption)}
					onToggleSelected={(option, isSelected) => {
						if (isSelected) onUpdate(felt, option);
					}}
					shouldAutocomplete
					placeholder="Velg felt"
				/>
			</div>
			<Button
				icon={<TrashIcon height="1.5rem" width="1.5rem" />}
				size="medium"
				variant="tertiary"
				onClick={() => onRemove(felt)}
			/>
		</div>
	);
};

const OppgaveSelectFelter = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleRemove = (felt: WithNodeId<EnkelSelectFelt>) => {
		updateQuery([removeSelectFelt(felt._nodeId)]);
	};

	const handleAdd = () => {
		updateQuery([addEnkelSelectFelt()]);
	};

	const handleUpdate = (felt: WithNodeId<EnkelSelectFelt>, newValue: string) => {
		const oppgavefelt = felter.find((f) => f.kode === newValue);
		if (oppgavefelt) {
			updateQuery([
				updateSelectFelt(felt._nodeId, {
					kode: oppgavefelt.kode,
					område: oppgavefelt.område,
				}),
			]);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const selectFields = oppgaveQuery?.select ?? [];
		const oldIndex = selectFields.findIndex((f) => f._nodeId === active.id);
		const newIndex = selectFields.findIndex((f) => f._nodeId === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		updateQuery([moveSelectFelt(oldIndex, newIndex)]);
	};

	return (
		<VStack gap="space-8">
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={oppgaveQuery.select.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
					{oppgaveQuery.select.map((felt) => (
						<SortableField
							key={felt._nodeId}
							felt={felt}
							select={oppgaveQuery.select}
							felter={felter}
							onUpdate={handleUpdate}
							onRemove={handleRemove}
						/>
					))}
				</SortableContext>
			</DndContext>
			<Button className="self-start" icon={<PlusCircleIcon aria-hidden />} size="small" variant="tertiary" onClick={handleAdd}>
				Legg til kolonne
			</Button>
		</VStack>
	);
};

export default OppgaveSelectFelter;
