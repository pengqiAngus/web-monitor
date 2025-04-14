/**
 * 资源加载性能指标
 */
import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class ResourcesPerf {
	constructor(
		private callback: (params: ReportParams) => void,
		private reportUrl?: string
	) {
		Utils.log('资源加载性能指标初始化成功');
		this.init();
	}
	resolveEntries(entries: PerformanceResourceTiming[]): Array<ReportParams> {
		const timings: Array<ReportParams> = [];
		entries.forEach((timing: PerformanceResourceTiming) => {
			if (this.checkReport(timing)) {
				timings.push({
					type: ReportType.RES_PERFORMANCE,
					message: '资源加载性能',
					resourcesUrl: timing.name,
					resourcesType: timing.initiatorType,
					redirect: (timing.redirectEnd - timing.redirectStart).toFixed(2), // 重定向
					appCache: (timing.domainLookupStart - timing.fetchStart).toFixed(2), // 缓存
					dns: (timing.domainLookupEnd - timing.domainLookupStart).toFixed(2),
					tcp: (timing.connectEnd - timing.connectStart).toFixed(2),
					ssl: (timing.connectEnd - timing.secureConnectionStart).toFixed(2), // https下有效
					rst: (timing.responseStart - timing.requestStart).toFixed(2), // 请求响应耗时
					trans: (timing.responseEnd - timing.responseStart).toFixed(2), // 内容传输耗时
					duration: timing.duration.toFixed(2), // 加载时长
					decodedBodySize: timing.decodedBodySize,
					encodedBodySize: timing.encodedBodySize,
					transferSize: timing.transferSize,
				});
			}
		});
		return timings;
	}
	// link(css) script img audio video css(字体)
	checkReport({ initiatorType, name }: PerformanceResourceTiming): boolean {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (name.startsWith(this.reportUrl!)) {
			// 防止上报死循环
			return false;
		}
		if (
			initiatorType === 'link' ||
			initiatorType === 'script' ||
			initiatorType === 'img' ||
			initiatorType === 'audio' ||
			initiatorType === 'video' ||
			initiatorType === 'css'
		) {
			return true;
		}
		return false;
	}
	init() {
		if (window.PerformanceObserver) {
			const observer = new window.PerformanceObserver(performance => {
				const entries = performance.getEntries() as PerformanceResourceTiming[];
				const timings = this.resolveEntries(entries);
				timings.forEach(timing => {
					this.callback(timing);
				});
			});
			observer.observe({
				entryTypes: ['resource'],
			});
		} else {
			window.addEventListener('load', () => {
				const entries = performance.getEntriesByType(
					'resource'
				) as PerformanceResourceTiming[];
				const timings = this.resolveEntries(entries);
				timings.forEach(timing => {
					this.callback(timing);
				});
			});
		}
	}
}
