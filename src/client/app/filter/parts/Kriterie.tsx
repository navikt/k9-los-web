import React, { useContext, useMemo } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Label } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { kriterierSomSkalGrupperes } from 'filter/konstanter';
import { removeFilter } from 'filter/queryUtils';
import { FeltverdiOppgavefilter, OppgavefilterKode } from '../filterTsTypes';
import { Aksjonspunktvisning } from './Aksjonspunktvisning';
import KriterieOperator from './KriterieOperator';
import KriterieVerdi from './KriterieVerdi';
import { generateId } from './idGenerator';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
	paakrevdeKoder: OppgavefilterKode[];
	readOnly: boolean;
}

const erAksjonspunktFelt = (feltdefinisjon) => kriterierSomSkalGrupperes.includes(feltdefinisjon.kode);

const Kriterie: React.FC<Props> = ({ oppgavefilter, paakrevdeKoder = [], readOnly = false }) => {
	const testID = useMemo(() => generateId(), []);

	const { updateQuery } = useContext(FilterContext);
	const { felter: kriterierSomKanVelges } = useContext(AppContext);
	const feltdefinisjon = kriterierSomKanVelges.find(
		(fd) => fd.område === oppgavefilter.område && fd.kode === oppgavefilter.kode,
	);

	const kriterieErPåkrevd = paakrevdeKoder.some((v) => v === feltdefinisjon?.kode);
	return (
		<div id={`feltpanel-${testID}`} className="rounded bg-surface-selected p-4">
			<div className="flex gap-4">
				<Label size="small" className="min-w-[10.5rem] w-[10.5rem] my-auto">
					{feltdefinisjon?.visningsnavn}:
				</Label>
				{oppgavefilter.kode && (
					<div className="flex grow gap-4">
						<KriterieOperator oppgavefilter={oppgavefilter} readOnly={readOnly} />
						<div className="grow">
							<KriterieVerdi feltdefinisjon={feltdefinisjon} oppgavefilter={oppgavefilter} readOnly={readOnly} />
						</div>
					</div>
				)}
				{!readOnly && (
					<div>
						<Button
							className={`ml-auto ${kriterieErPåkrevd ? 'invisible' : ''}`}
							icon={<TrashIcon />}
							size="small"
							variant="tertiary"
							onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}
						/>
					</div>
				)}
			</div>
			{feltdefinisjon && erAksjonspunktFelt(feltdefinisjon) && (
				<Aksjonspunktvisning oppgavefilter={oppgavefilter} feltdefinisjon={feltdefinisjon} />
			)}
		</div>
	);
};

export default Kriterie;
