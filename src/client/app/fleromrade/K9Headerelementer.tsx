import { MenuGridIcon } from '@navikt/aksel-icons';
import { ActionMenu, InternalHeader, Theme } from '@navikt/ds-react';
import Endringslogg from '@navikt/endringslogg';
import styles from './header.module.css';

/**
 * Endringslogg og lenkemeny som K9 har i headeren. De bruker ikke LOS-API-et, men er et bevisst valg for K9:
 * aktivitetspenger skal ikke ha dem.
 */
const K9Headerelementer = ({ brukerIdent }: { brukerIdent: string }) => (
	<>
		<Theme theme="light">
			<div className={styles.endringsloggContainer}>
				<Endringslogg
					userId={brukerIdent}
					appId="K9_SAK"
					appName="K9 Sak"
					backendUrl="/api/endringslogg"
					stil="lys"
					alignLeft
					maxEntries={150}
				/>
			</div>
		</Theme>
		<ActionMenu>
			<ActionMenu.Trigger>
				<InternalHeader.Button>
					<MenuGridIcon fontSize="1.5rem" title="Systemer og oppslagsverk" />
				</InternalHeader.Button>
			</ActionMenu.Trigger>
			<ActionMenu.Content>
				<ActionMenu.Group label="Systemer og oppslagsverk">
					<ActionMenu.Item as="a" href="https://lovdata.no/pro/sso/login/nav" target="_blank" rel="noopener noreferrer">
						Rettskilde
					</ActionMenu.Item>
					<ActionMenu.Item
						as="a"
						href="https://navno.sharepoint.com/sites/44/NAYSykdomifamilien/SitePages/Hjem.aspx"
						target="_blank"
						rel="noopener noreferrer"
					>
						Sharepoint
					</ActionMenu.Item>
				</ActionMenu.Group>
			</ActionMenu.Content>
		</ActionMenu>
	</>
);

export default K9Headerelementer;
