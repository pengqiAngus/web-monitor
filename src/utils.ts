import Bowser from 'bowser';
import uaParser from 'ua-parser-js';
import { ReportParams } from './types';

class Utils {
	lastEvent?: Event;
	isFlushPending: boolean;
	isBeforeunload: boolean;
	constructor() {
		this.isFlushPending = false;
		this.isBeforeunload = false;
		this.setClickEvent();
		this.beforeunloadFix();
		this.rewriteHistory();
	}
	setClickEvent() {
		['click'].forEach(eventType => {
			document.addEventListener(
				eventType,
				event => {
					this.lastEvent = event;
				},
				{
					capture: true, //捕获阶段
					passive: true, //默认不阻止默认事件
				}
			);
		});
	}

	getSelectorChain() {
		const target = this.lastEvent?.target as Element;
		const chain = [];
		let parentNode: Element | null = null;
		if (target) {
			chain.push(target);
			parentNode = target?.parentNode as Element;
		}
		while (parentNode) {
			if (parentNode.tagName.toLocaleUpperCase() === 'BODY') {
				return chain;
			}
			chain.push(parentNode);
			parentNode = parentNode.parentNode as Element;
		}
		return chain;
	}

	getSelectors(path: Array<any> = []) {
		const selectorChain: Element[] =
			Array.isArray(path) && path.length > 0 ? path : this.getSelectorChain();
		return selectorChain
			.reverse()
			.map(element => {
				if (element.id) {
					return encodeURIComponent(
						`${element.nodeName.toLowerCase()}#${element.id}`
					);
				}
				if (element.className && typeof element.className === 'string') {
					return `${element.nodeName.toLowerCase()}.${element.className}`;
				}
				return element.nodeName.toLowerCase();
			})
			.join(' > ');
	}

	log(message: string | object, type = 'info') {
		const color = type === 'info' ? 'green' : 'yellow';
		if (type === 'debug') {
			console.table(message);
		} else {
			console.info(
				`%c[monitor-sdk-${type}]: ${message}`,
				`color: ${color};font-size: 18px`
			);
		}
	}

	isObject(params: any): boolean {
		return Object.prototype.toString.call(params) === '[object Object]';
	}
	isFormData(params: any): boolean {
		return Object.prototype.toString.call(params) === '[object FormData]';
	}
	onload(callback: () => void) {
		if (document.readyState === 'complete') {
			callback();
		} else {
			window.addEventListener('load', callback);
		}
	}

	_patchRouter(type: keyof History) {
		const orig = history[type];
		const _this = this;
		return function (this: unknown) {
			_this.queueFlush(() => {
				if (_this.isBeforeunload) return;
				const e = new Event(type);
				window.dispatchEvent(e);
			});
			return orig.apply(this, arguments);
		};
	}

	rewriteHistory() {
		// fix: vue路由在push会先触发replaceState在pushState
		history.pushState = this._patchRouter('pushState');
		history.replaceState = this._patchRouter('replaceState');
	}
	beforeunloadFix() {
		// fix: vue路由会监听beforeunload事件，在刷新页面的时候会通过beforeunload事件，强制触发replaceState
		window.addEventListener('beforeunload', () => {
			this.isBeforeunload = true;
		});
	}

	routerChangeListener(handler: (e: Event) => void) {
		// 监听Hash、History路由变化
		window.addEventListener('popstate', e => handler(e), true);
		// AOP拦截出发
		window.addEventListener('replaceState', e => handler(e), true);
		window.addEventListener('pushState', e => handler(e), true);
	}
	getBrowserInfo() {
		const userAgent = window.navigator.userAgent;
		const browserData = Bowser.parse(userAgent);
        const parserData = uaParser();
		return {
			browserName: browserData.browser.name || parserData.browser.name, // 浏览器名
			browserVersion: browserData.browser.version || parserData.browser.version, // 浏览器版本号
			osName: browserData.os.name || parserData.os.name, // 操作系统名
			osVersion: parserData.os.version || browserData.os.version, // 操作系统版本号
			deviceType: browserData.platform.type || parserData.device.type, // 设备类型
			deviceVendor:
				browserData.platform.vendor || parserData.device.vendor || '', // 设备所属公司
			deviceModel: browserData.platform.model || parserData.device.model || '', // 设备型号
			engineName: browserData.engine.name || parserData.engine.name, // 内核engine名
			engineVersion: browserData.engine.version || parserData.engine.version, // 内核engine版本号
		};
	}
	trackerParamsFormat(params: ReportParams) {
		let p = '';
		Object.keys(params).forEach(key => {
			p += `${key}=${params[key]}&`;
		});
		return p.slice(0, -1);
	}

	formatError(errObj: any) {
		let sourceURL = errObj.sourceURL || errObj.fileName; // Safari Firefox
		let line = errObj.line || errObj.lineNumber; // Safari Firefox
		let column = errObj.column || errObj.columnNumber; // Safari Firefox
		const message = errObj.message;
		// 获取堆栈信息
        const { stack } = errObj;
		if (stack) {
			const matchUrl = stack.match(/https?:\/\/[^\n]+/); // ['http://127.0.0.1/index.js:48:17',xx,xx]
			const urlFirstStack = matchUrl ? matchUrl[0] : ''; // http://127.0.0.1/index.js:48:17
			const regUrlCheck = /https?:\/\/(\S)*.js/;

			if (regUrlCheck.test(urlFirstStack)) {
				sourceURL = urlFirstStack.match(regUrlCheck)[0]; // http://127.0.0.1/index.js
			}

			const posStack = urlFirstStack.match(/:(\d+):(\d+)/);
			if (posStack && posStack.length >= 3) {
				let stackCol;
				let stackRow;
				// eslint-disable-next-line prefer-const
				[, stackCol, stackRow] = posStack; // [':48:17', '48', '17']
				if (stackCol) {
					line = stackCol;
				}
				if (stackRow) {
					column = stackRow;
				}
			}
		}
		return {
			column,
			line,
			message,
			sourceURL,
		};
	}
	queueFlush(flushJobs: () => void) {
		if (!this.isFlushPending) {
			this.isFlushPending = true;
			Promise.resolve().then(() => {
				this.isFlushPending = false;
				flushJobs();
			});
		}
	}
}

export default new Utils();
