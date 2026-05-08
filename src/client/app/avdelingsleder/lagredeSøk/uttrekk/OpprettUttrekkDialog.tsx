import React, { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import _ from 'lodash';
import {
	ArrowsUpDownIcon,
	LayersIcon,
	MenuHamburgerIcon,
	PlusCircleIcon,
	PlusIcon,
	TableIcon,
	TrashIcon,
	XMarkIcon,
} from '@navikt/aksel-icons';
import {
	Alert,
	BodyShort,
	Button,
	Detail,
	Dialog,
	Radio,
	RadioGroup,
	ReadMore,
	Select,
	TextField,
	UNSAFE_Combobox,
	VStack,
} from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, useEndreLagretSøk, useOpprettUttrekk } from 'api/queries/avdelingslederQueries';
import { FilterContext, FilterContextType } from 'filter/FilterContext';
import OppgaveQueryModel from 'filter/OppgaveQueryModel';
import { IdentifiedOppgaveQuery, WithNodeId, fjernNodeIdFraQuery, tilIdentified } from 'filter/filterFrontendTypes';
import {
	AggregertFunksjon,
	EnkelOrderFelt,
	EnkelSelectFelt,
	OppgaveQuery,
	Oppgavefelt,
	OppgavefilterKode,
	OrderFelt,
	SelectFelt,
	Synlighet,
} from 'filter/filterTsTypes';
import OppgaveSelectFelter from 'filter/parts/OppgaveSelectFelter';
import {
	QueryFunction,
	addSortering,
	applyFunctions,
	moveSortering,
	removeSortering,
	updateSortering,
} from 'filter/queryUtils';
import { COMBOBOX_SEPARATOR_VALUE, comboboxSeparatorStyle } from 'filter/utils';
import { QueryBoksStyle } from '../QueryBoksStyle';

type UttrekkType = 'antall' | 'gruppert' | 'oppgaver';

type GruppertSorteringsFelt = { felt: string; økende: boolean; _nodeId: string };

interface OpprettUttrekkDialogProps {
	lagretSøk: LagretSøk;
	antall: number | undefined;
	onOpprettet: () => void;
}

const maksAntallForUttrekk = 20000;

function utledType(query: OppgaveQuery): UttrekkType {
	const harAggregert = query.select.some((s) => s.type === 'aggregert');
	const harEnkel = query.select.some((s) => s.type === 'enkel');
	if (harAggregert && harEnkel) return 'gruppert';
	if (harAggregert) return 'antall';
	return 'oppgaver';
}

function alleOppgaverTekst(antall: number) {
	const antallOmganger = Math.ceil(antall / maksAntallForUttrekk);
	const offsets = Array.from({ length: antallOmganger }, (_v, i) => i * maksAntallForUttrekk);

	let formattedOffsets: string;
	if (offsets.length > 4) {
		formattedOffsets = `${offsets.slice(0, 4).join(', ')}, osv`;
	} else {
		formattedOffsets = [...offsets.slice(0, -2).map(String), offsets.slice(-2).join(' og ')].join(', ');
	}

	return (
		`For å hente ut alle rader kan det gjøres uttrekk i ${antallOmganger} omganger.` +
		` Sett da maksimalt antall ${maksAntallForUttrekk}, og hopp over henholdsvis ${formattedOffsets}.`
	);
}

// --- Gruppering: SortableGroupByField ---

const SortableGroupByField: React.FC<{
	felt: WithNodeId<EnkelSelectFelt>;
	alleFelter: WithNodeId<EnkelSelectFelt>[];
	oppgaveFelter: Oppgavefelt[];
	onUpdate: (nodeId: string, kode: string) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, alleFelter, oppgaveFelter, onUpdate, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });
	const [fritekst, setFritekst] = useState('');

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const valgteFraAndreRader = alleFelter.filter((f) => f._nodeId !== felt._nodeId && f.kode).map((f) => f.kode);
	const tilgjengelige = oppgaveFelter.filter((f) => !valgteFraAndreRader.includes(f.kode) || f.kode === felt.kode);

	const options = useMemo(() => {
		const primærvalg = tilgjengelige.filter((v) => v.synlighet === Synlighet.OverStreken);
		const avanserteValg = tilgjengelige.filter((v) => v.synlighet === Synlighet.UnderStreken);

		const optionsList = primærvalg.map((v) => ({ value: v.kode, label: v.visningsnavn }));
		if (avanserteValg.length > 0) {
			optionsList.push({ value: COMBOBOX_SEPARATOR_VALUE, label: '' });
			optionsList.push(...avanserteValg.map((v) => ({ value: v.kode, label: v.visningsnavn })));
		}
		return optionsList;
	}, [tilgjengelige]);

	const selectedOptions = felt.kode ? options.filter((o) => o.value === felt.kode).map((o) => o.label) : [];

	const containerClass = `groupByCombobox-${felt._nodeId.replace(/[^a-zA-Z0-9]/g, '')}`;

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
					label="Velg felt"
					hideLabel
					size="small"
					value={fritekst}
					onChange={setFritekst}
					selectedOptions={selectedOptions}
					onToggleSelected={(value) => {
						if (value === COMBOBOX_SEPARATOR_VALUE) return;
						onUpdate(felt._nodeId, value);
						setFritekst('');
					}}
					options={options}
					shouldAutocomplete
				/>
			</div>
			<Button
				icon={<TrashIcon height="1.25rem" width="1.25rem" />}
				size="small"
				variant="tertiary"
				onClick={() => onRemove(felt._nodeId)}
			/>
		</div>
	);
};

// --- Gruppert konfigurasjon ---

const QUICK_ADD_GROUP_BY_KOLONNER: OppgavefilterKode[] = [
	OppgavefilterKode.Ytelsestype,
	OppgavefilterKode.BehandlingTypekode,
	OppgavefilterKode.Behandlingsårsak,
	OppgavefilterKode.AktivVenteårsak,
	OppgavefilterKode.Oppgavestatus,
];

const QuickAddGroupBy: React.FC<{
	groupByFelter: WithNodeId<EnkelSelectFelt>[];
	oppgaveFelter: Oppgavefelt[];
	onAdd: (kode: string) => void;
}> = ({ groupByFelter, oppgaveFelter, onAdd }) => {
	const valgteKoder = new Set(groupByFelter.filter((f) => f.kode).map((f) => f.kode));

	const tilgjengelige = QUICK_ADD_GROUP_BY_KOLONNER.map((kode) => {
		if (valgteKoder.has(kode)) return null;
		const oppgavefelt = oppgaveFelter.find((f) => f.kode === kode);
		if (!oppgavefelt) return null;
		return { kode: kode as string, visningsnavn: oppgavefelt.visningsnavn };
	}).filter((x): x is { kode: string; visningsnavn: string } => x !== null);

	if (tilgjengelige.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{tilgjengelige.map(({ kode, visningsnavn }) => (
				<button
					key={kode}
					type="button"
					className={[
						'cursor-pointer inline-flex items-center gap-0.5 rounded-md border border-dashed',
						'border-ax-neutral-400 bg-transparent pl-1 pr-2 py-0.5 font-semibold text-ax-neutral-700',
						'hover:border-ax-neutral-700 hover:text-ax-neutral-900 hover:bg-ax-neutral-200',
					].join(' ')}
					style={{ fontSize: '0.9rem' }}
					onClick={() => onAdd(kode)}
				>
					<PlusIcon aria-hidden className="shrink-0" height="0.875rem" width="0.875rem" />
					{visningsnavn}
				</button>
			))}
		</div>
	);
};

// --- Sortable order-felt for gruppert modus ---

const SortableGruppertOrderField: React.FC<{
	felt: GruppertSorteringsFelt;
	alleSorteringer: GruppertSorteringsFelt[];
	sorteringsAlternativer: { value: string; label: string }[];
	onUpdateFelt: (nodeId: string, felt: string) => void;
	onUpdateRetning: (nodeId: string, økende: boolean) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, alleSorteringer, sorteringsAlternativer, onUpdateFelt, onUpdateRetning, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const valgteFraAndreRader = alleSorteringer.filter((s) => s._nodeId !== felt._nodeId && s.felt).map((s) => s.felt);
	const tilgjengelige = sorteringsAlternativer.filter(
		(alt) => !valgteFraAndreRader.includes(alt.value) || alt.value === felt.felt,
	);

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
				label="Sorter på"
				className="min-w-0 grow"
				size="small"
				value={felt.felt}
				onChange={(e) => onUpdateFelt(felt._nodeId, e.target.value)}
			>
				<option value="">Velg felt</option>
				{tilgjengelige.map((alt) => (
					<option key={alt.value} value={alt.value}>
						{alt.label}
					</option>
				))}
			</Select>
			<Select
				hideLabel
				label="Retning"
				className="shrink-0"
				size="small"
				value={felt.økende.toString()}
				onChange={(e) => onUpdateRetning(felt._nodeId, e.target.value === 'true')}
			>
				<option value="true">Økende</option>
				<option value="false">Synkende</option>
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

// --- Constrained order-felter for oppgaver-modus ---

const SortableOppgaverOrderField: React.FC<{
	felt: WithNodeId<EnkelOrderFelt>;
	allOrder: WithNodeId<OrderFelt>[];
	sorteringsAlternativer: { value: string; label: string }[];
	onUpdateKode: (nodeId: string, kode: string) => void;
	onUpdateRetning: (nodeId: string, økende: boolean) => void;
	onRemove: (nodeId: string) => void;
}> = ({ felt, allOrder, sorteringsAlternativer, onUpdateKode, onUpdateRetning, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: felt._nodeId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const valgteFraAndreRader = allOrder
		.filter((o) => o._nodeId !== felt._nodeId && o.type === 'enkel' && o.kode)
		.map((o) => (o as WithNodeId<EnkelOrderFelt>).kode);
	const tilgjengelige = sorteringsAlternativer.filter(
		(alt) => !valgteFraAndreRader.includes(alt.value) || alt.value === felt.kode,
	);

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
				label="Sorter på"
				className="min-w-0 grow"
				size="small"
				value={felt.kode ?? ''}
				onChange={(e) => onUpdateKode(felt._nodeId, e.target.value)}
			>
				<option value="">Velg felt</option>
				{tilgjengelige.map((alt) => (
					<option key={alt.value} value={alt.value}>
						{alt.label}
					</option>
				))}
			</Select>
			<Select
				hideLabel
				label="Retning"
				className="shrink-0"
				size="small"
				value={felt.økende.toString()}
				onChange={(e) => onUpdateRetning(felt._nodeId, e.target.value === 'true')}
			>
				<option value="true">Økende</option>
				<option value="false">Synkende</option>
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

const OppgaverConstrainedOrderFelter: React.FC = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const valgteKolonner = (oppgaveQuery?.select ?? [])
		.filter((s): s is WithNodeId<EnkelSelectFelt> => s.type === 'enkel' && Boolean(s.kode))
		.map((s) => {
			const oppgavefelt = felter.find((f) => f.kode === s.kode);
			return { kode: s.kode, visningsnavn: oppgavefelt?.visningsnavn ?? s.kode };
		});

	const sorteringsAlternativer = valgteKolonner.map((k) => ({ value: k.kode, label: k.visningsnavn }));

	const orderFields = oppgaveQuery?.order ?? [];

	const handleAddFelt = () => {
		updateQuery([addSortering(null)]);
	};

	const handleUpdateKode = (nodeId: string, kode: string) => {
		const oppgavefelt = felter.find((f) => f.kode === kode);
		if (oppgavefelt) {
			updateQuery([updateSortering(nodeId, { område: oppgavefelt.område, kode: oppgavefelt.kode })]);
		}
	};

	const handleUpdateRetning = (nodeId: string, økende: boolean) => {
		updateQuery([updateSortering(nodeId, { økende })]);
	};

	const handleRemove = (nodeId: string) => {
		updateQuery([removeSortering(nodeId)]);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = orderFields.findIndex((f) => f._nodeId === active.id);
		const newIndex = orderFields.findIndex((f) => f._nodeId === over.id);
		if (oldIndex === -1 || newIndex === -1) return;
		updateQuery([moveSortering(oldIndex, newIndex)]);
	};

	return (
		<VStack gap="space-8">
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={orderFields.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
					{orderFields.map((felt) => (
						<SortableOppgaverOrderField
							key={felt._nodeId}
							felt={felt as WithNodeId<EnkelOrderFelt>}
							allOrder={orderFields}
							sorteringsAlternativer={sorteringsAlternativer}
							onUpdateKode={handleUpdateKode}
							onUpdateRetning={handleUpdateRetning}
							onRemove={handleRemove}
						/>
					))}
				</SortableContext>
			</DndContext>
			{orderFields.length === 0 && (
				<div className="text-ax-neutral-500 italic text-md mt-1 mb-1">Ingen sortering lagt til</div>
			)}
			<Button
				type="button"
				className="self-start -ml-1 px-1"
				icon={<PlusCircleIcon aria-hidden />}
				size="small"
				variant="tertiary"
				onClick={handleAddFelt}
			>
				Legg til sortering
			</Button>
		</VStack>
	);
};

function GruppertKonfig({
	groupByFelter,
	sorteringer,
	oppgaveFelter,
	onAddGroupBy,
	onQuickAddGroupBy,
	onUpdateGroupBy,
	onRemoveGroupBy,
	onMoveGroupBy,
	onAddSortering,
	onUpdateSorteringFelt,
	onUpdateSorteringRetning,
	onRemoveSortering,
	onMoveSortering,
	valideringsfeil,
}: {
	groupByFelter: WithNodeId<EnkelSelectFelt>[];
	sorteringer: GruppertSorteringsFelt[];
	oppgaveFelter: Oppgavefelt[];
	onAddGroupBy: () => void;
	onQuickAddGroupBy: (kode: string) => void;
	onUpdateGroupBy: (nodeId: string, kode: string) => void;
	onRemoveGroupBy: (nodeId: string) => void;
	onMoveGroupBy: (oldIndex: number, newIndex: number) => void;
	onAddSortering: () => void;
	onUpdateSorteringFelt: (nodeId: string, felt: string) => void;
	onUpdateSorteringRetning: (nodeId: string, økende: boolean) => void;
	onRemoveSortering: (nodeId: string) => void;
	onMoveSortering: (oldIndex: number, newIndex: number) => void;
	valideringsfeil: string | null;
}) {
	const groupBySensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const orderSensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const handleGroupByDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = groupByFelter.findIndex((f) => f._nodeId === active.id);
		const newIndex = groupByFelter.findIndex((f) => f._nodeId === over.id);
		if (oldIndex === -1 || newIndex === -1) return;
		onMoveGroupBy(oldIndex, newIndex);
	};

	const handleOrderDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = sorteringer.findIndex((f) => f._nodeId === active.id);
		const newIndex = sorteringer.findIndex((f) => f._nodeId === over.id);
		if (oldIndex === -1 || newIndex === -1) return;
		onMoveSortering(oldIndex, newIndex);
	};

	const valgteGroupByNavn = groupByFelter
		.filter((f) => f.kode)
		.map((f) => {
			const felt = oppgaveFelter.find((of) => of.kode === f.kode);
			return { kode: f.kode, visningsnavn: felt?.visningsnavn ?? f.kode };
		});

	const sorteringsAlternativer = [
		{ value: '__antall__', label: 'Antall' },
		...valgteGroupByNavn.map((f) => ({ value: f.kode, label: f.visningsnavn })),
	];

	return (
		<>
			<QueryBoksStyle ikon={<LayersIcon />} tittel="Grupper etter">
				<VStack gap="space-8">
					<DndContext sensors={groupBySensors} collisionDetection={closestCenter} onDragEnd={handleGroupByDragEnd}>
						<SortableContext items={groupByFelter.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
							{groupByFelter.map((felt) => (
								<SortableGroupByField
									key={felt._nodeId}
									felt={felt}
									alleFelter={groupByFelter}
									oppgaveFelter={oppgaveFelter}
									onUpdate={onUpdateGroupBy}
									onRemove={onRemoveGroupBy}
								/>
							))}
						</SortableContext>
					</DndContext>
					{groupByFelter.length === 0 && (
						<div className="text-ax-neutral-500 italic text-md mt-1 mb-1">Ingen kolonner lagt til</div>
					)}
					<QuickAddGroupBy groupByFelter={groupByFelter} oppgaveFelter={oppgaveFelter} onAdd={onQuickAddGroupBy} />
					<Button
						type="button"
						className="self-start -ml-1 px-1"
						icon={<PlusCircleIcon aria-hidden />}
						size="small"
						variant="tertiary"
						onClick={onAddGroupBy}
					>
						Legg til kolonne
					</Button>
					{valideringsfeil && (
						<Alert variant="error" size="small">
							{valideringsfeil}
						</Alert>
					)}
				</VStack>
			</QueryBoksStyle>

			<QueryBoksStyle ikon={<ArrowsUpDownIcon />} tittel="Sortering">
				<VStack gap="space-8">
					<DndContext sensors={orderSensors} collisionDetection={closestCenter} onDragEnd={handleOrderDragEnd}>
						<SortableContext items={sorteringer.map((f) => f._nodeId)} strategy={verticalListSortingStrategy}>
							{sorteringer.map((felt) => (
								<SortableGruppertOrderField
									key={felt._nodeId}
									felt={felt}
									alleSorteringer={sorteringer}
									sorteringsAlternativer={sorteringsAlternativer}
									onUpdateFelt={onUpdateSorteringFelt}
									onUpdateRetning={onUpdateSorteringRetning}
									onRemove={onRemoveSortering}
								/>
							))}
						</SortableContext>
					</DndContext>
					{sorteringer.length === 0 && (
						<div className="text-ax-neutral-500 italic text-md mt-1 mb-1">Ingen sortering lagt til</div>
					)}
					<Button
						type="button"
						className="self-start -ml-1 px-1"
						icon={<PlusCircleIcon aria-hidden />}
						size="small"
						variant="tertiary"
						onClick={onAddSortering}
					>
						Legg til sortering
					</Button>
				</VStack>
			</QueryBoksStyle>
		</>
	);
}

// --- Hovedkomponent ---

export function OpprettUttrekkDialog({ lagretSøk, antall, onOpprettet }: OpprettUttrekkDialogProps) {
	const { felter } = useContext(AppContext);
	const [open, setOpen] = useState(false);
	const {
		mutate: opprettUttrekk,
		isPending: opprettIsPending,
		isError: opprettIsError,
	} = useOpprettUttrekk(() => {
		setOpen(false);
		onOpprettet();
	});

	const { mutate: endreLagretSøk, isPending: endreIsPending } = useEndreLagretSøk();

	const initialType = useMemo(() => utledType(lagretSøk.query), [lagretSøk.query]);
	const [uttrekkType, setUttrekkType] = useState<UttrekkType>(initialType);

	// --- Gruppert state ---
	const [groupByFelter, setGroupByFelter] = useState<WithNodeId<EnkelSelectFelt>[]>([]);
	const [gruppertSorteringer, setGruppertSorteringer] = useState<GruppertSorteringsFelt[]>([]);
	const [gruppertValideringsfeil, setGruppertValideringsfeil] = useState<string | null>(null);

	// --- Oppgaver state (via react-hook-form) ---
	const uttrekketErForStort = antall !== undefined && antall > maksAntallForUttrekk;
	const [visAvgrensningsinnstillinger, setVisAvgrensningsinnstillinger] = useState(false);

	const {
		handleSubmit,
		reset,
		register,
		getValues,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<{ query: IdentifiedOppgaveQuery; limit?: number | null; offset?: number | null }>({
		defaultValues: {
			query: new OppgaveQueryModel(lagretSøk.query).toIdentifiedQuery(),
			limit: null,
			offset: null,
		},
	});

	const updateQuery = (operations: Array<QueryFunction>) => {
		setValue('query', applyFunctions(getValues('query'), operations));
		clearErrors('query');
	};

	const isPending = opprettIsPending || endreIsPending;

	// --- Initialisering ved åpning ---
	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			const type = utledType(lagretSøk.query);
			setUttrekkType(type);
			setGruppertValideringsfeil(null);

			if (type === 'gruppert') {
				// Hent ut enkel-felter som group-by
				const enkelFelter = lagretSøk.query.select
					.filter((s): s is EnkelSelectFelt => s.type === 'enkel')
					.map((s) => tilIdentified(s));
				setGroupByFelter(enkelFelter);

				// Hent ut sorteringer (støtter flere)
				if (lagretSøk.query.order.length > 0) {
					setGruppertSorteringer(
						lagretSøk.query.order.map((order) => ({
							felt: order.type === 'aggregert' ? '__antall__' : order.kode,
							økende: order.økende,
							_nodeId: crypto.randomUUID(),
						})),
					);
				} else {
					setGruppertSorteringer([{ felt: '__antall__', økende: false, _nodeId: crypto.randomUUID() }]);
				}
			} else {
				setGroupByFelter([]);
				setGruppertSorteringer([]);
			}

			// For oppgaver-modus: reset form med lagret søks data, men kun enkel-felter
			const queryForOppgaver = {
				...lagretSøk.query,
				select: lagretSøk.query.select.filter((s) => s.type === 'enkel'),
				order: lagretSøk.query.order.filter((o) => o.type === 'enkel'),
			};
			reset({
				query: new OppgaveQueryModel(type === 'oppgaver' ? queryForOppgaver : lagretSøk.query).toIdentifiedQuery(),
				limit: null,
				offset: null,
			});
			setVisAvgrensningsinnstillinger(uttrekketErForStort);
		}
		setOpen(newOpen);
	};

	// --- Type-bytte: nullstill konfigurasjon ---
	const handleTypeChange = (newType: UttrekkType) => {
		setUttrekkType(newType);
		setGruppertValideringsfeil(null);

		if (newType === 'gruppert') {
			setGroupByFelter([]);
			setGruppertSorteringer([{ felt: '__antall__', økende: false, _nodeId: crypto.randomUUID() }]);
		}

		if (newType === 'oppgaver') {
			reset({
				query: new OppgaveQueryModel({ ...lagretSøk.query, select: [], order: [] }).toIdentifiedQuery(),
				limit: null,
				offset: null,
			});
			setVisAvgrensningsinnstillinger(uttrekketErForStort);
		}
	};

	// --- Group-by handlers ---
	const handleAddGroupBy = () => {
		setGroupByFelter((prev) => [...prev, tilIdentified<EnkelSelectFelt>({ type: 'enkel', område: null, kode: null })]);
		setGruppertValideringsfeil(null);
	};

	const handleQuickAddGroupBy = (kode: string) => {
		const oppgavefelt = felter.find((f) => f.kode === kode);
		if (!oppgavefelt) return;
		setGroupByFelter((prev) => [
			...prev,
			tilIdentified<EnkelSelectFelt>({ type: 'enkel', område: oppgavefelt.område, kode: oppgavefelt.kode }),
		]);
		setGruppertValideringsfeil(null);
	};

	const handleUpdateGroupBy = (nodeId: string, kode: string) => {
		const oppgavefelt = felter.find((f) => f.kode === kode);
		if (!oppgavefelt) return;
		setGroupByFelter((prev) =>
			prev.map((f) => (f._nodeId === nodeId ? { ...f, kode: oppgavefelt.kode, område: oppgavefelt.område } : f)),
		);
		setGruppertValideringsfeil(null);
	};

	const handleRemoveGroupBy = (nodeId: string) => {
		setGroupByFelter((prev) => prev.filter((f) => f._nodeId !== nodeId));
	};

	const handleMoveGroupBy = (oldIndex: number, newIndex: number) => {
		setGroupByFelter((prev) => {
			const copy = [...prev];
			const [moved] = copy.splice(oldIndex, 1);
			copy.splice(newIndex, 0, moved);
			return copy;
		});
	};

	// --- Gruppert sortering handlers ---
	const handleAddGruppertSortering = () => {
		setGruppertSorteringer((prev) => [...prev, { felt: '', økende: true, _nodeId: crypto.randomUUID() }]);
	};

	const handleUpdateGruppertSorteringFelt = (nodeId: string, felt: string) => {
		setGruppertSorteringer((prev) => prev.map((s) => (s._nodeId === nodeId ? { ...s, felt } : s)));
	};

	const handleUpdateGruppertSorteringRetning = (nodeId: string, økende: boolean) => {
		setGruppertSorteringer((prev) => prev.map((s) => (s._nodeId === nodeId ? { ...s, økende } : s)));
	};

	const handleRemoveGruppertSortering = (nodeId: string) => {
		setGruppertSorteringer((prev) => prev.filter((s) => s._nodeId !== nodeId));
	};

	const handleMoveGruppertSortering = (oldIndex: number, newIndex: number) => {
		setGruppertSorteringer((prev) => {
			const copy = [...prev];
			const [moved] = copy.splice(oldIndex, 1);
			copy.splice(newIndex, 0, moved);
			return copy;
		});
	};

	// --- Submit ---
	const doSubmit = (formData?: { query: IdentifiedOppgaveQuery; limit?: number; offset?: number }) => {
		if (uttrekkType === 'antall') {
			// Bygg query: kun aggregert ANTALL
			const query: OppgaveQuery = {
				filtere: lagretSøk.query.filtere,
				select: [{ type: 'aggregert', funksjon: AggregertFunksjon.ANTALL }],
				order: [],
			};

			const selectEndret = !_.isEqual(query.select, lagretSøk.query.select);
			const orderEndret = !_.isEqual(query.order, lagretSøk.query.order);

			const doOpprett = () => {
				opprettUttrekk({ lagretSokId: lagretSøk.id });
			};

			if (selectEndret || orderEndret) {
				endreLagretSøk(
					{
						id: lagretSøk.id,
						tittel: lagretSøk.tittel,
						beskrivelse: lagretSøk.beskrivelse,
						query,
						versjon: lagretSøk.versjon,
					},
					{ onSuccess: doOpprett },
				);
			} else {
				doOpprett();
			}
		} else if (uttrekkType === 'gruppert') {
			// Validering
			const gyldigeGroupBy = groupByFelter.filter((f) => f.kode);
			if (gyldigeGroupBy.length === 0) {
				setGruppertValideringsfeil('Du må legge til minst ett felt å gruppere etter');
				return;
			}

			// Bygg select: enkel-felter (group-by) + aggregert ANTALL
			const selectFelter: SelectFelt[] = [
				...gyldigeGroupBy.map((f) => ({ type: 'enkel' as const, område: f.område, kode: f.kode })),
				{ type: 'aggregert' as const, funksjon: AggregertFunksjon.ANTALL },
			];

			// Bygg order fra alle gyldige sorteringer
			const orderFelter: OppgaveQuery['order'] = [];
			for (const sortering of gruppertSorteringer) {
				if (!sortering.felt) continue;
				if (sortering.felt === '__antall__') {
					orderFelter.push({
						type: 'aggregert',
						funksjon: AggregertFunksjon.ANTALL,
						økende: sortering.økende,
					});
				} else {
					const oppgavefelt = felter.find((f) => f.kode === sortering.felt);
					if (oppgavefelt) {
						orderFelter.push({
							type: 'enkel',
							område: oppgavefelt.område,
							kode: oppgavefelt.kode,
							økende: sortering.økende,
						});
					}
				}
			}

			const query: OppgaveQuery = {
				filtere: lagretSøk.query.filtere,
				select: selectFelter,
				order: orderFelter,
			};

			const selectEndret = !_.isEqual(query.select, lagretSøk.query.select);
			const orderEndret = !_.isEqual(query.order, lagretSøk.query.order);

			const doOpprett = () => {
				opprettUttrekk({ lagretSokId: lagretSøk.id });
			};

			if (selectEndret || orderEndret) {
				endreLagretSøk(
					{
						id: lagretSøk.id,
						tittel: lagretSøk.tittel,
						beskrivelse: lagretSøk.beskrivelse,
						query,
						versjon: lagretSøk.versjon,
					},
					{ onSuccess: doOpprett },
				);
			} else {
				doOpprett();
			}
		} else {
			// oppgaver
			if (!formData) return;
			const query = fjernNodeIdFraQuery(formData.query);
			const select = query.select.filter((s) => s.type === 'enkel' && Boolean(s.kode));
			const order = query.order.filter((o) => o.type === 'enkel' && Boolean(o.kode));

			if (select.length === 0) {
				setError('query', { type: 'custom', message: 'Uttrekket må ha minst en kolonne' });
				return;
			}

			const selectEndret = !_.isEqual(select, lagretSøk.query.select);
			const orderEndret = !_.isEqual(order, lagretSøk.query.order);

			const doOpprett = () => {
				opprettUttrekk({
					lagretSokId: lagretSøk.id,
					limit: formData.limit,
					offset: formData.offset,
				});
			};

			if (selectEndret || orderEndret) {
				endreLagretSøk(
					{
						id: lagretSøk.id,
						tittel: lagretSøk.tittel,
						beskrivelse: lagretSøk.beskrivelse,
						query: {
							...lagretSøk.query,
							select,
							order,
						},
						versjon: lagretSøk.versjon,
					},
					{ onSuccess: doOpprett },
				);
			} else {
				doOpprett();
			}
		}
	};

	const onSubmit = (data: { query: IdentifiedOppgaveQuery; limit?: number; offset?: number }) => {
		doSubmit(data);
	};

	// For 'antall' og 'gruppert' har vi ingen react-hook-form-felter å validere – kall doSubmit direkte.
	// For 'oppgaver' delegerer vi til react-hook-form, som validerer og kaller onSubmit.
	const handleFormSubmit = (e: React.FormEvent) => {
		if (uttrekkType === 'oppgaver') {
			handleSubmit(onSubmit)(e);
			return;
		}
		e.preventDefault();
		doSubmit();
	};

	const filterContextValues: FilterContextType = {
		oppgaveQuery: getValues('query'),
		updateQuery,
		errors: [],
	};

	const visAvgrensning = visAvgrensningsinnstillinger || uttrekketErForStort;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger>
				<Button icon={<TableIcon />} variant="secondary" size="small">
					Gjør uttrekk
				</Button>
			</Dialog.Trigger>
			<Dialog.Popup width="large" position="right">
				<Dialog.Header>
					<Dialog.Title>
						Gjør uttrekk for {lagretSøk.tittel.length > 0 ? <>&#34;{lagretSøk.tittel}&#34;</> : 'lagret søk'}
					</Dialog.Title>
				</Dialog.Header>
				<form className="flex flex-col overflow-hidden min-h-0 flex-1" onSubmit={handleFormSubmit}>
					<Dialog.Body>
						<BodyShort className="mb-4">
							Søket matcher <strong>{antall?.toLocaleString('nb-NO')}</strong> oppgaver.
						</BodyShort>

						<RadioGroup
							legend="Type uttrekk"
							value={uttrekkType}
							size="small"
							onChange={(val: UttrekkType) => handleTypeChange(val)}
							className="mb-4"
						>
							<Radio value="antall" description="Teller opp og gir ett enkelt tall som resultat.">
								Antall
							</Radio>
							<Radio
								value="gruppert"
								description="Teller antall per gruppe av ett eller flere felter. Eksempel: «Antall per ytelsestype»"
							>
								Gruppert
							</Radio>
							<Radio
								value="oppgaver"
								description="Henter ut oppgavene som enkeltrader med valgfrie kolonner. Eksempel: «Saksnummer, ytelsestype, status»"
							>
								Oppgaver
							</Radio>
						</RadioGroup>

						{/* Gruppert-modus */}
						{uttrekkType === 'gruppert' && (
							<GruppertKonfig
								groupByFelter={groupByFelter}
								sorteringer={gruppertSorteringer}
								oppgaveFelter={felter}
								onAddGroupBy={handleAddGroupBy}
								onQuickAddGroupBy={handleQuickAddGroupBy}
								onUpdateGroupBy={handleUpdateGroupBy}
								onRemoveGroupBy={handleRemoveGroupBy}
								onMoveGroupBy={handleMoveGroupBy}
								onAddSortering={handleAddGruppertSortering}
								onUpdateSorteringFelt={handleUpdateGruppertSorteringFelt}
								onUpdateSorteringRetning={handleUpdateGruppertSorteringRetning}
								onRemoveSortering={handleRemoveGruppertSortering}
								onMoveSortering={handleMoveGruppertSortering}
								valideringsfeil={gruppertValideringsfeil}
							/>
						)}

						{/* Oppgaver-modus */}
						{uttrekkType === 'oppgaver' && (
							<>
								<FilterContext.Provider value={filterContextValues}>
									<QueryBoksStyle ikon={<TableIcon />} tittel="Kolonner">
										<OppgaveSelectFelter />
									</QueryBoksStyle>

									<QueryBoksStyle ikon={<ArrowsUpDownIcon />} tittel="Sortering">
										<OppgaverConstrainedOrderFelter />
									</QueryBoksStyle>
								</FilterContext.Provider>

								<div className="mb-2">
									{uttrekketErForStort && (
										<Alert variant="warning" className="mb-4">
											Uttrekket er for stort, maksimalt antall er {maksAntallForUttrekk.toLocaleString('nb-NO')}. Du kan
											enten endre kriterier for å snevre inn søket, fylle ut et maksimalt antall, eller hoppe over et
											antall rader.
											<ReadMore header="For å hente ut alle rader">{alleOppgaverTekst(antall)}</ReadMore>
										</Alert>
									)}

									{!visAvgrensning ? (
										<div className="rounded-md bg-ax-neutral-200 p-2">
											<Detail>For å begrense antall resultater kan det legges til en avgrensning.</Detail>
											<Button
												className="mt-1 p-0"
												variant="tertiary"
												size="xsmall"
												type="button"
												onClick={() => setVisAvgrensningsinnstillinger(true)}
											>
												Legg til avgrensning
											</Button>
										</div>
									) : (
										<div className="rounded-md bg-ax-neutral-200 p-2">
											{!uttrekketErForStort && (
												<div className="float-right">
													<Button
														data-color="neutral"
														icon={<XMarkIcon />}
														variant="tertiary"
														size="small"
														title="Tilbakestill avgrensning"
														onClick={() => {
															setVisAvgrensningsinnstillinger(false);
															setValue('limit', null);
															setValue('offset', null);
														}}
													/>
												</div>
											)}
											<div className="flex gap-4 items-start">
												<div className="w-1/2">
													<TextField
														{...register('limit', {
															min: {
																value: 1,
																message: 'Maksimalt antall rader må være minst 1',
															},
															max: {
																value: maksAntallForUttrekk,
																message:
																	`Maksimalt antall rader kan ikke være større enn ` +
																	`${maksAntallForUttrekk.toLocaleString('nb-NO')}`,
															},
															valueAsNumber: true,
															...(uttrekketErForStort && {
																required: 'Avgrensning er påkrevd for store uttrekk',
															}),
														})}
														size="small"
														error={errors.limit?.message}
														label="Maksimalt antall rader"
														type="number"
													/>
												</div>
												<div className="w-1/2">
													<TextField
														{...register('offset', {
															min: {
																value: 0,
																message: 'Antall rader som skal hoppes over må være minst 0',
															},
															valueAsNumber: true,
														})}
														size="small"
														error={errors.offset?.message}
														label="Antall rader som skal hoppes over"
														type="number"
													/>
												</div>
											</div>
										</div>
									)}
								</div>
							</>
						)}

						{opprettIsError && (
							<Alert variant="error" className="mt-4">
								Noe gikk galt ved opprettelse av uttrekk. Prøv igjen senere.
							</Alert>
						)}
						{errors.query && <Alert variant="error">{errors.query.message}</Alert>}
					</Dialog.Body>
					<Dialog.Footer>
						<Button type="submit" disabled={isPending} loading={isPending}>
							Gjør uttrekk
						</Button>
						<Dialog.CloseTrigger>
							<Button variant="secondary" type="button" disabled={isPending}>
								Avbryt
							</Button>
						</Dialog.CloseTrigger>
					</Dialog.Footer>
				</form>
			</Dialog.Popup>
		</Dialog>
	);
}
