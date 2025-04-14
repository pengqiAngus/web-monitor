/**
 * 资源加载监控
 */

import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class ResourcesError {
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('资源加载监控初始化成功');
		this.init();
	}
	init() {
		window.addEventListener(
			'error',
			(event: any) => {
				// 只处理资源错误
				if (
					event.target &&
					(event.target.src || event.target.href || event.target.currentSrc)
				) {
					this.callback({
						type: ReportType.RESOURCES_ERROR,
						message: '资源加载异常',
						selector: Utils.getSelectors(),
						sourceURL:
							event.target.src || event.target.href || event.target.currentSrc,
					});
				}
			},
			true
		);
	}
}
