import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { afterEach } from 'vitest';

dayjs.extend(durationPlugin);

// Uten `globals: true` registrerer ikke Testing Library opprydding selv.
afterEach(cleanup);
