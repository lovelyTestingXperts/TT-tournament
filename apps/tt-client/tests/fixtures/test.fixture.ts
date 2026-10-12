import { test as baseTest } from '@playwright/test';
import { PageManager } from '../pages/page-manager';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

type TestFixtures = {
  pm: PageManager;
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

export const test = baseTest.extend<TestFixtures>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
  loginPage: async ({ pm }, use) => {
    await use(pm.login);
  },
  registerPage: async ({ pm }, use) => {
    await use(pm.register);
  },
});

export { expect } from '@playwright/test';
