import { Page } from "@playwright/test";

export default class HomePage {


    constructor(public page: Page) {

    }

    async clickOnSpecialHotMenu() {
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: "networkidle" }),
            
            this.page.click("(//span[contains(text(),'Special')]/../..)[2]")
        ])
    }
}