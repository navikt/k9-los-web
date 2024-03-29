import { ErrorResponse } from '../ResponseTsType';
import EventType from '../eventType';
import { isHandledError } from './ErrorTypes';
import TimeoutError from './TimeoutError';
import { ErrorType } from './errorTsType';

type NotificationEmitter = (eventType: keyof typeof EventType, data?: any, isPollingRequest?: boolean) => void;

const isString = (value) => typeof value === 'string';

const isOfTypeBlob = (error) => error && error.config && error.config.responseType === 'blob';

const blobParser = (blob: any): Promise<string> => {
	const fileReader = new FileReader();

	return new Promise((resolve, reject) => {
		fileReader.onerror = () => {
			fileReader.abort();
			reject(new Error('Problem parsing blob'));
		};

		fileReader.onload = () => {
			if (!(fileReader.result instanceof ArrayBuffer)) {
				resolve(fileReader.result);
			} else {
				reject(new Error('Problem parsing blob'));
			}
		};

		fileReader.readAsText(blob);
	});
};

interface FormatedError {
	data?: string | ErrorResponse;
	type?: string;
	status?: number;
	isForbidden?: boolean;
	isUnauthorized?: boolean;
	is418?: boolean;
	isGatewayTimeoutOrNotFound?: boolean;
	location?: string;
}

class RequestErrorEventHandler {
	notify: NotificationEmitter;

	isPollingRequest: boolean;

	constructor(notificationEmitter: NotificationEmitter, isPollingRequest: boolean) {
		this.notify = notificationEmitter;
		this.isPollingRequest = isPollingRequest;
	}

	handleError = async (error: ErrorType | TimeoutError): Promise<string> => {
		if (error instanceof TimeoutError) {
			this.notify(EventType.POLLING_TIMEOUT, { location: error.location });
			return;
		}

		const formattedError = this.formatError(error);

		if (isOfTypeBlob(error)) {
			const jsonErrorString = await blobParser(formattedError.data);
			if (isString(jsonErrorString)) {
				formattedError.data = JSON.parse(jsonErrorString);
			}
		}

		if (formattedError.isGatewayTimeoutOrNotFound) {
			this.notify(
				EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND,
				{ location: formattedError.location },
				this.isPollingRequest,
			);
		} else if (formattedError.isForbidden || formattedError.isUnauthorized) {
			this.notify(EventType.REQUEST_FORBIDDEN, formattedError.data ? formattedError.data : { message: error.message });
		} else if (formattedError.is418) {
			this.notify(EventType.POLLING_HALTED_OR_DELAYED, formattedError.data);
		} else if (!error.response && error.message) {
			this.notify(EventType.REQUEST_ERROR, { message: error.message }, this.isPollingRequest);
		} else if (!isHandledError(formattedError.type) && formattedError.status !== 404) {
			this.notify(EventType.REQUEST_ERROR, this.getFormattedData(formattedError.data), this.isPollingRequest);
		}
	};

	getFormattedData = (data: string | Record<string, any>): string | Record<string, any> =>
		isString(data) ? { message: data } : data;

	findErrorData = (response: { data?: any; status?: number; statusText?: string }): string | ErrorResponse =>
		response.data ? response.data : response.statusText;

	formatError = (error: ErrorType): FormatedError => {
		const response = error && error.response ? error.response : undefined;
		return {
			data: response ? this.findErrorData(response) : undefined,
			type: response && response.data ? response.data.type : undefined,
			status: response ? response.status : undefined,
			isForbidden: response ? response.status === 403 : undefined,
			isUnauthorized: response ? response.status === 401 : undefined,
			is418: response ? response.status === 418 : undefined,
			isGatewayTimeoutOrNotFound: response ? response.status === 504 /* || response.status === 404 */ : undefined,
			location: response && response.config ? response.config.url : undefined,
		};
	};
}

export default RequestErrorEventHandler;
