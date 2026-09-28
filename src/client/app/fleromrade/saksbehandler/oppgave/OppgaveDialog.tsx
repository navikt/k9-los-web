import { BodyShort, Button, Dialog, InlineMessage, VStack } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useState } from 'react';
import { useOppgaveDialogViewModel } from './oppgaveDialogViewModel';

interface Props {
	oppgave: OppgaveSammendragDto;
	lukk: () => void;
}

/**
 * Dialogen styrer åpen-tilstanden selv, og kaller `lukk` først når lukkeanimasjonen er ferdig. Da kan forelderen
 * avmontere komponenten uten at animasjonen kuttes.
 */
const OppgaveDialog = ({ oppgave, lukk }: Props) => {
	const [åpen, setÅpen] = useState(true);
	const viewModel = useOppgaveDialogViewModel(oppgave, () => setÅpen(false));

	// Dialogen vises først når dataene er hentet, så innholdet ikke bytter ut under åpningsanimasjonen.
	if (!viewModel.harHentetData) {
		return null;
	}

	const { tittel, tekst, feilmelding, knapper } = viewModel;

	return (
		<Dialog
			open={åpen}
			onOpenChange={setÅpen}
			onOpenChangeComplete={(nyÅpen) => {
				if (!nyÅpen) {
					lukk();
				}
			}}
		>
			<Dialog.Popup>
				<Dialog.Header>
					<Dialog.Title>{tittel}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<VStack gap="space-8">
						{tekst && <BodyShort>{tekst}</BodyShort>}
						<BodyShort>Hva ønsker du å gjøre med oppgaven?</BodyShort>
						{feilmelding && <InlineMessage status="error">{feilmelding}</InlineMessage>}
					</VStack>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.CloseTrigger>
						<Button variant="tertiary">Avbryt</Button>
					</Dialog.CloseTrigger>
					{knapper.leggTilbakeIKø.vis && (
						<Button
							variant="secondary"
							loading={knapper.leggTilbakeIKø.loading}
							disabled={knapper.leggTilbakeIKø.disabled}
							onClick={knapper.leggTilbakeIKø.handling}
						>
							Legg tilbake i kø
						</Button>
					)}
					{knapper.overtaOgÅpne.vis && (
						<Button
							variant="secondary"
							loading={knapper.overtaOgÅpne.loading}
							disabled={knapper.overtaOgÅpne.disabled}
							onClick={knapper.overtaOgÅpne.handling}
						>
							Overta reservasjon og åpne oppgave
						</Button>
					)}
					{knapper.reserverOgÅpne.vis && (
						<Button
							variant="secondary"
							loading={knapper.reserverOgÅpne.loading}
							disabled={knapper.reserverOgÅpne.disabled}
							onClick={knapper.reserverOgÅpne.handling}
						>
							Reserver og åpne oppgave
						</Button>
					)}
					{knapper.åpneOppgave.vis && (
						<Button
							loading={knapper.åpneOppgave.loading}
							disabled={knapper.åpneOppgave.disabled}
							onClick={knapper.åpneOppgave.handling}
						>
							Åpne oppgave
						</Button>
					)}
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
};

export default OppgaveDialog;
