import React, { ReactNode } from 'react';
import dayjs from 'dayjs';
import { Detail, Heading, HelpText } from '@navikt/ds-react';
import { useHentAvdelingslederStatusFordeling } from 'api/queries/avdelingslederQueries';
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

function visningsnavn(navn: string) {
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
		case 'Innsyn':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 2: «Innsyn»." />;
		case 'Anker':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 2: «Anke»." />;
		case 'Unntaksbehandlinger':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 2: «Unntaksbehandling»." />;
		case 'Klager':
			return <Forklaring tekst={navn} hjelpetekst="Oppgaver med behandlingstype nivå 1: «k9klage»." />;
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
						{data.tall
							.filter(({ antallTotalt, gruppe }) => antallTotalt > 0 || gruppe === 'BEHANDLINGER')
							.map((t) => {
								const navn = data.grupper.find((g) => g.kode === t.gruppe)?.navn;
								return (
									<div className={styles.ramme} key={t.gruppe}>
										<div className={styles.forklaring}>{visningsnavn(navn)}</div>
										<div className={styles.tallcontainer}>
											<div className={styles.hovedtall}>{t.antallTotalt}</div>
											<div className={styles.nedbrytning}>
												{t.antallÅpne > 0 && <div className={styles.nedbrytningElement}>{`${t.antallÅpne} åpne`}</div>}
												{t.antallVenter > 0 && (
													<div className={styles.nedbrytningElement}>{`${t.antallVenter} venter`}</div>
												)}
												{t.antallUavklart > 0 && (
													<div className={styles.nedbrytningElement}>{`${t.antallUavklart} uavklarte`}</div>
												)}
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</>
			)}
		</div>
	);
}
