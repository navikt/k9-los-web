import React, { useEffect, useMemo, useState } from 'react';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Alert, Button, Label, Skeleton } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { useHentAntallOppgaver, useValiderOppgaveQuery } from 'api/queries/oppgaveQueries';
import { FilterContext } from './FilterContext';
import OppgaveQueryModel from './OppgaveQueryModel';
import * as styles from './filterIndex.css';
import { OppgaveQuery } from './filterTsTypes';
import { QueryFunction, applyFunctions } from './queryUtils';
import EnkelSortering from './sortering/EnkelSortering';

interface OwnProps {
	lagre: (oppgaveQuery: OppgaveQuery) => void;
	avbryt: () => void;
	initialQuery?: OppgaveQuery;
	visSortering?: boolean;
	children: React.ReactNode;
}

const KøKriterieEditorProvider = ({ initialQuery, lagre, avbryt, visSortering, children }: OwnProps) => {
	const [queryErrorMessage, setQueryErrorMessage] = useState(null);
	const [queryErrors, setQueryErrors] = useState([]);
	const [shouldRevalidate, setShouldRevalidate] = useState(false);
	const [oppgaveQuery, setOppgaveQuery] = useState(
		initialQuery ? new OppgaveQueryModel(initialQuery).toOppgaveQuery() : new OppgaveQueryModel().toOppgaveQuery(),
	);
	const [antallOppgaver, setAntallOppgaver] = useState<number>();

	const { isPending: validerIsPending, mutate: validerMutate } = useValiderOppgaveQuery();

	const { mutate: hentAntallMutate, isPending: hentAntallIsPending } = useHentAntallOppgaver();

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

	const validerQuery = (feilmelding: string, onSuccess: () => void) => {
		validerMutate(oppgaveQuery, {
			onSuccess: (valideringOK) => {
				const model = new OppgaveQueryModel(oppgaveQuery);
				model.validate();
				const errors = model.getErrors();

				if (valideringOK && errors.length === 0) {
					setQueryErrorMessage(null);
					setQueryErrors([]);
					onSuccess();
				} else {
					setAntallOppgaver(undefined);
					setShouldRevalidate(true);
					setQueryErrors(errors);
					setQueryErrorMessage(feilmelding);
				}
			},
			onError: () => {
				setAntallOppgaver(undefined);
				setShouldRevalidate(true);
				setQueryErrorMessage(feilmelding);
			},
		});
	};

	const hentAntall = () => {
		validerQuery('Kriteriene er ikke gyldige. Kan ikke hente antall oppgaver.', () => {
			hentAntallMutate(oppgaveQuery, {
				onSuccess: (respons) => {
					if (respons !== undefined) {
						setAntallOppgaver(respons);
					}
				},
				onError: () => {
					setQueryErrorMessage('Noe gikk galt ved henting av antall oppgaver. Prøv igjen senere.');
				},
			});
		});
	};

	const validerOgLagre = () => {
		validerQuery('Kriteriene er ikke gyldige. Kriterier for kø kan ikke lagres.', () => {
			lagre(oppgaveQuery);
		});
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
				{children}
				<div className="mt-auto">
					<div className="bg-surface-subtle rounded flex gap-8 p-5 mt-8">
						{visSortering && (
							<div className="w-6/12">
								<EnkelSortering />
							</div>
						)}
						<div className="flex flex-col">
							<Label size="small">
								Antall oppgaver:{' '}
								{validerIsPending || hentAntallIsPending ? <Skeleton className="inline-block w-12" /> : antallOppgaver}
							</Label>
							<Button
								variant="tertiary"
								icon={<ArrowsCirclepathIcon aria-hidden />}
								size="small"
								onClick={hentAntall}
								loading={validerIsPending || hentAntallIsPending}
								disabled={validerIsPending || hentAntallIsPending}
							>
								Oppdater antall
							</Button>
						</div>
					</div>
					{queryErrorMessage && (
						<Alert variant="error" className="my-4">
							{queryErrorMessage}
						</Alert>
					)}
					<div className={styles.filterButtonGroup}>
						<div className="ml-auto">
							<Button className="mr-2" variant="secondary" onClick={avbryt} disabled={validerIsPending}>
								Avbryt
							</Button>
							<Button onClick={validerOgLagre} loading={validerIsPending} disabled={validerIsPending}>
								Lagre
							</Button>
						</div>
					</div>
				</div>
			</div>
		</FilterContext.Provider>
	);
};

export default KøKriterieEditorProvider;
