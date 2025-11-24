import React, { FunctionComponent, ReactNode, useRef, useState } from 'react';
import { BodyShort, Popover } from '@navikt/ds-react';
import { DagensTallHovedtallOgLinjer } from 'api/queries/avdelingslederQueries';
import KøKriterieViewer from 'filter/KøKriterieViewer';
import { OppgaveQuery } from 'filter/filterTsTypes';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import * as styles from './teller3.css';

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
		<>
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
				className="flex items-center gap-0 m-0"
				onClick={() => setOpenPopover(!openPopover)}
			>
				<div
					className={
						openPopover
							? 'underline decoration-dashed cursor-pointer m-0'
							: 'hover:underline hover:decoration-dashed hover:cursor-pointer m-0'
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
		</>
	);
}

interface OwnProps {
	forklaring: string;
	tall: [DagensTallHovedtallOgLinjer, DagensTallHovedtallOgLinjer];
}

const Teller: FunctionComponent<OwnProps> = ({ forklaring, tall }) => {
	const [inngang, ferdigstilt] = tall;
	return (
		<div className={styles.ramme}>
			<div className={styles.forklaring}>
				<p>{forklaring}</p>
			</div>
			<div className={styles.container}>
				<div className={styles.tallramme}>
					<p className={styles.beskrivelse}>{inngang.hovedtall.visningsnavn}</p>
					<div className={styles.felt}>
						<KildeViewer tittel={forklaring} linje={inngang.hovedtall}>
							<p className={styles.tall}>{inngang.hovedtall.verdi}</p>
						</KildeViewer>
					</div>
				</div>
				<div className={styles.bredTallramme}>
					<p className={styles.beskrivelse}>{ferdigstilt.hovedtall.visningsnavn}</p>
					<div className={styles.fargetFelt}>
						<KildeViewer tittel={forklaring} linje={ferdigstilt.hovedtall}>
							<p className={styles.tall}>{ferdigstilt.hovedtall.verdi}</p>
						</KildeViewer>
					</div>
					<div className={styles.nedbrytning}>
						{ferdigstilt.linjer.map((linje) => (
							<KildeViewer key={linje.visningsnavn} tittel={forklaring} linje={linje}>
								<span>{`${linje.verdi} ${linje.visningsnavn}`}</span>
							</KildeViewer>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Teller;
