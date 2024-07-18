/* Magic Mirror
 * Module: weiboTopic
 * Magic Mirror显示微博热搜
 * By 胡迪
 */
Module.register("MMM-weiboTopic", {
	// Default module config.
	defaults: {
		upgradeInterval: 30, //更新微博数据源，单位为分
		updateInterval: 30, //数据更新显示间隔，单位为秒
		animationSpeed: 1 //动画显示间隔，单位为秒
	},
	start () {
		Log.info(`Starting module: ${this.name}`);
		this.sendSocketNotification("getweiboTopic_s", null);
		this.upgradeData(this.config.updateInterval * 1000 * 60);
		this.getData(this.config.updateInterval * 1000);
	},
	upgradeData (upgradeInterval) {
		const self = this;
		setInterval(function () {
			self.sendSocketNotification("getweiboTopic_s", null);
		}, upgradeInterval);
	},

	getRandomInt (N) {
		return Math.floor(Math.random() * (N + 1));
	},
	getDom () {
		if (!this.weiboData) {
			const wrapper = document.createElement("div");
			const loading = document.createElement("div");
			loading.className = "title bright medium normal";
			loading.innerHTML = "数据获取中...";
			wrapper.appendChild(loading);
			this.sendSocketNotification("getweiboTopic_s", null);
			return wrapper;
		}

		const wrapper = document.createElement("div");
		const titleWrapper = document.createElement("div");
		const contentWrapper = document.createElement("div");
		const index = this.getRandomInt(this.weiboData.length);
		wrapper.className = "container";

		titleWrapper.className = "title bright medium normal";
		contentWrapper.className = "title dimmed small light";

		titleWrapper.innerHTML = this.weiboData[index].Title;
		contentWrapper.innerHTML = "微博热搜";

		wrapper.appendChild(titleWrapper);
		wrapper.appendChild(contentWrapper);
		return wrapper;
	},
	getData (specifiedDelay) {
		this.sendSocketNotification("getweiboTopic_s", null);
		var self = this;
		setInterval(function () {
			self.updateDom(self.config.animationSpeed * 1000);
		}, specifiedDelay);
	},

	socketNotificationReceived (notification, data) {
		Log.info("data");
		if (notification === "getweiboTopic_r") {
			Log.info("获取微博数据。");
			this.weiboData = data;
			this.updateDom(this.config.animationSpeed * 1000);
		}
	}
});
