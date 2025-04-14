# 前端监控 SDK

## 安装



## 使用

- 除了`perfLog`页面渲染性能监控，其他都是实时上报

### 参数说明

| 参数 | 是否必传  | 默认值 |说明 |
| :-----| :----: | :----: | :----: |
| pid | true | - | 产品ID |
| reportUrl | true | - | 上报接口地址 |
| debug | false | false | debug模式打印控制台，不上报接口 |
| jsErrorLog | false | false | js异常 |
| promiseErrorLog | false | false | promise异常 |
| resourcesErrorLog | false | false | 资源加载异常 |
| exposureLog | false | false | 曝光埋点 |
| automaticBurialPointLog | false | false | 自动埋点 |
| pageDwellTimeLog | false | false | 页面停留时间 |
| pvLog | false | false | pv |
| xhrLog | false | false | 接口监控 |
| resourcesPerfLog | false | false | 资源加载性能 |
| perfLog | false | false | 页面渲染性能 |

```js
import MonitorSdk from '@fe-hl/monitor-sdk';

const monitorSdk = MonitorSdk({
	pid: '1000', // 产品ID
	reportUrl: 'http://127.0.0.1:9001/report', // 上报的地址
	debug: false, // 是否开启debug，开启后打印控制台不上报
	jsErrorLog: true, // js异常
	promiseErrorLog: true, // promise异常
	resourcesErrorLog: true, // 资源加载异常
	exposureLog: true, //  // 曝光
	automaticBurialPointLog: true,  // 自动埋点
	pageDwellTimeLog: true, // 页面停留时间
	pvLog: true, // PV
	xhrLog: true, // 接口监控
	resourcesPerfLog: true, // 资源加载性能
	perfLog: true, // 页面渲染性能
});

// 自定义上报
monitorSdk.report({
	type: 'click',
	message:"下单成功"
});
```

## 爆光埋点

- 给需要`爆光`的元素加上`appear`属性，当元素在可视区域内，上报接口

```html
	<div appear="广告1">广告</div>
	<div appear="{id:100}">广告</div>
```

## 无痕埋点

- 当元素发生点击事件，如果元素有`report`属性会自动上报接口

```html
<el-button type="primary" size="default" report="{userId:'1000'}">
	无痕埋点
</el-button>

 <el-button type="primary" size="default" report="report1">
	无痕埋点
 </el-button>
```


## 关键指标

| 指标      | 计算方式                      | 说明                                                                |
| ---------| ---------------------------- | ----------------------------------------------------------------   |
| TTFB     | responseStart-redirectStart  |  首字节时间(页面重定向到服务器接收页面的第一个字节)                         |
| FP       | responseEnd - fetchStart     |  首次绘制时间-白屏时间(背景颜色绘制，它是将第一个像素点绘制到屏幕的时刻)             |
| FCP      | 谷歌web-vitals                |  首次内容绘制时间(浏览器将第一个DOM渲染到屏幕的时间)|
| FMP      | 谷歌web-vitals                |  首次有意义绘制时间(FMP 是一个主观的指标，触发时机可能是`主要内容的绘制`、`用户页面交互`)|
| LCP      | 谷歌web-vitals                |  最大内容渲染时间(LCP 是一个动态的指标，它可能在页面加载过程中发生变化触发时机可能是`主要内容绘制完成`、`用户页面交互`)             |
| DCL      | domContentLoadedEventEnd - domContentLoadedEventStart |  DOMContentLoaded事件耗时            |
| L        | loadEventStart - fetchStart  |  页面完全加载总时间                                             |
| TTI      | 谷歌web-vitals                |  首次可交互时间(页面从加载开始到用户可以进行有意义的交互操作)          |
| FID      | 谷歌web-vitals                |  首次输入延迟时间(用户首次输入与页面响应之间的延迟时间)             |

- TTI触发时机

  - 1、首次渲染（FP）已经完成：页面的第一个像素已经被绘制。
  - 2、主线程空闲时间达到一定阈值：在一段时间内，浏览器主线程没有耗时的任务在执行。这意味着页面的关键渲染路径已经完成，主要内容已经可见。
  - 3、页面元素的可操作性：页面上的交互元素（如按钮、链接、输入框等）可以响应用户的交互操作。这表示页面已经加载完成，并且用户可以进行有意义的交互。
  - 当以上条件都满足时，TTI 会被触发

- FID触发时机
  - 1、用户首次与页面进行交互：用户执行了一个交互动作，如点击按钮、滚动页面、选择下拉菜单等。
  - 2、浏览器主线程忙于处理其他任务：当用户进行交互时，如果主线程正忙于处理其他任务（如执行 JavaScript、处理样式计算等），则会导致延迟。




## 指标参考

| 指标 | 优 | 中 | 差 |说明 |
| :-----| ----: | :----: | :----: |:----: |
| TTFB | 0-800(ms) | 800-1800(ms) |1800-~(ms) |第一字节时间 |
| FCP | 0-1.8(sec) | 1.8-3.0(sec) |3.0-~(sec) |首次内容绘制 |
| FID | 0-100(ms) | 100-300(ms) |300-~(ms) |首次输入延迟 |


## 错误监控 
window.onerror(js 运行错误) 
window.onunhandledrejection(promise错误) 
window.addEventListener(资源错误) 
React用 错误边界（Error Boundaries）代替window.onerror

## 白屏监控
x,y 各取 9个点使用 elementsFromPoint 是否有dom元素

## 元素曝光监控
dom元素设置 data-appear
IntersectionObserver 通过data-appear观察属性判断元素是否被曝光

## 元素点击事件
document.addEventListener（'click'）+ data-report 判断是否需要记录

## 页面停留时长
prePageUrl = encodeURIComponent(location.href);
window.addEventListener('beforeunload');
window.addEventListener('popstate', e => handler(e), true);
window.addEventListener('replaceState', e => handler(e), true);
window.addEventListener('pushState', e => handler(e), true);
lastTime = Date.now();

## PV
prePageUrl = encodeURIComponent(location.href);
window.addEventListener('popstate', e => handler(e), true);
window.addEventListener('replaceState', e => handler(e), true);
window.addEventListener('pushState', e => handler(e), true);

## api 监控
重写 xhr 或者 fetch

## 资源加载性能
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

## 页面渲染性能监控
const p = performance.getEntriesByType(
			'navigation'
		)
web-vitals 观察 FCP LCP NIP CLS
通过p计算其他指标
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
## TODO

  - 用户链路追踪 每次埋点统计都push到breadcrumb数组里面，满20步就发服务端。
  - 用户页面行为录制 rrweb
