export const saksbehandlerEnhet = (enhet?: string | null) => {
	if (
		window.location.hostname.includes('intern.nav.no') &&
		!['2103', '4403', '4410'].some((kode) => enhet?.includes(kode))
	) {
		return 'Andre enheter';
	}
	return enhet?.replace('NAV', 'Nav') || 'Ukjent enhet';
};
