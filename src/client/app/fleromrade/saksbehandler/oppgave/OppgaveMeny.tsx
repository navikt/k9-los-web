import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, HStack, InlineMessage } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useSaksbehandlereForReservasjon } from 'fleromrade/api/saksbehandlerQueries';
import { Fragment, useState } from 'react';
import { type OppgaveMenyViewModel, useOppgaveMenyViewModel } from './oppgaveMenyViewModel';
import { saksbehandlerEnhet } from './saksbehandlerEnhet';

const Saksbehandlermeny = ({ reserver, disabled }: { reserver: (navident: string) => void; disabled: boolean }) => {
	const { data: saksbehandlere, isPending, isError } = useSaksbehandlereForReservasjon();
	const grupper = [...new Set(saksbehandlere?.map(({ enhet }) => saksbehandlerEnhet(enhet)))].sort();

	return (
		<>
			{isPending && <ActionMenu.Item disabled>Henter saksbehandlere…</ActionMenu.Item>}
			{isError && (
				<InlineMessage status="error" role="alert">
					Kunne ikke hente saksbehandlere. Prøv igjen.
				</InlineMessage>
			)}
			{saksbehandlere?.length === 0 && <ActionMenu.Item disabled>Ingen saksbehandlere tilgjengelig</ActionMenu.Item>}
			{grupper.map((enhet, indeks) => (
				<Fragment key={enhet}>
					{indeks > 0 && <ActionMenu.Divider />}
					<ActionMenu.Group label={enhet}>
						{saksbehandlere
							?.filter((saksbehandler) => saksbehandlerEnhet(saksbehandler.enhet) === enhet)
							?.toSorted((a, b) => a.navn.localeCompare(b.navn, 'nb'))
							.map(({ brukerIdent, navn }) => (
								<ActionMenu.Item
									key={brukerIdent}
									disabled={disabled}
									onSelect={(event) => {
										event.preventDefault();
										reserver(brukerIdent);
									}}
								>
									{navn} ({brukerIdent})
								</ActionMenu.Item>
							))}
					</ActionMenu.Group>
				</Fragment>
			))}
		</>
	);
};

const Menyinnhold = ({ oppgave, viewModel }: { oppgave: OppgaveSammendragDto; viewModel: OppgaveMenyViewModel }) => {
	const [visSaksbehandlere, setVisSaksbehandlere] = useState(false);

	if (viewModel.harHentetData === false) {
		return viewModel.feilmelding ? (
			<InlineMessage status="error" role="alert">
				{viewModel.feilmelding}
			</InlineMessage>
		) : (
			<ActionMenu.Item disabled>Henter oppgave…</ActionMenu.Item>
		);
	}

	const { knapper, reserverForAnnen } = viewModel;
	const handlinger = [{ knapp: knapper.åpneOppgave, tekst: 'Åpne oppgave' }];

	return (
		<ActionMenu.Group
			label={`${oppgave.saksnummer ? 'Sak' : 'Journalpost-id'} ${oppgave.saksnummer || oppgave.journalpostId}`}
		>
			{handlinger
				.filter(({ knapp }) => knapp.vis)
				.map(({ knapp, tekst }) => (
					<ActionMenu.Item
						key={tekst}
						disabled={knapp.disabled}
						onSelect={(event) => {
							event.preventDefault();
							knapp.handling();
						}}
					>
						{tekst}
					</ActionMenu.Item>
				))}
			{knapper.reserverOgÅpne.vis && (
				<ActionMenu.Sub open={visSaksbehandlere} onOpenChange={setVisSaksbehandlere}>
					<ActionMenu.SubTrigger disabled={knapper.reserverOgÅpne.disabled}>
						Reserver for annen saksbehandler
					</ActionMenu.SubTrigger>
					<ActionMenu.SubContent>
						{visSaksbehandlere && (
							<Saksbehandlermeny reserver={reserverForAnnen} disabled={knapper.reserverOgÅpne.disabled} />
						)}
					</ActionMenu.SubContent>
				</ActionMenu.Sub>
			)}
		</ActionMenu.Group>
	);
};

const OppgaveMeny = ({
	oppgave,
	visFeil,
}: {
	oppgave: OppgaveSammendragDto;
	visFeil: (melding: string | undefined) => void;
}) => {
	const [åpen, setÅpen] = useState(false);
	const viewModel = useOppgaveMenyViewModel(oppgave, () => setÅpen(false), visFeil);
	const reserver = viewModel.harHentetData ? viewModel.knapper.reserverOgÅpne : undefined;
	return (
		<HStack gap="space-12" align="center" justify="end" wrap={false}>
			{(!viewModel.harHentetData || reserver?.vis) && (
				<Button
					type="button"
					variant="secondary"
					size="small"
					aria-label={`Reserver oppgave ${oppgave.saksnummer || oppgave.journalpostId}`}
					loading={(viewModel.harHentetData === false && !viewModel.feilmelding) || reserver?.loading}
					disabled={!reserver || reserver.disabled}
					onClick={reserver?.handling}
				>
					Reserver
				</Button>
			)}
			<ActionMenu open={åpen} onOpenChange={setÅpen}>
				<ActionMenu.Trigger>
					<Button
						variant="secondary"
						size="small"
						aria-label={`Handlinger på oppgave ${oppgave.saksnummer || oppgave.journalpostId}`}
						icon={<MenuElipsisVerticalIcon aria-hidden />}
					/>
				</ActionMenu.Trigger>
				<ActionMenu.Content align="end">
					{åpen && <Menyinnhold oppgave={oppgave} viewModel={viewModel} />}
				</ActionMenu.Content>
			</ActionMenu>
		</HStack>
	);
};

export default OppgaveMeny;
