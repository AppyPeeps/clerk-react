import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

globalThis.__DEV__ = true;
globalThis.PACKAGE_NAME = '@appypeeps/clerk-react';
globalThis.PACKAGE_VERSION = '0.0.0-test';

afterEach(cleanup);
