import { test as baseTest } from '@playwright/test';
import { PageManager } from '../pages/page-manager';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { cleanTestData } from '../../../../tools/cleanup-test-data';

type TestFixtures = {
  pm: PageManager;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  cleanupTestData: () => Promise<any>;
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
  cleanupTestData: async ({}, use) => {
    await use(cleanTestData);
  },
});

export { expect } from '@playwright/test';
