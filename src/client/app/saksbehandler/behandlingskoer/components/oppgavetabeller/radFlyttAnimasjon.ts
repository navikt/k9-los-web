import { useMount } from 'hooks/UseMount';
import { type RefObject, useLayoutEffect, useRef } from 'react';

/** Attributtet som knytter en tabellrad til en stabil oppgavenøkkel. */
export const RAD_NØKKEL_ATTRIBUTT = 'data-radnokkel';

export const FLYTTE_VARIGHET_MS = 400;

const FLYTTE_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** Under én piksel er forskyvningen ikke synlig og skal ikke animeres. */
const MINSTE_SYNLIGE_FORSKYVNING = 1;

export type Flytting = {
	nøkkel: string;
	/** Hvor mange piksler raden må forskyves for å starte der den lå før. */
	forskyvning: number;
};

/**
 * Sammenligner posisjonene før og etter en ny sortering. Kun rader som finnes i
 * begge målingene og som faktisk har flyttet seg skal animeres.
 */
export const beregnFlyttinger = (forrige: Map<string, number>, nye: Map<string, number>): Flytting[] => {
	const flyttinger: Flytting[] = [];

	nye.forEach((nyPosisjon, nøkkel) => {
		const forrigePosisjon = forrige.get(nøkkel);
		if (forrigePosisjon === undefined) return;

		const forskyvning = forrigePosisjon - nyPosisjon;
		if (Math.abs(forskyvning) < MINSTE_SYNLIGE_FORSKYVNING) return;

		flyttinger.push({ nøkkel, forskyvning });
	});

	return flyttinger;
};

const foretrekkerRedusertBevegelse = (): boolean =>
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Måler radene relativt til containeren, slik at rulling ikke påvirker resultatet. */
const målPosisjoner = (container: HTMLElement): Map<string, number> => {
	const containerTopp = container.getBoundingClientRect().top;
	const posisjoner = new Map<string, number>();

	container.querySelectorAll<HTMLElement>(`[${RAD_NØKKEL_ATTRIBUTT}]`).forEach((rad) => {
		const nøkkel = rad.getAttribute(RAD_NØKKEL_ATTRIBUTT);
		if (nøkkel) posisjoner.set(nøkkel, rad.getBoundingClientRect().top - containerTopp);
	});

	return posisjoner;
};

const avbrytAnimasjoner = (animasjoner: Map<string, Animation>): void => {
	animasjoner.forEach((animasjon) => {
		animasjon.cancel();
	});
	animasjoner.clear();
};

/**
 * FLIP-animasjon for tabellrader som bytter plass.
 *
 * Radene rendres umiddelbart i riktig rekkefølge, slik at DOM-rekkefølgen og
 * tabellsemantikken alltid er korrekt. Animasjonen forskyver dem visuelt tilbake
 * til der de lå, og lar dem gli på plass. Oppgaver i samme reservasjon får lik
 * forskyvning og beveger seg derfor som én gruppe.
 *
 * `rekkefølge` skal være en streng som endrer seg når radrekkefølgen endres.
 */
export const useRadFlyttAnimasjon = (containerRef: RefObject<HTMLElement | null>, rekkefølge: string): void => {
	const forrigePosisjoner = useRef<Map<string, number> | null>(null);
	const aktiveAnimasjoner = useRef(new Map<string, Animation>());

	// biome-ignore lint/correctness/useExhaustiveDependencies: rekkefølge er hookens argument, og endrer seg når radene bytter plass. Det er nettopp da vi skal måle på nytt.
	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Pågående animasjoner må avbrytes før måling, ellers inkluderer
		// getBoundingClientRect den midlertidige forskyvningen.
		avbrytAnimasjoner(aktiveAnimasjoner.current);

		const nyePosisjoner = målPosisjoner(container);
		const forrige = forrigePosisjoner.current;
		forrigePosisjoner.current = nyePosisjoner;

		if (!forrige || foretrekkerRedusertBevegelse()) return;

		beregnFlyttinger(forrige, nyePosisjoner).forEach(({ nøkkel, forskyvning }) => {
			const rad = container.querySelector<HTMLElement>(`[${RAD_NØKKEL_ATTRIBUTT}="${CSS.escape(nøkkel)}"]`);
			if (!rad || typeof rad.animate !== 'function') return;

			const animasjon = rad.animate([{ transform: `translateY(${forskyvning}px)` }, { transform: 'translateY(0)' }], {
				duration: FLYTTE_VARIGHET_MS,
				easing: FLYTTE_EASING,
			});

			aktiveAnimasjoner.current.set(nøkkel, animasjon);
			animasjon.finished
				.then((): void => {
					aktiveAnimasjoner.current.delete(nøkkel);
				})
				// En avbrutt animasjon avviser Promise og er ikke en feil her.
				.catch((): void => undefined);
		});
	}, [containerRef, rekkefølge]);

	useMount(() => {
		const animasjoner = aktiveAnimasjoner.current;
		return () => avbrytAnimasjoner(animasjoner);
	});
};
