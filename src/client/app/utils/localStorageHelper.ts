export const getValueFromLocalStorage = (key: string): string | undefined => {
	const value = window.localStorage.getItem(key);
	return value !== 'undefined' && value !== null ? value : undefined;
};

export const setValueInLocalStorage = (key: string, value: string) => {
	window.localStorage.setItem(key, value);
};

export const removeValueFromLocalStorage = (key: string) => {
	window.localStorage.removeItem(key);
};

export const lagreTilLocalStorageCallback = (key: string, value: string, callback: (v: string) => void) => {
	setValueInLocalStorage(key, value);
	callback(value);
};
