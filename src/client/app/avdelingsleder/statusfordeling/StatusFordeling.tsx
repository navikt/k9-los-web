import React, { ReactNode, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { BodyShort, Detail, Heading, Popover } from '@navikt/ds-react';
import { useHentAvdelingslederStatusFordeling } from 'api/queries/avdelingslederQueries';
import KøKriterieViewer from 'filter/KøKriterieViewer';
import { OppgaveQuery } from 'filter/filterTsTypes';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import * as styles from './StatusFordeling.css';

function KildeViewer({
	tittel,
	linje,
	children,
}: {
	tittel: string;
	linje: { visningsnavn: string; verdi: number; kildespørring: OppgaveQuery };
	children: ReactNode | ReactNode[];
}) {
	const [openPopover, setOpenPopover] = useState(false);
	const href = useRef<HTMLDivElement>(null);
	return (
		<div>
			{/* Vurder annet html-element */}
			<div
				onKeyUp={(event) => {
					if (event.key === 'Enter') {
						setOpenPopover(!openPopover);
					}
				}}
				role="button"
				tabIndex={0}
				ref={href}
				className="flex items-center gap-1"
				onClick={() => setOpenPopover(!openPopover)}
			>
				<div
					className={
						openPopover
							? 'underline decoration-dashed cursor-pointer'
							: 'hover:underline hover:decoration-dashed hover:cursor-pointer'
					}
				>
					{children}
				</div>
			</div>
			<Popover anchorEl={href.current} open={openPopover} onClose={() => setOpenPopover(false)}>
				{openPopover && (
					<div className="max-w-screen-md">
						<div className="p-4">
							<BodyShort>
								Antallet{' '}
								<b>
									{linje.verdi} {linje.visningsnavn}
								</b>{' '}
								i gruppe <b>{tittel}</b> er funnet ved søk med kriteriene under. Dersom du ønsker å finne disse
								oppgavene kan du opprette et lagret søk eller en oppgavekø, og sette tilsvarende kriterier som under.
							</BodyShort>
							<VerticalSpacer sixteenPx />
							<BodyShort>Du kan ikke endre kriteriene her.</BodyShort>
						</div>
						<KøKriterieViewer query={linje.kildespørring} tittel="Kriterier" />
					</div>
				)}
			</Popover>
		</div>
	);
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
								<div className={styles.forklaring}>
									<div className={styles.forklaringTekst}>{tittel.navn}</div>
								</div>
								<div className={styles.tallcontainer}>
									<div className={styles.hovedtall}>
										<KildeViewer tittel={tittel.navn} linje={topplinje}>
											{`${topplinje.verdi} ${topplinje.visningsnavn}`}
										</KildeViewer>
									</div>
									<div className={styles.nedbrytning}>
										{linjer.map((linje) => (
											<KildeViewer key={linje.visningsnavn} tittel={tittel.navn} linje={linje}>
												<div className={styles.nedbrytningElement} key={linje.visningsnavn}>
													{`${linje.verdi} ${linje.visningsnavn}`}
												</div>
											</KildeViewer>
										))}
										<KildeViewer tittel={tittel.navn} linje={bunnlinje}>
											<div className={styles.nedbrytningElement}>
												<b>{`${bunnlinje.verdi} ${bunnlinje.visningsnavn}`}</b>
											</div>
										</KildeViewer>
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
