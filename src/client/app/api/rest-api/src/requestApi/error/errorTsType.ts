type ErrorType = Readonly<{
	response?: {
		data?: any;
		statusText?: string;
		status?: number;
		config?: any;
	};
	message?: string;
	type?: string;
	config?: {
		responseType: string;
	};
}>;

export { ErrorType };
export default ErrorType;
