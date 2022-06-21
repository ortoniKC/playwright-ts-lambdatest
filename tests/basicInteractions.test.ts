import { expect, test } from "@playwright/test";

test("Interaction with inputs", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/simple-form-demo");
    const messageInput = page.locator("input#user-message");
    await messageInput.scrollIntoViewIfNeeded();
    console.log(await messageInput.getAttribute("placeholder"));
    expect(messageInput).toHaveAttribute("placeholder", "Please enter your Message")
    console.log('Before entering data: ' + await messageInput.inputValue());
    await messageInput.type("Hi koushik");
    console.log('After entering data: ' + await messageInput.inputValue())


})

test("Sum", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/simple-form-demo");
    const sum1input = page.locator("#sum1")
    const sum2input = page.locator("#sum2")

    const getValuesBtn = page.locator("//button[text()='Get values']")
    let num1 = 121;
    let num2 = 546
    await sum1input.fill("" + num1);
    await sum2input.type("" + num2);
    await getValuesBtn.click()
    const result = page.locator("#addmessage")
    console.log(await result.textContent());
    let expectedResult = num1 + num2;
    expect(result).toHaveText("" + expectedResult)

})

test("Checkbox", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/checkbox-demo")
    const singleCheckbox = page.locator("id=isAgeSelected")
    expect(singleCheckbox).not.toBeChecked();
    await singleCheckbox.check();
    expect(singleCheckbox).toBeChecked();


})