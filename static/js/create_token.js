var redirect_uri = 'http://127.0.0.1:8000/';
var client_id = '675399488120478dbe15a59fa08e3285';
var client_secret = 'db6aeaf6d9c54998ace0c634b761b109';

var scopes = 'user-read-currently-playing user-read-playback-state user-modify-playback-state streaming user-read-email user-read-private';

const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const TOKEN = 'https://accounts.spotify.com/api/token';

function requestAuthorization(){
	localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

	let url = AUTHORIZE;
	url += "?client_id=" + client_id;
	url += "&response_type=code";
	url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
	url += "&show_dialog=true";
	url += "&scope=" + encodeURIComponent(scopes);
	window.location.href = url;
};

function onPageLoad(){
	client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

	if ( window.location.search.length > 0 ){
		handleRedirect();
	}
};

function handleRedirect(){
	let code = getCode();
	fetchAccessToken(code);
	window.history.pushState("", "", redirect_uri);
};

function getCode(){
	let code = null;
	const queryString = window.location.search;
	if ( queryString.length > 0 ){
		const urlParams = new URLSearchParams(queryString);
		code = urlParams.get('code');
	}
	return code;
};

function fetchAccessToken(code){
	let body = "grant_type=authorization_code";
	body += "&code=" + code;
	body += "&redirect_uri=" + encodeURIComponent(redirect_uri);
	body += "&client_id=" + client_id;
	body += "&client_secret=" + client_secret;
	callAuthorizationAPI(body);
};

function callAuthorizationAPI(body){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", TOKEN, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
	xhr.send(body);
	xhr.onload = handleAuthorizationResponse;
};

function handleAuthorizationResponse(){
	if ( this.status == 200 ){
		var data = JSON.parse(this.responseText);
		var data = JSON.parse(this.responseText);
		if ( data.access_token != undefined ){
			access_token = data.access_token;
		}
		if ( data.refresh_token != undefined ){
			refresh_token = data.refresh_token;
		}
		var username = localStorage.getItem('username');
		var password = localStorage.getItem('password');
		addToDatabase(username, password, access_token, refresh_token);
		localStorage.removeItem('username');
		localStorage.removeItem('password');
		window.location.replace('lobby/?username='+username);
	}
	else {
		console.log(this.responseText);
		alert(this.responseText);
	}
};

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
};

$('#post-form').on('submit', function(event){
	event.preventDefault();
	var username = $('#id_username').val();
	var password = $('#id_password').val();
	localStorage.setItem('username', username);
	localStorage.setItem('password', password);
	requestAuthorization();
});

function addToDatabase(username, password, access_token, refresh_token) {

	$.ajax({
		url : 'jsondata/', //the endpoint
		type : 'POST',
		data : {
			username : username,
			password : password,
			user_token : access_token,
			user_refresh_token : refresh_token
		},

		//successful response handling
		success : function(json) {
			$('#id_username').val('');
			console.log('success');
			console.log(json);
		},

		//bad response handling
		error : function(xhr,errmsg,err) {
			$('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg + " <a href='#' class='close'>&times;</a></div>");
			console.log(xhr.status + ": " + xhr.responseText);
		}
	});
};

$(function() {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
