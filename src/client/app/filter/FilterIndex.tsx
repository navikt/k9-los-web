import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ArrowCirclepathIcon, DownloadIcon, MagnifyingGlassIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Loader, ReadMore, Select, TextField } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { useAlleKoer, useKo } from 'api/queries/avdelingslederQueries';
import { useLastNedOppgaverSomFil, useSøkOppgaver } from 'api/queries/oppgaveQueries';
import { FilterContext } from './FilterContext';
import OppgaveQueryModel from './OppgaveQueryModel';
import * as styles from './filterIndex.css';
import { OppgaveQuery, Oppgaverad } from './filterTsTypes';
import OppgaveQueryResultat from './parts/OppgaveQueryResultat';
import OppgaveSelectFelter from './parts/OppgaveSelectFelter';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import { QueryFunction, addFilter, addGruppe, applyFunctions } from './queryUtils';
import OppgaveOrderFelter from './sortering/OppgaveOrderFelter';

interface OwnProps {
	initialQuery?: OppgaveQuery;
}

const resultatErKunAntall = (oppgaver: Oppgaverad[]) => {
	if (oppgaver.length === 1) {
		if (oppgaver[0].felter.length === 1 && (oppgaver[0].felter[0].kode as string) === 'Antall') {
			return true;
		}
	}
	return false;
};

const antallTreffOppgaver = (oppgaver: Oppgaverad[]) => {
	if (resultatErKunAntall(oppgaver)) {
		return oppgaver[0].felter[0].verdi as string;
	}

	return String(oppgaver.length);
};

// Custom deep comparison excluding the limit field
const hasQueryChangedExcludingLimit = (prev, current) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { limit, ...prevRest } = prev;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { limit: currLimit, ...currRest } = current;

	return JSON.stringify(prevRest) !== JSON.stringify(currRest);
};

const FilterIndex = ({ initialQuery }: OwnProps) => {
	const [queryErrorMessage, setQueryErrorMessage] = useState(null);
	const [queryErrors, setQueryErrors] = useState([]);
	const [koId, setKoId] = useState(null);
	const [oppgaveQuery, setOppgaveQuery] = useState(
		initialQuery ? new OppgaveQueryModel(initialQuery).toOppgaveQuery() : new OppgaveQueryModel().toOppgaveQuery(),
	);

	const updateQuery = (operations: Array<QueryFunction>) => {
		const newQuery = applyFunctions(oppgaveQuery, operations);
		setOppgaveQuery(newQuery);
	};

	const { felter } = React.useContext(AppContext);

	const [oppgaver, setOppgaver] = useState<Oppgaverad[]>(null);
	const [antallTreff, setAntallTreff] = useState('0');
	const [prevOppgaveQuery, setPrevOppgaveQuery] = useState({});

	const { mutate: søkOppgaver, isPending: isSøkPending } = useSøkOppgaver();
	const { mutate: lastNedOppgaverSomFil, isPending: isDownloadPending } = useLastNedOppgaverSomFil();

	const nullstillTreff = () => {
		setAntallTreff('0');
		setOppgaver(null);
	};

	useEffect(() => {
		if (Array.isArray(oppgaver)) setAntallTreff(antallTreffOppgaver(oppgaver));
	}, [oppgaver]);

	useEffect(() => {
		if (hasQueryChangedExcludingLimit(prevOppgaveQuery, oppgaveQuery)) {
			nullstillTreff();
			setPrevOppgaveQuery(oppgaveQuery);
			setQueryErrorMessage(null);
		}
	}, [oppgaveQuery]);

	const { data: koer, isLoading: koerIsLoading } = useAlleKoer();

	const { data: køData, isSuccess } = useKo(koId, {
		enabled: !!koId,
	});

	useEffect(() => {
		if (isSuccess) {
			const newQuery = new OppgaveQueryModel(køData.oppgaveQuery).toOppgaveQuery();
			setOppgaveQuery(newQuery);
		}
	}, [isSuccess]);

	const executeOppgavesøk = () => {
		nullstillTreff();
		function updateIdentities(oppgaverader: Oppgaverad[]) {
			oppgaverader.map((v) => ({
				...v,
				id: uuid(),
			}));
			return oppgaverader;
		}

		søkOppgaver(oppgaveQuery, {
			onSuccess: (data) => {
				setOppgaver(updateIdentities(data));
				setQueryErrorMessage(null);
			},
			onError: () => {
				setOppgaver([]);
				setQueryErrorMessage('Klarte ikke å kjøre søk grunnet ukjent feil.');
			},
		});
	};

	const executeOppgavesøkToFile = () => {
		lastNedOppgaverSomFil(new OppgaveQueryModel(oppgaveQuery).updateLimit(-1).toOppgaveQuery(), {
			onSuccess: () => {
				setQueryErrorMessage(null);
			},
			onError: () => {
				setQueryErrorMessage('Klarte ikke å kjøre søk grunnet ukjent feil.');
			},
		});
	};

	const oppdaterLimit = (limit) => {
		if (!Number.isNaN(limit) && limit >= 0) {
			setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).updateLimit(limit).toOppgaveQuery());
		}
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
					Søk på oppgaver
				</Heading>
				<ReadMore header="Ta utgangspunkt i eksisterende kø (valgfritt)">
					{koerIsLoading && <Loader title="Laster køer" />}
					{!!koer?.length && (
						<Select
							label="Eksisterende køer"
							onChange={(e) => setKoId(e.target.value)}
							size="small"
							className="w-[400px] my-7"
						>
							<option value="">Velg kø</option>
							{koer.map((item) => (
								<option value={item.id} key={item.id}>
									{item.tittel}
								</option>
							))}
						</Select>
					)}
				</ReadMore>
				<div className="flex flex-col gap-4">
					{oppgaveQuery.filtere.map((item) => (
						<OppgavefilterPanel
							key={item.id}
							oppgavefilter={item}
							addGruppeOperation={addGruppe(oppgaveQuery.id)}
							køvisning={false}
							paakrevdeKoder={[]}
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
				<OppgaveSelectFelter />
				<div className="mt-auto">
					<OppgaveOrderFelter />
					{queryErrorMessage && (
						<Alert variant="error" className="my-4">
							{queryErrorMessage}
						</Alert>
					)}
					<div className="flex gap-4">
						<Button variant="primary" icon={<MagnifyingGlassIcon />} onClick={executeOppgavesøk} loading={isSøkPending}>
							Søk
						</Button>
						<Button
							variant="secondary"
							icon={<DownloadIcon />}
							onClick={executeOppgavesøkToFile}
							loading={isDownloadPending}
						>
							Last ned CSV
						</Button>
					</div>
				</div>
			</div>
			<div className="mt-10">
				{queryErrorMessage && <Alert variant="error">{queryErrorMessage}</Alert>}
				{oppgaver && (
					<>
						<Heading size="small" spacing className="mt-6">
							Søkeresultat
						</Heading>
						<ReadMore header={`Maksimalt antall rader: ${oppgaveQuery.limit}. Klikk her for å endre dette.`}>
							<TextField
								className={`${styles.limitTextField} inline`}
								label="Maksimalt antall rader"
								description="Du kan endre antallet rader som blir hentet ned ved søk. Trykk på søkeknappen etter å ha oppdatert antallet. Merk at høye tall kan medføre at du må vente en stund før svaret kommer. Hvis søket blir avbrutt, fordi det tar for lang tid, så kan du forsøke det samme søket på nytt."
								htmlSize={4}
								type="number"
								min={1}
								defaultValue={oppgaveQuery.limit}
								onChange={(event) => oppdaterLimit(parseInt(event.target.value, 10))}
							/>
							<Button
								className="ml-2"
								variant="tertiary"
								icon={<ArrowCirclepathIcon />}
								size="small"
								onClick={executeOppgavesøk}
								loading={isSøkPending}
							>
								Søk på nytt
							</Button>
						</ReadMore>
						<BodyShort className="mt-6">{`Fant ${
							Number(antallTreff) > 0 && Number(antallTreff) === oppgaveQuery.limit
								? Number(antallTreff) === oppgaveQuery.limit && `mer enn ${antallTreff} oppgaver`
								: `${antallTreff} oppgaver`
						}`}</BodyShort>
						{!resultatErKunAntall(oppgaver) && (
							<OppgaveQueryResultat felter={felter} oppgaveQuery={oppgaveQuery} oppgaver={oppgaver} />
						)}
					</>
				)}
			</div>
		</FilterContext.Provider>
	);
};

export default FilterIndex;
