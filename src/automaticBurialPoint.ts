/**
 * 自动埋点
 */
import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class AutomaticBurialPoint {
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('自动埋点初始化成功');
		this.init();
	}

	init() {
		document.addEventListener(
			'click',
			(event: Event) => {
				const target = event.target as Element;
				const selectors = [];
				selectors.push(target);
				let reportData = target.getAttribute('data-report');
				let parentNode = target.parentNode as Element;

				while (!reportData && parentNode) {
					if (parentNode.tagName.toLocaleUpperCase() === 'BODY') {
						return;
					}
					selectors.push(parentNode);
					reportData = parentNode.getAttribute('data-report');
					parentNode = parentNode.parentNode as Element;
				}
				if (!reportData) return;
				this.callback({
					type: ReportType.AUTOMATIC_BURIAL_POINT,
					message: '自动埋点',
					data: reportData,
					selector: Utils.getSelectors(selectors),
				});
			},
			{
				capture: true,
				passive: true,
			}
		);
	}
}
