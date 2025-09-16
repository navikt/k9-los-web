import React, { useState } from 'react';
import { Search } from '@navikt/ds-react';

export function SøkForm(props: {
	loading: boolean;
	utførSøk: (søk: { søkeord: string }) => void;
	nullstillSøk: () => void;
}) {
	const [søkeord, setSøkeord] = useState('');

	const endreSøkeord = (ord: string) => {
		// Fjerner all whitespace fra søkeordet
		setSøkeord(ord.replace(/\s/g, ''));
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
				maxLength={11}
				onClear={props.nullstillSøk}
				value={søkeord}
				clearButton
			>
				<Search.Button loading={props.loading}>Søk</Search.Button>
			</Search>
		</form>
	);
}
