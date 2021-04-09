// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: '/',
  apiBaseUrl: 'http://localhost',
  learningPhaseIntervalsInMinutes: [15, 24 * 60, 6 * 24 * 60],
  relearningPhaseIntervalsInMinutes: [20],
  graduatingIntervalInDays: 15,
  graduatingEase: 2.5,
  schedulingDeviationInSeconds: 30,
  easyBonus: 1.5,
  easeModifiers: {
    fail: -0.2,
    hard: -0.15,
    good: 0,
    easy: 0.15
  },
  minEase: 1.3,
  relearnPassedIntervalModifier: 0.7,
  minRelearnPassedIntervalInDays: 2,
  leechThreshold: 8,
  reviewLookAheadInMinutes: 5
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
