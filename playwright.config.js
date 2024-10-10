
const { defineConfig, devices } = require('@playwright/test');
const config = {
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 3,
  workers: 2,
  expect:{
    timeout:5000
  },
  reporter:"html",
  projects:
  [
    {
      name: "Safari",
      use:{
        browserName: 'webkit',
        headless: false,
        screenshot: 'on',
        trace: 'on',
        //...devices["iPhone 13"]
      },
    },
    {
      name: "Chrome",
      use:{
        browserName: 'chromium',
        headless: false,
        screenshot: 'on',
        video:'retain-on-failure',
        ignoreHttpsErrors: true,
        permissions:['geolocation'],
        trace: 'on',
        //viewport: {"width":420,"height":420},
        //...devices["Pixel 2 XL"]
      },
    }
  ]

};
module.exports = config;

