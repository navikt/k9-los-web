import React, { useState } from 'react';
import { Search } from '@navikt/ds-react';

export function SøkForm(props: {
	loading: boolean;
	utførSøk: (søk: { søkeord: string }) => void;
	nullstillSøk: () => void;
}) {
	const [søkeord, setSøkeord] = useState('');

	const endreSøkeord = (ord: string) => {
		setSøkeord(
			ord
				.replace(/\D*(\d{6})\s*(\d{5})\D*/, '$1$2') // fnr, med mulig mellomrom
				.replace(/[^a-zA-Z0-9]/g, '') // tar bort alt som ikke er tall eller bokstaver
				.substring(0, 11), // maks 11 tegn (fnr er lengste mulige input)
		);
	};

	return (
		<form
			role="search"
			onSubmit={(e) => {
				e.preventDefault();
				props.utførSøk({
					søkeord,
				});
			}}
		>
			<Search
				label="Søk på saksnummer, personnummer eller journalpost-id"
				variant="primary"
				hideLabel={false}
				onChange={endreSøkeord}
				htmlSize={40}
				onClear={props.nullstillSøk}
				value={søkeord}
				clearButton
			>
				<Search.Button loading={props.loading}>Søk</Search.Button>
			</Search>
		</form>
	);
}
