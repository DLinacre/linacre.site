import { games } from './games';
import { projects } from './projects';
import type { StudioContent } from './schemas/content.schema';
export { games, projects };
export * from './schemas/content.schema';
export const content: StudioContent[] = [...projects, ...games];
export const contentById = new Map(content.map(record => [record.id, record]));
