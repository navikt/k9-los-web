import { useContext } from 'react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { addSortering, removeSortering, updateSortering } from 'filter/queryUtils';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../utils';
import * as styles from './OppgaveOrderFelter.module.css';

const OppgaveOrderFelter = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const handleRemoveFelt = (feltId) => {
		updateQuery([removeSortering(feltId)]);
	};

	const handleAddFelt = () => {
		updateQuery([addSortering()]);
	};

	const handleUpdateKode = (feltId, value) => {
		updateQuery([
			updateSortering(feltId, {
				område: områdeFraKey(value),
				kode: kodeFraKey(value),
			}),
		]);
	};

	const handleUpdateDirection = (feltId, direction) => {
		updateQuery([
			updateSortering(feltId, {
				økende: direction,
			}),
		]);
	};

	return (
		<div>
			{oppgaveQuery?.order?.map((felt) => (
				<div className={styles.orderEnkelFelt} key={felt.id}>
					<Select
						label=""
						className={styles.noGap}
						value={feltverdiKey(felt)}
						onChange={(event) => handleUpdateKode(felt.id, event.target.value)}
					>
						<option value="">Velg felt</option>
						{felter.map((feltdefinisjon) => (
							<option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
								{feltdefinisjon.visningsnavn}
							</option>
						))}
					</Select>
					<Select
						label=""
						className={styles.orderDirection}
						value={felt.økende}
						onChange={(event) => handleUpdateDirection(felt.id, event.target.value)}
					>
						<option key="true" value="true">
							Økende
						</option>
						<option key="false" value="false">
							Synkende
						</option>
					</Select>
					<Button
						icon={<TrashIcon height="1.5rem" width="1.5rem" />}
						size="medium"
						variant="tertiary"
						onClick={() => handleRemoveFelt(felt.id)}
					/>
				</div>
			))}
			<Button
				className={styles.orderLeggTil}
				icon={<PlusCircleIcon aria-hidden />}
				size="small"
				variant="tertiary"
				onClick={handleAddFelt}
			>
				Legg til sortering
			</Button>
		</div>
	);
};

export default OppgaveOrderFelter;
