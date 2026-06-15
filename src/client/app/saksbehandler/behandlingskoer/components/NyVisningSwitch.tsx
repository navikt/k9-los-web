import React from 'react';
import { HStack, HelpText, Switch } from '@navikt/ds-react';
import { useNyVisning } from 'saksbehandler/NyVisningContext';

const NyVisningSwitch = () => {
	const { nyVisning, setNyVisning } = useNyVisning();

	return (
		<HStack gap="space-8" align="center">
			<Switch size="small" checked={nyVisning} onChange={(event) => setNyVisning(event.target.checked)}>
				Ny visning
			</Switch>
			<HelpText>
				<p>Dette er funksjonalitet under utvikling.</p>
				<p>Når denne er på vises en oversikt over hvilke kriterier køen er satt opp med.</p>
			</HelpText>
		</HStack>
	);
};

export default NyVisningSwitch;
