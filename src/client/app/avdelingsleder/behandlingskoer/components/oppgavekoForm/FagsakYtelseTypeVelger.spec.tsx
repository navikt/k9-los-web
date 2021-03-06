import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { RadioOption, RadioGroupField } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import RestApiTestMocker from 'testHelpers/RestApiTestMocker';
import { K9LosApiKeys } from 'api/k9LosApi';
import FagsakYtelseTypeVelger from './FagsakYtelseTypeVelger';

describe('<FagsakYtelseTypeVelger>', () => {
  const fagsakYtelseTyper = [{
    kode: fagsakYtelseType.OMSORGSPENGER,
    navn: 'Engangsstønad',
  }, {
    kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    navn: 'Foreldrepenger',
  }];

  it('skal vise checkboxer for ytelsetyper', () => {
    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withDummyRunner()
      .runTest(() => {
        const wrapper = shallow(<FagsakYtelseTypeVelger
          valgtOppgavekoId="1"
          hentOppgaveko={sinon.spy()}
        />);

        const radios = wrapper.find(RadioOption);
        expect(radios).to.have.length(4);
        expect(radios.first().prop('value')).to.eql(fagsakYtelseType.OMSORGSPENGER);
        expect(radios.at(1).prop('value')).to.eql(fagsakYtelseType.OMSORGSDAGER);
        expect(radios.at(2).prop('value')).to.eql(fagsakYtelseType.PLEIEPENGER_SYKT_BARN);
        expect(radios.last().prop('value')).to.eql('');
      });
  });

  it('skal lagre ytelsetype ved klikk på checkbox', () => {
    const lagreYtelseTypeFn = sinon.spy();

    new RestApiTestMocker()
      .withKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE, fagsakYtelseTyper)
      .withRestCallRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE,
        { startRequest: (params) => { lagreYtelseTypeFn(params); return Promise.resolve(); } })
      .runTest(() => {
        const wrapper = shallow(<FagsakYtelseTypeVelger
          valgtOppgavekoId="1"
          hentOppgaveko={sinon.spy()}
        />);

        const radioGroup = wrapper.find(RadioGroupField);
        radioGroup.prop('onChange')(fagsakYtelseType.OMSORGSPENGER);

        expect(lagreYtelseTypeFn.calledOnce).to.be.true;
        const { args } = lagreYtelseTypeFn.getCalls()[0];
        expect(args).to.have.length(1);
        expect(args[0].id).to.eql('1');
        expect(args[0].fagsakYtelseType).to.eql(fagsakYtelseType.OMSORGSPENGER);
      });
  });
});
