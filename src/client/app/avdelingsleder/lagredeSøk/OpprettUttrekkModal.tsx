import React, { useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, BodyShort, Button, Heading, List, Modal, TextField } from '@navikt/ds-react';
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

	const { handleSubmit, reset, register } = useForm({
		defaultValues: {
			timeout: 30,
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
		closeModal();
	};

	return (
		<Modal open={open} onClose={handleClose} width="medium" aria-label="Opprett uttrekk">
			<Modal.Header>
				<Heading level="1" size="medium">
					Opprett uttrekk for "{lagretSøk.tittel}"
				</Heading>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					{harSelectFelter ? (
						<>
							<BodyShort>Uttrekket vil inneholde følgende felter:</BodyShort>
							<List>
								{selectFelterMedNavn.map((felt) => (
									<List.Item key={felt.id}>{felt.visningsnavn}</List.Item>
								))}
							</List>
						</>
					) : (
						<Alert variant="warning">
							Ingen felter er valgt for uttrekk. Uttrekket vil kun inneholde antall oppgaver som matcher søket. For å
							sette felter gå til &#34;Endre kriterier&#34; og legg til felter under &#34;Felter som skal vises i
							søkeresultat&#34;.
						</Alert>
					)}

					<TextField
						{...register('timeout', {
							required: 'Timeout er påkrevd',
							min: { value: 1, message: 'Timeout må være minst 1 sekund' },
							max: { value: 300, message: 'Timeout kan ikke overstige 300 sekunder' },
							valueAsNumber: true,
						})}
						label="Timeout (sekunder)"
						description="Uttrekk med mye data kan ta lang tid å kjøre. Timeout kan økes ved behov, men vær forsiktig da det kan hemme ytelsen til systemet."
						type="number"
						className="mt-4"
					/>

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
