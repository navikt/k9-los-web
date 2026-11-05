import { BodyShort, Button, Dialog, InlineMessage, VStack } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useRef, useState } from 'react';
import OppgaveOppsummering from './OppgaveOppsummering';
import { useOppgaveMenyViewModel } from './oppgaveMenyViewModel';

const OppgaveDialog = ({ oppgave, lukk }: { oppgave: OppgaveSammendragDto; lukk: () => void }) => {
	const [åpen, setÅpen] = useState(true);
	const [feilmelding, setFeilmelding] = useState<string>();
	const nyViewModel = useOppgaveMenyViewModel(oppgave, () => setÅpen(false), setFeilmelding, false);
	const sisteViewModel = useRef(nyViewModel);
	if (nyViewModel.harHentetData) {
		sisteViewModel.current = nyViewModel;
	}
	const viewModel =
		nyViewModel.harHentetData === false && nyViewModel.feilmelding ? nyViewModel : sisteViewModel.current;
	if (viewModel.harHentetData === false && !viewModel.feilmelding) {
		return null;
	}
	return (
		<Dialog open={åpen} onOpenChange={setÅpen} onOpenChangeComplete={(open) => !open && lukk()}>
			<Dialog.Popup>
				<Dialog.Header>
					<Dialog.Title>{viewModel.harHentetData ? viewModel.tittel : 'Kunne ikke hente oppgaven'}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<VStack gap="space-16">
						<OppgaveOppsummering oppgave={oppgave} />
						<VStack gap="space-8">
							{viewModel.harHentetData && <BodyShort>{viewModel.tekst}</BodyShort>}
							{feilmelding && (
								<InlineMessage status="error" role="alert">
									{feilmelding}
								</InlineMessage>
							)}
							{nyViewModel.harHentetData === false && nyViewModel.feilmelding && (
								<InlineMessage status="error" role="alert">
									{nyViewModel.feilmelding}
								</InlineMessage>
							)}
						</VStack>
					</VStack>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.CloseTrigger>
						<Button type="button" variant="tertiary">
							Avbryt
						</Button>
					</Dialog.CloseTrigger>
					{viewModel.harHentetData &&
						[
							{ knapp: viewModel.knapper.leggTilbakeIKø, tekst: 'Legg tilbake i kø' },
							{ knapp: viewModel.knapper.overtaOgÅpne, tekst: 'Overta reservasjon og åpne oppgave' },
							{ knapp: viewModel.knapper.reserverOgÅpne, tekst: 'Reserver og åpne oppgave' },
							{ knapp: viewModel.knapper.åpneOppgave, tekst: 'Åpne oppgave' },
						]
							.filter(({ knapp }) => knapp.vis)
							.map(({ knapp, tekst }) => (
								<Button
									key={tekst}
									type="button"
									variant={tekst === 'Åpne oppgave' ? 'primary' : 'secondary'}
									loading={knapp.loading}
									disabled={knapp.disabled}
									onClick={knapp.handling}
								>
									{tekst}
								</Button>
							))}
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
};

export default OppgaveDialog;
