import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import * as styles from './oppgaverTabellMenyAntallOppgaver.css';

interface OwnProps {
	antallOppgaver: number;
	tekstId: string;
	hastesak?: boolean;
}

const OppgaveTabellMenyAntallOppgaver: FunctionComponent<OwnProps> = ({ antallOppgaver, tekstId, hastesak }) => (
	<div className={classnames(styles.container, { [styles.hastesak]: hastesak && antallOppgaver > 0 })}>
		{hastesak && antallOppgaver > 0 && (
			<ExclamationmarkTriangleFillIcon height="1.5rem" width="1.5rem" className={styles.hastesakIkon} />
		)}
		<div className="m-1">
			<FormattedMessage id={tekstId} values={{ antall: antallOppgaver }} />
		</div>
	</div>
);

export default OppgaveTabellMenyAntallOppgaver;
