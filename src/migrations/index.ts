import * as migration_20260726_190033 from './20260726_190033';
import * as migration_20260731_164532_projects_collection from './20260731_164532_projects_collection';

export const migrations = [
  {
    up: migration_20260726_190033.up,
    down: migration_20260726_190033.down,
    name: '20260726_190033',
  },
  {
    up: migration_20260731_164532_projects_collection.up,
    down: migration_20260731_164532_projects_collection.down,
    name: '20260731_164532_projects_collection'
  },
];
