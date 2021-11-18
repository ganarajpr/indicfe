import core from 'puppeteer-core';
import { getOptions } from './chr-options';

async function getPage(url,isDev) {
    const options = await getOptions(isDev);
    const browser = await core.launch(options);
    const _page = await browser.newPage();
    await _page.goto(url);
    return _page;
}

export async function getScreenshot(url, isDev) {
    const page = await getPage(url, isDev);
    await page.setViewport({ width: 600, height: 300 });
    const file = await page.screenshot({ type: 'jpeg' });
    return file;
}