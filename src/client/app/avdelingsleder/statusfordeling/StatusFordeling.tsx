import React, { ReactNode } from 'react';
import dayjs from 'dayjs';
import { Detail, Heading, HelpText } from '@navikt/ds-react';
import { useHentAvdelingslederStatusFordeling } from 'api/queries/avdelingslederQueries';
import KøKriterieViewer from 'filter/KøKriterieViewer';
import { OppgaveQuery } from 'filter/filterTsTypes';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import * as styles from './StatusFordeling.css';

function Forklaring({ tekst, hjelpetekst }: { tekst: string; hjelpetekst: ReactNode }) {
	return (
		<>
			<div className={styles.forklaringTekst}>{tekst}</div>
			<HelpText>{hjelpetekst}</HelpText>
		</>
	);
}

function visningsnavn(navn: string, query?: OppgaveQuery) {
	switch (navn) {
		case 'Behandlinger':
			return <Forklaring tekst={navn} hjelpetekst={<>Alle oppgaver ekskludert behandlingstype nivå 1: «k9punsj».</>} />;
		case 'Feilutbetalinger':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 1: «k9tilbake»." />;
		case 'Revurderinger':
			return (
				<Forklaring
					tekst={navn}
					hjelpetekst="Oppgaver med behandlingstype nivå 2: «Revurdering», «Tilbakekreving revurdering»."
				/>
			);
		case 'Unntaksbehandlinger':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 2: «Unntaksbehandling»." />;
		case 'Klager':
			return <Forklaring tekst={navn} hjelpetekst={<>Oppgaver med behandlingstype nivå 1: «k9klage».</>} />;
		case 'Punsj-oppgaver':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 1: «k9punsj»." />;
		case 'Førstegangsbehandlinger':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 2: «Førstegangsbehandling»." />;
		default:
			return navn;
	}
}

export function StatusFordeling() {
	const { data, isSuccess } = useHentAvdelingslederStatusFordeling();

	return (
		<div>
			{isSuccess && (
				<>
					<div className="mt-4 mb-4">
						<Heading size="small">Status</Heading>
						<VerticalSpacer eightPx />
						<Detail>Oppdatert {dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}</Detail>
					</div>
					<div className={styles.rammer}>
						{data.tall.map(({ linjer, tittel, topplinje, bunnlinje }) => (
							<div className={styles.ramme} key={tittel.kode}>
								<div className={styles.forklaring}>{visningsnavn(tittel.navn, topplinje.kildespørring)}</div>
								<div className={styles.tallcontainer}>
									<div className={styles.hovedtall}>
										<b>{topplinje.verdi}</b>&nbsp;<span>{topplinje.visningsnavn}</span>
									</div>
									<div className={styles.nedbrytning}>
										{linjer.map((linje) => (
											<div className={styles.nedbrytningElement} key={linje.visningsnavn}>
												{`${linje.verdi} ${linje.visningsnavn}`}
											</div>
										))}
										<div className={styles.nedbrytningElement}>
											<b>{`${bunnlinje.verdi} ${bunnlinje.visningsnavn}`}</b>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}
