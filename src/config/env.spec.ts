import * as fs from 'fs';
import * as path from 'path';
import { parseEnv } from './env';

jest.mock('fs');

describe('parseEnv', () => {
  const localEnvPath = 'path/to/.env';
  const prodEnvPath = 'path/to/.env.prod';

  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = undefined;

    jest.spyOn(path, 'resolve').mockImplementation((file) => `path/to/${file}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('throws error when no env files are found', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    expect(() => parseEnv()).toThrow('The env file not found');
  });

  test('returns local env path when no production env file exists', () => {
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((file) => file === localEnvPath);
    expect(parseEnv()).toEqual({ path: localEnvPath });
  });

  test('returns production env path when NODE_ENV is production and prod env exists', () => {
    process.env.NODE_ENV = 'production';
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((file) => file === prodEnvPath);
    expect(parseEnv()).toEqual({ path: prodEnvPath });
  });

  test('returns local env path when NODE_ENV is not set and both env files exist', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    expect(parseEnv()).toEqual({ path: localEnvPath });
  });

  test('returns prod env path when NODE_ENV is production and both env files exist', () => {
    process.env.NODE_ENV = 'production';
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    expect(parseEnv()).toEqual({ path: prodEnvPath });
  });
});
