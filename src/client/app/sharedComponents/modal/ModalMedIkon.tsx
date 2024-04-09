import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import { ErrorMessage } from '@navikt/ds-react';
import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';
import styles from './modalMedIkon.css';

type TsProps = Readonly<{
	cancel: () => void;
	submit?: () => void;
	tekst: {
		formattedMessageId: string;
		values?: Record<string, boolean | string | number>;
		valgmulighetA?: string;
		valgmulighetB: string;
	};
	ikonUrl: string;
	ikonAlt: string;
	errorMessage?: string;
}>;

const ModalMedIkon = ({ cancel, submit, tekst, ikonUrl, ikonAlt, errorMessage }: TsProps) => (
	<Modal className={styles.modal} closeButton={false} isOpen onRequestClose={cancel}>
		<div className={classnames(styles.row, styles.container)}>
			<div>
				<Image className={styles.image} alt={ikonAlt} src={ikonUrl} />
			</div>
			<div className={styles.divider}>
				<div className={styles.text}>
					<Normaltekst>
						{typeof tekst.values === 'undefined' && <FormattedMessage id={tekst.formattedMessageId} />}
						{typeof tekst.values !== 'undefined' && (
							<FormattedMessage id={tekst.formattedMessageId} values={tekst.values} />
						)}
					</Normaltekst>
				</div>
			</div>
			<div className={classnames(styles.row, styles.buttons)}>
				{tekst.valgmulighetA && typeof submit !== 'undefined' && (
					<Hovedknapp className={styles.submitButton} mini htmlType="submit" onClick={() => submit()} autoFocus>
						{tekst.valgmulighetA}
					</Hovedknapp>
				)}
				<Knapp className={styles.cancelButton} mini htmlType="reset" onClick={() => cancel()}>
					{tekst.valgmulighetB}
				</Knapp>
			</div>
		</div>
		{errorMessage && (
			<div>
				<ErrorMessage> {errorMessage} </ErrorMessage>
			</div>
		)}
	</Modal>
);

ModalMedIkon.propTypes = {
	submit: PropTypes.func.isRequired,
	cancel: PropTypes.func.isRequired,
};

export default ModalMedIkon;
