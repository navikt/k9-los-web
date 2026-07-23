import { FunctionComponent, useContext, useMemo, useState } from 'react';
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
import { EnkelOrderFelt, Oppgavefelt, OrderFelt, Synlighet } from 'filter/filterTsTypes';
import { addSortering, moveSortering, removeSortering, updateSortering } from 'filter/queryUtils';
import { COMBOBOX_SEPARATOR_VALUE, comboboxSeparatorStyle } from 'filter/utils';
import QuickAddOrder from './QuickAddOrder';

const SortableEnkelOrderField: FunctionComponent<{
	felt: WithNodeId<EnkelOrderFelt>;
	order: WithNodeId<OrderFelt>[];
	felter: Oppgavefelt[];
	onUpdateKode: (nodeId: string, kode: string) => void;
	onUpdateDirection: (nodeId: string, direction: string) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, order, felter, onUpdateKode, onUpdateDirection, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });
	const [fritekst, setFritekst] = useState('');

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const valgteFelterFraAndreRader = order
		.filter((o) => o._nodeId !== felt._nodeId && o.type === 'enkel' && o.kode)
		.map((o) => (o as WithNodeId<EnkelOrderFelt>).kode);
	const tilgjengeligeFelter = felter.filter((f) => !valgteFelterFraAndreRader.includes(f.kode) || f.kode === felt.kode);

	const options = useMemo(() => {
		const primærvalg = tilgjengeligeFelter.filter((v) => v.synlighet === Synlighet.OverStreken);
		const avanserteValg = tilgjengeligeFelter.filter((v) => v.synlighet === Synlighet.UnderStreken);

		const optionsList = primærvalg.map((v) => ({ value: v.kode, label: v.visningsnavn }));
		if (avanserteValg.length > 0) {
			optionsList.push({ value: COMBOBOX_SEPARATOR_VALUE, label: '' });
			optionsList.push(...avanserteValg.map((v) => ({ value: v.kode, label: v.visningsnavn })));
		}
		return optionsList;
	}, [tilgjengeligeFelter]);

	const selectedOptions = felt.kode ? options.filter((o) => o.value === felt.kode).map((o) => o.label) : [];

	const containerClass = `orderFeltCombobox-${felt._nodeId.replace(/[^a-zA-Z0-9]/g, '')}`;

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
			<div className={`min-w-0 grow ${containerClass}`}>
				<style>{comboboxSeparatorStyle(containerClass)}</style>
				<UNSAFE_Combobox
					label="Velg felt for sortering"
					hideLabel
					size="small"
					value={fritekst}
					onChange={setFritekst}
					selectedOptions={selectedOptions}
					onToggleSelected={(value) => {
						if (value === COMBOBOX_SEPARATOR_VALUE) return;
						onUpdateKode(felt._nodeId, value);
						setFritekst('');
					}}
					options={options}
					shouldAutocomplete
				/>
			</div>
			<Select
				hideLabel
				label="Retning"
				size="small"
				className="shrink-0"
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
				type="button"
				icon={<TrashIcon height="1.25rem" width="1.25rem" />}
				size="small"
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

	const handleAddEnkelFelt = () => {
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

	const handleUpdateDirection = (nodeId: string, direction: string) => {
		updateQuery([updateSortering(nodeId, { økende: direction === 'true' })]);
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
						<SortableEnkelOrderField
							key={felt._nodeId}
							felt={felt as WithNodeId<EnkelOrderFelt>}
							felter={felter}
							order={orderFields}
							onUpdateKode={handleUpdateKode}
							onUpdateDirection={handleUpdateDirection}
							onRemove={handleRemoveFelt}
						/>
					))}
				</SortableContext>
			</DndContext>
			{orderFields.length === 0 && (
				<div className="text-ax-neutral-500 italic text-md mt-1 mb-1">Ingen sortering lagt til</div>
			)}
			<QuickAddOrder />
			<div className="flex gap-2">
				<Button
					type="button"
					className="self-start -m-1 px-1"
					icon={<PlusCircleIcon aria-hidden />}
					size="small"
					variant="tertiary"
					onClick={handleAddEnkelFelt}
				>
					Legg til sortering
				</Button>
			</div>
		</VStack>
	);
};

export default OppgaveOrderFelter;
