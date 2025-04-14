/**
 * 接口监控
 */
import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class Xhr {
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('接口监控监控初始化成功');
		this.xhrHook();
	}
	xhrHook() {
		const xhrSelf = this;
		const xhr = window.XMLHttpRequest;
		const _originOpen = xhr.prototype.open;
		// open AOP
		xhr.prototype.open = function (method, url) {
			(this as any).xhrInfo = {
				url,
				method,
			};
			return _originOpen.apply(this, arguments as any);
		};

		// send AOP
		const _originSend = xhr.prototype.send;
		xhr.prototype.send = function (value) {
			const _self = this;
			const xhrStartTime = Date.now();

			const ajaxEnd = (event: string) => () => {
				(this as any).xhrInfo.event = event;
				(this as any).xhrInfo.status = _self.status;
				(this as any).xhrInfo.success =
					(_self.status >= 200 && _self.status <= 206) || _self.status === 304;
				(this as any).xhrInfo.duration = Date.now() - xhrStartTime;

				if (_self.response) {
					let responseSize = null;
					let responseData = null;
					switch (_self.responseType) {
						case 'json':
							responseSize = JSON && JSON.stringify(_self.response).length;
							responseData = JSON && JSON.stringify(_self.response);
							break;
						case 'blob':
							responseSize = _self.response.size;
							break;
						case 'arraybuffer':
							responseSize = _self.response.byteLength;
						// eslint-disable-next-line no-fallthrough
						case 'document':
							responseSize =
								_self.response.documentElement &&
								_self.response.documentElement.innerHTML &&
								_self.response.documentElement.innerHTML.length + 28;
							break;
						default:
							try {
								responseSize = JSON && JSON.stringify(_self.response).length;
								responseData = JSON && JSON.stringify(_self.response);
							} catch (error) {
								console.log(error);
							}
					}

					(this as any).xhrInfo.responseSize = responseSize;
					(this as any).xhrInfo.responseData = responseData;
					(this as any).xhrInfo.requestData = Utils.isFormData(value)
						? 'Binary System'
						: value;
				}
				xhrSelf.callback({
					...(this as any).xhrInfo,
					type: ReportType.XHR,
					message: '接口监控',
				});
			};

			if (this.addEventListener) {
				// 监听请求事件
				this.addEventListener('load', ajaxEnd('load'), false); // 完成
				this.addEventListener('error', ajaxEnd('error'), false); // 出错
				this.addEventListener('abort', ajaxEnd('abort'), false); // 取消
			} else {
				const _origin_onreadystatechange = this.onreadystatechange;
				this.onreadystatechange = function () {
					if (_origin_onreadystatechange) {
						_origin_onreadystatechange.apply(this, arguments as any);
					}
					if (this.readyState === 4) {
						ajaxEnd('load')();
					}
				};
			}
			return _originSend.apply(this, arguments as any);
		};
	}
}
