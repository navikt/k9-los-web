import React, { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Detail, Heading, List, Modal, TextField } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, TypeKjøring, useOpprettUttrekk } from 'api/queries/avdelingslederQueries';

interface OpprettUttrekkModalProps {
	lagretSøk: LagretSøk;
	open: boolean;
	closeModal: () => void;
}

export function OpprettUttrekkModal({ lagretSøk, open, closeModal }: OpprettUttrekkModalProps) {
	const { mutate, isPending, isError } = useOpprettUttrekk(() => {
		closeModal();
	});

	const [visAvgrensningsinnstillinger, setVisAvgrensningsinnstillinger] = useState(false);

	const feltdefinisjoner = useContext(AppContext).felter;

	// Bestem type basert på om det finnes select-felter
	const typeKjoring = lagretSøk.query.select.length > 0 ? TypeKjøring.OPPGAVER : TypeKjøring.ANTALL;

	// Hent visningsnavn for select-feltene
	const selectFelterMedNavn = useMemo(
		() =>
			lagretSøk.query.select.map((selectFelt) => {
				const feltdef = feltdefinisjoner.find((f) => f.område === selectFelt.område && f.kode === selectFelt.kode);
				return {
					...selectFelt,
					visningsnavn: feltdef?.visningsnavn || `${selectFelt.område}.${selectFelt.kode}`,
				};
			}),
		[lagretSøk.query.select, feltdefinisjoner],
	);

	// Hent visningsnavn for order-feltene
	const orderFelterMedNavn = useMemo(
		() =>
			lagretSøk.query.order.map((orderFelt) => {
				const feltdef = feltdefinisjoner.find((f) => f.område === orderFelt.område && f.kode === orderFelt.kode);
				return {
					...orderFelt,
					visningsnavn: feltdef?.visningsnavn || `${orderFelt.område}.${orderFelt.kode}`,
				};
			}),
		[lagretSøk.query.order, feltdefinisjoner],
	);

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

	const onSubmit = (data: { limit?: number | null; offset?: number | null }) => {
		mutate({
			lagretSokId: lagretSøk.id,
			typeKjoring,
			limit: data.limit || null,
			offset: data.offset || null,
		});
	};

	const handleClose = () => {
		reset();
		setVisAvgrensningsinnstillinger(false);
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
					{lagretSøk.query.select.length > 0 ? (
						<>
							<BodyShort>Uttrekket vil inneholde følgende felter:</BodyShort>
							<List size="small">
								{selectFelterMedNavn.map((felt) => (
									<List.Item key={felt.id}>{felt.visningsnavn}</List.Item>
								))}
							</List>

							{orderFelterMedNavn.length > 0 && (
								<>
									<BodyShort className="mt-5">Uttrekket vil sorteres etter:</BodyShort>
									<List size="small">
										{orderFelterMedNavn.map((felt) => (
											<List.Item key={felt.id}>
												{felt.visningsnavn} ({felt.økende ? 'stigende' : 'synkende'})
											</List.Item>
										))}
									</List>
								</>
							)}
						</>
					) : (
						<Alert variant="warning">
							Ingen felter er valgt for uttrekk. Uttrekket vil kun inneholde antall oppgaver som matcher søket. Du kan
							legge til felter ved å klikke på &#34;Endre&#34; under &#34;Felter&#34;.
						</Alert>
					)}

					<div className="mt-5">
						{!visAvgrensningsinnstillinger ? (
							<div className="rounded-md bg-gray-100 p-2">
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
							<div className="rounded-md bg-gray-100 p-2">
								<div className="float-right">
									<Button
										icon={<XMarkIcon />}
										variant="tertiary-neutral"
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

					{isError && (
						<Alert variant="error" className="mt-4">
							Noe gikk galt ved opprettelse av uttrekk. Prøv igjen senere.
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" disabled={isPending}>
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
