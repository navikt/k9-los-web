import { CopyButton } from '@navikt/ds-react';
import { cloneElement, type FunctionComponent, type ReactElement, type ReactNode, useState } from 'react';
import styles from './kopierbarVerdi.module.css';

interface Props {
	copyText: string;
	title: string;
	children: ReactNode;
}

interface KopieringsområdeProps {
	children: ReactElement<{ className?: string }>;
}

export const Kopieringsområde: FunctionComponent<KopieringsområdeProps> = ({ children }) =>
	cloneElement(children, {
		className: [children.props.className, styles.område].filter(Boolean).join(' '),
	});

const KopierbarVerdi: FunctionComponent<Props> = ({ copyText, title, children }) => {
	const [kopiert, setKopiert] = useState(false);

	return (
		<div className={`${styles.wrapper} ${kopiert ? styles.kopiert : ''}`}>
			<div className={styles.innhold}>{children}</div>
			<div className={styles.knapp}>
				<CopyButton copyText={copyText} title={title} size="xsmall" onActiveChange={setKopiert} />
			</div>
		</div>
	);
};

export default KopierbarVerdi;
