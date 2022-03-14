interface IPaaVentResponse {
  påVent: IBehandlingerSomGarAvVentType[];
  påVentMedVenteårsak: IBehandlingerSomGarAvVentType[];
}
interface IBehandlingerSomGarAvVentType {
  fagsakYtelseType: string;
  behandlingType: string;
  dato: string;
  antall: number;
  venteårsak?: {
    kode: string;
    navn: string;
  };
  frist?: string;
}

export { IPaaVentResponse, IBehandlingerSomGarAvVentType };
