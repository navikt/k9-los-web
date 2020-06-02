import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import { mountWithIntl } from 'testHelpers/intl-enzyme-test-helper';

import { LanguageProvider } from './LanguageProvider';

describe('<LanguageProvider>', () => {
  it('skal sette opp react-intl', () => {
    const wrapper = mountWithIntl((
      <LanguageProvider nbMessages={{ 'Header.K9Los': 'Omsorgspenger, pleiepenger og frisinn' }}>
        <FormattedMessage id="Header.K9Los" tagName="span" />
      </LanguageProvider>
    ));

    const intlProvider = wrapper.find('IntlProvider');
    expect(intlProvider).to.have.length(1);
    expect(intlProvider.prop('messages')).to.eql({ 'Header.K9Los': 'Omsorgspenger, pleiepenger og frisinn' });
    const span = wrapper.find('span');
    expect(span).to.have.length(1);
    expect(span.text()).to.eql('Omsorgspenger, pleiepenger og frisinn');
  });
});
