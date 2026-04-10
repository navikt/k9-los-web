import React, { FunctionComponent, useContext, useMemo } from 'react';
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
import { Button, Select, VStack } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { WithNodeId } from 'filter/filterFrontendTypes';
import { EnkelOrderFelt, Oppgavefelt, OrderFelt, AggregertOrderFelt, AggregertSelectFelt, AGGREGERT_FUNKSJON_VISNINGSNAVN, SelectFelt } from 'filter/filterTsTypes';
import { addSortering, addAggregertSortering, moveSortering, removeSortering, updateSortering, updateAggregertSortering } from 'filter/queryUtils';
import QuickAddOrder from './QuickAddOrder';

function aggregertSelectNøkkel(s: AggregertSelectFelt): string {
	return `${s.funksjon}:${s.område ?? ''}:${s.kode ?? ''}`;
}

function aggregertSelectVisningsnavn(s: AggregertSelectFelt, felter: Oppgavefelt[]): string {
	const funksjonNavn = AGGREGERT_FUNKSJON_VISNINGSNAVN[s.funksjon];
	if (s.område && s.kode) {
		const felt = felter.find((f) => f.område === s.område && f.kode === s.kode);
		return `${funksjonNavn}(${felt?.visningsnavn ?? s.kode})`;
	}
	return funksjonNavn;
}

const SortableEnkelOrderField: FunctionComponent<{
	felt: WithNodeId<EnkelOrderFelt>;
	order: WithNodeId<OrderFelt>[];
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

	const valgteFelterFraAndreRader = order
		.filter((o) => o._nodeId !== felt._nodeId && o.type === 'enkel' && o.kode)
		.map((o) => (o as WithNodeId<EnkelOrderFelt>).kode);
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
				label="Velg felt for sortering"
				className="min-w-0 grow"
				value={felt.kode}
				onChange={(event) => onUpdateKode(felt._nodeId, event.target.value)}
			>
				<option value="">Velg felt</option>
				{tilgjengeligeFelter.map((feltdefinisjon) => (
					<option key={feltdefinisjon.kode} value={feltdefinisjon.kode}>
						{feltdefinisjon.visningsnavn}
					</option>
				))}
			</Select>
			<Select
				hideLabel
				label="Retning"
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
				icon={<TrashIcon height="1.5rem" width="1.5rem" />}
				size="medium"
				variant="tertiary"
				onClick={() => onRemove(felt._nodeId)}
			/>
		</div>
	);
};

const SortableAggregertOrderField: FunctionComponent<{
	felt: WithNodeId<AggregertOrderFelt>;
	aggregerteSelectFelter: AggregertSelectFelt[];
	felter: Oppgavefelt[];
	onUpdateAggregat: (nodeId: string, nøkkel: string) => void;
	onUpdateDirection: (nodeId: string, direction: string) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, aggregerteSelectFelter, felter, onUpdateAggregat, onUpdateDirection, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const currentKey = `${felt.funksjon}:${felt.område ?? ''}:${felt.kode ?? ''}`;

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
				label="Velg aggregering for sortering"
				className="min-w-0 grow"
				value={currentKey}
				onChange={(event) => onUpdateAggregat(felt._nodeId, event.target.value)}
			>
				<option value="">Velg aggregering</option>
				{aggregerteSelectFelter.map((s) => {
					const key = aggregertSelectNøkkel(s);
					return (
						<option key={key} value={key}>
							{aggregertSelectVisningsnavn(s, felter)}
						</option>
					);
				})}
			</Select>
			<Select
				hideLabel
				label="Retning"
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

	const aggregerteSelectFelter = useMemo(
		() => oppgaveQuery.select.filter((s): s is WithNodeId<AggregertSelectFelt> => s.type === 'aggregert'),
		[oppgaveQuery.select],
	);

	const handleRemoveFelt = (nodeId: string) => {
		updateQuery([removeSortering(nodeId)]);
	};

	const handleAddEnkelFelt = () => {
		updateQuery([addSortering(null)]);
	};

	const handleAddAggregertFelt = () => {
		updateQuery([addAggregertSortering()]);
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

	const handleUpdateAggregat = (nodeId: string, nøkkel: string) => {
		const [funksjon, område, kode] = nøkkel.split(':');
		updateQuery([
			updateAggregertSortering(nodeId, {
				funksjon: funksjon as AggregertOrderFelt['funksjon'],
				område: område || null,
				kode: kode || null,
			}),
		]);
	};

	const handleUpdateDirection = (nodeId: string, direction: string) => {
		const felt = oppgaveQuery.order.find((o) => o._nodeId === nodeId);
		if (!felt) return;

		if (felt.type === 'aggregert') {
			updateQuery([updateAggregertSortering(nodeId, { økende: direction === 'true' })]);
		} else {
			updateQuery([updateSortering(nodeId, { økende: direction === 'true' })]);
		}
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
	const harAggregerteSelect = aggregerteSelectFelter.length > 0;

	return (
		<VStack gap="space-8">
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={orderFields.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
					{orderFields.map((felt) =>
						felt.type === 'aggregert' ? (
							<SortableAggregertOrderField
								key={felt._nodeId}
								felt={felt}
								aggregerteSelectFelter={aggregerteSelectFelter}
								felter={felter}
								onUpdateAggregat={handleUpdateAggregat}
								onUpdateDirection={handleUpdateDirection}
								onRemove={handleRemoveFelt}
							/>
						) : (
							<SortableEnkelOrderField
								key={felt._nodeId}
								felt={felt}
								felter={felter}
								order={orderFields}
								onUpdateKode={handleUpdateKode}
								onUpdateDirection={handleUpdateDirection}
								onRemove={handleRemoveFelt}
							/>
						),
					)}
				</SortableContext>
			</DndContext>
			{orderFields.length === 0 && <div className="text-ax-neutral-500 italic text-md">Ingen sortering lagt til</div>}
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
				{harAggregerteSelect && (
					<Button
						type="button"
						className="self-start px-1"
						icon={<PlusCircleIcon aria-hidden />}
						size="small"
						variant="tertiary"
						onClick={handleAddAggregertFelt}
					>
						Sorter på aggregering
					</Button>
				)}
			</div>
		</VStack>
	);
};

export default OppgaveOrderFelter;
