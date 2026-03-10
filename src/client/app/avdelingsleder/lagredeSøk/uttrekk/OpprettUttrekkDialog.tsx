import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { ArrowsUpDownIcon, TableIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Detail, Dialog, HelpText, ReadMore, TextField } from '@navikt/ds-react';
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

const maksAntallForUttrekk = 20000;
const hoppOverLabel = 'Antall rader som skal hoppes over';

function alleOppgaverTekst(antall: number) {
	const antallOmganger = Math.ceil(antall / maksAntallForUttrekk);
	const offsets = Array.from({ length: antallOmganger }, (_, i) => i * maksAntallForUttrekk);

	let formattedOffsets: string;
	if (offsets.length > 4) {
		formattedOffsets = `${offsets.slice(0, 4).join(', ')}, osv`;
	} else {
		formattedOffsets = [...offsets.slice(0, -2).map(String), offsets.slice(-2).join(' og ')].join(', ');
	}

	return `For å hente ut ${antall.toLocaleString('nb-NO')} oppgaver kan det gjøres uttrekk i ${antallOmganger} omganger. Sett da maksimalt antall ${maksAntallForUttrekk}, og hopp over henholdsvis ${formattedOffsets}.`;
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
			setVisAvgrensningsinnstillinger(uttrekketErForStort);
		}
		setOpen(newOpen);
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
							{uttrekketErForStort && (
								<Alert variant="warning" className="mb-4">
									Uttrekket er for stort, maksimalt antall er {maksAntallForUttrekk.toLocaleString('nb-NO')}. Du kan
									enten endre kriterier for å snevre inn søket, fylle ut et maksimalt antall, eller hoppe over et antall
									rader.
									<ReadMore header={`For å hente ut alle oppgaver`}>{alleOppgaverTekst(antall)}</ReadMore>
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
														message: `Maksimalt antall rader kan ikke være større enn ${maksAntallForUttrekk.toLocaleString('nb-NO')}`,
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
												label={hoppOverLabel}
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
