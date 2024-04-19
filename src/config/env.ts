import * as fs from 'fs';
import * as path from 'path';

// Get the relevant ENV file path
export function parseEnv(): { path: string } {
  const isProd: boolean = process.env.NODE_ENV === 'production';
  const localEnv: string = path.resolve('.env');
  const prodEnv: string = path.resolve('.env.prod');

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('The env file not found');
  }

  const filePath: string =
    isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  return { path: filePath };
}

// export default parseEnv();
