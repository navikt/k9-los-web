import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@navikt/ds-react';
import { Uttrekk, useEndreUttrekkTittel } from 'api/queries/avdelingslederQueries';

export function EndreTittelUttrekk({
	uttrekk,
	ikkeIEndreModusLenger,
}: {
	uttrekk: Uttrekk;
	ikkeIEndreModusLenger: () => void;
}) {
	const { mutate, isPending, isError } = useEndreUttrekkTittel(ikkeIEndreModusLenger);
	const [tittel, setTittel] = useState(uttrekk.tittel || '');
	const [feilmelding, setFeilmelding] = useState('');

	useEffect(() => {
		if (tittel.trim().length === 0) {
			setFeilmelding('Tittel må være utfylt');
		} else {
			setFeilmelding('');
		}
	}, [tittel]);

	useEffect(() => {
		if (isError) {
			setFeilmelding('Noe gikk galt ved lagring. Prøv igjen.');
		}
	}, [isError]);

	return (
		<form
			className="flex gap-2 items-start"
			onSubmit={(event) => {
				event.preventDefault();
				if (tittel.trim().length > 0) {
					mutate({ id: uttrekk.id, tittel: tittel.trim() });
				}
			}}
		>
			<TextField
				label="Tittel"
				hideLabel
				value={tittel}
				onChange={(event) => setTittel(event.target.value)}
				error={feilmelding}
				htmlSize={40}
				maxLength={100}
				autoFocus
			/>
			<Button variant="secondary" disabled={isPending} type="submit" size="medium">
				Lagre
			</Button>
			<Button variant="tertiary" disabled={isPending} type="button" onClick={ikkeIEndreModusLenger} size="medium">
				Avbryt
			</Button>
		</form>
	);
}
