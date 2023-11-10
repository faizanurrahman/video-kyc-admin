// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  appVersion: 'v8.1.6',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  // apiUrl: 'http://192.168.121.21:8081',
  // apiUrl2: 'http://192.168.121.21:8082',
  // apiUrl: 'http://ceda.mobeebank.com:8081',
  // apiUrl2: 'http://ceda.mobeebank.com:8082',
  // apiUrl: 'https://online.ceda.co.bw', // PRODUCTION
  // apiUrl2: 'https://online.ceda.co.bw', // PRODUCTION

  apiUrl: 'https://dev-ceda.mobeebank.com', // UAT
  apiUrl2: 'https://dev-ceda.mobeebank.com', // UAT

  chatwoot: {
    apiUrl: 'https://chat.mobeebank.com:8083', // UAT
    token: '3N8gK9nc4YVDdpd6KQrtUuiZ', // UAT,
    userIdentificationToken: 'ogX9fcjytXaEottCZU2HAJoW', // UAT
    // apiUrl: 'https://chat.ceda.co.bw', // Production
    // token: 'wMzrZ5uNakL9fYhj1QfSScho', // Production
    // userIdentificationToken: '5pzCwFVcj8Eg2bG19QzBT4ue', // Production
  },

  urlMaskingEnabled: false,
};
