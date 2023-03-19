import { useCallback, useContext, useState } from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { ErrorType, REQUEST_POLLING_CANCELLED } from 'api/rest-api';
import { RestApiRequestContext } from '../RestApiContext';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
    startRequest: (params?: any, keepData?: boolean) => Promise<T>;
    resetRequestData: () => void;
    state: RestApiState;
    error?: ErrorType;
    data?: T;
    cancelRequest: () => void;
}

/**
 * Hook som gir deg ein funksjon til å starte restkall, i tillegg til kallets status/resultat/feil
 */
function useRestApiRunner<T>(key: K9LosApiKeys): RestApiData<T> {
    const [data, setData] = useState({
        state: RestApiState.NOT_STARTED,
        data: undefined,
        error: undefined,
    });

    const requestApi = useContext(RestApiRequestContext);

    const startRequest = useCallback((params: any = {}, keepData = false): Promise<T> => {
        setData((oldState) => ({
            state: RestApiState.LOADING,
            data: keepData ? oldState.data : undefined,
            error: undefined,
        }));

        return requestApi
            .startRequest(key, params)
            .then((dataRes) => {
                if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
                    setData({
                        state: RestApiState.SUCCESS,
                        data: dataRes.payload,
                        error: undefined,
                    });
                }

                return Promise.resolve(dataRes.payload);
            })
            .catch((error) => {
                setData({
                    state: RestApiState.ERROR,
                    data: undefined,
                    error,
                });
                throw error;
            });
    }, []);

    const resetRequestData = useCallback(() => {
        setData({
            state: RestApiState.NOT_STARTED,
            data: undefined,
            error: undefined,
        });
    }, []);

    return {
        startRequest,
        resetRequestData,
        cancelRequest: () => requestApi.cancelRequest(key),
        ...data,
    };
}

export default useRestApiRunner;
