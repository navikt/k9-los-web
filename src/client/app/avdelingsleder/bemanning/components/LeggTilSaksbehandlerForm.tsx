import React, { FunctionComponent, useState } from 'react';
import { Button, Label, TextField } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { useHentSaksbehandlereAvdelingsleder, useLeggTilSaksbehandler } from 'api/queries/avdelingslederQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

// Flyttet fra tidligere fil validators.js
const isEmpty = (text: string) => text === null || text === undefined || text.toString().trim().length === 0;
const emailPattern =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const LeggTilSaksbehandlerForm: FunctionComponent = () => {
	const [epost, setEpost] = useState('');
	const [touched, setTouched] = useState(false);
	const [feilmelding, setFeilmelding] = useState<string>();
	const [finnesAllerede, setFinnesAllerede] = useState(false);

	const {
		data: saksbehandlere,
		isLoading: isLoadingSaksbehandlere,
		isSuccess: isSuccessSaksbehandlere,
	} = useHentSaksbehandlereAvdelingsleder();
	const { mutate: leggTilSaksbehandler, isPending: isLoadingLeggTil } = useLeggTilSaksbehandler();

	const validate = (value: string) => {
		let nyFeilmelding: string;
		if (isEmpty(value) || !emailPattern.test(value)) {
			nyFeilmelding = 'Ugyldig e-post adresse';
		} else {
			nyFeilmelding = undefined;
		}
		setFeilmelding(nyFeilmelding);
		return nyFeilmelding;
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setEpost(val);
		setFinnesAllerede(false);
		if (touched) validate(val);
	};

	const onBlur = () => {
		if (!touched) setTouched(true);
		validate(epost);
	};

	const resetForm = () => {
		setEpost('');
		setTouched(false);
		setFeilmelding(undefined);
		setFinnesAllerede(false);
	};

	const onAdd = () => {
		const harFeilmelding = validate(epost) !== undefined;
		if (harFeilmelding) {
			setTouched(true);
			return;
		}
		if (isSuccessSaksbehandlere && saksbehandlere.some((s) => s.epost.toLowerCase() === epost.toLowerCase())) {
			setFinnesAllerede(true);
			return;
		}
		leggTilSaksbehandler(
			{ epost },
			{
				onSuccess: () => {
					resetForm();
				},
			},
		);
	};

	const errorNode =
		(touched && finnesAllerede && 'E-post adressen finnes allerede i listen') || (touched && feilmelding);

	return (
		<div>
			<Label>Legg til saksbehandler</Label>
			<VerticalSpacer eightPx />
			<div className="flex flex-row">
				<TextField
					label="Epost"
					size="small"
					className="w-72"
					// Show error only if any
					error={errorNode || undefined}
					value={epost}
					onChange={onChange}
					onBlur={onBlur}
				/>
				<Button
					className="ml-4 h-[30px] mt-[1.7rem]"
					loading={isLoadingLeggTil}
					size="small"
					variant="secondary"
					disabled={isLoadingSaksbehandlere}
					onClick={onAdd}
					icon={<PlusIcon />}
				>
					Legg til saksbehandler
				</Button>
			</div>
		</div>
	);
};

export default LeggTilSaksbehandlerForm;
