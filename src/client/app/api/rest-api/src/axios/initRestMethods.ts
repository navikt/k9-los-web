const openPreview = (data, filename) => {
	// Type assertion for legacy IE method
	const navigator = window.navigator as any;
	if (navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(data, filename);
	} else {
		// Last ned filinnholdet i nettleser:
		const downloadLink = document.createElement('a');
		downloadLink.style = 'display: none';
		downloadLink.href = URL.createObjectURL(data);
		downloadLink.download = filename;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		URL.revokeObjectURL(downloadLink.href);
		downloadLink.remove();
	}
};

const cancellable = (axiosInstance, config) => {
	let cancel;
	const request = axiosInstance({
		...config,
		cancelToken: new axiosInstance.CancelToken((c) => {
			cancel = c;
		}),
	});
	request.cancel = cancel;
	return request.catch((error) =>
		axiosInstance.isCancel(error) ? Promise.reject(new Error(null)) : Promise.reject(error),
	);
};

const defaultHeaders = {
	'Cache-Control': 'no-cache',
	Pragma: 'no-cache',
	Expires: 0,
};

const defaultPostHeaders = {
	'Content-Type': 'application/json',
};

const get =
	(axiosInstance) =>
	(url: string, params: any, responseType = 'json') =>
		cancellable(axiosInstance, {
			url: url ? `${url}` : null,
			params,
			responseType,
			method: 'get',
			headers: {
				...defaultHeaders,
			},
		});

const post =
	(axiosInstance) =>
	(url: string, data: any, responseType = 'json') =>
		cancellable(axiosInstance, {
			url: url ? `${url}` : null,
			responseType,
			data: JSON.stringify(data),
			method: 'post',
			headers: {
				...defaultHeaders,
				...defaultPostHeaders,
			},
			cache: false,
		});

const put =
	(axiosInstance) =>
	(url: string, data: any, responseType = 'json') =>
		cancellable(axiosInstance, {
			url: url ? `${url}` : null,
			responseType,
			data: JSON.stringify(data),
			method: 'put',
			headers: {
				...defaultHeaders,
				...defaultPostHeaders,
			},
			cache: false,
		});

const getBlob = (axiosInstance) => (url: string, params: any) => get(axiosInstance)(url, params, 'blob');

const postBlob = (axiosInstance) => (url: string, data: any) => post(axiosInstance)(url, data, 'blob');

// TODO (TOR) Åpninga av dokument bør vel ikkje ligga her?
const postAndOpenBlob = (axiosInstance) => (url: string, data: any) =>
	postBlob(axiosInstance)(url, data).then((response) => {
		let filename = 'data';
		const attachmentPrefix = 'attachment; filename=';
		if (
			response.headers &&
			response.headers['content-disposition'] &&
			response.headers['content-disposition'].indexOf(attachmentPrefix) >= 0
		) {
			filename = response.headers['content-disposition'].substring(attachmentPrefix.length);
		}
		openPreview(response.data, filename);
		return {
			...response,
			data: 'blob opened as preview', // Don't waste memory by storing blob in state
		};
	});

const getAsync = (axiosInstance) => (url: string, params: any) => get(axiosInstance)(url, params);
const postAsync = (axiosInstance) => (url: string, params: any) => post(axiosInstance)(url, params);
const putAsync = (axiosInstance) => (url: string, params: any) => put(axiosInstance)(url, params);

const isAsyncRestMethod = (allRestMethods) => (restMethod: any) =>
	restMethod === allRestMethods.getAsync ||
	restMethod === allRestMethods.postAsync ||
	restMethod === allRestMethods.putAsync;

const initRestMethods = (axiosInstance: any) => {
	const restMethods = {
		get: get(axiosInstance),
		post: post(axiosInstance),
		put: put(axiosInstance),
		getBlob: getBlob(axiosInstance),
		postBlob: postBlob(axiosInstance),
		postAndOpenBlob: postAndOpenBlob(axiosInstance),
		getAsync: getAsync(axiosInstance),
		postAsync: postAsync(axiosInstance),
		putAsync: putAsync(axiosInstance),
	};

	return {
		...restMethods,
		isAsyncRestMethod: isAsyncRestMethod(restMethods),
	};
};

export default initRestMethods;
