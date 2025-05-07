import React from 'react';
import { HStack, Heading } from '@navikt/ds-react';
import { useHentAvdelingslederStatus } from 'api/queries/avdelingslederQueries';
import EnkelTeller from './EnkelTeller';
import * as styles from './Status.css';

// Pynter visningsnavnet som kommer fra backend
function visningsnavn(behandlingstype: string) {
	switch (behandlingstype) {
		case 'Førstegangsbehandling':
			return <>Førstegangs&shy;behandling</>; // Legger på bindestrek på riktig sted hvis nødvendig
		default:
			return behandlingstype;
	}
}

export default function Status() {
	const { data, isSuccess } = useHentAvdelingslederStatus();
	return (
		<div className={styles.container}>
			<Heading size="medium">Status</Heading>
			{isSuccess && (
				<HStack>
					{data.map(({ antall, behandlingstype }) => (
						<EnkelTeller antall={antall} tekst={visningsnavn(behandlingstype)} />
					))}
				</HStack>
			)}
		</div>
	);
}
