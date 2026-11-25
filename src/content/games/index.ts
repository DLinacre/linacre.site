import records from './records.json';
import type { GameContent } from '../schemas/content.schema';
// JSON receives full runtime validation in tests and before every production build.
export const games = records as GameContent[];
