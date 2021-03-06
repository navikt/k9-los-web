import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import behandlingType from 'kodeverk/behandlingType';
import NyeOgFerdigstilteOppgaverForSisteSyvPanel from './NyeOgFerdigstilteOppgaverForSisteSyvPanel';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';

describe('<NyeOgFerdigstilteOppgaverForSisteSyvPanel>', () => {
  it('skal vise rendre komponent', () => {
    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      antallFerdigstilteMine: 1,
      dato: '2019-01-01',
    }];

    const wrapper = shallow(<NyeOgFerdigstilteOppgaverForSisteSyvPanel
      width={300}
      height={200}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />);

    expect(wrapper.find(NyeOgFerdigstilteOppgaverForSisteSyvGraf)).to.have.length(1);
  });

  it('skal filtrere bort dagens oppgaver', () => {
    const iDag = moment().format();
    const iGar = moment().subtract(1, 'days').format();
    const atteDagerSiden = moment().subtract(8, 'days').format();
    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      antallFerdigstilteMine: 1,
      dato: iDag,
    }, {
      behandlingType: {
        kode: behandlingType.KLAGE,
        navn: 'KLAGE',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 1,
      antallFerdigstilte: 6,
      antallFerdigstilteMine: 1,
      dato: iGar,
    }, {
      behandlingType: {
        kode: behandlingType.INNSYN,
        navn: 'INNSYN',
      },
      fagsakYtelseType: {
        kode: 'PSB',
        navn: 'Pleiepenger',
      },
      antallNye: 8,
      antallFerdigstilte: 9,
      antallFerdigstilteMine: 1,
      dato: atteDagerSiden,
    }];

    const wrapper = shallow(<NyeOgFerdigstilteOppgaverForSisteSyvPanel
      width={300}
      height={200}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />);

    const graf = wrapper.find(NyeOgFerdigstilteOppgaverForSisteSyvGraf);
    expect(graf).to.have.length(1);
    const oppgaver = graf.props().nyeOgFerdigstilteOppgaver;

    expect(oppgaver).to.have.length(2);
    expect(oppgaver[0].dato).is.eql(iGar);
    expect(oppgaver[1].dato).is.eql(atteDagerSiden);
  });
});
