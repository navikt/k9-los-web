import React, { Component, ReactNode } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import classnames from 'classnames/bind';
import { Detail } from '@navikt/ds-react';
import * as styles from './label.module.css';

const classNames = classnames.bind(styles);

export type LabelType =
	| string
	| ReactNode
	| {
			id: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			args?: any;
	  };

interface OwnProps {
	input: LabelType;
	typographyElement?: React.ElementType;
	readOnly?: boolean;
}

/**
 * @deprecated
 */

export class Label extends Component<OwnProps & WrappedComponentProps> {
	// eslint-disable-next-line react/static-property-placement
	static defaultProps = {
		typographyElement: Detail,
		readOnly: false,
	};

	constructor(props) {
		super(props);
		this.format = this.format.bind(this);
	}

	format(label) {
		if (label && label.id) {
			const { intl } = this.props;
			return intl.formatMessage({ id: label.id }, label.args);
		}
		return label;
	}

	render() {
		const { input, readOnly, typographyElement: TypoElem } = this.props;
		if (!input) {
			return null;
		}
		return (
			<span className={classNames('labelWrapper', { readOnly })}>
				<TypoElem tag="span" className={styles.label}>
					{this.format(input)}
				</TypoElem>
			</span>
		);
	}
}

export default injectIntl(Label);
