/**
 * 用户页面停留时长
 */
import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';
export default class PageDwellTime {
	OFFLINE_MILL = 15 * 60 * 1000; // 15分钟不操作认为不在线
	lastTime = Date.now();
	prePageUrl = encodeURIComponent(location.href);
	isBeforeunload = false;
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('用户页面停留时长初始化成功');
		this.init();
	}
	init() {
		const handler = () => {
			const now = Date.now();
			const duration = now - this.lastTime;
			this.lastTime = now;
			// 超过十五分钟，判定为掉线
			if (duration > this.OFFLINE_MILL) {
				this.lastTime = now;
				return;
			}
			this.callback({
				type: ReportType.PAGE_DWELL_TIME,
				message: '页面停留时长',
				durationMs: duration,
				pageUrl: this.prePageUrl,
			});
			this.prePageUrl = encodeURIComponent(location.href);
		};
		setTimeout(() => {
			Utils.routerChangeListener(() => {
				handler();
			});
		}, 100);

		// 页面关闭
		window.addEventListener('beforeunload', () => {
			handler();
		});
	}
}
