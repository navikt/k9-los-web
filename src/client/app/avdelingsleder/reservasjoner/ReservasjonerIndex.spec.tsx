import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';

import { K9LosApiKeys } from 'api/k9LosApi';
import behandlingType from 'kodeverk/behandlingType';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import { ReservasjonerIndex } from './ReservasjonerIndex';
import ReservasjonerTabell from './components/ReservasjonerTabell';

describe('<ReservasjonerIndex>', () => {
  it('skal hente reservasjoner ved lasting av komponent og så vise dem i panel', () => {
    const reservasjoner = [{
      reservertAvUid: '2323',
      reservertAvNavn: 'Espen Utvikler',
      reservertTilTidspunkt: '2019-01-01',
      oppgaveId: 1,
      oppgaveSaksNr: 2,
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: '',
      },
    }];

    new RestApiTestMocker()
      .withRestCallRunner(K9LosApiKeys.HENT_ALLE_RESERVASJONER, { data: reservasjoner, startRequest: () => undefined })
      .withRestCallRunner(K9LosApiKeys.AVDELINGSLEDER_OPPHEVER_RESERVASJON, { startRequest: () => undefined })
      .runTest(() => {
        const wrapper = shallow(<ReservasjonerIndex />);

        const tabell = wrapper.find(ReservasjonerTabell);
        expect(tabell).to.have.length(1);
        expect(tabell.prop('reservasjoner')).is.eql(reservasjoner);
      });
  });
});
