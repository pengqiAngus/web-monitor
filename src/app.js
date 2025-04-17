const Koa = require('koa');
const path = require('path');
const app = new Koa();
const fs = require('fs-extra');
const cors = require('koa2-cors');
const { koaBody } = require('koa-body');
const statics = require('koa-static');
const router = require('koa-router')();
app.use(cors());
app.use(statics(path.resolve('./lib')));
app.use(
	koaBody({
		multipart: true, // 支持文件上传
		formidable: {
			maxFileSize: 3000 * 1024 * 1024, // 设置上传文件大小的限制，3G
		},
	})
);

router.get('/report', async ctx => {
	console.log('get', JSON.stringify(ctx.query));
	return (ctx.body = {
		code: 0,
		message: '成功',
		data: {},
	});
});

router.post('/report', async ctx => {
	console.log('post', ctx.request.body);
	return (ctx.body = {
		code: 0,
		message: '成功',
		data: {},
	});
});

router.post('/user', async ctx => {
	return (ctx.body = {
		code: 0,
		message: '成功',
		data: {},
	});
});

router.get('/user', async ctx => {
	return (ctx.body = {
		code: 0,
		message: '成功',
		data: {},
	});
});

router.post('/upload', async ctx => {
	// 获取上传的文件
	const file = ctx.request.files?.file;
	// 获取上传文件路径
	const chunk_dir = path.resolve(__dirname, 'public');
	const exist = await fs.pathExists(chunk_dir);
	// 文件不存在创建
	if (!exist) {
		await fs.mkdirs(chunk_dir);
	}
	const filename = new Date().getTime() + '';
	const targetPath = path.resolve(chunk_dir, filename);
	// 创建可读流
	const reader = fs.createReadStream(file.filepath);
	// 创建写入流
	const writer = fs.createWriteStream(targetPath);
	reader.pipe(writer);

	writer.on('error', err => {
		console.error(`错误信息：${err}`);
		writer.close();
	});

	writer.on('finish', () => {
		console.log('写入操作已完成');
		writer.end();
		writer.close();
	});
	ctx.body = {
		code: 0,
		message: '文件上传成功',
	};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(9001, () => {
	console.log('服务已启动端口:9001');
});
