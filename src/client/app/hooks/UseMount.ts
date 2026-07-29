import { type EffectCallback, useEffect } from 'react';

/**
 * Kjører effekten én gang når komponenten mountes, og aldri igjen.
 *
 * Bruk denne når engangskjøring ved mount er den ønskede oppførselen — for eksempel
 * initialisering av lokal state fra props, eller oppsett som ikke skal reagere på
 * senere endringer. Da slipper man spredte `biome-ignore`-kommentarer, og
 * intensjonen blir tydelig på kallstedet.
 *
 * Ikke bruk den for å skjule en manglende dependency. Hvis effekten *bør* kjøre på nytt
 * når en verdi endrer seg, skal du bruke `useEffect` med riktige dependencies i stedet.
 *
 * En eventuell returnert opprydningsfunksjon kjøres ved unmount.
 */
export function useMount(effect: EffectCallback): void {
	// biome-ignore lint/correctness/useExhaustiveDependencies: hele poenget med hooken er å kjøre effekten kun ved mount
	useEffect(effect, []);
}
