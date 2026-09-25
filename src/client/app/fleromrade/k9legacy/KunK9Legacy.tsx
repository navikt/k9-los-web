import { useOmråde } from 'fleromrade/OmrådeContext';
import type { ReactNode } from 'react';

/**
 * Bryter for K9-komponenter som ennå ikke er ført over til ny API.
 *
 * K9 på ny API (`/k9-ny`) skal vise alt som legacy-K9 viser. Komponenter som fortsatt henter data via
 * legacy-API-et, rendres derfor bare for K9, og aldri for andre områder. All bruk av legacy-komponenter i
 * flerområde skal gå gjennom denne mappen, slik at det som gjenstår, står samlet her.
 *
 * Når en komponent er ført over til ny API, flyttes den ut av `k9legacy/` og vises for alle områder.
 */
export const useVisK9Legacy = () => useOmråde().område === 'K9';

export const KunK9Legacy = ({ children }: { children: ReactNode }) => (useVisK9Legacy() ? children : null);
