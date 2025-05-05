import React, { useState } from 'react';
import { Checkbox, Search } from '@navikt/ds-react';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export function SøkForm(props: {
	loading: boolean;
	utførSøk: (søk: { searchString: string; fraAktiv: boolean }) => void;
	nullstillSøk: () => void;
}) {
	const [searchString, setSearchString] = useState('');
	const [inkluderLukkede, setInkluderLukkede] = useState(false);
	return (
		<form
			role="search"
			onSubmit={(e) => {
				e.preventDefault();
				props.utførSøk({ searchString, fraAktiv: !inkluderLukkede });
			}}
		>
			<Search
				label="Søk på saksnummer, personnummer eller journalpost-id"
				variant="primary"
				hideLabel={false}
				onChange={setSearchString}
				htmlSize={40}
				maxLength={11}
				onClear={props.nullstillSøk}
				clearButton
			>
				<Search.Button loading={props.loading}>Søk</Search.Button>
			</Search>
			<VerticalSpacer eightPx />
			<Checkbox size="small" value={inkluderLukkede} onChange={() => setInkluderLukkede(!inkluderLukkede)}>
				Søk også i lukkede behandlinger
			</Checkbox>
		</form>
	);
}
