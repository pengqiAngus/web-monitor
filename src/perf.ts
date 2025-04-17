/**
 * 页面性能指标
 */
import { onFCP, onLCP, onFID } from 'web-vitals';
import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class Perf {
	cycleFreq = 100; // 循环轮询的时间
	timer: any = 0;
	constructor(private callback: (params: ReportParams) => void) {
		Utils.log('页面渲染性能监控初始化成功');
		this.init();
	}
	runCheck() {
		let FCP = 0;
		let LCP = 0;
		let FID = 0;
		let FMP = 0;
		const p = performance.getEntriesByType(
			'navigation'
		)[0] as PerformanceNavigationTiming;
		new PerformanceObserver((entryList, observer) => {
			const perfEntries = entryList.getEntries();
			FMP = perfEntries[0].startTime;
			observer.disconnect(); //不再观察了
		}).observe({ entryTypes: ['element'] }); //观察页面中的意义的元素
		// 首次内容绘制
		onFCP(data => {
			console.log('onFCP', data);
			FCP = data.value;
			callback();
		});
		// 最大内容绘制
		onLCP(data => {
			console.log('onLCP', data);
			LCP = data.value;
			callback();
		});
		// 首次输入延迟
		onFID(data => {
			console.log('onFID', data);
			FID = data.value;
			callback();
		});
		const callback = () => {
			this.callback({
				type: ReportType.PERFORMANCE,
				message: '页面渲染性能',
				unload: (p.unloadEventEnd - p.unloadEventStart).toFixed(2), // 前一个页面卸载耗时
				redirect: (p.redirectEnd - p.redirectStart).toFixed(2), // 重定向的时间
				appCache: (p.domainLookupStart - p.fetchStart).toFixed(2), // 读取缓存的时间
				dns: (p.domainLookupEnd - p.domainLookupStart).toFixed(2), // DNS查询耗时
				tcp: (p.connectEnd - p.connectStart).toFixed(2), // TCP连接耗时
				ssl: (p.connectEnd - p.secureConnectionStart).toFixed(2), // SSL 安全连接耗时
				rst: (p.responseStart - p.requestStart).toFixed(2), // 请求响应耗时
				trans: (p.responseEnd - p.responseStart).toFixed(2), // 响应数据传输耗时
				ready: (p.domComplete - p.domInteractive).toFixed(2), // DOM解析耗时(不包含dom内嵌资源加载时间)
				resources: (p.loadEventStart - p.domContentLoadedEventEnd).toFixed(2), //资源加载耗时
				onLoad: (p.loadEventEnd - p.loadEventStart).toFixed(2), // onLoad事件耗时(所有资源已加载)
				// 指标
				TTFB: (p.responseStart - p.redirectStart).toFixed(2), // 首字节(重定向到->服务器接收页面的第一个字节)
				FP: (p.responseEnd - p.fetchStart).toFixed(2), // 白屏时间 首次绘制包括了任何用户自定义的背景颜色绘制，它是将第一个像素点绘制到屏幕的时刻
				FCP: FCP.toFixed(2), //	首次内容绘制 是浏览器将第一个DOM渲染到屏幕的时间,可以是任何文本、图像、SVG等的时间
				FMP: FMP.toFixed(2), //	首次有意义绘制
				LCP: LCP.toFixed(2), //	最大内容渲染(事件响应时触发)
				DCL: (
					p.domContentLoadedEventEnd - p.domContentLoadedEventStart
				).toFixed(2), // DOMContentLoaded事件耗时
				L: (p.loadEventStart - p.fetchStart).toFixed(2), // 页面完全加载总时间(load)
				TTI: (p.domInteractive - p.fetchStart).toFixed(2), // 首次可交互时间
				FID: FID.toFixed(2), //	首次输入延迟时间(点击到响应的时间差)
			});
		};
		// 保证load事件结束
		if (p.loadEventEnd) {
			callback();
		} else {
			clearInterval(this.timer);
			this.timer = setTimeout(this.runCheck.bind(this), this.cycleFreq);
		}
	}

	init() {
		// 检查文档是否已经加载完成
		if (document.readyState === 'complete') {
            this.runCheck();
            this.LCPMonitor();
		} else {
			// 如果文档还未加载完成，添加事件监听
			window.addEventListener('load', () => {
                this.runCheck();
                 this.LCPMonitor();
			});
		}

		// 同时监听 DOMContentLoaded 事件
		if (
			document.readyState === 'interactive' ||
			document.readyState === 'complete'
		) {
			this.runCheck();
            this.LCPMonitor();
		} else {
			document.addEventListener('DOMContentLoaded', () => {
				this.runCheck();
                this.LCPMonitor();
			});
		}
	}
	LCPMonitor() {
        new PerformanceObserver(list => {
			const lcpEntry: any = list.getEntries().at(-1) ;
			if (!lcpEntry.url) return;
			const navEntry = performance.getEntriesByType('navigation')[0];
			const resEntries = performance.getEntriesByType('resource');
			const lcpResEntry = resEntries.filter(e => e.name === lcpEntry.url)[0];

			const docTTFB = navEntry.responseStart;

			const lcpRequestStart = Math.max(
				docTTFB,
				lcpResEntry ? lcpResEntry.requestStart : 0
			);

			const lcpResponseEnd = Math.max(
				lcpRequestStart,
				lcpResEntry ? lcpResEntry.responseEnd : 0
			);

			const lcpRenderTime = Math.max(
				lcpResponseEnd,
				lcpEntry ? lcpEntry.startTime : 0
			);

			console.log('LCP: ', lcpRenderTime, lcpEntry.element);
			console.log('document_ttfb', docTTFB);
			console.log('resource_load_delay', lcpRequestStart - docTTFB);
			console.log('resource_load_time', lcpResponseEnd - lcpRequestStart);
			console.log('element_render_delay', lcpRenderTime - lcpResponseEnd);

			performance.measure('document_ttfb', {
				start: 0,
				end: docTTFB,
			});
			performance.measure('resource_load_delay', {
				start: docTTFB - 0.01,
				end: lcpRequestStart - 0.01,
			});
			performance.measure('resource_load_time', {
				start: lcpRequestStart,
				end: lcpResponseEnd,
			});
			performance.measure('element_render_delay', {
				start: lcpResponseEnd - 0.01,
				end: lcpRenderTime - 0.01,
			});
		}).observe({
			type: 'largest-contentful-paint',
			buffered: true,
		});
	}
}
