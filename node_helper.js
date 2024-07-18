/* Magic Mirror
 * Module: weiboTopic
 * Magic Mirror显示微博热搜
 * By 胡迪
 */
const weiboHotUrl = "https://s.weibo.com/top/summary?cate=realtimehot";

const NodeHelper = require("node_helper");

const puppeteer = require("puppeteer");

module.exports = NodeHelper.create({
	start () {
	},

	async socketNotificationReceived (notification, payload) {
		if (notification === "getweiboTopic_s") {
			const browser = await puppeteer.launch({ headless: true });
			const page = await browser.newPage();
			await page.setExtraHTTPHeaders({
			});
			await page.goto(weiboHotUrl);
			await page.on("load", async () => {
				let list = [];
				const elements = await page.$$("#pl_top_realtimehot tbody>tr");
				elements.forEach(async (ele) => {
					const item = await ele.$eval(".td-02>a", (node) => {
						return {
							Title: node.innerText,
							url: `https://s.weibo.com${node.getAttribute("href")}`
						};
					});
					list.push(item);
					if (list.length === elements.length) {
						await page.close();
						await browser.close();
						this.sendSocketNotification("getweiboTopic_r", list);
					}
				});
			});

		}
	}
});

