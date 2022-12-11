// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    environmentName: 'local',
    authApi: 'http://localhost:8080/api/auth/',
    // apiUrl: 'http://localhost:8083/dvdtheque',
    // websocketApiUrl: 'ws://localhost:8083/dvdtheque/websocket',
    configFile: 'assets/config/config.local.json',
    apiUrl: 'http://localhost:8762/dvdtheque-service',
    websocketApiUrl: 'ws://localhost:8762/dvdtheque-ws/websocket'
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
  