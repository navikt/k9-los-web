type AksjonspunkterPerEnhetType = Readonly<{
	fagsakYtelseType: string;
	dato: string;
	antall: number;
	behandlendeEnhet: string;
	behandlingType?: string;
	fagsystemType: string;
}>;

export default AksjonspunkterPerEnhetType;
