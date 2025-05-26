import React, { useState } from 'react';
import { Checkbox, Search } from '@navikt/ds-react';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export function SøkForm(props: {
	loading: boolean;
	utførSøk: (søk: { søkeord: string; oppgavestatus: string[] }) => void;
	nullstillSøk: () => void;
}) {
	const [søkeord, setSøkeord] = useState('');
	return (
		<form
			role="search"
			onSubmit={(e) => {
				e.preventDefault();
				props.utførSøk({
					søkeord,
					oppgavestatus: ['AAPEN', 'VENTER', 'LUKKET'],
				});
			}}
		>
			<Search
				label="Søk på saksnummer, personnummer eller journalpost-id"
				variant="primary"
				hideLabel={false}
				onChange={setSøkeord}
				htmlSize={40}
				maxLength={11}
				onClear={props.nullstillSøk}
				clearButton
			>
				<Search.Button loading={props.loading}>Søk</Search.Button>
			</Search>
		</form>
	);
}
