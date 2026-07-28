/**
 * Babel-plugin som gjør `import.meta` gyldig i CommonJS-output.
 *
 * Jest kjører testene som CommonJS, mens flere avhengigheter (bl.a. react-router 8,
 * som er ESM-only) inneholder `import.meta.hot`. `import.meta` er syntaktisk ugyldig
 * utenfor en ES-modul, så Node kaster «Cannot use 'import.meta' outside a module»
 * før koden i det hele tatt kjører.
 *
 * Pluginen bytter ut hele `import.meta`-uttrykket med et objektliteral. Dermed blir
 * `import.meta.hot` til `undefined` (som i en produksjonsbuild) og `import.meta.url`
 * beholder riktig verdi.
 *
 * Brukes kun av babel-jest. Vite håndterer `import.meta` selv.
 */
module.exports = function transformImportMeta({ types: t }) {
	return {
		name: 'transform-import-meta-to-cjs',
		visitor: {
			MetaProperty(path) {
				const { node } = path;
				if (node.meta.name !== 'import' || node.property.name !== 'meta') {
					return;
				}

				// require('url').pathToFileURL(__filename).toString()
				const url = t.callExpression(
					t.memberExpression(
						t.callExpression(
							t.memberExpression(
								t.callExpression(t.identifier('require'), [t.stringLiteral('url')]),
								t.identifier('pathToFileURL'),
							),
							[t.identifier('__filename')],
						),
						t.identifier('toString'),
					),
					[],
				);

				path.replaceWith(
					t.objectExpression([
						t.objectProperty(t.identifier('url'), url),
						// Vites `import.meta.env` finnes ikke under test – tom for å unngå TypeError.
						t.objectProperty(t.identifier('env'), t.objectExpression([])),
					]),
				);
			},
		},
	};
};
