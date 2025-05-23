import { appInfo, applicationBase } from './environment.common';

export const environment = {
  appInfo,
  application: {
    ...applicationBase,
    angular: `${applicationBase.angular} ENV`,
  },
  urlNews: './assets/params/json/mock/trailers.json',
  urlMovies: './assets/params/json/mock/movies.json',
  useDatabase: false,
  backend: 'YOUR_BACKEND_URL',
  monitorApi: 'YOUR_MONITOR_API_URL'
};
