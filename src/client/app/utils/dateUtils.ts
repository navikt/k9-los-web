import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

const DDMMYYYY_DATE_FORMAT = 'DD.MM.YYYY';
const HHMM_TIME_FORMAT = 'HH:mm';
const HHMMSS_TIME_FORMAT = 'HH:mm:ss';

dayjs.extend(isoWeek);

export const timeFormat = (date: string) => dayjs(date).format(HHMM_TIME_FORMAT);

export const dateFormat = (date: Date | string): string => dayjs(date).format(DDMMYYYY_DATE_FORMAT);

export const dateTimeFormat = (date: Date | string): string =>
	dayjs(date).format(`${DDMMYYYY_DATE_FORMAT} kl. ${HHMM_TIME_FORMAT}`);

export const dateTimeSecondsFormat = (date: Date | string): string =>
	dayjs(date).format(`${DDMMYYYY_DATE_FORMAT} kl. ${HHMMSS_TIME_FORMAT}`);

export const getDateAndTime = (tidspunkt: string): { date: string; time: string } => {
	const dateTime = dayjs(tidspunkt);
	const date = dateTime.format(DDMMYYYY_DATE_FORMAT);
	const time = dateTime.format(HHMM_TIME_FORMAT);
	return { date, time };
};

function formatDuration(milliseconds: number): string {
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
