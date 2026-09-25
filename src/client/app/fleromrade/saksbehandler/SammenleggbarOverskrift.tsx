import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import styles from './sammenleggbarOverskrift.module.css';

interface Props {
	tittel: string;
	åpen: boolean;
	onToggle: () => void;
	/** Id-en til innholdet som vises og skjules. */
	innholdId: string;
}

/** Overskrift med chevron som viser og skjuler en seksjon, som i legacy-K9. */
const SammenleggbarOverskrift = ({ tittel, åpen, onToggle, innholdId }: Props) => (
	<button type="button" className={styles.knapp} aria-expanded={åpen} aria-controls={innholdId} onClick={onToggle}>
		{åpen ? (
			<ChevronDownIcon className={styles.chevron} aria-hidden />
		) : (
			<ChevronRightIcon className={styles.chevron} aria-hidden />
		)}
		<Label as="span">{tittel}</Label>
	</button>
);

export default SammenleggbarOverskrift;
