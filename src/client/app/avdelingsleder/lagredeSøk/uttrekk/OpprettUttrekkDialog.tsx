import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { ArrowsUpDownIcon, TableIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Detail, Dialog, TextField } from '@navikt/ds-react';
import { LagretSøk, TypeKjøring, useEndreLagretSøk, useOpprettUttrekk } from 'api/queries/avdelingslederQueries';
import { FilterContext, FilterContextType } from 'filter/FilterContext';
import OppgaveQueryModel from 'filter/OppgaveQueryModel';
import { IdentifiedOppgaveQuery, fjernNodeIdFraQuery } from 'filter/filterFrontendTypes';
import OppgaveSelectFelter from 'filter/parts/OppgaveSelectFelter';
import { QueryFunction, applyFunctions } from 'filter/queryUtils';
import OppgaveOrderFelter from 'filter/sortering/OppgaveOrderFelter';
import { QueryBoksStyle } from '../QueryBoksStyle';

interface OpprettUttrekkDialogProps {
	lagretSøk: LagretSøk;
	antall: number | undefined;
	onOpprettet: () => void;
}

export function OpprettUttrekkDialog({ lagretSøk, antall, onOpprettet }: OpprettUttrekkDialogProps) {
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

	const erStortUttrekk = antall !== undefined && antall > 10000;
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

	const onSubmit = (data: { query: IdentifiedOppgaveQuery; limit?: number; offset?: number }) => {
		const query = fjernNodeIdFraQuery(data.query);
		const select = query.select.filter((s) => Boolean(s.kode));
		const order = query.order.filter((o) => Boolean(o.kode));

		if (select.length === 0) {
			setError('query', { type: 'custom', message: 'Uttrekket må ha minst én kolonne' });
			return;
		}

		const selectEndret = !_.isEqual(select, lagretSøk.query.select);
		const orderEndret = !_.isEqual(order, lagretSøk.query.order);

		const doOpprettUttrekk = () => {
			opprettUttrekk({
				lagretSokId: lagretSøk.id,
				typeKjoring: TypeKjøring.OPPGAVER,
				limit: data.limit,
				offset: data.offset,
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
				{ onSuccess: doOpprettUttrekk },
			);
		} else {
			doOpprettUttrekk();
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			reset({
				query: new OppgaveQueryModel(lagretSøk.query).toIdentifiedQuery(),
				limit: null,
				offset: null,
			});
			setVisAvgrensningsinnstillinger(erStortUttrekk);
		}
		setOpen(newOpen);
	};

	const filterContextValues: FilterContextType = {
		oppgaveQuery: getValues('query'),
		updateQuery,
		errors: [],
	};

	const visAvgrensning = visAvgrensningsinnstillinger || erStortUttrekk;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger>
				<Button icon={<TableIcon />} variant="secondary" size="small">
					Gjør oppgaveuttrekk
				</Button>
			</Dialog.Trigger>
			<Dialog.Popup width="large">
				<Dialog.Header>
					<Dialog.Title>
						Gjør uttrekk for {lagretSøk.tittel.length > 0 ? <>&#34;{lagretSøk.tittel}&#34;</> : 'lagret søk'}
					</Dialog.Title>
				</Dialog.Header>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Dialog.Body>
						<BodyShort className="mb-6">
							Uttrekket vil gjøres på <strong>{antall?.toLocaleString('nb-NO')}</strong> oppgaver. Velg minst én kolonne
							som skal være med i resultatet. Sortering er valgfritt.
						</BodyShort>

						<FilterContext.Provider value={filterContextValues}>
							<QueryBoksStyle ikon={<TableIcon />} tittel="Kolonner">
								<OppgaveSelectFelter />
							</QueryBoksStyle>

							<QueryBoksStyle ikon={<ArrowsUpDownIcon />} tittel="Sortering">
								<OppgaveOrderFelter />
							</QueryBoksStyle>
						</FilterContext.Provider>

						<div className="mb-2">
							{erStortUttrekk && (
								<Alert variant="warning" className="mb-4">
									Dette er et stort uttrekk ({antall?.toLocaleString('nb-NO')} oppgaver). Avgrensning er påkrevd.
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
									{!erStortUttrekk && (
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
														value: 50000,
														message: 'Avgrensning kan ikke være større enn 50 000',
													},
													valueAsNumber: true,
													...(erStortUttrekk && {
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
