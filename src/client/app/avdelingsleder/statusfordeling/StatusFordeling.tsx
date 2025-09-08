import React, { ReactNode } from 'react';
import dayjs from 'dayjs';
import { Heading, HelpText } from '@navikt/ds-react';
import { useHentAvdelingslederStatusFordeling } from 'api/queries/avdelingslederQueries';
import * as styles from './StatusFordeling.css';

export function StatusFordeling() {
	const { data, isSuccess } = useHentAvdelingslederStatusFordeling();

	return (
		<div>
			{isSuccess && (
				<>
					<Heading size="small" className="flex items-center gap-1.5 mt-4">
						Status
						<HelpText>
							<p>
								Viser fordeling av oppgaver som ikke er ferdigstilte. «Behandlinger» viser totalt antall oppgaver,
								ekskludert Punsj-oppgaver.
							</p>
							<p>
								Tallene oppdateres periodisk. Sist oppdatert{' '}
								{dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}.
							</p>
						</HelpText>
					</Heading>
					<div className={styles.rammer}>
						{data.tall.map((t) => {
							let navn: ReactNode = data.grupper.find((g) => g.kode === t.gruppe)?.navn;
							navn = navn === 'Førstegangsbehandlinger' ? <>Førstegangsbehandlinger</> : navn;
							return (
								<div className={styles.ramme} key={t.gruppe}>
									<div className={styles.forklaring}>
										<span>{navn}</span>
									</div>
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
