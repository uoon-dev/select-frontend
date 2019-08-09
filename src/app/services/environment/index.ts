import { createReducer } from 'redux-act';

import env from 'app/config/env';

const INITIAL_STATE = {
  ...env,
};

export type EnvironmentState = typeof INITIAL_STATE;

export const environmentReducer = createReducer<EnvironmentState>({}, INITIAL_STATE);
