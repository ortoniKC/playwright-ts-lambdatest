import { Page } from "@playwright/test";

export default class SpecialHotPage{


    constructor(public page: Page) { }

    async addFirstProductToTheCart() { 
        await this.page.hover("//div[@class='image']/a", {
            strict: false
        });
        await this.page.locator("(//button[@title='Add to Cart'])")
            .nth(0).click();
    }
    async isToastVisible() { 
        // await this.page.waitFor
        const toast = this.page.locator("//a[.='View Cart ']");
        await toast.waitFor({state:"visible"})
        return toast;
    }
}