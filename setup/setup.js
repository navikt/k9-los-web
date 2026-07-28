import { TextDecoder, TextEncoder } from 'util';
import { vi } from 'vitest';

// NB: mockImplementationOnce gjør at denne guarden kun fanger det første
// console.warn-kallet per testfil. Beholdt uendret i Vitest-migreringen for å
// ikke blande atferdsendring inn i flyttingen – se testkvalitetsgjeld.
vi.spyOn(global.console, 'warn').mockImplementationOnce((message) => {
	if (message.includes('Please use the peer or standalone build instead')) {
		global.console.warn(message);
	} else {
		throw new Error(message);
	}
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
