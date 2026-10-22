import { BodyShort, Box, InlineMessage, Popover, VStack } from '@navikt/ds-react';
import { useHentStatusfordeling } from 'api/generated/los';
import type { StatuslinjeDto } from 'api/generated/los.schemas';
import KøKriterieViewer from 'filter/KøKriterieViewer';
import { erIkkeImplementert, nøkkeltallQueryOptions } from 'fleromrade/api/nøkkeltallQueryOptions';
import { fraKlientQuery } from 'fleromrade/api/oppgaveQuery';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { type ReactNode, useId, useState } from 'react';
import styles from './statusFordeling.module.css';

function KildeViewer({ tittel, linje, children }: { tittel: string; linje: StatuslinjeDto; children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const id = useId();
	return (
		<div>
			<button
				type="button"
				ref={setAnchorEl}
				className="flex items-center text-left hover:underline decoration-dashed cursor-pointer"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				aria-controls={open ? id : undefined}
			>
				{children}
			</button>
			<Popover anchorEl={anchorEl} open={open} onClose={() => setOpen(false)} id={id}>
				{open && (
					<Box maxWidth="48rem">
						<VStack padding="space-16" gap="space-16">
							<BodyShort>
								Antallet{' '}
								<b>
									{linje.verdi} {linje.visningsnavn}
								</b>{' '}
								i gruppe <b>{tittel}</b> er funnet ved søk med kriteriene under. For å finne disse oppgavene kan du
								opprette et lagret søk eller en oppgavekø med de samme kriteriene.
							</BodyShort>
							<BodyShort>Du kan ikke endre kriteriene her.</BodyShort>
						</VStack>
						<KøKriterieViewer query={fraKlientQuery(linje.kildespørring)} tittel="Kriterier" />
					</Box>
				)}
			</Popover>
		</div>
	);
}

export function StatusFordeling() {
	const { urlSegment } = useOmråde();
	const { data, error } = useHentStatusfordeling(urlSegment, { query: nøkkeltallQueryOptions });

	if (erIkkeImplementert(error)) return null;
	if (error) return <InlineMessage status="error">Kunne ikke hente statusfordelingen</InlineMessage>;
	if (!data) return null;

	return (
		<div className={styles.rammer}>
			{data.tall.map(({ linjer, tittel, topplinje, bunnlinje }) => (
				<div className={styles.ramme} key={tittel.kode}>
					<div className={styles.forklaring}>
						<div className={styles.forklaringTekst}>{tittel.navn}</div>
					</div>
					<div className={styles.tallcontainer}>
						<div className={styles.hovedtall}>
							<KildeViewer
								tittel={tittel.navn}
								linje={topplinje}
							>{`${topplinje.verdi} ${topplinje.visningsnavn}`}</KildeViewer>
						</div>
						<div className={styles.nedbrytning}>
							{linjer.map((linje) => (
								<KildeViewer key={linje.visningsnavn} tittel={tittel.navn} linje={linje}>
									<span className={styles.nedbrytningElement}>{`${linje.verdi} ${linje.visningsnavn}`}</span>
								</KildeViewer>
							))}
							{bunnlinje.verdi !== topplinje.verdi && (
								<KildeViewer tittel={tittel.navn} linje={bunnlinje}>
									<span className={styles.nedbrytningElement}>
										<b>{`${bunnlinje.verdi} ${bunnlinje.visningsnavn}`}</b>
									</span>
								</KildeViewer>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
