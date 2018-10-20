// This file contains application wide constants

// API_URL is the cloud functions endpoint for your Express API, which this
// front-end app will hit to get its data from.
// The conditional variable will come handy for testing on local environment.

// export const API_URL =
//   "local" === process.env.REACT_APP_ENV
//     ? "YOUR_APP_LOCAL_FUNCTION_URL"
//     : "YOUR_APP_PRODUCTION_FUNCTION_URL";

export const API_URL =
  "local" === process.env.REACT_APP_ENV
    ? "http://localhost:5000/fir-admin-dashboard/us-central1/api"
    : "YOUR_APP_PRODUCTION_FUNCTION_URL";
