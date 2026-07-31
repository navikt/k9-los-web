import { ApmRoutes } from '@nais/apm/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import AppContext from 'app/AppContext';
import AvdelingslederIndex from 'avdelingsleder/AvdelingslederIndex';
import type { Oppgavefelt } from 'filter/filterTsTypes';
import { type FunctionComponent, useEffect, useMemo } from 'react';
import { Route } from 'react-router';
import SaksbehandlerIndex from 'saksbehandler/SaksbehandlerIndex';
import AdminIndex from '../../admin/AdminIndex';
import MissingPage from './MissingPage';

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */

const Home: FunctionComponent = () => {
	const { data, isSuccess: harHentetFelter } = useQuery<{ felter: Oppgavefelt[] }>({
		queryKey: [apiPaths.hentOppgaveFelter],
	});
	const { data: saksbehandler } = useInnloggetSaksbehandler();

	const queryClient = useQueryClient();

	const kanOppgavestyre = saksbehandler?.kanOppgavestyre;
	const brukerIdent = saksbehandler?.brukerIdent;

	useEffect(() => {
		if (brukerIdent !== undefined) {
			if (kanOppgavestyre) {
				queryClient.prefetchQuery({
					queryKey: [apiPaths.hentSaksbehandlereAvdelingsleder],
				});
			}
			queryClient.prefetchQuery({
				queryKey: [apiPaths.hentSaksbehandlereSomSaksbehandler],
			});
		}
	}, [queryClient, brukerIdent, kanOppgavestyre]);

	const contextValues = useMemo(() => ({ felter: data?.felter || [] }), [data]);

	if (!harHentetFelter) {
		return null;
	}

	return (
		<div className="mt-5">
			<AppContext.Provider value={contextValues}>
				<ApmRoutes>
					<Route path="/" element={<SaksbehandlerIndex />} />
					<Route path="/avdelingsleder" element={<AvdelingslederIndex />} />
					<Route path="/admin" element={<AdminIndex />} />
					<Route path="*" element={<MissingPage />} />
				</ApmRoutes>
			</AppContext.Provider>
		</div>
	);
};

export default Home;
