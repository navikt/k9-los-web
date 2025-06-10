import React, { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Panel, Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { removeFilter, updateFilter } from 'filter/queryUtils';
import * as styles from '../../filterIndex.css';
import { FeltverdiOppgavefilter, Oppgavefelt } from '../../filterTsTypes';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../../utils';
import FilterOperatorOgVerdi from '../FilterOperatorOgVerdi';
import OperatorSelect from '../OperatorSelect';
import { generateId } from './idGenerator';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
}

const FeltverdiOppgavefilterPanel: React.FC<Props> = ({ oppgavefilter }) => {
	const testID = useMemo(() => generateId(), []);

	const { updateQuery } = useContext(FilterContext);
	const { felter: kriterierSomKanVelges } = useContext(AppContext);
	const [feltdefinisjon, setFeltdefinisjon] = useState<Oppgavefelt | undefined>();
	const [isUsingPredefinedValues, setIsUsingPredefinedValues] = useState<boolean>(false);

	useEffect(() => {
		const feltdef = kriterierSomKanVelges.find(
			(fd) => fd.område === oppgavefilter.område && fd.kode === oppgavefilter.kode,
		);
		setFeltdefinisjon(feltdef);
		setIsUsingPredefinedValues(!!feltdef?.verdiforklaringer?.length);
	}, [kriterierSomKanVelges, oppgavefilter.område, oppgavefilter.kode]);

	const handleChangeKey = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const område = områdeFraKey(event.target.value);
		const kode = kodeFraKey(event.target.value);

		const updateData = { område, kode, operator: 'EQUALS', verdi: feltdefinisjon?.tolkes_som === 'boolean' ? [] : '' };
		updateQuery([updateFilter(oppgavefilter.id, updateData)]);
	};

	const options = useMemo(
		() =>
			kriterierSomKanVelges.map((fd) => (
				<option key={feltverdiKey(fd)} value={feltverdiKey(fd)}>
					{fd.visningsnavn}
				</option>
			)),
		[kriterierSomKanVelges],
	);

	return (
		<Panel className={`${styles.filter} ${styles.filterFelt}`} key={oppgavefilter.id} id={`feltpanel-${testID}`} border>
			<div className="flex">
				<Select
					label="Felt"
					hideLabel
					value={feltverdiKey(oppgavefilter)}
					onChange={handleChangeKey}
					className={classNames({ 'mt-[55px]': isUsingPredefinedValues })}
				>
					<option value="">Velg felt</option>
					{options}
				</Select>
				{oppgavefilter.kode && (
					<>
						<OperatorSelect oppgavefilter={oppgavefilter} />
						<FilterOperatorOgVerdi feltdefinisjon={feltdefinisjon} oppgavefilter={oppgavefilter} />
					</>
				)}
			</div>
			<Button
				icon={<TrashIcon height="1.5rem" width="1.5rem" />}
				size="small"
				variant="tertiary"
				onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}
			/>
		</Panel>
	);
};

export default FeltverdiOppgavefilterPanel;
