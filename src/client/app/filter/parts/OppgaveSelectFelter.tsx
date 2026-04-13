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
import { Button, Select, VStack } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { WithNodeId } from 'filter/filterFrontendTypes';
import { EnkelSelectFelt, Oppgavefelt, SelectFelt } from 'filter/filterTsTypes';
import { addEnkelSelectFelt, moveSelectFelt, removeSelectFelt, updateSelectFelt } from 'filter/queryUtils';
import QuickAddSelect from './QuickAddSelect';

const SortableEnkelField: FunctionComponent<{
	felt: WithNodeId<EnkelSelectFelt>;
	select: WithNodeId<SelectFelt>[];
	felter: Oppgavefelt[];
	onUpdate: (felt: WithNodeId<EnkelSelectFelt>, newValue: string) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, select, felter, onUpdate, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const valgteFelterFraAndreRader = select
		.filter((s) => s._nodeId !== felt._nodeId && s.type === 'enkel' && s.kode)
		.map((s) => (s as WithNodeId<EnkelSelectFelt>).kode);
	const tilgjengeligeFelter = felter.filter((f) => !valgteFelterFraAndreRader.includes(f.kode) || f.kode === felt.kode);

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
			<Select
				hideLabel
				label="Velg felt"
				className="min-w-0 grow"
				value={felt.kode}
				onChange={(event) => onUpdate(felt, event.target.value)}
			>
				<option value="">Velg felt</option>
				{tilgjengeligeFelter.map((feltdefinisjon) => (
					<option key={feltdefinisjon.kode} value={feltdefinisjon.kode}>
						{feltdefinisjon.visningsnavn}
					</option>
				))}
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

const OppgaveSelectFelter = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleRemove = (nodeId: string) => {
		updateQuery([removeSelectFelt(nodeId)]);
	};

	const handleAddEnkel = () => {
		updateQuery([addEnkelSelectFelt()]);
	};

	const handleUpdateEnkel = (felt: WithNodeId<EnkelSelectFelt>, newValue: string) => {
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
						<SortableEnkelField
							key={felt._nodeId}
							felt={felt as WithNodeId<EnkelSelectFelt>}
							select={oppgaveQuery.select}
							felter={felter}
							onUpdate={handleUpdateEnkel}
							onRemove={handleRemove}
						/>
					))}
				</SortableContext>
			</DndContext>
			{oppgaveQuery.select.length === 0 && (
				<div className="text-ax-neutral-500 italic text-md">Ingen kolonner lagt til</div>
			)}
			<QuickAddSelect />
			<div className="flex gap-2">
				<Button
					type="button"
					className="self-start -ml-1 px-1"
					icon={<PlusCircleIcon aria-hidden />}
					size="small"
					variant="tertiary"
					onClick={handleAddEnkel}
				>
					Legg til kolonne
				</Button>
			</div>
		</VStack>
	);
};

export default OppgaveSelectFelter;
