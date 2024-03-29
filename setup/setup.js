import { TextDecoder, TextEncoder } from 'util';
import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-datetimeformat/locale-data/nb';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-numberformat/locale-data/nb';

jest.spyOn(global.console, 'warn').mockImplementationOnce(message => {
  if (message.includes('Please use the peer or standalone build instead')) {
    global.console.warn(message);
  } else {
    throw new Error(message);
  }
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
