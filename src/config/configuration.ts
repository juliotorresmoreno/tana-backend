import * as path from 'path';
import { Configuration } from 'src/types/configuration';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = path.join('..', '..', 'config.yaml');

export default function getConfig(): Configuration {
  const config = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Configuration;

  return config;
}
