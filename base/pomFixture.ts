import path from "path";
import { chromium, test as baseTest } from "@playwright/test";
import RegisterPage from "../pages/registerPage"
import LoginPage from "../pages/loginPage"
import HomePage from "../pages/homePage"
import SpecialHotPage from "../pages/specialHotPage"

type pages = {
    registerPage: RegisterPage;
    loginPage: LoginPage;
    homePage: HomePage;
    specialPage: SpecialHotPage
}
// LambdaTest capabilities
const capabilities = {
    browserName: "Chrome", // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    browserVersion: "latest",
    "LT:Options": {
        platform: "Windows 10",
        build: "Playwright Build",
        name: "Playwright Test",
        user: "koushik350",
        accessKey: "GhnFCYUK4IWo9j4f38tr2RoS3rwmJxaR0AozKsHvRjigNBDzlJ",
        network: true,
        video: true,
        console: true,
        tunnel: false, // Add tunnel configuration if testing locally hosted webpage
        tunnelName: "", // Optional
        geoLocation: '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
    },
};

// Patching the capabilities dynamically according to the project name.
const modifyCapabilities = (configName, testName) => {
    let config = configName.split("@lambdatest")[0];
    let [browserName, browserVersion, platform] = config.split(":");
    capabilities.browserName = browserName
        ? browserName
        : capabilities.browserName;
    capabilities.browserVersion = browserVersion
        ? browserVersion
        : capabilities.browserVersion;
    capabilities["LT:Options"]["platform"] = platform
        ? platform
        : capabilities["LT:Options"]["platform"];
    capabilities["LT:Options"]["name"] = testName;
};

const getErrorMessage = (obj, keys) =>
    keys.reduce(
        (obj, key) => (typeof obj == "object" ? obj[key] : undefined),
        obj)

const testPages = baseTest.extend<pages>({
    // page: async ({}, use) => {
    //     const browser = await chromium.connect(
    //         `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
    //     );
    //     const ctxt = await browser.newContext();
    //     const myPage = await ctxt.newPage();
    //     await use(myPage);
    //     await myPage.close();
    //     await ctxt.close();
    //     await browser.close();
    // },

    page: async ({ context }, use, testInfo) => {
        // Configure LambdaTest platform for cross-browser testing
        let fileName = testInfo.file.split(path.sep).pop();
        if (testInfo.project.name.match(/lambdatest/)) {
            modifyCapabilities(
                testInfo.project.name,
                `${testInfo.title} - ${fileName}`
            );

            const browser = await chromium.connect({
                wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
                    JSON.stringify(capabilities)
                )}`,
            });
            const ltContext = await browser.newContext(testInfo.project.use);
            const ltPage = await ltContext.newPage();
            await use(ltPage);

            console.log("Before closing: " + testInfo.status);
            const testStatus = {
                action: "setTestStatus",
                arguments: {
                    status: testInfo.status,
                    remark: getErrorMessage(testInfo, ["error", "message"]),
                },
            };
            await ltPage.evaluate(() => { },
                `lambdatest_action: ${JSON.stringify(testStatus)}`);

            await ltPage.close();
            await browser.close();
            console.log("After closing: " + testInfo.status);


        } else {
            // Run tests in local in case of local config provided
            const page = await context.newPage()
            await use(page);
            // await 
        }
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    specialPage: async ({ page }, use) => {
        await use(new SpecialHotPage(page));
    },

})

export const test = testPages;
export const expect = testPages.expect;