import type { UserData } from '../types/userData';
import { apiFetch } from './api';

export type UserDataPatch = Partial<UserData>;

const readData = async (response: Response): Promise<UserData> => {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'Could not load your health data.');
  return result.data as UserData;
};

export const userDataService = {
  async getCurrent(): Promise<UserData> {
    return readData(await apiFetch('/api/user-data'));
  },

  async update(patch: UserDataPatch): Promise<UserData> {
    return readData(await apiFetch('/api/user-data', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }));
  },
};