import KopierbarVerdi, { Kopieringsområde } from 'sharedComponents/KopierbarVerdi';
import { BodyShort, Box, Detail, VStack } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';

const OppgaveOppsummering = ({ oppgave }: { oppgave: OppgaveSammendragDto }) => {
	const idTittel = oppgave.saksnummer ? 'Sak' : 'Journalpost-id';
	const id = oppgave.saksnummer || oppgave.journalpostId;
	const idNavn = oppgave.saksnummer ? 'saksnummer' : 'journalpost-id';
	return (
		<Box background="neutral-soft" borderRadius="8" padding="space-16">
			<VStack gap="space-12">
				<Kopieringsområde>
					<div>
						<Detail textColor="subtle">Søker</Detail>
						<BodyShort>{oppgave.person?.navn ?? 'Ukjent'}</BodyShort>
						{oppgave.person?.fnr && (
							<KopierbarVerdi copyText={oppgave.person.fnr} title="Kopier fødselsnummer">
								<BodyShort size="small">{oppgave.person.fnr}</BodyShort>
							</KopierbarVerdi>
						)}
					</div>
				</Kopieringsområde>
				{id && (
					<Kopieringsområde>
						<div>
							<Detail textColor="subtle">{idTittel}</Detail>
							<KopierbarVerdi copyText={id} title={`Kopier ${idNavn}`}>
								<BodyShort>{id}</BodyShort>
							</KopierbarVerdi>
						</div>
					</Kopieringsområde>
				)}
			</VStack>
		</Box>
	);
};

export default OppgaveOppsummering;
