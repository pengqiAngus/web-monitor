import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

/**
 * js错误监控
 */
export default class JsError {
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('js错误监控初始化成功');
		this.init();
	}
	init() {
		const _originOnerror = window.onerror;
		window.onerror = (...arg: any) => {
			const [message, sourceURL, line, column, errorObj] = arg;
			const e = Utils.formatError(errorObj);
			this.callback({
				type: ReportType.JS_ERROR,
				message: e.message || message,
				sourceURL: encodeURIComponent(e.sourceURL || sourceURL),
				line: e.line || line,
				column: e.column || column,
				selector: Utils.getSelectors(),
				stack: encodeURIComponent(errorObj?.stack || ''),
			});
			_originOnerror && _originOnerror.apply(window, arg);
		};
	}
}
