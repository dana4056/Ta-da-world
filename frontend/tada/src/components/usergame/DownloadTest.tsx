function DownloadTest(): JSX.Element {
	const corsCheck = async () => {
		const rewardImgPath = 'https://d2ab9z4xn2ddpo.cloudfront.net/rooms/1/treasures/95aa9224-ff30-42fe-b079-50dc9922ce20treasure.png';
		const response = await fetch(rewardImgPath);
		console.log('res: ', response);

		const blob = await response.blob();

		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `treasure_image_${1}`;

		document.body.appendChild(a);

		a.click();

		document.body.removeChild(a);
	};

	return (
		<div className="bg-white">
			<h1>CORS</h1>
			<button className="bg-gray" onClick={corsCheck}>테스트</button>
		</div>
	);
}

export default DownloadTest;
