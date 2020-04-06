import axios, { AxiosResponse } from 'axios';

import env from 'app/config/env';
import { ErrorResponseData } from 'app/services/serviceStatus';

export const requestMaintenanceData = (): Promise<AxiosResponse<ErrorResponseData>> =>
  axios.get(`${env.SORRY_URL}/status`);
