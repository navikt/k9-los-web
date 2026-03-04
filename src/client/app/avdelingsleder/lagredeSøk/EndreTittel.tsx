import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@navikt/ds-react';
import { LagretSøk, useEndreLagretSøk } from 'api/queries/avdelingslederQueries';

export function EndreTittel({
	lagretSøk,
	ikkeIEndreModusLenger,
}: {
	lagretSøk: LagretSøk;
	ikkeIEndreModusLenger: () => void;
}) {
	const { mutate, isPending, isError } = useEndreLagretSøk(ikkeIEndreModusLenger);
	const [tittel, setTittel] = useState(lagretSøk.tittel);
	const [feilmelding, setFeilmelding] = useState('');

	useEffect(() => {
		if (isError) {
			setFeilmelding('Noe gikk galt ved lagring av søk. Prøv å oppfrisk siden.');
		}
	}, [isError]);

	return (
		<form
			className="flex gap-2 items-start"
			onSubmit={(event) => {
				event.preventDefault();
				mutate({ ...lagretSøk, tittel });
			}}
			onReset={(event) => {
				event.preventDefault();
				mutate({ ...lagretSøk, tittel: '' });
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
				size="small"
				autoFocus
			/>
			<Button variant="secondary" disabled={isPending} type="submit" size="small">
				Lagre
			</Button>
			{lagretSøk.tittel.length > 0 && (
				<Button variant="secondary" disabled={isPending} type="reset" size="small">
					Fjern tittel
				</Button>
			)}
			<Button variant="tertiary" disabled={isPending} type="button" onClick={ikkeIEndreModusLenger} size="small">
				Avbryt
			</Button>
		</form>
	);
}
