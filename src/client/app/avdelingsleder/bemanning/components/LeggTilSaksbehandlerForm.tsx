import React, { FunctionComponent, useState } from 'react';
import { Field, FieldMetaState, Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { FormApi } from 'final-form';
import { Button, Label, TextField } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';
import { useHentSaksbehandlereAvdelingsleder, useLeggTilSaksbehandler } from 'api/queries/avdelingslederQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { hasValidEmailFormat } from 'utils/validation/validators';

export const LeggTilSaksbehandlerForm: FunctionComponent = () => {
	const [finnesAllerede, setFinnesAllerede] = useState(false);
	const {
		data: saksbehandlere,
		isLoading: isLoadingSaksbehandlere,
		isSuccess: isSuccessSaksbehandlere,
	} = useHentSaksbehandlereAvdelingsleder();
	const { mutate: leggTilSaksbehandler, isPending: isLoadingLeggTil } = useLeggTilSaksbehandler();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const addSaksbehandler = (epost: string, form: FormApi<any, Partial<any>>, meta: FieldMetaState<any>) => {
		if (meta.error) {
			form.blur('epost');
			return;
		}
		if (isSuccessSaksbehandlere && saksbehandlere.some((s) => s.epost.toLowerCase() === epost.toLowerCase())) {
			setFinnesAllerede(true);
		} else {
			leggTilSaksbehandler(
				{ epost },
				{
					onSuccess: () => {
						form.reset();
						form.resetFieldState('epost');
					},
				},
			);
		}
	};

	return (
		<Form
			onSubmit={() => undefined}
			render={({ form, values }) => (
				<div>
					<Label>
						<FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
					</Label>
					<VerticalSpacer eightPx />
					<div className="flex flex-row">
						<Field name="epost" validate={hasValidEmailFormat}>
							{({ input, meta }) => (
								<>
									<TextField
										onChange={input.onChange}
										onBlur={input.onBlur}
										value={input.value}
										label="Epost"
										size="small"
										className="w-72"
										error={
											(meta.touched && finnesAllerede && (
												<FormattedMessage id="LeggTilSaksbehandlerForm.FinnesAllerede" />
											)) ||
											(meta.touched && meta.error?.[0] && <FormattedMessage id={meta.error[0].id} />)
										}
									/>
									<Button
										className="ml-4 h-[30px] mt-[1.7rem]"
										loading={isLoadingLeggTil}
										size="small"
										variant="secondary"
										disabled={isLoadingSaksbehandlere}
										onClick={() => addSaksbehandler(values.epost, form, meta)}
										icon={<PlusIcon />}
									>
										<FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
									</Button>
								</>
							)}
						</Field>
					</div>
				</div>
			)}
		/>
	);
};

export default LeggTilSaksbehandlerForm;
