import React, { useEffect, useMemo, useState } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import apiPaths from 'api/apiPaths';
import { post } from 'utils/axios';
import { AntallOppgaver } from './AntallOppgaver';
import { FilterContext } from './FilterContext';
import OppgaveQueryModel from './OppgaveQueryModel';
import * as styles from './filterIndex.css';
import { OppgaveQuery, OppgavefilterKode } from './filterTsTypes';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import { QueryFunction, addFilter, addGruppe, applyFunctions } from './queryUtils';
import EnkelSortering from './sortering/EnkelSortering';

interface OwnProps {
	lagre: (oppgaveQuery: OppgaveQuery) => void;
	avbryt: () => void;
	initialQuery?: OppgaveQuery;
	tittel: string;
	paakrevdeKoder?: OppgavefilterKode[];
	readOnlyKoder?: OppgavefilterKode[];
	visSortering?: boolean;
}

const KøKriterieEditor = ({
	initialQuery,
	lagre,
	avbryt,
	tittel,
	visSortering,
	paakrevdeKoder,
	readOnlyKoder,
}: OwnProps) => {
	const [queryErrorMessage, setQueryErrorMessage] = useState(null);
	const [queryErrors, setQueryErrors] = useState([]);
	const [shouldRevalidate, setShouldRevalidate] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const [oppgaveQuery, setOppgaveQuery] = useState(
		initialQuery ? new OppgaveQueryModel(initialQuery).toOppgaveQuery() : new OppgaveQueryModel().toOppgaveQuery(),
	);

	useEffect(() => {
		if (oppgaveQuery && shouldRevalidate) {
			const model = new OppgaveQueryModel(oppgaveQuery);
			const errors = model.validate().getErrors();
			if (errors.length === 0) {
				setShouldRevalidate(false);
			}
			setQueryErrors(errors);
		}
	}, [oppgaveQuery, shouldRevalidate]);

	const updateQuery = (operations: Array<QueryFunction>) => {
		const newQuery = applyFunctions(oppgaveQuery, operations);
		setOppgaveQuery(newQuery);
	};

	const { felter } = React.useContext(AppContext);

	const validateOppgaveQuery = async (isValidatingFunc: (validating: boolean) => void): Promise<boolean> => {
		isValidatingFunc(true);
		return post(apiPaths.validerQuery, oppgaveQuery)
			.then((data: boolean) => {
				isValidatingFunc(false);
				return data;
			})
			.catch(() => {
				isValidatingFunc(false);
				return false;
			});
	};

	const validerOgLagre = async () => {
		const valideringOK = await validateOppgaveQuery(setIsValidating);
		const model = new OppgaveQueryModel(oppgaveQuery);
		model.validate();
		const errors = model.getErrors();
		if (valideringOK && errors.length === 0) {
			setQueryErrorMessage(null);
			setQueryErrors([]);
			lagre(oppgaveQuery);
			return;
		}
		setShouldRevalidate(true);
		setQueryErrors(errors);
		setQueryErrorMessage('Kriteriene er ikke gyldige. Kriterier for kø kan ikke lagres.');
	};

	const filterContextValues = useMemo(
		() => ({
			oppgaveQuery,
			updateQuery,
			errors: queryErrors,
		}),
		[oppgaveQuery, queryErrors],
	);

	if (felter.length === 0) {
		return null;
	}

	return (
		<FilterContext.Provider value={filterContextValues}>
			<div className="mt-3 p-4 rounded-lg flex flex-col flex-grow">
				<Heading size="small" spacing className="mt-3">
					{tittel}
				</Heading>
				<div className="flex flex-col gap-4">
					{oppgaveQuery.filtere.map((item) => (
						<OppgavefilterPanel
							key={item.id}
							køvisning
							oppgavefilter={item}
							addGruppeOperation={addGruppe(oppgaveQuery.id)}
							paakrevdeKoder={paakrevdeKoder}
							readOnlyKoder={readOnlyKoder}
						/>
					))}
				</div>
				<div>
					<Button
						className="mt-4 mb-13"
						icon={<PlusCircleIcon aria-hidden />}
						variant="tertiary"
						size="small"
						onClick={() => updateQuery([addFilter(oppgaveQuery.id)])}
					>
						Legg til nytt kriterie
					</Button>
				</div>
				<div className="mt-auto">
					<div className="bg-surface-subtle rounded flex gap-8 p-5 mt-8">
						{visSortering && (
							<div className="w-6/12">
								<EnkelSortering />
							</div>
						)}
						<AntallOppgaver setQueryError={setQueryErrorMessage} />
					</div>
					{queryErrorMessage && (
						<Alert variant="error" className="my-4">
							{queryErrorMessage}
						</Alert>
					)}
					<div className={styles.filterButtonGroup}>
						<div className="ml-auto">
							<Button className="mr-2" variant="secondary" onClick={avbryt} disabled={isValidating}>
								Avbryt
							</Button>
							<Button onClick={validerOgLagre} loading={isValidating} disabled={isValidating}>
								Lagre
							</Button>
						</div>
					</div>
				</div>
			</div>
		</FilterContext.Provider>
	);
};

export default KøKriterieEditor;
