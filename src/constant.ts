/**
 * 常量
 */
export enum ReportType {
	JS_ERROR = 'JS_ERROR', // js异常
	PROMISE_ERROR = 'PROMISE_ERROR', // promise异常
	RESOURCES_ERROR = 'RESOURCES_ERROR', // 资源加载异常
	XHR = 'XHR', // 接口监控
	PERFORMANCE = 'PERFORMANCE', // 页面渲染性能
	RES_PERFORMANCE = 'RES_PERFORMANCE', // 资源加载性能
	PAGE_DWELL_TIME = 'PAGE_DWELL_TIME', // 页面停留时间
	PV = 'PV',
	EXPOSURE = 'EXPOSURE', // 曝光
	AUTOMATIC_BURIAL_POINT = 'AUTOMATIC_BURIAL_POINT', // 自动埋点
	BLANKSCREEN = 'BLANKSCREEN', // TODO:页面白屏监控
}
