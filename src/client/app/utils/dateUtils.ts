import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const DDMMYYYY_DATE_FORMAT = 'DD.MM.YYYY';
const HHMM_TIME_FORMAT = 'HH:mm';
const HHMMSS_TIME_FORMAT = 'HH:mm:ss';

dayjs.extend(isoWeek);

export const TIDENES_ENDE = '9999-12-31';

const checkDays = (weeks, days) => {
	const weeksDaysObj = {
		weeks,
		days,
	};

	let id = 'UttakInfoPanel.AntallFlereDagerOgFlereUker';

	if (weeks === undefined && days === undefined) {
		id = 'UttakInfoPanel.TidenesEnde';
	}

	if (days === 0) {
		id = weeks === 1 ? 'UttakInfoPanel.AntallNullDagerOgEnUke' : 'UttakInfoPanel.AntallNullDagerOgFlereUker';
	}

	if (weeks === 0) {
		id = days === 1 ? 'UttakInfoPanel.AntallEnDagOgNullUker' : 'UttakInfoPanel.AntallFlereDagerOgNullUker';
	}

	if (days === 1) {
		id = weeks === 1 ? 'UttakInfoPanel.AntallEnDagOgEnUke' : 'UttakInfoPanel.AntallEnDagOgFlereUker';
	}

	if (weeks === 1) {
		id = 'UttakInfoPanel.AntallFlereDagerOgEnUke';
	}

	return {
		id,
		...weeksDaysObj,
	};
};

export const calcDaysAndWeeksWithWeekends = (fraDatoPeriode, tilDatoPeriode) => {
	if (tilDatoPeriode === TIDENES_ENDE) {
		return checkDays(undefined, undefined);
	}
	const fraDato = dayjs(fraDatoPeriode, ISO_DATE_FORMAT);
	const tilDato = dayjs(tilDatoPeriode, ISO_DATE_FORMAT);

	// Vi legger til én dag for å få med startdato i perioden
	const duration = tilDato.diff(fraDato, 'days') + 1;

	const weeks = Math.floor(duration / 7);
	const days = duration % 7;

	return checkDays(weeks, days);
};

export const calcDaysAndWeeks = (fraDatoPeriode, tilDatoPeriode) => {
	if (tilDatoPeriode === TIDENES_ENDE) {
		return checkDays(undefined, undefined);
	}

	const fraDato = dayjs(fraDatoPeriode, ISO_DATE_FORMAT);
	const tilDato = dayjs(tilDatoPeriode, ISO_DATE_FORMAT);
	let count = tilDato.diff(fraDato, 'days');
	let date = dayjs(fraDatoPeriode, ISO_DATE_FORMAT);
	let numOfDays = date.isoWeekday() !== 6 && date.isoWeekday() !== 7 ? 1 : 0;

	while (count > 0) {
		date = date.add(1, 'days');

		if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
			numOfDays += 1;
		}

		count -= 1;
	}

	const weeks = Math.floor(numOfDays / 5);
	const days = numOfDays % 5;

	return checkDays(weeks, days);
};

export const splitWeeksAndDays = (weeks, days) => {
	const returnArray = [];
	const allDays = weeks ? weeks * 5 + days : days;
	const firstPeriodDays = allDays % 2 === 0 ? allDays / 2 : allDays / 2 + 0.5;
	const secondPeriodDays = allDays % 2 === 0 ? allDays / 2 : allDays / 2 - 0.5;
	const firstPeriodWeeksAndDays = { weeks: Math.trunc(firstPeriodDays / 5), days: firstPeriodDays % 5 };
	const secondPeriodWeeksAndDays = { weeks: Math.trunc(secondPeriodDays / 5), days: secondPeriodDays % 5 };
	returnArray.push(secondPeriodWeeksAndDays, firstPeriodWeeksAndDays);
	return returnArray;
};

export const momentDateFormat = (date) => dayjs(date).format(DDMMYYYY_DATE_FORMAT);

export const timeFormat = (date) => dayjs(date).format(HHMM_TIME_FORMAT);

export const dateFormat = (date: Date | string): string => dayjs(date).format(DDMMYYYY_DATE_FORMAT);

export const dateTimeFormat = (date: Date | string): string =>
	dayjs(date).format(`${DDMMYYYY_DATE_FORMAT} kl. ${HHMM_TIME_FORMAT}`);

export const dateTimeSecondsFormat = (date: Date | string): string =>
	dayjs(date).format(`${DDMMYYYY_DATE_FORMAT} kl. ${HHMMSS_TIME_FORMAT}`);

// Skal ikke legge til dag når dato er tidenes ende
export const addDaysToDate = (dateString, nrOfDays) =>
	dateString === TIDENES_ENDE
		? dateString
		: dayjs(dateString, ISO_DATE_FORMAT).add(nrOfDays, 'days').format(ISO_DATE_FORMAT);

export const findDifferenceInMonthsAndDays = (fomDate, tomDate) => {
	const fDate = dayjs(fomDate, ISO_DATE_FORMAT, true);
	const tDate = dayjs(tomDate, ISO_DATE_FORMAT, true).add(1, 'days');
	if (!fDate.isValid() || !tDate.isValid() || fDate.isAfter(tDate)) {
		return undefined;
	}

	const months = tDate.diff(fDate, 'months');
	const updatedFDate = fDate.add(months, 'months');

	return {
		months,
		days: tDate.diff(updatedFDate, 'days'),
	};
};

export const getDateAndTime = (tidspunkt): { date: string; time: string } => {
	const dateTime = dayjs(tidspunkt);
	const date = dateTime.format(DDMMYYYY_DATE_FORMAT);
	const time = dateTime.format(HHMM_TIME_FORMAT);
	return { date, time };
};

export function formatDuration(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) {
		return `${hours} t ${minutes % 60} min`;
	}
	if (minutes > 0) {
		return `${minutes} min ${seconds % 60} sek`;
	}
	if (seconds > 0) {
		return `${seconds} sek`;
	}
	return `${milliseconds} ms`;
}

export function calculateDuration(startTime: string | null, endTime: string | null): string | null {
	if (!startTime) return null;

	const start = new Date(startTime).getTime();
	const end = endTime ? new Date(endTime).getTime() : Date.now();

	return formatDuration(end - start);
}
