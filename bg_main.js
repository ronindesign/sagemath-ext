// JavaScript Document
function check_options()
{
	// Icon Color
	var color = localStorage["icon_color"];
  	if (!color) 
	{
    	return;
  	}
	if (color == 'black')
		var blackpath = 'resources/icon_black.png';
		chrome.browserAction.setIcon({path: blackpath});
	if (color == 'blue')
		var bluepath = 'resources/icon.png';
		chrome.browserAction.setIcon({path: bluepath});
	if (color == 'green')
		var greenpath = 'resources/icon_green.png';
		chrome.browserAction.setIcon({path: greenpath});
	if (color == 'pink')
		var pinkpath = 'resources/icon_pink.png';
		chrome.browserAction.setIcon({path: pinkpath});
	if (color == 'red')
		var redpath = 'resources/icon_red.png';
		chrome.browserAction.setIcon({path: redpath});
	if (color == 'white')
		var whitepath = 'resources/icon_white.png';
		chrome.browserAction.setIcon({path: whitepath});	
}	

function check_folder()
{
	
}

//chrome.extension.onRequest.addListener(onRequest);
$(window).on('beforeunload', function() {
  return 'Your own message goes here...';
});