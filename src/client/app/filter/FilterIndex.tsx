import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Download, Refresh, Search } from '@navikt/ds-icons';
import { Alert, BodyShort, Button, Heading, ReadMore, TextField } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { K9LosApiKeys, k9LosApi } from 'api/k9LosApi';
import { useKo } from 'api/queries/avdelingslederQueries';
import { REQUEST_POLLING_CANCELLED } from 'api/rest-api';
import { FilterContext, OrderContext } from './FilterContext';
import OppgaveQueryModel from './OppgaveQueryModel';
import styles from './filterIndex.css';
import { EnkelSelectFelt, OppgaveQuery, Oppgavefelt, Oppgaverad } from './filterTsTypes';
import OppgaveQueryResultat from './parts/OppgaveQueryResultat';
import OppgaveSelectFelter from './parts/OppgaveSelectFelter';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import SorteringContainer from './sortering/SorteringContainer';
import { kodeFraKey, områdeFraKey } from './utils';

interface OwnProps {
	lagre?: (oppgaveQuery: OppgaveQuery) => void;
	avbryt?: () => void;
	initialQuery?: OppgaveQuery;
	tittel: string;
	visningV2?: boolean;
	køvisning?: boolean;
}

const resultatErKunAntall = (oppgaver: Oppgaverad[]) => {
	if (oppgaver.length === 1) {
		if (oppgaver[0].felter.length === 1 && oppgaver[0].felter[0].kode === 'Antall') {
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
	const { limit, ...prevRest } = prev;
	const { limit: currLimit, ...currRest } = current;

	return JSON.stringify(prevRest) !== JSON.stringify(currRest);
};
const FilterIndex = ({ initialQuery, lagre, avbryt, tittel, visningV2, køvisning }: OwnProps) => {
	const [oppgaveQuery, setOppgaveQuery] = useState(
		initialQuery ? new OppgaveQueryModel(initialQuery).toOppgaveQuery() : new OppgaveQueryModel().toOppgaveQuery(),
	);

	const { felter } = React.useContext(AppContext);
	console.log(felter);

	const [oppgaver, setOppgaver] = useState<Oppgaverad[]>(null);
	const [antallTreff, setAntallTreff] = useState('0');
	const [prevOppgaveQuery, setPrevOppgaveQuery] = useState({});

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
		}
	}, [oppgaveQuery]);

	const [queryError, setQueryError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingDownload, setLoadingDownload] = useState(false);
	const [koId, setKoId] = useState(null);
	const [visFelterSomSkalVises, setVisFelterSomSkalVises] = useState(false);

	useKo(koId, {
		enabled: !!koId,
		onSuccess: (data) => {
			const newQuery = new OppgaveQueryModel(data.oppgaveQuery).toOppgaveQuery();
			setOppgaveQuery(newQuery);
			if (newQuery.select.length) {
				setVisFelterSomSkalVises(true);
			}
		},
	});

	const executeOppgavesøk = () => {
		nullstillTreff();
		function updateIdentities(oppgaverader: Oppgaverad[]) {
			oppgaverader.map((v) => ({
				...v,
				id: uuid(),
			}));
			return oppgaverader;
		}

		if (loading) {
			return;
		}

		setLoading(true);

		k9LosApi
			.startRequest(K9LosApiKeys.OPPGAVE_QUERY, oppgaveQuery)
			.then((dataRes) => {
				if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
					setOppgaver(updateIdentities(dataRes.payload));
					setQueryError(null);
					setLoading(false);
				} else {
					setOppgaver([]);
					setQueryError('Klarte ikke å kjøre søk grunnet tidsavbrudd.');
					setLoading(false);
				}
			})
			.catch(() => {
				setOppgaver([]);
				setQueryError('Klarte ikke å kjøre søk grunnet ukjent feil.');
				setLoading(false);
			});
	};

	const executeOppgavesøkToFile = async () => {
		if (loadingDownload) {
			return;
		}

		setLoadingDownload(true);

		try {
			const dataRes = await k9LosApi.startRequest(
				K9LosApiKeys.OPPGAVE_QUERY_TO_FILE,
				new OppgaveQueryModel(oppgaveQuery).updateLimit(-1).toOppgaveQuery(),
			);

			if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
				setQueryError(null);
			} else {
				setQueryError('Klarte ikke å kjøre søk grunnet tidsavbrudd.');
			}
		} catch {
			setQueryError('Klarte ikke å kjøre søk grunnet ukjent feil.');
		} finally {
			setLoadingDownload(false);
		}
	};

	const fjernFilter = (id: string) => {
		setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).removeFilter(id).toOppgaveQuery());
	};

	const leggTilFilter = (id: string) => {
		setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).addFilter(id).toOppgaveQuery());
	};

	const leggTilGruppe = (id: string) => {
		setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).addGruppe(id).toOppgaveQuery());
	};

	const fjernSelectFelt = (felt: EnkelSelectFelt) => {
		setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).removeSelectFelt(felt.id).toOppgaveQuery());
	};

	const leggTilEnkelSelectFelt = () => {
		setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).addEnkelSelectFelt().toOppgaveQuery());
	};

	const oppdaterFilter = (id: string, newData) => {
		const oppgaveQueryModel = new OppgaveQueryModel(oppgaveQuery);
		const oppgavefilterToUpdate = oppgaveQueryModel.getById(id);
		const data = {
			...oppgavefilterToUpdate,
			...newData,
		};
		oppgaveQueryModel.updateFilter(id, data);
		setOppgaveQuery(oppgaveQueryModel.toOppgaveQuery());
	};

	const oppdaterEnkelSelectFelt = (selectFelt: EnkelSelectFelt, verdi: string) => {
		const newOppgaveQueryModel = new OppgaveQueryModel(oppgaveQuery);
		const selectToUpdate = newOppgaveQueryModel.getById(selectFelt.id);
		const data = {
			...selectToUpdate,
			område: områdeFraKey(verdi),
			kode: kodeFraKey(verdi),
		};

		newOppgaveQueryModel.updateEnkelSelectFelt(selectFelt.id, data);
		setOppgaveQuery(newOppgaveQueryModel.toOppgaveQuery());
	};

	const fjernSortering = (id) => {
		setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).removeOrderFelt(id).toOppgaveQuery());
	};

	const nullstillSortering = () => {
		setOppgaveQuery(() => new OppgaveQueryModel({ ...oppgaveQuery, order: [] }).toOppgaveQuery());
	};

	const nullstillOgLeggTilSortering = (data?: any) => {
		const newQuery = new OppgaveQueryModel({ ...oppgaveQuery, order: [] }).addEnkelOrderFelt(data).toOppgaveQuery();
		setOppgaveQuery(newQuery);
	};

	const leggTilSortering = (data?: any) => {
		const newQuery = new OppgaveQueryModel(oppgaveQuery).addEnkelOrderFelt(data).toOppgaveQuery();
		setOppgaveQuery(newQuery);
	};

	const oppdaterSortering = (id, newData) => {
		const newOppgaveQueryModel = new OppgaveQueryModel(oppgaveQuery);
		const orderToUpdate = newOppgaveQueryModel.getById(id);
		const data = { ...orderToUpdate, ...newData };
		newOppgaveQueryModel.updateEnkelOrderFelt(id, data);
		setOppgaveQuery(newOppgaveQueryModel.toOppgaveQuery());
	};

	const oppdaterLimit = (limit) => {
		if (!Number.isNaN(limit) && limit >= 0) {
			setOppgaveQuery(() => new OppgaveQueryModel(oppgaveQuery).updateLimit(limit).toOppgaveQuery());
		}
	};

	const filterContextValues = useMemo(
		() => ({
			oppdaterFilter,
			leggTilFilter,
			leggTilGruppe,
			fjernFilter,
		}),
		[felter, oppgaveQuery],
	);

	const orderContextValues = useMemo(
		() => ({
			oppgaveQuery,
			leggTilSortering,
			oppdaterSortering,
			fjernSortering,
			nullstillSortering,
			nullstillOgLeggTilSortering,
		}),
		[felter, oppgaveQuery, oppdaterSortering],
	);

	if (felter.length === 0) {
		return null;
	}

	return (
		<div>
			<div className="mt-3 p-4 rounded-lg">
				<Heading size="small" spacing className="mt-3">
					{tittel}
				</Heading>
				<FilterContext.Provider value={filterContextValues}>
					<div className="flex flex-col gap-4">
						{oppgaveQuery.filtere.map((item) => (
							<OppgavefilterPanel key={item.id} oppgavefilter={item} visningV2={visningV2} />
						))}
					</div>
				</FilterContext.Provider>
				<Button
					className="mt-4 mb-13"
					icon={<PlusCircleIcon aria-hidden />}
					variant="tertiary"
					size="small"
					onClick={() => leggTilFilter(oppgaveQuery.id)}
				>
					Legg til nytt kriterie
				</Button>
				{!køvisning && (
					<ReadMore
						className={styles.feltvalgBlokk}
						header="Velg felter som skal vises"
						defaultOpen={!!oppgaveQuery.select.length}
						open={visFelterSomSkalVises}
						size="medium"
						onClick={() => setVisFelterSomSkalVises(!visFelterSomSkalVises)}
					>
						<OppgaveSelectFelter
							felter={felter}
							oppgaveQuery={oppgaveQuery}
							onLeggTil={leggTilEnkelSelectFelt}
							onOppdater={oppdaterEnkelSelectFelt}
							onFjern={fjernSelectFelt}
						/>
					</ReadMore>
				)}
				<OrderContext.Provider value={orderContextValues}>
					<SorteringContainer køvisning={køvisning} />
				</OrderContext.Provider>

				<div className={styles.filterButtonGroup}>
					{lagre && (
						<div className="ml-auto">
							<Button className="mr-2" variant="secondary" onClick={avbryt}>
								Avbryt
							</Button>
							<Button onClick={() => lagre(oppgaveQuery)} loading={loading}>
								Lagre
							</Button>
						</div>
					)}
					{!køvisning && (
						<>
							<Button
								variant={lagre ? 'tertiary' : 'primary'}
								icon={<Search aria-hidden />}
								onClick={executeOppgavesøk}
								loading={loading}
							>
								Søk
							</Button>
							<Button
								variant={lagre ? 'tertiary' : 'primary'}
								icon={<Download aria-hidden />}
								onClick={executeOppgavesøkToFile}
								loading={loadingDownload}
							>
								Last ned CSV
							</Button>
						</>
					)}
				</div>
			</div>
			<div className="mt-10">
				{queryError && <Alert variant="error">{queryError}</Alert>}

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
								icon={<Refresh aria-hidden />}
								size="small"
								onClick={executeOppgavesøk}
								loading={loading}
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
		</div>
	);
};

export default FilterIndex;
