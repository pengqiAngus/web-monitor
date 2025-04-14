<template>
	<div>
		<input type="text" />
		<el-button type="primary" size="default" @click="$router.push('list')">
			跳转
		</el-button>
		<el-button type="primary" size="default" @click="$router.push('perf')">
			跳转perf
		</el-button>
		<el-button type="primary" size="default" @click="jsError1">
			jsError1
		</el-button>
		<el-button type="primary" size="default" @click="jsError2">
			jsError2
		</el-button>
		<el-button type="primary" size="default" @click="promiseError1">
			promiseError1
		</el-button>
		<el-button type="primary" size="default" @click="promiseError2">
			promiseError2
		</el-button>
		<el-button type="primary" size="default" @click="resourcesError">
			resourcesError
		</el-button>
		<el-button type="primary" size="default" data-report="{userId:'1000'}">
			无痕埋点
		</el-button>
		<el-button type="primary" size="default" @click="apiGet">api-get</el-button>
		<el-button type="primary" size="default" @click="apiPost">
			api-post
		</el-button>
		<input type="file" @change="upload" />
		<img src="xxx.jpg" v-if="isResources" />
		<audio
			v-if="isResources"
			src="xxx.mp3"
			controls="controls"
			autoplay="autoplay"
			loop="loop"
		></audio>
		<video
			v-if="isResources"
			src="xxx.mp4"
			autoplay="autoplay"
			controls="controls"
			loop="loop"
		></video>
		<div data-appear="appear1">appear1</div>
		<div class="box">box</div>
		<div data-appear="appear2">appear2</div>
	</div>
</template>
<script setup>
	import { ref } from 'vue';
	import axios from 'axios';
	const jsError1 = () => {
		o.x;
	};
	const jsError2 = () => {
		try {
			setTimeout(() => {
				o.y;
			});
		} catch (error) {
			console.log('error');
		}
	};
	const promiseError1 = () => {
		new Promise((resolve, reject) => {
			// reject 不上报
			reject('error');
		});
	};

	const promiseError2 = () => {
		new Promise((resolve, reject) => {
			a.x;
		});
	};
	const isResources = ref(false);
	const resourcesError = () => {
		isResources.value = true;
	};

	const apiGet = () => {
		axios.get('http://127.0.0.1:9001/user?userId=12345');
		axios.get('http://127.0.0.1:9001/user', {
			params: {
				userId: '0001212',
			},
		});
	};
	const apiPost = () => {
		axios.post('http://127.0.0.1:9001/user', {
			firstName: 'Fred',
			lastName: 'Flintstone',
		});
	};
	const upload = e => {
		const formData = new FormData();
		formData.append('file', e.target.files[0]);
		axios.post('http://127.0.0.1:9001/upload', formData);
	};
</script>
<style>
	.box {
		background: red;
		height: 100vh;
	}
</style>
