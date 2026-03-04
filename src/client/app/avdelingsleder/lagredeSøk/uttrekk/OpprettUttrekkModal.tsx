import React, { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Detail, Heading, Label, Modal, TextField } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, TypeKjøring, useEndreLagretSøk, useOpprettUttrekk } from 'api/queries/avdelingslederQueries';
import { FilterContext, FilterContextType } from 'filter/FilterContext';
import OppgaveQueryModel from 'filter/OppgaveQueryModel';
import { fjernNodeIdFraQuery, IdentifiedOppgaveQuery } from 'filter/filterFrontendTypes';
import OppgaveSelectFelter from 'filter/parts/OppgaveSelectFelter';
import { applyFunctions, QueryFunction } from 'filter/queryUtils';
import OppgaveOrderFelter from 'filter/sortering/OppgaveOrderFelter';

interface OpprettUttrekkModalProps {
	lagretSøk: LagretSøk;
	open: boolean;
	closeModal: () => void;
}

export function OpprettUttrekkModal({ lagretSøk, open, closeModal }: OpprettUttrekkModalProps) {
	const { mutate: opprettUttrekk, isPending: opprettIsPending, isError: opprettIsError } = useOpprettUttrekk(() => {
		closeModal();
	});

	const { mutate: endreLagretSøk, isPending: endreIsPending } = useEndreLagretSøk();

	const [visAvgrensningsinnstillinger, setVisAvgrensningsinnstillinger] = useState(false);

	const [oppgaveQuery, setOppgaveQuery] = useState<IdentifiedOppgaveQuery>(() =>
		new OppgaveQueryModel(lagretSøk.query).toIdentifiedQuery(),
	);

	// Resynk lokal state når modalen åpnes med ny lagretSøk
	const [prevLagretSøkVersjon, setPrevLagretSøkVersjon] = useState(lagretSøk.versjon);
	if (lagretSøk.versjon !== prevLagretSøkVersjon) {
		setPrevLagretSøkVersjon(lagretSøk.versjon);
		setOppgaveQuery(new OppgaveQueryModel(lagretSøk.query).toIdentifiedQuery());
	}

	const updateQuery = (operations: Array<QueryFunction>) => {
		setOppgaveQuery((prev) => applyFunctions(prev, operations));
	};

	const filterContextValues: FilterContextType = useMemo(
		() => ({
			oppgaveQuery,
			updateQuery,
			errors: [],
		}),
		[oppgaveQuery],
	);

	const localQuery = fjernNodeIdFraQuery(oppgaveQuery);
	const typeKjoring = localQuery.select.length > 0 ? TypeKjøring.OPPGAVER : TypeKjøring.ANTALL;

	const {
		handleSubmit,
		reset,
		register,
		formState: { errors },
	} = useForm<{ limit?: number | null; offset?: number | null }>({
		defaultValues: {
			limit: null,
			offset: null,
		},
	});

	const isPending = opprettIsPending || endreIsPending;

	const onSubmit = (data: { limit?: number | null; offset?: number | null }) => {
		const selectEndret = !_.isEqual(localQuery.select, lagretSøk.query.select);
		const orderEndret = !_.isEqual(localQuery.order, lagretSøk.query.order);

		const doOpprettUttrekk = () => {
			opprettUttrekk({
				lagretSokId: lagretSøk.id,
				typeKjoring,
				limit: data.limit || null,
				offset: data.offset || null,
			});
		};

		if (selectEndret || orderEndret) {
			endreLagretSøk(
				{
					id: lagretSøk.id,
					tittel: lagretSøk.tittel,
					beskrivelse: lagretSøk.beskrivelse,
					query: { ...lagretSøk.query, select: localQuery.select, order: localQuery.order },
					versjon: lagretSøk.versjon,
				},
				{ onSuccess: doOpprettUttrekk },
			);
		} else {
			doOpprettUttrekk();
		}
	};

	const handleClose = () => {
		reset();
		setVisAvgrensningsinnstillinger(false);
		setOppgaveQuery(new OppgaveQueryModel(lagretSøk.query).toIdentifiedQuery());
		closeModal();
	};

	return (
		<Modal open={open} onClose={handleClose} width="medium" aria-label="Opprett uttrekk">
			<Modal.Header>
				<Heading level="1" size="medium">
					Opprett uttrekk for {lagretSøk.tittel.length > 0 ? <>&#34;{lagretSøk.tittel}&#34;</> : 'lagret søk'}
				</Heading>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					<FilterContext.Provider value={filterContextValues}>
						<div className="mb-6">
							<Label spacing>Felter som vises i søkeresultat</Label>
							<OppgaveSelectFelter />
							{localQuery.select.length === 0 && (
								<BodyShort size="small" className="text-ax-neutral-600 mt-1">
									Ingen felter valgt. Uttrekket vil kun inneholde antall oppgaver.
								</BodyShort>
							)}
						</div>

						<div className="mb-6">
							<Label spacing>Sortering</Label>
							<OppgaveOrderFelter />
						</div>
					</FilterContext.Provider>

					<div>
						{!visAvgrensningsinnstillinger ? (
							<div className="rounded-md bg-ax-neutral-200 p-2">
								<Detail>For å begrense antall resultater kan det legges til en avgrensning.</Detail>
								<Button
									className="mt-1 p-0"
									variant="tertiary"
									size="xsmall"
									type="button"
									onClick={() => {
										setVisAvgrensningsinnstillinger(true);
									}}
								>
									Legg til avgrensning
								</Button>
							</div>
						) : (
							<div className="rounded-md bg-ax-neutral-200 p-2">
								<div className="float-right">
									<Button
										data-color="neutral"
										icon={<XMarkIcon />}
										variant="tertiary"
										size="small"
										title="Tilbakestill avgrensning"
										onClick={() => {
											setVisAvgrensningsinnstillinger(false);
											reset({ limit: null, offset: null });
										}}
									/>
								</div>
								<div className="flex gap-4">
									<TextField
										{...register('limit', {
											min: { value: 1, message: 'Maksimalt antall rader må være minst 1' },
											valueAsNumber: true,
										})}
										error={errors.limit?.message}
										label="Maksimalt antall rader som skal hentes"
										type="number"
									/>
									<TextField
										{...register('offset', {
											min: { value: 0, message: 'Antall rader som skal hoppes over må være minst 0' },
											valueAsNumber: true,
										})}
										error={errors.offset?.message}
										label="Antall rader som skal hoppes over"
										type="number"
									/>
								</div>
							</div>
						)}
					</div>

					{opprettIsError && (
						<Alert variant="error" className="mt-4">
							Noe gikk galt ved opprettelse av uttrekk. Prøv igjen senere.
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" disabled={isPending} loading={isPending}>
						Opprett uttrekk
					</Button>
					<Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
						Avbryt
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
}
