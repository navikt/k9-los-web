import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import { Detail, TextField } from '@navikt/ds-react';
import ArrowBox from 'sharedComponents/ArrowBox';
import * as styles from './utvalgskriterierForOppgavekoForm.module.css';

const validate = (values) => {
	const errors: {
		fraBelop?: string;
		tilBelop?: string;
	} = {};

	if (!values.fraBelop) {
		errors.fraBelop = 'Fra må ikke være tom.';
	} else if (values.tilBelop < values.fraBelop && values.tilBelop !== 0) {
		errors.tilBelop = 'Til må være større enn fra.';
	}

	return errors;
};

interface OwnProps {
	til: number;
	fra: number;
	lagreFilteringBelopp: (fraBelop: number, tilBelop: number) => void;
}

/**
 *
 * @deprecated
 *
 */
const BelopSorteringValg: React.FunctionComponent<OwnProps> = ({ til, fra, lagreFilteringBelopp }) => {
	const formik = useFormik({
		initialValues: { fraBelop: fra || 0, tilBelop: til || 0 },
		enableReinitialize: true,
		onSubmit: (values) => lagreFilteringBelopp(values.fraBelop, values.tilBelop),
		validate,
	});

	return (
		<div className={styles.arrowBoxContainer}>
			<ArrowBox>
				<form onSubmit={formik.handleSubmit}>
					<div className={styles.belopContainer}>
						<TextField
							name="fraBelop"
							onChange={(e) =>
								formik.handleChange({
									target: { name: 'fraBelop', value: parseInt(e.target.value, 10) },
								})
							}
							value={formik.values.fraBelop}
							onBlur={() => formik.handleSubmit()}
							size="small"
							type="number"
							label="Fra"
						/>
						<Detail className={styles.belop}>
							<FormattedMessage id="SorteringVelger.Valuta" />
						</Detail>
						<TextField
							name="tilBelop"
							onChange={(e) =>
								formik.handleChange({
									target: { name: 'tilBelop', value: parseInt(e.target.value, 10) },
								})
							}
							value={formik.values.tilBelop}
							onBlur={() => formik.handleSubmit()}
							size="small"
							type="number"
							label="Til"
						/>
						<Detail className={styles.belop}>
							<FormattedMessage id="SorteringVelger.Valuta" />
						</Detail>
					</div>
				</form>
				{(formik.errors.fraBelop || formik.errors.tilBelop) && (
					<span className={styles.feilmelding}>
						{formik.errors.fraBelop ? formik.errors.fraBelop : formik.errors.tilBelop}
					</span>
				)}
			</ArrowBox>
		</div>
	);
};

export default BelopSorteringValg;
