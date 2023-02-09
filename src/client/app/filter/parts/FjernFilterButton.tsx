import React from 'react';

import { Delete } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";

import styles from './FjernFilterButton.less';

interface OwnProps {
   oppgavefilter: Oppgavefilter,
   onFjernFilter: (oppgavefilter: Oppgavefilter) => void,
}

const FjernFilterButton = ({oppgavefilter, onFjernFilter}): OwnProps => {
    return <Button className={styles.filterFjern} icon={<Delete aria-hidden />} size="small" variant="tertiary" onClick={() => onFjernFilter(oppgavefilter)}></Button>
}

export default FjernFilterButton;