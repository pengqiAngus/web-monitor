/**
 * 爆光上报(是否可见浏览过)
 */

import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class Exposure {
	ob: IntersectionObserver;
	count: number;
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('爆光监控初始化成功');
		this.count = 0;
		this.ob = new IntersectionObserver(entries => {
			entries.forEach(element => {
				const appearKey = element.target.getAttribute('data-appear');
				if (element.intersectionRatio > 0 && appearKey) {
					this.callback({
						type: ReportType.EXPOSURE,
						message: '曝光埋点',
						exposure: appearKey,
					});
				}
			});
		});
		this.init();
	}

	appear() {
		const appears = document.querySelectorAll('[data-appear]');
		if (this.count === 10) return;
		this.count++;
		if (appears.length === 0) {
			setTimeout(() => this.appear(), 100);
		} else {
			for (let index = 0; index < appears.length; index++) {
				// 订阅
				this.ob.observe(appears[index]);
			}
		}
	}

	init() {
		window.addEventListener('load', () => this.appear());
		Utils.routerChangeListener(() => {
			this.appear();
		});
	}
}
