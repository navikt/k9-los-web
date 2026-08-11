import { PlusIcon } from '@navikt/aksel-icons';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { type Feltreferanse, feltIdentitet, finnFelt, sammeFelt } from 'filter/feltIdentitet';
import { OppgavefilterKode } from 'filter/filterTsTypes';
import { addEnkelSelectFelt, updateSelectFelt } from 'filter/queryUtils';
import { useContext } from 'react';

const QUICK_ADD_KOLONNER: Feltreferanse[] = [
	{ område: 'K9', kode: OppgavefilterKode.Saksnummer },
	{ område: 'K9', kode: OppgavefilterKode.Ytelsestype },
	{ område: 'K9', kode: OppgavefilterKode.BehandlingTypekode },
	{ område: 'K9', kode: OppgavefilterKode.Behandlingsårsak },
	{ område: 'K9', kode: OppgavefilterKode.AktivVenteårsak },
	{ område: 'K9', kode: OppgavefilterKode.MottattDato },
	{ område: null, kode: OppgavefilterKode.Oppgavestatus },
	{ område: 'K9', kode: OppgavefilterKode.TidSidenMottattDato },
];

const QuickAddSelect = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const valgteFelter: Feltreferanse[] = oppgaveQuery.select
		.filter((s) => s.type === 'enkel' && s.kode !== null)
		.map((s) => ({ område: s.område ?? null, kode: s.kode as string }));

	const handleAdd = (referanse: Feltreferanse) => {
		const oppgavefelt = finnFelt(felter, referanse);
		if (!oppgavefelt) return;

		updateQuery([
			addEnkelSelectFelt(),
			(query) => {
				const nyRad = query.select[query.select.length - 1];
				return updateSelectFelt(nyRad._nodeId, {
					kode: oppgavefelt.kode,
					område: oppgavefelt.område,
				})(query);
			},
		]);
	};

	const tilgjengelige = QUICK_ADD_KOLONNER.filter(
		(referanse) => !valgteFelter.some((valgt) => sammeFelt(valgt, referanse)),
	)
		.map((referanse) => {
			const oppgavefelt = finnFelt(felter, referanse);
			if (!oppgavefelt) return null;
			return { referanse, visningsnavn: oppgavefelt.visningsnavn };
		})
		.filter(Boolean);

	if (tilgjengelige.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{tilgjengelige.map(({ referanse, visningsnavn }) => (
				<button
					key={feltIdentitet(referanse)}
					type="button"
					className={[
						'cursor-pointer inline-flex items-center gap-0.5 rounded-md border border-dashed',
						'border-ax-neutral-400 bg-transparent pl-1 pr-2 py-0.5 font-semibold text-ax-neutral-700',
						'hover:border-ax-neutral-700 hover:text-ax-neutral-900 hover:bg-ax-neutral-200',
					].join(' ')}
					style={{ fontSize: '0.9rem' }}
					onClick={() => handleAdd(referanse)}
				>
					<PlusIcon aria-hidden className="shrink-0" height="0.875rem" width="0.875rem" />
					{visningsnavn}
				</button>
			))}
		</div>
	);
};

export default QuickAddSelect;
