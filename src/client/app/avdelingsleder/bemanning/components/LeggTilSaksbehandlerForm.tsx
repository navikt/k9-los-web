import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Label, TextField } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';
import { useHentSaksbehandlereAvdelingsleder, useLeggTilSaksbehandler } from 'api/queries/avdelingslederQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { hasValidEmailFormat } from 'utils/validation/validators';

// Skrevet om for å unngå final form, og har fortsatt med konsepter derfra
export const LeggTilSaksbehandlerForm: FunctionComponent = () => {
	const [epost, setEpost] = useState('');
	const [touched, setTouched] = useState(false);
	const [validationErrors, setValidationErrors] = useState<any[] | undefined>(undefined);
	const [finnesAllerede, setFinnesAllerede] = useState(false);

	const {
		data: saksbehandlere,
		isLoading: isLoadingSaksbehandlere,
		isSuccess: isSuccessSaksbehandlere,
	} = useHentSaksbehandlereAvdelingsleder();
	const { mutate: leggTilSaksbehandler, isPending: isLoadingLeggTil } = useLeggTilSaksbehandler();

	const validate = (value: string) => {
		const errs = hasValidEmailFormat ? hasValidEmailFormat(value) : undefined;
		setValidationErrors(errs && errs.length ? errs : undefined);
		return errs;
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
		setValidationErrors(undefined);
		setFinnesAllerede(false);
	};

	const onAdd = () => {
		const errs = validate(epost);
		if (errs && errs.length) {
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
		(touched && finnesAllerede && <FormattedMessage id="LeggTilSaksbehandlerForm.FinnesAllerede" />) ||
		(touched && validationErrors && validationErrors[0]?.id && <FormattedMessage id={validationErrors[0].id} />);

	return (
		<div>
			<Label>
				<FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
			</Label>
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
					<FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
				</Button>
			</div>
		</div>
	);
};

export default LeggTilSaksbehandlerForm;
