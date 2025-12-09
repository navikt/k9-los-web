import React, { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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

	const [visTimeoutInnstillinger, setVisTimeoutInnstillinger] = useState(false);

	const feltdefinisjoner = useContext(AppContext).felter;

	// Automatisk bestem type basert på om det finnes select-felter
	const harSelectFelter = lagretSøk.query.select.length > 0;
	const typeKjoring = harSelectFelter ? TypeKjøring.OPPGAVER : TypeKjøring.ANTALL;

	// Hent visningsnavn for select-feltene
	const selectFelterMedNavn = useMemo(() => {
		return lagretSøk.query.select.map((selectFelt) => {
			const feltdef = feltdefinisjoner.find((f) => f.område === selectFelt.område && f.kode === selectFelt.kode);
			return {
				...selectFelt,
				visningsnavn: feltdef?.visningsnavn || `${selectFelt.område}.${selectFelt.kode}`,
			};
		});
	}, [lagretSøk.query.select, feltdefinisjoner]);

	// Hent visningsnavn for order-feltene
	const orderFelterMedNavn = useMemo(() => {
		return lagretSøk.query.order.map((orderFelt) => {
			const feltdef = feltdefinisjoner.find((f) => f.område === orderFelt.område && f.kode === orderFelt.kode);
			return {
				...orderFelt,
				visningsnavn: feltdef?.visningsnavn || `${orderFelt.område}.${orderFelt.kode}`,
			};
		});
	}, [lagretSøk.query.order, feltdefinisjoner]);

	const defaultTimeout = 30;
	const {
		handleSubmit,
		reset,
		register,
		formState: { errors },
	} = useForm({
		defaultValues: {
			timeout: defaultTimeout,
		},
	});

	const onSubmit = (data: { timeout: number }) => {
		mutate({
			lagretSokId: lagretSøk.id,
			timeout: data.timeout,
			typeKjoring,
		});
	};

	const handleClose = () => {
		reset();
		setVisTimeoutInnstillinger(false);
		closeModal();
	};

	return (
		<Modal open={open} onClose={handleClose} width="medium" aria-label="Opprett uttrekk">
			<Modal.Header>
				<Heading level="1" size="medium">
					Opprett uttrekk for &#34;{lagretSøk.tittel}&#34;
				</Heading>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					{harSelectFelter ? (
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
							Ingen felter er valgt for uttrekk. Uttrekket vil kun inneholde antall oppgaver som matcher søket. For å
							sette felter gå til &#34;Endre kriterier&#34; og legg til felter under &#34;Felter som skal vises i
							søkeresultat&#34;.
						</Alert>
					)}

					<div className="mt-5">
						{!visTimeoutInnstillinger ? (
							<>
								<Detail>Uttrekket kjører som standard maksimalt i {defaultTimeout} sekunder.</Detail>
								<Button
									className="mt-2 p-0"
									variant="tertiary"
									size="xsmall"
									type="button"
									onClick={() => {
										setVisTimeoutInnstillinger(true);
									}}
								>
									Endre maksimal kjøretid
								</Button>
							</>
						) : (
							<TextField
								{...register('timeout', {
									required: 'Timeout er påkrevd',
									min: { value: 1, message: 'Timeout må være minst 1 sekund' },
									max: { value: 600, message: 'Timeout kan ikke overstige 600 sekunder (10 minutter)' },
									valueAsNumber: true,
								})}
								error={errors.timeout?.message}
								label="Maksimal kjøretid (sekunder)"
								description="Uttrekk med mye data kan ta lang tid å kjøre. Vær forsiktig med høye verdier da det kan påvirke ytelsen til systemet."
								type="number"
							/>
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
