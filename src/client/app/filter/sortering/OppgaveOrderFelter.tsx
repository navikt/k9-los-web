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
import { addSortering, moveSortering, removeSortering, updateSortering } from 'filter/queryUtils';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../utils';
import * as styles from './OppgaveOrderFelter.css';

const SortableOrderField = ({ felt, felter, onUpdateKode, onUpdateDirection, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className={styles.orderEnkelFelt}>
			<button type="button" className={styles.dragHandle} {...attributes} {...listeners}>
				<MenuHamburgerIcon aria-hidden height="1.5rem" width="1.5rem" />
			</button>
			<Select
				label=""
				className={styles.noGap}
				value={feltverdiKey(felt)}
				onChange={(event) => onUpdateKode(felt.id, event.target.value)}
			>
				<option value="">Velg felt</option>
				{felter.map((feltdefinisjon) => (
					<option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
						{feltdefinisjon.visningsnavn}
					</option>
				))}
			</Select>
			<Select
				label=""
				className={styles.orderDirection}
				value={felt.økende.toString()}
				onChange={(event) => onUpdateDirection(felt.id, event.target.value)}
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
				onClick={() => onRemove(felt.id)}
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

	const handleRemoveFelt = (feltId) => {
		updateQuery([removeSortering(feltId)]);
	};

	const handleAddFelt = () => {
		updateQuery([addSortering()]);
	};

	const handleUpdateKode = (feltId, value) => {
		updateQuery([
			updateSortering(feltId, {
				område: områdeFraKey(value),
				kode: kodeFraKey(value),
			}),
		]);
	};

	const handleUpdateDirection = (feltId, direction) => {
		updateQuery([
			updateSortering(feltId, {
				økende: direction === 'true',
			}),
		]);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const orderFields = oppgaveQuery?.order ?? [];
		const oldIndex = orderFields.findIndex((f) => f.id === active.id);
		const newIndex = orderFields.findIndex((f) => f.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		updateQuery([moveSortering(oldIndex, newIndex)]);
	};

	const orderFields = oppgaveQuery?.order ?? [];

	return (
		<div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={orderFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
					{orderFields.map((felt) => (
						<SortableOrderField
							key={felt.id}
							felt={felt}
							felter={felter}
							onUpdateKode={handleUpdateKode}
							onUpdateDirection={handleUpdateDirection}
							onRemove={handleRemoveFelt}
						/>
					))}
				</SortableContext>
			</DndContext>
			<Button
				className={styles.orderLeggTil}
				icon={<PlusCircleIcon aria-hidden />}
				size="small"
				variant="tertiary"
				onClick={handleAddFelt}
			>
				Legg til sortering
			</Button>
		</div>
	);
};

export default OppgaveOrderFelter;
