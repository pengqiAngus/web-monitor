import Utils from './utils';
import Tracker from './tracker';
import JsError from './jsError';
import PromiseError from './promiseError';
import ResourcesError from './resourcesError';
import WhiteScreen from './whiteScreen';
import Exposure from './exposure';
import AutomaticBurialPoint from './automaticBurialPoint';
import LengthOfStay from './pageDwellTime';
import Pv from './pv';
import Perf from './perf';
import ResourcesPerf from './resourcesPerf';
import Xhr from './xhr';
import { MonitorSdkConfig, ReportParams } from './types';

let __TRACKER__: Tracker; // 上报实例
class RegisterMonitorSdk {
	exposureRefresh!: () => void;
	constructor(private monitorSdkConfig: MonitorSdkConfig) {
		Utils.log('version 1.2.0');
		if (!monitorSdkConfig.pid) {
			Utils.log('请上传[pid]字段', 'warning');
			return;
		}
		__TRACKER__ = new Tracker(monitorSdkConfig);
		if (monitorSdkConfig.jsErrorLog) {
			new JsError((params: ReportParams) => this.report(params));
		}
		if (monitorSdkConfig.promiseErrorLog) {
			new PromiseError((params: ReportParams) => this.report(params));
		}
		if (monitorSdkConfig.resourcesErrorLog) {
			new ResourcesError((params: ReportParams) => this.report(params));
		}
		if (monitorSdkConfig.blankScreenLog) {
			new WhiteScreen(
				(params: ReportParams) => this.report(params),
				monitorSdkConfig?.ignoreWhiteScreenElements
			);
		}
		if (monitorSdkConfig.exposureLog) {
			const exposure = new Exposure((params: ReportParams) =>
				this.report(params)
			);
			this.exposureRefresh = exposure.appear.bind(exposure);
		}
		if (monitorSdkConfig.automaticBurialPointLog) {
			new AutomaticBurialPoint((params: ReportParams) => this.report(params));
		}
		if (monitorSdkConfig.pageDwellTimeLog) {
			new LengthOfStay((params: ReportParams) => this.report(params));
		}
		if (monitorSdkConfig.pvLog) {
			new Pv((params: ReportParams) => this.report(params));
		}
		if (monitorSdkConfig.xhrLog) {
			new Xhr((params: ReportParams) => this.report(params));
		}
		if (monitorSdkConfig.resourcesPerfLog) {
			new ResourcesPerf(
				(params: ReportParams) => this.report(params),
				monitorSdkConfig.reportUrl
			);
		}
		if (monitorSdkConfig.perfLog) {
			new Perf((params: ReportParams) => this.report(params));
		}
	}

	// 统一处理日志上报
	report = (params: ReportParams) => {
		params.pid = this.monitorSdkConfig.pid;
		__TRACKER__.report(params);
	};
}

let monitorSdk: RegisterMonitorSdk;
export default function singletonMonitor(
	monitorSdkStrategy: MonitorSdkConfig = { pid: '' }
) {
	return monitorSdk
		? monitorSdk
		: (monitorSdk = new RegisterMonitorSdk(monitorSdkStrategy));
}
