import { defineTransformer, type OpenApiDocument } from 'orval';

// Rettinger av spec-en fra backend før Orval validerer og genererer kode fra den.

type JsonObjekt = Record<string, unknown>;

const erObjekt = (verdi: unknown): verdi is JsonObjekt =>
	typeof verdi === 'object' && verdi !== null && !Array.isArray(verdi);

// Backend utelater description på responser. Feltet er påkrevd i OpenAPI, og uten det feiler Orvals validering.
const leggTilManglendeResponsbeskrivelser = (spec: JsonObjekt) => {
	for (const pathItem of Object.values(erObjekt(spec.paths) ? spec.paths : {})) {
		for (const operasjon of Object.values(erObjekt(pathItem) ? pathItem : {})) {
			if (!erObjekt(operasjon) || !erObjekt(operasjon.responses)) {
				continue;
			}
			for (const respons of Object.values(operasjon.responses)) {
				if (erObjekt(respons) && !('$ref' in respons) && respons.description === undefined) {
					respons.description = '';
				}
			}
		}
	}
};

// Backend navngir komponenter med fullt kvalifisert Kotlin-navn (f.eks. "no.nav.k9.los.søkeboks.SøkRequest").
// Orval krever ASCII-nøkler (^[a-zA-Z0-9.\-_]+$), og vi vil ha korte typenavn. Vi fjerner derfor pakkenavnet,
// slår sammen nøstede klasser og erstatter æøå. Ved navnekollisjon prefikses siste pakkesegment.
const translitterer = (navn: string) =>
	navn
		.replace(/æ/g, 'ae')
		.replace(/Æ/g, 'Ae')
		.replace(/ø/g, 'o')
		.replace(/Ø/g, 'O')
		.replace(/å/g, 'a')
		.replace(/Å/g, 'A');

const storForbokstav = (tekst: string) => tekst.charAt(0).toUpperCase() + tekst.slice(1);

const splittNavn = (nøkkel: string) => {
	const deler = nøkkel.split('.');
	const førsteKlasse = deler.findIndex((del) => /^[A-Z]/.test(del));
	if (førsteKlasse === -1) {
		return { pakke: [], kortNavn: deler.join('') };
	}
	return { pakke: deler.slice(0, førsteKlasse), kortNavn: deler.slice(førsteKlasse).join('') };
};

const lagNyeNavn = (nøkler: string[]) => {
	const antallMedKortNavn = new Map<string, number>();
	for (const nøkkel of nøkler) {
		const { kortNavn } = splittNavn(nøkkel);
		antallMedKortNavn.set(kortNavn, (antallMedKortNavn.get(kortNavn) ?? 0) + 1);
	}

	const nyeNavn = new Map<string, string>();
	for (const nøkkel of nøkler) {
		const { pakke, kortNavn } = splittNavn(nøkkel);
		const sistePakke = pakke[pakke.length - 1];
		const kolliderer = (antallMedKortNavn.get(kortNavn) ?? 0) > 1;
		nyeNavn.set(nøkkel, translitterer(kolliderer && sistePakke ? storForbokstav(sistePakke) + kortNavn : kortNavn));
	}

	const duplikater = [...nyeNavn.values()].filter((navn, indeks, alle) => alle.indexOf(navn) !== indeks);
	if (duplikater.length > 0) {
		throw new Error(`Komponentnavn kolliderer etter forkorting: ${duplikater.join(', ')}`);
	}
	return nyeNavn;
};

const oppdaterRefs = (node: unknown, prefiks: string, nyeNavn: Map<string, string>): unknown => {
	if (Array.isArray(node)) {
		return node.map((element) => oppdaterRefs(element, prefiks, nyeNavn));
	}
	if (!erObjekt(node)) {
		return node;
	}
	return Object.fromEntries(
		Object.entries(node).map(([nøkkel, verdi]) => {
			if (nøkkel === '$ref' && typeof verdi === 'string' && verdi.startsWith(prefiks)) {
				const gammeltNavn = verdi.slice(prefiks.length);
				return [nøkkel, prefiks + (nyeNavn.get(gammeltNavn) ?? gammeltNavn)];
			}
			return [nøkkel, oppdaterRefs(verdi, prefiks, nyeNavn)];
		}),
	);
};

const forkortKomponentnavn = (spec: JsonObjekt): JsonObjekt => {
	let resultat = spec;
	for (const type of Object.keys(erObjekt(spec.components) ? spec.components : {})) {
		const komponenter = (resultat.components as JsonObjekt)[type];
		if (!erObjekt(komponenter)) {
			continue;
		}
		const nyeNavn = lagNyeNavn(Object.keys(komponenter));
		resultat = oppdaterRefs(resultat, `#/components/${type}/`, nyeNavn) as JsonObjekt;
		const oppdaterteKomponenter = (resultat.components as JsonObjekt)[type] as JsonObjekt;
		(resultat.components as JsonObjekt)[type] = Object.fromEntries(
			Object.entries(oppdaterteKomponenter).map(([nøkkel, verdi]) => [nyeNavn.get(nøkkel) ?? nøkkel, verdi]),
		);
	}
	return resultat;
};

// Backend beskriver Java-typer som serialiseres til strenger (f.eks. LocalDateTime og UUID) som tomme objekter.
const strengtyper: Record<string, JsonObjekt> = {
	'java.time.LocalDate': { type: 'string', format: 'date' },
	'java.time.LocalDateTime': { type: 'string', description: 'Dato og tid uten tidssone, f.eks. 2026-09-18T17:49:21' },
	'java.util.UUID': { type: 'string', format: 'uuid' },
};

const rettStrengtyper = (spec: JsonObjekt) => {
	const skjemaer = erObjekt(spec.components) && erObjekt(spec.components.schemas) ? spec.components.schemas : {};
	for (const [navn, skjema] of Object.entries(strengtyper)) {
		if (navn in skjemaer) {
			skjemaer[navn] = skjema;
		}
	}
};

export default defineTransformer((spec) => {
	const kopi = structuredClone(spec) as unknown as JsonObjekt;
	leggTilManglendeResponsbeskrivelser(kopi);
	rettStrengtyper(kopi);
	return forkortKomponentnavn(kopi) as unknown as OpenApiDocument;
});
