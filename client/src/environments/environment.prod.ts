export const environment = {
  production: true,
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
