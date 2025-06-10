// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getEnvironmentVariable = (variableName: string) => (window as any).appSettings[variableName];
