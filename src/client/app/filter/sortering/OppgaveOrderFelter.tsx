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
import { Button, Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { WithNodeId } from 'filter/filterFrontendTypes';
import { EnkelOrderFelt, Oppgavefelt } from 'filter/filterTsTypes';
import { addSortering, moveSortering, removeSortering, updateSortering } from 'filter/queryUtils';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../utils';
import * as styles from './OppgaveOrderFelter.css';

const SortableOrderField: FunctionComponent<{
	felt: WithNodeId<EnkelOrderFelt>;
	felter: Oppgavefelt[];
	onUpdateKode: (nodeId: string, direction: string) => void;
	onUpdateDirection: (nodeId: string, direction: string) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, felter, onUpdateKode, onUpdateDirection, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

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
				onChange={(event) => onUpdateKode(felt._nodeId, event.target.value)}
			>
				<option value="">Velg felt</option>
				{felter.map((feltdefinisjon: Oppgavefelt) => (
					<option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
						{feltdefinisjon.visningsnavn}
					</option>
				))}
			</Select>
			<Select
				label=""
				className={styles.orderDirection}
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
		updateQuery([addSortering()]);
	};

	const handleUpdateKode = (nodeId: string, value: string) => {
		updateQuery([
			updateSortering(nodeId, {
				område: områdeFraKey(value),
				kode: kodeFraKey(value),
			}),
		]);
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
		<div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={orderFields.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
					{orderFields.map((felt) => (
						<SortableOrderField
							key={felt._nodeId}
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
