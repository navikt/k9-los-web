import { InternalHeader, Spacer } from '@navikt/ds-react';
import { useInnloggetBrukersOmråder } from 'api/queries/områdeQueries';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { områdenavn } from 'fleromrade/områder';
import { Link, useLocation, useNavigate } from 'react-router';
import styles from './header.module.css';

const isDev = !window.location.hostname.includes('intern.nav.no');

const Header = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { område, basissti } = useOmråde();
	const { data: bruker } = useInnloggetBruker();
	const { data: områder } = useInnloggetBrukersOmråder();

	const avdelingslederSti = `${basissti}/avdelingsleder`;
	const adminSti = `${basissti}/admin`;
	const erPå = (sti: string) => pathname === sti || pathname.startsWith(`${sti}/`);

	const loggUt = () => {
		window.location.assign('/logout');
		setTimeout(() => navigate(basissti), 1000);
	};

	return (
		<header className={isDev ? styles.containerDev : ''}>
			<InternalHeader>
				<InternalHeader.Title as={Link} to={basissti}>
					{områdenavn[område]}
				</InternalHeader.Title>
				<Spacer />
				{bruker.tilganger.drift && !erPå(adminSti) && (
					<InternalHeader.Button onClick={() => navigate(adminSti)}>Driftsmeldinger</InternalHeader.Button>
				)}
				{bruker.tilganger.oppgavestyring && !erPå(avdelingslederSti) && (
					<InternalHeader.Button onClick={() => navigate(avdelingslederSti)}>Avdelingslederpanel</InternalHeader.Button>
				)}
				{områder?.length > 1 && (
					<InternalHeader.Button onClick={() => navigate('/')}>Bytt område</InternalHeader.Button>
				)}
				<InternalHeader.User name={bruker.navn} description={bruker.brukerIdent} />
				{isDev && (
					<InternalHeader.Button type="button" onClick={loggUt}>
						Logg ut
					</InternalHeader.Button>
				)}
			</InternalHeader>
		</header>
	);
};

export default Header;
