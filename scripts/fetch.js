//google.load("jquery", "1.3");
// WebSocket Interfacing Template
/*var ws = $.websocket("ws://10.1.19.3:5002/", {
        events: {
                message: {"event":"sign_in","email_address":"turnert@uw.edu","password":"A$ifjnew23","remember_me":true,"id":"90f37833-5aea-4c71-ad27-37b1cd452dae"}
        }
});

$('#message').change(function(){
  ws.send('message', {"event":"sign_in","email_address":"turnert@uw.edu","password":"A$ifjnew23","remember_me":true,"id":"90f37833-5aea-4c71-ad27-37b1cd452dae"});
  this.value = '';
});*/

var salvus_stats = {test : "value"};
var wsUri = "wss://cloud.sagemath.com/hub/633/q1jxqjfc/websocket";
//var wsMGetStats = '["\u0000{\"event\":\"get_stats\",\"id\":\"d9a725a3-b60a-4cc2-b7c7-fcc193ef7898\"}"]';
var wsMGetStats = '["\\u0000{\\"event\\":\\"get_stats\\",\\"id\\":\\"d9a725a3-b60a-4cc2-b7c7-fcc193ef7898\\"}"]';

function init(callback) {
	//var test2;
	// Use $("tabs-1") instead of output
	//output = document.getElementById("output"); 
	testWebSocket( function() {
		callback.call(this)
		//$("#tabs-1").append("THIS: "+this.active_projects);
	});
	//writeToScreen("MORE: "+test2.active_projects);
	
  //$("#tabs-1").append("Test3: "+test2);
}
function testWebSocket(callback) {
	//$("#tabs-1").append("Test: "+salvus_stats.test.active_projects);
	//var o_test;
	//var f_out = "";
 	websocket = new WebSocket(wsUri); 
	websocket.onopen = function(evt) {
		onOpen(evt)
		}; 
	websocket.onclose = function(evt) {
		onClose(evt)
		}; 
	websocket.onmessage = function(evt) {
		if (evt.data.indexOf("get_stats") != -1) {
			//var sParse = 
			
			//$("#tabs-1").append("Type: "+typeof salvus_stats);
			salvus_stats.test = parse_stats(evt.data)
			callback.call(salvus_stats.test);
			//$("#tabs-1").append("Test2: "+salvus_stats.test.active_projects);
			
		}
		//var o_test=salvus_stats.test;
		 onMessage(evt)
		}; 
	websocket.onerror = function(evt) {
		onError(evt)
		};
}
function onOpen(evt) {
 	//writeToScreen("CONNECTED"); 
	doSend(wsMGetStats)
}
function onClose(evt) {
 	//writeToScreen("DISCONNECTED"); 
}
function onMessage(evt) {
		//writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
	
		//var sParse = parse_stats(evt.data)
		if (evt.data.indexOf("get_stats") != -1) {
			websocket.close();
		}
		//salvus_stats.test2 = sParse;
}
function onError(evt) {
 	writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data); 
}
function doSend(message) {
 	//writeToScreen("SENT: " + message); 
 	websocket.send(message);
}
/*function writeToScreen(message) {
 	var pre = document.createElement("p"); 
	pre.style.wordWrap = "break-word"; 
	pre.innerHTML = message; 
	output.appendChild(pre); 
}*/
function parse_stats(raw) {
	// Remove: backslash escape character | (null) character "\u0000" | assuming first char is "a", removing
	var parsed =  raw.replace(/\\"/g, '"').replace(/\\u0000/g, "").slice(3);
	//writeToScreen(parsed);
	var jParsed = jQuery.parseJSON(parsed.slice(0,parsed.length-2));
	//writeToScreen("Accounts: "+jParsed.stats.accounts);
	var clients = 0;
	jQuery.each( jParsed.stats.hub_servers, function( i, val ) {
		clients += val.clients;
	});
//writeToScreen("Servers: "+clients);
	var salvus_stats = {number_of_clients : clients,
						accounts : jParsed.stats.accounts,
						projects : jParsed.stats.projects,
						active_projects : jParsed.stats.active_projects,
						last_day_projects : jParsed.stats.last_day_projects,
						last_week_projects : jParsed.stats.last_week_projects,
						last_month_projects : jParsed.stats.last_month_projects						
					}
	return salvus_stats;
	//writeToScreen("Stuff: "+salvus_stats.number_of_clients);
}
function writeToScreen(message) {
/* 	var pre = document.createElement("p"); 
	pre.style.wordWrap = "break-word"; 
	pre.innerHTML = message; */
	$("#tabs-1").append(message); 
}
//window.addEventListener("load", init, false);

function fetch_feed() {
/*  chrome.extension.sendRequest({'action' : 'fetch_feed', 'url' : 'http://cloud.sagemath.com/help'}, 
    function(response) {
	  $("#tabs-1").append(display_stories(response));display_stories
    }
  );*/
  init(function(){display_stories(this)});
  //$("#tabs-1").append(some);
  //$("#tabs-1").append("Other: "+salvus_stats.test.active_projects); 
  
	var interval = 3000; /* Milliseconds between requests. 
	window.setInterval(function() {
		$.get("http://cloud.sagemath.com/help", {}, function(data, textStatus) {
			$('#tabs-1').append(data);
		});
	}, interval);*/
  
/*  $.get("http://cloud.sagemath.com/help", {}, function(content){
        $('#tabs-1').append(content);
    });*/
}

// Make a string's first character of each word uppercase
function ucwords(string)
{
	return (string + '')
    .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
      return $1.toUpperCase();
    });
}

function display_stories(salvus_stats) {
  //$("#tabs-1").append("WIN: "+salvus_stats.accounts); 
//salvus-stats
//var raw = JSON.parse(feed_data);
//var raw = jQuery(feed_data)
	// Status Section
	var output = '<h3>Status</h3>';
	// Required syntax includes lowercase letters only and underscore "_" for spacing:
	// Examples: this_item, another_important_item, single, long_is_fine_but_dont_get_crazy
	
	for ( var stat in salvus_stats ) {
		//document.write();
		output += "<b>"+ucwords(stat.replace(/_/g," "))+"</b>: "+salvus_stats[stat]+"<br>";
	}
	
	// Resource Section
	output += '<h3>SageMath Resources</h3>';
	
	var sage_resources = {trac : "http://trac.sagemath.org/",
							documentation : "http://www.sagemath.org/doc/reference/"
							}
	for ( var res in sage_resources ) {
		//document.write();
		output += '[<a href="'+sage_resources[res]+'" target="_blank">'+ucwords(res.replace(/_/g," "))+'</a>]&nbsp;&nbsp;&nbsp;';
	}
	
	output += '<h3>SageCloud Resources</h3>';
	var cloud_resources = {help : "https://cloud.sagemath.com/help",
							issues : "https://github.com/sagemath/cloud/issues",
							FAQ : "https://github.com/sagemath/cloud/issues"
							}
	
	for ( var res in cloud_resources ) {
		//document.write();
		output += '[<a href="'+cloud_resources[res]+'" target="_blank">'+ucwords(res.replace(/_/g," "))+'</a>]&nbsp;&nbsp;&nbsp;';
	}
	
  $("#tabs-1").append(output); 
	//return feed_data;
	
	/*
	//$('#popup').append(item+"<br>");
//document.write("test2");

  /*
  var xml_doc = $.parseXML(feed_data);
  $xml = $(xml_doc);
  $('#popup').html('<img src="images/logo.png" id="logo" /><br clear="all" />');
  $('#logo')[0].addEventListener('click', function() {
    open_item('https://cloud.sagemath.com/help')
    window.close() } )

  var items = $xml.find("item");
  items.each(function(index, element) {
    var post = parse_post(element);
    var item = '';
    var class2 = '';
    if (index >= localStorage['unread_count']) {
      // // console.log('visited');
      item += '<div class="post read">';
    }
    else {
      item += '<div class="post">'
    }
    item += '<span class="tag">' + post.tag + '</span>\
          <a href="' + post.url + '">\
            <div id="' + post.id + '" class="item">\
              <img src="' + post.img + '" width="107" height="60" />\
              <h4>' + post.title + '</h4>\
              <span class="description">' + post.description + '...</span>\
            </div>\
          </a>';
    item += '</div>';
    $('#popup').append(item);
    // TODO why isn't jQuery's .on defined?
    var $item = $('div[id="' + post.id + '"]')
    console.log('$item', $item)
    $item[0].addEventListener('click', function() {
      open_item(post.url) } )
  });
  */
}
$(document).ready(function() {
		$( "#accordion" ).accordion();
		

		
		var availableTags = [
			"ActionScript",
			"AppleScript",
			"Asp",
			"BASIC",
			"C",
			"C++",
			"Clojure",
			"COBOL",
			"ColdFusion",
			"Erlang",
			"Fortran",
			"Groovy",
			"Haskell",
			"Java",
			"JavaScript",
			"Lisp",
			"Perl",
			"PHP",
			"Python",
			"Ruby",
			"Scala",
			"Scheme"
		];
		$( "#autocomplete" ).autocomplete({
			source: availableTags
		});
		
		$( "#button" ).button();
		$( "#radioset" ).buttonset();
		
		$( "#tabs" ).tabs();
		
		$( "#dialog" ).dialog({
			autoOpen: false,
			width: 400,
			buttons: [
				{
					text: "Ok",
					click: function() {
						$( this ).dialog( "close" );
					}
				},
				{
					text: "Cancel",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});

		// Link to open the dialog
		$( "#dialog-link" ).click(function( event ) {
			$( "#dialog" ).dialog( "open" );
			event.preventDefault();
		});
		
		$( "#datepicker" ).datepicker({
			inline: true
		});
		
		$( "#slider" ).slider({
			range: true,
			values: [ 17, 67 ]
		});
		
		$( "#progressbar" ).progressbar({
			value: 20
		});
		
		// Hover states on the static widgets
		$( "#dialog-link, #icons li" ).hover(
			function() {
				$( this ).addClass( "ui-state-hover" );
			},
			function() {
				$( this ).removeClass( "ui-state-hover" );
			}
		);
  fetch_feed();
});
