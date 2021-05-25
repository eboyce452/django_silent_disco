const CURRENT_PLAY = "https://api.spotify.com/v1/me/player/currently-playing";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";

// gray code is test for closing all sockets
// var all_sockets = [];

function createSocket(roomName, token, master_slave){
                
    const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/lobby/'
    + roomName
    + '/'
    );

    // all_sockets.push({'room_name': roomName,'socket':chatSocket});

    if (master_slave == 'slave'){
    	chatSocket.onmessage = async function(e) {
	        const inc_data = await JSON.parse(e.data);

	        let album = null;
	        let track_num = null;
	        let track_pos = null;
	        let image_url = null;
	        let song_name = null;
	        let artist_name = null;
	        let active_device = null;
	        let is_socket_new = null;

	        if (inc_data.message === 'new_socket_request'){
	        	return
	        }

	        if (inc_data.message === 'master_present'){
	        	$('#test').html(Math.random());
	        	return
	        }

	        if (inc_data.message.token != null){
	        	let init_track_info = await currentplayInfo(inc_data.message.token);
	        	let socket_current_play = await currentplayInfo(token);

	        	album = await init_track_info['album'];
		        track_num = await init_track_info['track_num'];
		        track_pos = await init_track_info['track_pos'];

		        image_url = await init_track_info['image_url'];
		        song_name = await init_track_info['song_name'];
		        artist_name = await init_track_info['artist_name'];

		        is_socket_new = await socket_current_play['is_playing'];

		        if (is_socket_new == true && init_track_info['album'] == socket_current_play['album'] && init_track_info['track_num'] == socket_current_play['track_num']){
		        	if (image_url != null && song_name != null && artist_name != null){
	        			document.getElementById('artist_image').innerHTML = await '<img src="' + image_url + '"><div class="jumbotron"><h1>' + song_name + '</h1><h2>' + artist_name + '</h2></div>';	
	        		}
		        	return
		        }

		        else {
		        	await console.log('new socket registered');
		        }

		        active_device = await currentdeviceInfo(token);
	        }

	        else {
		        album = await inc_data.message.album;
		        track_num = await inc_data.message.track_num;
		        track_pos = await inc_data.message.track_pos;

		        image_url = await inc_data.message.image_url;
		        song_name = await inc_data.message.song_name;
		        artist_name = await inc_data.message.artist_name;

		        active_device = await currentdeviceInfo(token);
	        }

	        if (image_url != null && song_name != null && artist_name != null){
	        	document.getElementById('artist_image').innerHTML = await '<img src="' + image_url + '"><div class="jumbotron"><h1>' + song_name + '</h1><h2>' + artist_name + '</h2></div>';	
	        }

	        if (active_device == undefined){
	        	console.log('NO DEVICE');
	        	return
	        }
	        
	        let data = {
				'context_uri' : album,
				'offset': {
					'position': track_num - 1
				},
				'position_ms': track_pos
			};

	        await fetch(PLAY + "?device_id=" + active_device, {
				method: "PUT",
				headers: {
					'Content-Type' : 'application/json',
					'Authorization' : 'Bearer ' + token
				},
				body: JSON.stringify(data)
			});

			console.log('Play request submitted');
		};
	}

    if (master_slave == 'master'){
    	chatSocket.onmessage = async function(e) {
    		var connection_request = await JSON.parse(e.data);
    		if (connection_request.message == 'new_socket_request'){
    			var message = {
    				'token':token,
    				'data_type':'token'
    			}
    			await chatSocket.send(JSON.stringify({
    				'message':message,
    			}));
    		}
    	};

    	chatSocket.onopen = function(e) {
    		console.log('Master user connected');
    	}
    }

    if (master_slave == 'slave'){
    	chatSocket.onopen = function(e) {
    		var init_request = 'new_socket_request';
    		chatSocket.send(JSON.stringify({
    			'message': init_request
    		}));
    	};
    }

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    return chatSocket;
}

async function currentplayInfo(token){
    const result = await fetch(CURRENT_PLAY, {
        method: "GET",
        headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    });

    const data = await result.json();
    
    if (data.item == null){
    	var replacement_info = await currentplayInfo(token);
    	return replacement_info;
    }

    const album = data.item.album.uri;
    const track_num = data.item.track_number;
    const track_pos = data.progress_ms;
    const image_url = data.item.album.images[0]['url'];
    const song_name = data.item.name;
    const artist_name = data.item.artists[0]['name'];

    const track_info = {
        'album':album,
        'track_num':track_num,
        'track_pos':track_pos,
        'image_url':image_url,
        'song_name':song_name,
        'artist_name':artist_name,
        'is_playing':data.is_playing,
    };

    return track_info;
}

async function currentdeviceInfo(token){
	const result = await fetch(DEVICES, {
		method: "GET",
		headers: {
			'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json',
		},
	});

	const data = await result.json();
	for (var x = 0; x < data.devices.length; x++){
		var active = data.devices[x].is_active;
			
		if ( active == true ){
			var playback_device = data.devices[x].id
		}
	}
		
	return playback_device;
}
