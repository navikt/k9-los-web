/**
 * https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl
 *
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that.
 */

import React from 'react';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
export const messages = require('../../src/client/app/sprak/nb_NO.json');

// Create the IntlProvider to retrieve context for wrapping around.
const cache = createIntlCache();

const getIntlObject = (moduleMessages) => {
  const selectedMessages = moduleMessages || messages;

  return createIntl({
    locale: 'nb-NO',
    defaultLocale: 'nb-NO',
    messages: selectedMessages,
  }, cache);
};

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node, moduleMessages) {
  const selectedMessages = moduleMessages || messages;
  return React.cloneElement(node, { intl: getIntlObject(selectedMessages) });
}

const getOptions = (moduleMessages) => {
  const selectedMessages = moduleMessages || messages;

  return {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages: selectedMessages,
    },
  };
};

export function shallowWithIntl(node) {
  return shallow(nodeWithIntlProp(node, undefined), { ...getOptions(undefined) });
}

export function mountWithIntl(node) {
  return mount(nodeWithIntlProp(node, undefined), { ...getOptions(undefined) });
}

/* Lagt til for a hindre warnings i tester */
export const intlMock = {
  formatDate: sinon.spy(),
  formatTime: sinon.spy(),
  formatRelative: sinon.spy(),
  formatNumber: sinon.spy(),
  formatPlural: sinon.spy(),
  formatMessage: sinon.spy(),
  now: sinon.spy(),
  defaultFormats: undefined,
  defaultLocale: '',
  defaultRichTextElements: undefined,
  formatListToParts: sinon.spy(),
  formats: undefined,
  formatters: undefined,
  locale: '',
  messages: undefined,
  onError: sinon.spy(),
  formatDateTimeRange: sinon.spy(),
  formatDateToParts: sinon.spy(),
  formatDisplayName: sinon.spy(),
  formatList: sinon.spy(),
  formatNumberToParts: sinon.spy(),
  formatRelativeTime: sinon.spy(),
  formatTimeToParts: sinon.spy(),
};