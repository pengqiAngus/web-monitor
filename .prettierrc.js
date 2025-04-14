module.exports = {
	arrowParens: 'avoid', //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
	bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
	endOfLine: 'auto', // 结尾是 \n \r \n\r auto
	htmlWhitespaceSensitivity: 'ignore',
	jsxBracketSameLine: false, // 在jsx中把'>' 是否单独放一行
	jsxSingleQuote: true, // 在jsx中使用单引号代替双引号
	// printWidth: 1000, // 超过最大值换行
	proseWrap: 'preserve', // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
	semi: true, // 句尾添加分号
	singleQuote: true, // 使用单引号代替双引号
	tabWidth: 2, // 缩进字节数
	trailingComma: 'es5', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
	useTabs: true, // 缩进使用tab，不使用空格
	vueIndentScriptAndStyle: true, //是否在Vue文件中的<script>和<style>标签内缩进代码
	requireConfig: false,
};
