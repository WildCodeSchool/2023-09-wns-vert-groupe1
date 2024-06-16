import { test, expect } from "@playwright/test";

test("Trigger a error when the form is submitted with empty inputs and after create a city", async ({
	page,
}) => {
	await page.goto("http://localhost:3000/login");

	await page.getByLabel("Email *").fill("duygu@gmail.com");

	await page.getByLabel("Mot de passe *").fill("password");

	await page.getByRole("button", { name: "Envoyer" }).click();
	await expect(page).toHaveURL("http://localhost:3000/");

	await page.pause();
	//to modify
	await page.getByRole("button", { name: "GO CITY NEW FORM" }).click();

	await expect(page).toHaveURL("http://localhost:3000/city/new");

	const form = await page.getByTestId("city-form");
	await expect(form).toBeTruthy();

	const name = await page.getByPlaceholder("Nom de la ville");
	const description = await page.getByPlaceholder("Description");

	await expect(name).toBeVisible();
	await expect(name).toBeEmpty();
	await expect(description).toBeVisible();
	await expect(description).toBeEmpty();

	const button = await page.getByRole("button", { name: "Créer" });

	await expect(button).toBeDisabled();

	await name.fill("Metz");
	await description.fill("Ville Nord Est");

	await button.click();
	await page.pause();

	// await page.waitForSelector(".Toastify__toast-body");

	// const alertText = await page.textContent(".Toastify__toast-body");
	// await expect(alertText).toContain("La ville Metz a été crée");

	// const alert = page.getByRole("alert");
	// await expect(alert).toBeVisible();
	// await expect(alert).toHaveText("La ville Metz a été crée");
});
