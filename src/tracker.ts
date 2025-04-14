import { v4 as uuidv4 } from 'uuid';
import { ReportParams, TypeTracker } from './types';
import Utils from './utils';

export default class Tracker {
	tracker: TypeTracker;
	constructor(tracker: TypeTracker) {
		this.tracker = tracker;
		window.addEventListener('beforeunload', async () => {
			const performance = sessionStorage.getItem('MONITOR_SDK_PERFORMANCE');
			if (performance) {
				const formData = new FormData();
				formData.append('data', performance as string);
				navigator.sendBeacon(this.tracker.reportUrl as any, formData);
			}
		});
	}

	getCommonData() {
		const browserInfo = Utils.getBrowserInfo();
		let userId = localStorage.getItem('MONITOR_SDK_USERID');
		let uuid = localStorage.getItem('MONITOR_SDK_UUID'); // 用于登录后通过userId关联
		let trackerId = sessionStorage.getItem('MONITOR_SDK_TRACKERID'); // 用户链路追踪ID
		if (!trackerId) {
			trackerId = uuidv4();
			sessionStorage.setItem('MONITOR_SDK_TRACKERID', trackerId);
		}
		if (!uuid) {
			uuid = uuidv4();
			localStorage.setItem('MONITOR_SDK_UUID', uuid);
		}
		if (!userId) {
			userId = uuid;
		}

		return {
			...browserInfo,
			timestamp: Date.now(),
			pageUrl: encodeURIComponent(location.href),
			title: document.title,
			userId,
			uuid,
			trackerId,
		};
	}

	reportParamsFormat(params: ReportParams) {
		if (this.tracker.reportParamsFormat) {
			return this.tracker.reportParamsFormat(params);
		}
		return params;
	}

	reportUploadBefore(params: ReportParams) {
		if (this.tracker.debug) {
			Utils.log('上报参数之前', 'debug');
		}
		this.tracker.reportUploadBefore && this.tracker.reportUploadBefore(params);
	}

	reportUploadAfter(params: ReportParams) {
		if (this.tracker.debug) {
			Utils.log('上报参数之后', 'debug');
		}
		this.tracker.reportUploadAfter && this.tracker.reportUploadAfter(params);
	}

	async report(params: ReportParams) {
		const reportData = this.reportParamsFormat({
			...this.getCommonData(),
			...params,
		});
		this.reportUploadBefore(reportData);
		if (!this.tracker.debug) {
			if (this.tracker.reportUrl) {
				if (reportData.type === 'PERFORMANCE') {
					const perf =
						sessionStorage.getItem('MONITOR_SDK_PERFORMANCE') || '{}';
					sessionStorage.setItem(
						'MONITOR_SDK_PERFORMANCE',
						JSON.stringify({ ...JSON.parse(perf), ...reportData })
					);
					return;
				}
				// 实时上报
				let img: any = new Image();
				img.src = `${this.tracker.reportUrl}?${Utils.trackerParamsFormat(
					reportData
				)}`;
				img = null; // 内存释放
			} else {
				Utils.log('请指定上传的URL地址', 'warning');
			}
		} else {
			Utils.log(reportData, 'debug');
		}
		this.reportUploadAfter(reportData);
	}
}
