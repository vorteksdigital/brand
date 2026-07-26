import * as migration_20260726_190033 from './20260726_190033';

export const migrations = [
  {
    up: migration_20260726_190033.up,
    down: migration_20260726_190033.down,
    name: '20260726_190033'
  },
];
