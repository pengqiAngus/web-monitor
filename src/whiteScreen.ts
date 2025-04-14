/**
 * 页面白屏监控
 */
import { ReportType } from './constant';
import { ReportParams } from './types';
import Utils from './utils';

export default class WhiteScreen {
	constructor(
		private callback: (params: ReportParams) => void,
		private filterWhiteScreenElements?: Array<string>
	) {
		Utils.log('页面白屏监控初始化成功');
		this.init();
	}

	checkWhiteScreen() {
		const elements = this.filterWhiteScreenElements || ['html', 'body'];
		let emptyPoints = 0;
		const w = window.innerWidth;
		const h = window.innerHeight;
		const isWrapper = (element: HTMLElement) => {
			const selector = getSelector(element);
			if (elements.indexOf(selector) != -1) {
				emptyPoints++;
			}
		};

		const getSelector = (element: HTMLElement) => {
			if (element.id) {
				return '#' + element.id;
			} else if (element.className) {
				return (
					'.' +
					element.className
						.split(' ')
						.filter(item => !!item)
						.join('.')
				);
			} else {
				return element.nodeName.toLowerCase();
			}
		};
		// 屏幕x,y各取9个点位
		for (let index = 1; index <= 9; index++) {
			// TODO:中心点不太准，有的页面比较短
			const xElements = document.elementsFromPoint((w * index) / 10, h / 2);
			const yElements = document.elementsFromPoint(w / 2, (h * index) / 10);
			isWrapper(xElements[0] as HTMLElement);
			isWrapper(yElements[0] as HTMLElement);
		}
		// 少于18个元素判定为白屏
		if (emptyPoints >= 18) {
			const centerElements = document.elementsFromPoint(
				window.innerWidth / 2,
				window.innerHeight / 2
			);
			this.callback({
				type: ReportType.BLANKSCREEN,
				message: '页面白屏',
				emptyPoints,
				screen: window.screen.width + 'X' + window.screen.height, // 屏幕
				viewPoint: window.innerWidth + 'X' + window.innerHeight, // 浏览器
				selector: getSelector(centerElements[0] as HTMLElement), // 中心点
			});
		}
	}
	init() {
		Utils.onload(() => {
			this.checkWhiteScreen();
		});
	}
}
