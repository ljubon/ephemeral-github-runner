import { instance } from './instance';

export const instanceId = instance.then(i => i.id);