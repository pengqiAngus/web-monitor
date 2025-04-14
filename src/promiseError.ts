/**
 * promise错误监控
 */

import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class PromiseError {
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('Promise错误监控初始化成功');
		this.init();
	}
	init() {
		// Promise错误捕捉
		const _originOnunhandledrejection = window.onunhandledrejection;
		window.onunhandledrejection = event => {
			// reject 错误不上报
			if (!event?.reason?.stack) return;
			const e = Utils.formatError(event.reason || {});
			const matchResult = event?.reason?.stack?.match(/at\s+(.+):(\d+):(\d+)/);
			this.callback({
				type: ReportType.PROMISE_ERROR,
				message: e.message,
				sourceURL: encodeURIComponent(matchResult[1] || ''),
				line: e.line,
				column: e.column,
				selector: Utils.getSelectors(),
				stack: encodeURIComponent(event?.reason?.stack) || '',
			});
			_originOnunhandledrejection &&
				_originOnunhandledrejection.call(window, event);
		};
	}
}
