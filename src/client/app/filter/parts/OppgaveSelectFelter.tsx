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
import { Button, Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { WithNodeId } from 'filter/filterFrontendTypes';
import { EnkelSelectFelt, Oppgavefelt } from 'filter/filterTsTypes';
import { addEnkelSelectFelt, moveSelectFelt, removeSelectFelt, updateSelectFelt } from 'filter/queryUtils';
import * as styles from './OppgaveSelectFelter.css';

const SortableField: FunctionComponent<{
	felt: WithNodeId<EnkelSelectFelt>;
	felter: Oppgavefelt[];
	onUpdate: (felt: WithNodeId<EnkelSelectFelt>, newValue: string) => void;
	onRemove: (felt: WithNodeId<EnkelSelectFelt>) => void;
}> = ({ felt, felter, onUpdate, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className={styles.selectEnkelFelt}>
			<button type="button" className={styles.dragHandle} {...attributes} {...listeners}>
				<MenuHamburgerIcon aria-hidden height="1.5rem" width="1.5rem" />
			</button>
			<Select
				hideLabel
				label="Velg felt"
				className={styles.noGap}
				value={felt.kode}
				onChange={(event) => onUpdate(felt, event.target.value)}
			>
				<option value="">Velg felt</option>
				{felter.map((feltdefinisjon: Oppgavefelt) => (
					<option key={feltdefinisjon.kode} value={feltdefinisjon.kode}>
						{feltdefinisjon.visningsnavn}
					</option>
				))}
			</Select>
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
		<div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={oppgaveQuery.select.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
					{oppgaveQuery.select.map((felt) => (
						<SortableField
							key={felt._nodeId}
							felt={felt}
							felter={felter}
							onUpdate={handleUpdate}
							onRemove={handleRemove}
						/>
					))}
				</SortableContext>
			</DndContext>
			<Button icon={<PlusCircleIcon aria-hidden />} size="small" variant="tertiary" onClick={handleAdd}>
				Legg til felt som skal vises i søkeresultat
			</Button>
		</div>
	);
};

export default OppgaveSelectFelter;
