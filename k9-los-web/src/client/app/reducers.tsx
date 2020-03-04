import { combineReducers } from 'redux';

import { reduxRestApi } from 'api/k9LosApi';
import errorHandler from 'api/error-api-redux';
import { appReducer as appContext } from 'app/duck';
import { formReducer as formContext } from 'form/reduxBinding/formDuck';
import { avdelingslederReducer as avdelingslederContext } from 'avdelingsleder/duck';
import { organiseringAvSakslisterReducer as organiseringAvSakslisterContext } from 'avdelingsleder/behandlingskoer/duck';
import { behandlingskoerReducer as behandlingskoerContext } from 'saksbehandler/behandlingskoer/duck';

export default combineReducers({
  appContext,
  formContext,
  avdelingslederContext,
  organiseringAvSakslisterContext,
  behandlingskoerContext,
  [errorHandler.getErrorReducerName()]: errorHandler.getErrorReducer(),
  dataContext: reduxRestApi.getDataReducer(),
});
