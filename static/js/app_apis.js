const access_token = '';//code to fetch access token from database

const CURRENT_PLAY = "https://api.spotify.com/v1/me/player/currently-playing";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";

async function doCode(){

	const getAlbum = async () => {

		const result = await fetch(CURRENT_PLAY, {
			method: "GET",
			headers: {'Authorization' : 'Bearer ' + access_token}
		});

		const data = await result.json();
		return data.item.album.uri;
	};

	const getTrackPos = async () => {

		const result = await fetch(CURRENT_PLAY, {
			method: "GET",
			headers: {'Authorization' : 'Bearer ' + access_token}
		});

		const data = await result.json();
		return data.item.track_number;
	};

	const getSong = async () => {

		const result = await fetch(CURRENT_PLAY, {
			method: "GET",
			headers: {'Authorization' : 'Bearer ' + access_token}
		});

		const data = await result.json();
		return data.item.uri;
	};

	const getDevice = async () => {

		const result = await fetch(DEVICES, {
			method: "GET",
			headers: {'Authorization' : 'Bearer ' + access_token}
		});

		const data = await result.json();

		for (var x = 0; x < data.devices.length; x++){
			var active = data.devices[x].is_active;
			
			if ( active == true ){
				var playback_device = data.devices[x].id
			}
		}
		return playback_device;
	};

	const playSong = async () => {

		console.log(curent_album);
		console.log(track_position);
		console.log(active_device);

		let data = {
			'context_uri' : curent_album,
			'offset': {
				'position': track_position - 1
			},
			'position_ms': 0
		};

		await fetch(PLAY + "?device_id=" + active_device, {
			method: "PUT",
			headers: {
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + access_token
			},
			body: JSON.stringify(data)
		});

		console.log('Play request submitted');
		console.log(track_position);
	};

	let curent_album = await getAlbum();
	let track_position = await getTrackPos();
	let active_device = await getDevice();

	await playSong();
};