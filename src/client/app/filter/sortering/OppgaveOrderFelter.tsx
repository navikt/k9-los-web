import React, { FunctionComponent, useContext } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core/dist/types';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuHamburgerIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Select, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { WithNodeId } from 'filter/filterFrontendTypes';
import { EnkelOrderFelt, Oppgavefelt } from 'filter/filterTsTypes';
import { addSortering, moveSortering, removeSortering, updateSortering } from 'filter/queryUtils';

const SortableOrderField: FunctionComponent<{
	felt: WithNodeId<EnkelOrderFelt>;
	order: WithNodeId<EnkelOrderFelt>[];
	felter: Oppgavefelt[];
	onUpdateKode: (nodeId: string, kode: string) => void;
	onUpdateDirection: (nodeId: string, direction: string) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, order, felter, onUpdateKode, onUpdateDirection, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const mapper = (feltdefinisjon: Oppgavefelt) => ({
		value: feltdefinisjon.kode,
		label: feltdefinisjon.visningsnavn,
	});

	const valgtFelt = felter.find((f) => f.kode === felt.kode);
	const selectedOption = valgtFelt ? [mapper(valgtFelt)] : [];

	const valgteFelterFraAndreRader = order.filter((o) => o._nodeId !== felt._nodeId && o.kode).map((o) => o.kode);
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
					label="Velg felt for sortering"
					options={felter.map(mapper)}
					selectedOptions={selectedOption}
					filteredOptions={tilgjengeligeFelter.map(mapper)}
					onToggleSelected={(option, isSelected) => {
						if (isSelected) onUpdateKode(felt._nodeId, option);
					}}
					shouldAutocomplete
					placeholder="Velg felt"
				/>
			</div>

			<Select
				hideLabel
				label="Retning"
				value={felt.økende.toString()}
				onChange={(event) => onUpdateDirection(felt._nodeId, event.target.value)}
			>
				<option key="true" value="true">
					Økende
				</option>
				<option key="false" value="false">
					Synkende
				</option>
			</Select>
			<Button
				icon={<TrashIcon height="1.5rem" width="1.5rem" />}
				size="medium"
				variant="tertiary"
				onClick={() => onRemove(felt._nodeId)}
			/>
		</div>
	);
};

const OppgaveOrderFelter = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleRemoveFelt = (nodeId: string) => {
		updateQuery([removeSortering(nodeId)]);
	};

	const handleAddFelt = () => {
		updateQuery([addSortering(null)]);
	};

	const handleUpdateKode = (nodeId: string, kode: string) => {
		const oppgavefelt = felter.find((f) => f.kode === kode);
		if (oppgavefelt) {
			updateQuery([
				updateSortering(nodeId, {
					område: oppgavefelt.område,
					kode: oppgavefelt.kode,
				}),
			]);
		}
	};

	const handleUpdateDirection = (nodeId: string, direction: 'true' | 'false') => {
		updateQuery([
			updateSortering(nodeId, {
				økende: direction === 'true',
			}),
		]);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const orderFields = oppgaveQuery?.order ?? [];
		const oldIndex = orderFields.findIndex((f) => f._nodeId === active.id);
		const newIndex = orderFields.findIndex((f) => f._nodeId === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		updateQuery([moveSortering(oldIndex, newIndex)]);
	};

	const orderFields = oppgaveQuery?.order ?? [];

	return (
		<VStack gap="space-8">
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={orderFields.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
					{orderFields.map((felt) => (
						<SortableOrderField
							key={felt._nodeId}
							felt={felt}
							felter={felter}
							order={orderFields}
							onUpdateKode={handleUpdateKode}
							onUpdateDirection={handleUpdateDirection}
							onRemove={handleRemoveFelt}
						/>
					))}
				</SortableContext>
			</DndContext>
			<Button className="self-start" icon={<PlusCircleIcon aria-hidden />} size="small" variant="tertiary" onClick={handleAddFelt}>
				Legg til sortering
			</Button>
		</VStack>
	);
};

export default OppgaveOrderFelter;
