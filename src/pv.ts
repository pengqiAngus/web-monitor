/**
 * pv，uv根据pv算
 */

import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class Pv {
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('PV初始化成功');
		this.init();
	}
	init() {
		setTimeout(() => {
			this.callback({
				type: ReportType.PV,
				message: 'PV',
			});
			Utils.routerChangeListener(() => {
				this.callback({
					type: ReportType.PV,
					message: 'PV',
				});
			});
		}, 100);
	}
}
