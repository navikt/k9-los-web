import React from 'react';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Oppgavefelt, Oppgavefeltverdi, TolkesSom } from 'filter/filterTsTypes';
import { kriterierSomSkalGrupperes } from 'filter/konstanter';

dayjs.extend(durationPlugin);

interface Props {
	oppgaveFelter: Oppgavefelt[];
	felt: Oppgavefeltverdi;
}

function getVerdiforklaringer(felt, oppgaveFelt, format = false) {
	const mapFunc = (v) => {
		const verdiforklaring = oppgaveFelt.verdiforklaringer.find((item) => item.verdi === v);
		if (!verdiforklaring) return v;
		return format ? `${verdiforklaring.visningsnavn} (${v})` : verdiforklaring.visningsnavn;
	};

	return Array.isArray(felt.verdi) ? felt.verdi.map(mapFunc) : [mapFunc(felt.verdi)];
}

const OppgaveFeltVisning = ({ felt, oppgaveFelter }: Props) => {
	const oppgaveFelt = oppgaveFelter.find((v) => v.kode === felt.kode);

	if (!oppgaveFelt || !felt.verdi) {
		return <div>-</div>;
	}

	if (kriterierSomSkalGrupperes.includes(oppgaveFelt.kode)) {
		const aksjonspunkter = getVerdiforklaringer(felt, oppgaveFelt, true).join(', ');

		return <div>{aksjonspunkter}</div>;
	}

	if (oppgaveFelt.verdiforklaringer && oppgaveFelt.verdiforklaringer.length > 0) {
		const verdiforklaringer = getVerdiforklaringer(felt, oppgaveFelt).join(', ');

		return <div>{verdiforklaringer}</div>;
	}

	if (oppgaveFelt.tolkes_som === TolkesSom.Boolean) {
		const booleanValue = felt.verdi === 'true';
		return <div>{booleanValue ? 'Ja' : 'Nei'}</div>;
	}

	if (oppgaveFelt.tolkes_som === TolkesSom.Duration) {
		const duration = felt.verdi ? dayjs.duration(felt.verdi as string) : dayjs.duration(0);
		const formattedDuration = `${Math.floor(duration.hours() / 24)}d ${duration.hours() % 24}t`;
		return <div>{formattedDuration}</div>;
	}

	if (oppgaveFelt.tolkes_som === TolkesSom.Timestamp) {
		const formattedDate = felt.verdi ? dayjs(felt.verdi as string).format('DD.MM.YYYY') : '';
		return <div>{formattedDate}</div>;
	}

	if (Array.isArray(felt.verdi)) {
		if (felt.verdi.length === 0) {
			return <div>-</div>;
		}
		return <div>{felt.verdi.join(', ')}</div>;
	}

	return <div>{felt.verdi}</div>;
};

export default OppgaveFeltVisning;
