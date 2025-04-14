import axios from 'axios';
import { Button, Space } from 'antd-mobile';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Home() {
	const navigate = useNavigate();
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
	const [flag, setFlag] = useState(false);
	return (
		<>
			<Space wrap>
				<Button color='primary' onClick={() => navigate('/list')}>
					跳转
				</Button>
				<Button color='primary' onClick={() => navigate('/perf')}>
					跳转perf
				</Button>
				<Button color='primary' onClick={() => jsError1()}>
					jsError1
				</Button>
				<Button color='primary' onClick={() => jsError2()}>
					jsError2
				</Button>
				<Button color='primary' onClick={() => promiseError1()}>
					promiseError1
				</Button>
				<Button color='primary' onClick={() => promiseError2()}>
					promiseError2
				</Button>
				<Button color='primary' onClick={() => setFlag(true)}>
					resourcesError
				</Button>
				<Button color='primary' data-report="{userId:'1000'}">
					无痕埋点
				</Button>
				<Button color='primary' onClick={() => apiGet()}>
					api-get
				</Button>
				<Button color='primary' onClick={() => apiPost()}>
					api-post
				</Button>
				<input type='file' onChange={e => upload(e)} />
				{flag && (
					<>
						<img src='xxx.jpg' />,
						<audio
							src='xxx.mp3'
							controls='controls'
							autoPlay='autoplay'
							loop='loop'
						></audio>
						,
						<video
							src='xxx.mp4'
							autoPlay='autoplay'
							controls='controls'
							loop='loop'
						></video>
					</>
				)}
				<div data-appear='appear1'>appear1</div>
				<div
					className='box'
					style={{ background: 'red', height: '100vh', width: '100vw' }}
				>
					box
				</div>
				<div data-appear='appear2'>appear2</div>
			</Space>
		</>
	);
}
