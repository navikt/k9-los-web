import React, { useContext } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
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
import { addSelectFelt, moveSelectFelt, removeSelectFelt, updateSelectFelt } from 'filter/queryUtils';
import { feltverdiKey } from '../utils';
import * as styles from './OppgaveSelectFelter.css';

const SortableField = ({ felt, felter, onUpdate, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt.id });

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
				value={feltverdiKey(felt)}
				onChange={(event) => onUpdate(felt, event.target.value)}
			>
				<option value="">Velg felt</option>
				{felter.map((feltdefinisjon) => (
					<option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
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

	const handleRemove = (felt) => {
		updateQuery([removeSelectFelt(felt.id)]);
	};

	const handleAdd = () => {
		updateQuery([addSelectFelt()]);
	};

	const handleUpdate = (felt, newValue) => {
		updateQuery([updateSelectFelt(felt.id, newValue)]);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const selectFields = oppgaveQuery?.select ?? [];
		const oldIndex = selectFields.findIndex((f) => f.id === active.id);
		const newIndex = selectFields.findIndex((f) => f.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		updateQuery([moveSelectFelt(oldIndex, newIndex)]);
	};

	const selectFields = oppgaveQuery?.select ?? [];

	return (
		<div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={selectFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
					{selectFields.map((felt) => (
						<SortableField key={felt.id} felt={felt} felter={felter} onUpdate={handleUpdate} onRemove={handleRemove} />
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
