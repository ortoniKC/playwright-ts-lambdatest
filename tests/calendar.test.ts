import { test } from "@playwright/test";
import moment from "moment";

// test("Calendar demo using fill function", async ({ page }) => {
//     await page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo");
//     let date = "1994-12-04"

//     await page.fill("id=birthday", date);
//     await page.waitForTimeout(3000)
// })

test("Calendar demo using moment", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo");

    await selectDate(12, "December 2017");

    await page.reload();

    await selectDate(5, "December 2023");

    await page.reload();

    await selectDate(2, "July 2022");


    await page.waitForTimeout(3000)



    async function selectDate(date: number, dateToSelect: string) {
        await page.click("//input[@placeholder='Start date']")

        const mmYY = page.locator("(//table[@class='table-condensed']//th[@class='datepicker-switch'])[1]");
        const prev = page.locator("(//table[@class='table-condensed']//th[@class='prev'])[1]");
        const next = page.locator("(//table[@class='table-condensed']//th[@class='next'])[1]");

        // let dateToSelect: string = "May 2019";
        const thisMonth = moment(dateToSelect, "MMMM YYYY").isBefore();
        console.log("this month? " + thisMonth);
        while (await mmYY.textContent() != dateToSelect) {
            if (thisMonth) {
                await prev.click();
            } else {
                await next.click();
            }
        }
        await page.click(`//td[@class='day'][text()='${date}']`);
    }
})