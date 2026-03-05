import React, { useContext, useMemo, useState } from 'react';
import { Watch, useForm } from 'react-hook-form';
import _ from 'lodash';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Detail, Heading, Label, Modal, TextField } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, TypeKjøring, useEndreLagretSøk, useOpprettUttrekk } from 'api/queries/avdelingslederQueries';
import { FilterContext, FilterContextType } from 'filter/FilterContext';
import OppgaveQueryModel from 'filter/OppgaveQueryModel';
import { IdentifiedOppgaveQuery, fjernNodeIdFraQuery } from 'filter/filterFrontendTypes';
import { EnkelOrderFelt, EnkelSelectFelt } from 'filter/filterTsTypes';
import OppgaveSelectFelter from 'filter/parts/OppgaveSelectFelter';
import { QueryFunction, applyFunctions } from 'filter/queryUtils';
import OppgaveOrderFelter from 'filter/sortering/OppgaveOrderFelter';

interface OpprettUttrekkModalProps {
	lagretSøk: LagretSøk;
	open: boolean;
	closeModal: () => void;
}

export function OpprettUttrekkModal({ lagretSøk, open, closeModal }: OpprettUttrekkModalProps) {
	const {
		mutate: opprettUttrekk,
		isPending: opprettIsPending,
		isError: opprettIsError,
	} = useOpprettUttrekk(() => {
		closeModal();
	});

	const { felter } = useContext(AppContext);

	const { mutate: endreLagretSøk, isPending: endreIsPending } = useEndreLagretSøk();

	const [visAvgrensningsinnstillinger, setVisAvgrensningsinnstillinger] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		register,
		getValues,
		setValue,
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
	};

	const isPending = opprettIsPending || endreIsPending;

	const onSubmit = (data: { query: IdentifiedOppgaveQuery; limit?: number | null; offset?: number | null }) => {
		const query = fjernNodeIdFraQuery(data.query);
		const selectEndret = !_.isEqual(query.select, lagretSøk.query.select);
		const orderEndret = !_.isEqual(query.order, lagretSøk.query.order);

		const doOpprettUttrekk = () => {
			opprettUttrekk({
				lagretSokId: lagretSøk.id,
				typeKjoring: TypeKjøring.OPPGAVER,
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
					query,
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
		closeModal();
	};

	const filterContextValues: FilterContextType = {
		oppgaveQuery: getValues('query'),
		updateQuery,
		errors: [],
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
							<Watch
								control={control}
								name="query"
								render={(query) =>
									query.select.length === 0 ? (
										<BodyShort size="small" className="text-ax-neutral-600 mt-1">
											Ingen felter valgt. Uttrekket vil kun inneholde antall oppgaver.
										</BodyShort>
									) : null
								}
							/>
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
