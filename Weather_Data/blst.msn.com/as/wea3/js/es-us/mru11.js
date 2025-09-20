var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

var g_isIE = -1;
var currentSelection = 0;

// Global variables for animated maps player
var loaded = 0;	// total number  of images successfully loaded (cached)
var loadFailed = 0;	// total number of images that did not load (due to missing image files or download problems)
var imgIndex = 0;	// image iterator
var loadedImgIndex = 0; //iterator for loaded (cached) images
var images = new Array();
var imageCount = 0;	// total number of images to load (cache)
var g_mapKeyImg;
var timeout_state = null;
var animSpeed = 500;
var timeStampList;
var SliderUnit;

var L_WeatherVideo_Text = "Videos del tiempo de hoy";
var L_MoreVideo_Text = "Más videos del tiempo";
var L_ForecastVideo_Text = "Videos de pronóstico de EE.UU.";
var L_ViewAllVideo_Text = "Ver todos los videos del tiempo";
var L_NewsWeather_Text = "Noticias - Tiempo";
var L_NoResults_Text = "No se encontraron resultados.";
var L_SearchTips_Text = "¿No encuentra lo que está buscando? Estos consejos pueden servirle de ayuda:";
var L_SearchTip1_Text = "Incluya el estado o el país así como la ciudad. Por ejemplo, {0} o {1}.";
var L_SearchTip1Example1_Text = "San Francisco, CA";
var L_SearchTip1Example2_Text = "Londres, Inglaterra";
var L_SearchTip2_Text = "Asegúrese de separar la ciudad y el estado, o el país con una coma.";
var L_Feedback_Text = "Si aun así no encuentra lo que está buscando, envíenos la información y haremos lo posible por solucionar el problema.";
var L_TextInEng_Text = "{0}";
var L_PlayAnimation_Text = "Reproducir";
var L_StopAnimation_Text = "Detener";

var mapSelCtr = 0;	// keep track of the number of times a map is selected


///////////////// Utility functions

function insertHtmlAfter(element, html)
{
	if (isIE() == 1)
	{
		// IE
		element.insertAdjacentHTML("afterEnd", html);
	}
	else
	{
		// Firefox...
		var r = document.createRange();
		r.setStartBefore(element);

		var parsedNode = r.createContextualFragment(html);
		var parent = element.parentNode;
		if (element.nextSibling)
			parent.insertBefore(parsedNode, element.nextSibling);
		else
			parent.appendChild(parsedNode);
	}
}

function isIE()
{
	if (g_isIE != -1)
	{
		return g_isIE;
	}
	else //uninitialized
	{
		var element = document.body;
		try
		{
			// IE
			element.insertAdjacentHTML("beforeEnd", "&nbsp");
			g_isIE = 1;
		}
		catch(e)
		{
			g_isIE = 0;
		}		
	}

	return g_isIE;
}


//////////////////////////////////////////////////////////////////////////////////////


function VideoModule(thumbs, hasRegion)
{
	var thumb_block_size=4;

	var strTitle = L_TextInEng_Text.replace("{0}",L_WeatherVideo_Text);
	document.write('<div id="videos" class="parent chrome7 promo double2"><h2>'+strTitle+'</h2>');

	if (hasRegion)
	{
		slotsLeft = 4;
	}
	else
	{
		slotsLeft = 2;
	}

	// output the local thumbnail if there is one
	document.write('<div class="child c1 first">');
	document.write('<ul class="linkedimglinklist16 cf">');
	if (local[1]!="" && local[2]!="")
	{
		title = local[0];
		guid = local[1];
		image = local[2];	
		alt = local[3];
		onclick = VideoOnClick(guid);

		document.write('<li>');
		document.write('<a href="" onclick="' + onclick + '"><img width="92" height="69" src="' + image + '" alt="' + alt + '" />');
		document.write('<span>' + title + '</span></a>');
		document.write("</li>");
		
		slotsLeft--;
	}

	// output the allowed number of thumbs
	for (i = 0; i < thumbs.length && slotsLeft > 0; i+=thumb_block_size)
	{
		title = thumbs[i].replace(/ Regional /, " ");
		guid = thumbs[i+1];
		image = thumbs[i+2];	
		alt = thumbs[i+3];
		onclick = VideoOnClick(guid);

		if (title != "" && image != "")
		{
	 		document.write('<li>');
			document.write('<a href="" onclick="' + onclick + '"><img width="92" height="69" src="' + image + '" alt="' + alt + '" />');
			document.write('<span>' + title + '</span></a>');
			document.write("</li>");
			slotsLeft--;
		}
	}
	document.write("</ul></div>");


	// Output the rest, if any, as links
	if (i < thumbs.length)
	{
		if (hasRegion)
		{
			document.write('<div class="child c2 last"><h3>'+L_MoreVideo_Text+'</h3><ul class="linklist12 cf">');
		}
		else
		{
			document.write('<div class="child c2 last"><h3>'+L_ForecastVideo_Text+'</h3><ul class="linklist12 cf">');
		}
				
		for (; i < thumbs.length && i < 12 * thumb_block_size; i+=thumb_block_size)
		{
			title = thumbs[i].replace(/ Regional /, " ");
			guid = thumbs[i+1];
			image = thumbs[i+2];	
			onclick = VideoOnClick(guid);
			if (title != "" && guid != "")
			{
				document.write('<li><a href="" onclick="' + onclick + '">' + title + '</a></li>');
			}
		}
		document.write("</ul></div>");
	}

	document.write('<a class="more" href="https://web.archive.org/web/20110928170804/http://video.msn.com/v/us/v.htm?t=c9&f=12/64&p=Weather_Forecast - Maps">'+L_ViewAllVideo_Text+'</a></div>');
}

function VideoOnClick(guid)
{
	return "javascript:oMvsLink('12/64','" + guid + "','0',L_NewsWeather_Text, 'Weather','','','','', 'Weather_Forecast - Maps');return false;"; // "Weather_Forecast - Maps" should not be localized
}

function PlayAnimatedMap(index, filename, timesteps, timestamps, mapKeyImg, speed)
{ 
  stop();

  animSpeed = speed;
  timeStampList = timestamps;
  imgIndex = 0;
  loadedImgIndex = 0;
  loaded = 0;
  loadFailed = 0;
  imageCount = timesteps.length;
  
  SetMapKey(mapKeyImg);
  SetVisibilityOnLoad();

  var i;
  for(i = 0; i<timesteps.length; i++) {
    images[i] = new Image();
    images[i].onload = ImageLoaded;
    images[i].onerror = ImageLoadFailed;
    images[i].src = filename + timesteps[i];
  }

	UpdateMapSelection(index);
	
	// omniture tracking
	TrackOmniture(filename, true);
}

function SetVisibilityOnLoad() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("mapimage").style.display = "none";

    document.getElementById("playstop").style.display = "none"; //turn off while loading...
    document.getElementById("slider").style.display = "none"; //turn off while loading...

    document.getElementById("mapkey").style.display = "none";	//turn off while loading...
    document.getElementById("mcont").className = "child c1 first nokey";
}  
  
function ImageLoaded() {
  loaded++;
  Animate();
}

function ImageLoadFailed() {
  loadFailed++;
  Animate();
}

var Nubbin;
var StepBoundaries;
var IsDraggable = false;
function Animate() {
    if (loaded + loadFailed == imageCount) {
        CondenseImageArray();
        
        if (imageCount == 1) {
            document.getElementById("loading").style.display = "none";
            document.getElementById("mapimage").style.display = "block";
            document.getElementById("mapimage").src = images[0].src;
            document.getElementById("timestamp").innerText = timeStampList[0];
      }
        else {
            document.getElementById("playstop").style.display = "block";
            document.getElementById("slider").style.display = "block";

            document.getElementById("loading").style.display = "none";
            document.getElementById("mapimage").style.display = "block";
            SetMapKey(g_mapKeyImg); 

            // Enable dragging
            Nubbin = document.getElementById("grab");
            Nubbin.onmousedown = BeginDrag;
            document.onmousemove = Drag;
            document.onmouseup = new Function("IsDraggable=false");//EndDrag;
            
            // Enable clicking
//    if (!document.getElementById("slider").attachEvent("onclick", SliderClicked))
//        alert("not attached");
//            var Slider = document.getElementById("slider");
//            Slider.attachEvent("onclick", Clicked);
 //           Nubbin.onclick = Click;
//            Slider.onmouseover = TurnToPointer;
//            Slider.onmouseout = RevertFromPointer;
            
            SliderUnit = GetSliderUnit();
//document.onclick = SliderClicked;
            play();
            
        }
    }
}

function SliderClicked(evt)
{
    //alert("hello world");
    debugger;
}

//function TurnToPointer()
//{
//    document.getElementById("slider").style.cursor = "pointer";
//}

//function RevertFromPointer()
//{
//    document.getElementById("slider").style.cursor = "default";
//}

// Set off when the onmousedown event occurs on the nubbin
function BeginDrag(evt)
{
    evt = Evt(evt);
    position = parseInt(Nubbin.style.marginLeft);
    MouseXOffset = evt.myx - position;

    IsDraggable = true;
}

// Set off when the onmouseup event occurs
function EndDrag(evt)
{
    IsDraggable=false;
}

function Drag(evt)
{
    evt = Evt(evt);
    
    // Only continue execution if left mouse button was pressed (and still pressed) on nubbin
    if (IsDraggable)
    {
        Reindex(evt.myx - MouseXOffset);
    }
    
    return false;
}

function Clicked(evt)
{
    debugger;
    evt = Evt(evt);
    
    // Only continue if left mouse button was pressed
    if (evt.button == 1)
    {
        Reindex(evt.myx);
    }
}

// This is helps increase compatibility across diffent browsers    
function Evt(evt) 
{
	evt = evt ? evt : window.event; 
	evt.mysource = evt.target ? evt.target : evt.srcElement;
	evt.myx = evt.pageX ? evt.pageX : evt.clientX + document.documentElement.scrollLeft;
	evt.myy = evt.pageY ? evt.pageY : evt.clientY + document.documentElement.scrollTop;
	return evt;
}

var MouseXOffset = 0;       // Mouse offset from nubbin position (x-axis only)
    
function Reindex(newXPosition)
{
    var tempIndex;
    if (newXPosition < 0)
        tempIndex = 0;
    else if (newXPosition <= 160)
        tempIndex = Math.round(newXPosition / SliderUnit);
    else
        tempIndex = imageCount - 1;

    if (tempIndex != imgIndex)
    {
        imgIndex = tempIndex;
        Nubbin.style.marginLeft = SliderUnit * imgIndex;
        document.getElementById("mapimage").src = images[imgIndex].src;
        document.getElementById("timestamp").innerText = timeStampList[imgIndex];
    }
}    
    
function play() {
    document.getElementById("playstop").innerText = L_StopAnimation_Text;
    document.getElementById("playstop").className = "stop";

    animator();
}

// Calculates distance between each "step"
function GetSliderUnit()
{
    var sliderUnit;
    if (imageCount > 1) {
        sliderUnit = 160 / (imageCount-1);
    }
    else {
        sliderUnit = 0;
    }
    
    return sliderUnit;
}

// Gets rid of images in the array that did not load
function CondenseImageArray()
{
    if (loadFailed > 0)
    {
        var i;
        var validImageCount = 0;
        for (i = 0; i < imageCount; i++)
        {
            if (images[i].complete == true)
            {
                timeStampList[validImageCount] = timeStampList[i];
                images[validImageCount++] = images[i];
            }
        }

        imageCount = validImageCount;
    }
}

function stop() {
    document.getElementById("playstop").innerText = L_PlayAnimation_Text;
    document.getElementById("playstop").className = "start";
    clearTimeout(timeout_state);
    timeout_state = null;
}

// Loops through the images in the animated maps
function animator() {
    var img = document.getElementById("mapimage");
    img.src = images[imgIndex].src;
    document.getElementById("timestamp").innerText = timeStampList[imgIndex];

    var sliderPos = parseInt(SliderUnit * imgIndex);
    document.getElementById("grab").style.marginLeft = sliderPos + "px"; 

    GetNextImage();
    timeout_state = setTimeout("animator()", animSpeed);
}      

function GetNextImage() {
    imgIndex++;
    if (imgIndex >= imageCount) {
        imgIndex = 0;
    }
}

function PlayStopPress() {
  var el = document.getElementById("playstop");
  if (el.className == "start") {
	play();
  }
  else {
    stop();
  }
}      

function ReLoadMapImage(strNewMap, mapKeyImg, index, timestamp)
{ 
  stop();

  document.getElementById("playstop").style.display = "none";
  document.getElementById("slider").style.display = "none";

  document.getElementById("loading").style.display = "none";
  document.getElementById("mapimage").style.display = "block";

  document.getElementById("mapimage").src = strNewMap;
  document.getElementById("timestamp").innerText = timestamp;
  SetMapKey(mapKeyImg);
  
  UpdateMapSelection(index);

  // omniture tracking
  TrackOmniture(strNewMap, false);
}

function TrackOmniture(filename, animated)
{
  prefix = filename.lastIndexOf("/")+1;
  prop6 = filename.substring(prefix, prefix+16);
  if (animated)
     prop6 += " animated";

  s.prop6 = prop6;
  s.t(); 
}

function RefreshMapAd(refreshInterval)
{
	// Refresh the ads only after a certain number of clicks specified by refreshInterval parameter, then reset the counter.
	mapSelCtr++;
	if (mapSelCtr >= refreshInterval)
	{
		dapMgr.trackEvent(eventType.click);
		mapSelCtr = 0;
	}
}

function UpdateMapSelection(index)
{
	if (parseInt(index,10) != currentSelection)
	{
		var newSelection = document.getElementById("MR" + index);
		newSelection.className = "i3";

		var oldSelection = document.getElementById("MR" + currentSelection);
		oldSelection.className = "";

		currentSelection = index;
	}
}

function SetTimeStamp(timestamp)
{
  	document.getElementById("timestamp").innerText = timestamp;
}

function SetInitialMapSelection()
{
	var newSelection = document.getElementById("MR0");
	newSelection.className = "i3";
}

function SetMapMessage(href, msg)
{
	var div = document.getElementById("mapnote");
	div.style.display = "block";
	div.innerHTML = "<a href=\"" + href + "\">" + msg + "</a>";
}

function SetMapKey(mapKeyImg)
{
	g_mapKeyImg = mapKeyImg;
	if (mapKeyImg != "")
	{
		document.getElementById("mapkey").src = mapKeyImg;
	  document.getElementById("mapkey").style.display = "block";	
		document.getElementById("mcont").className = "child c1 first wkey";
	}
	else
	{
	  document.getElementById("mapkey").style.display = "none";	
		document.getElementById("mcont").className = "child c1 first nokey";
	}
}

function SearchFocus()
{ 	
	sURL = new String(window.location); 
	if ( sURL.indexOf("#") == -1 ) 
		document.find.weasearchstr.focus(); 
}

function SubmitIfNotEmpty(alertstring) 
{
	if (document.find.weasearchstr.value != "")
		return true;
	else 
	{ 
		alert(alertstring); 
		document.find.weasearchstr.focus(); 
		return false;
	}
}


function HandleEmptySearchResults()
{
	if (document.getElementById("pg1") == null && document.getElementById("error") == null)
	{
		var global = document.getElementById("global")
		if (global!=null)
		{
			var ex1 = "<strong>" + L_SearchTip1Example1_Text+ "</strong>";
			var ex2 = "<strong>" + L_SearchTip1Example2_Text+ "</strong>";
			var str = L_SearchTip1_Text.replace("{0}", ex1);
			str = str.replace("{1}", ex2);

			var html = "<table id=\"pg\"><tr><td id=\"pg1\">";
			html += "<h1 class=\"h1a\">"+ L_NoResults_Text +"</h1>";
			html += "<p>"+ L_SearchTips_Text +"</p>"; 
			html += "<ul class=\"l2\"><li>"+ str + "</li>";
			html += "<li>"+ L_SearchTip2_Text +"</li></ul>"; 
			html += "<p>"+ L_Feedback_Text +"</p>";
			html += "</td><td id=\"pg2\">";
			html += "</td></tr></table>";

			insertHtmlAfter(global, html);
		}
	}	
}

function setFocus()
{
	var k = event.keyCode;
	if (k == 33 || k == 34)
	{
		document.find.weasearchstr.blur();
	}
}



//---- Start  client-side support functions for Records & Averages page

var _pendingShowTipID = "";
var _lastTipTimerID = null;

var _prevTColClass = null;
var _prevPColClass = null;

function onTColMouseOver(tcol)
{
	var idNum = IDNumFromColID(tcol.id);
	var pcol = document.getElementById("pcol" + idNum);
	var hcol = document.getElementById("hcol" + idNum);

	aveMouseOver(hcol, tcol, pcol);
}

function onTColMouseOut(tcol)
{
	var idNum = IDNumFromColID(tcol.id);
	var pcol = document.getElementById("pcol" + idNum);
	var hcol = document.getElementById("hcol" + idNum);

	aveMouseOut(hcol, tcol, pcol);
}

function onPColMouseOver(pcol)
{
	var idNum = IDNumFromColID(pcol.id);
	var tcol = document.getElementById("tcol" + idNum);
	var hcol = document.getElementById("hcol" + idNum);

	aveMouseOver(hcol, tcol, pcol);
}

function onPColMouseOut(pcol)
{
	var idNum = IDNumFromColID(pcol.id);
	var tcol = document.getElementById("tcol" + idNum);
	var hcol = document.getElementById("hcol" + idNum);

	aveMouseOut(hcol, tcol, pcol);
}

function aveMouseOver(hcol, tcol, pcol)
{
	_prevTColClass = tcol.className;
	_prevPColClass = pcol.className;

	// Highlight column
	tcol.className = "hover";
	pcol.className = "hover";

	// Show tip window
	_pendingShowTipID = "tip" + IDNumFromColID(tcol.id);
	_lastTipTimerID = window.setTimeout("ShowTip()", 500);
}

function aveMouseOut(hcol, tcol, pcol)
{
	// Cancel any pending tips to be shown
	if (_lastTipTimerID != null)
	{
		window.clearTimeout(_lastTipTimerID);
		_lastTipTimerID = null;
		_pendingShowTipID = "";
	}

	// Hide tip window
	tipID = "tip" + IDNumFromColID(tcol.id);
	HideTip(tipID);

	// De-highlight column
	tcol.className = _prevTColClass;
	pcol.className = _prevPColClass;
}

function ShowTip()
{
	if (_pendingShowTipID != "")
	{
		tipwin = document.getElementById(_pendingShowTipID);

		if (tipwin != null)
		{
			tipwin.style.visibility = "";
		}

		_pendingShowTipID = "";
	}
	
	_lastTipTimerID = null;
}

function HideTip(tipID)
{
	tipwin = document.getElementById(tipID);

	if (tipwin != null)
	{
		tipwin.style.visibility = "hidden";
	}
}

function IDNumFromColID(colID)
{
	// "tcol23" or "pcol23" --> return "23" by extracting the digits after 'tcol' or 'pcol'
	return colID.substring(4, colID.length)
}


function setMouseCursor(curName)
{
	var i;
	if (document.all != null)
	{
		for (i=0; i < document.all.length; i++)
		{
			document.all(i).style.cursor = curName;
		}
	}
}

//---- End  client-side support functions for Records & Averages page

//---- Start Seasonal support functions

function onCalendarMouseOver(id)
{
    var element = document.getElementById(id);
    
    if (element != null)
    {
        ShowPopup(element)
    }
}

function onCalendarMouseOut(id)
{
    var element = document.getElementById(id);
    
    if (element != null)
    {
        HidePopup(element);
    }
}

function ShowPopup(element)
{
    if (element != null)
    {
        element.style.visibility = "";
    }
}

function HidePopup(element)
{
    if (element != null)
    {
        element.style.visibility = "hidden";
    }
}

//---- End Seasonal support functions

//--- Start MRU for seasonal features
    function AddLocationViewed(feature)
    {
        var array = new Array();
        
	var list = getCookie(feature + "MRU");
        array = eval('[' + list + ']');

        var index = InArray(entityId, array);
        
        if (index != -1)
            array.splice(index, 1);
		
	array.unshift(entityId);

	var expires = new Date();
	expires.setFullYear(expires.getFullYear() + 2);

	setCookie(feature + "MRU", array.slice(0,5), expires);
    }
    
    function InArray(value, array)
    {
		for (i in array)
		{
			if (array[i] == value)
				return i;
		}
		
		return -1;
    }
    
    var entityArray;

    function DisplayMRU(hostname, feature)
    {
		var list = getCookie(feature + "MRU");
		if (list == "")
			return;
		
		var array = eval('[' + list + ']');
		entityArray = array;

		for (i=0; i < array.length; i++)
		{
		        loadXMLDoc(hostname, feature, i);
		}
    }


    var xmlhttp = new Array()

    function loadXMLDoc(hostname, feature, i)
    {
        xmlhttp[i]=null
        // code for IE
        if (window.ActiveXObject)
        {
            xmlhttp[i]=new ActiveXObject("Microsoft.XMLHTTP")
        }
	else
        {
            xmlhttp[i]=new XMLHttpRequest()
        }
        if (xmlhttp[i]!=null)
        {
            xmlhttp[i].onreadystatechange=function()
                {
			if (xmlhttp[i].readyState == 4 && xmlhttp[i].status == 200) {
				onResponse(hostname, feature, i);
			}
                }
	    var url = "http://" + hostname + "/data.aspx?wealocations=wc:" + entityArray[i] + "&outputview=" + feature + "conditions";
	    if (degreeType == "C")
	        url += "&weadegreetype=C";
            xmlhttp[i].open("GET",url,true)
            xmlhttp[i].send(null)
        }
        else
        {
            return;
        }
    }

    function onResponse(hostname, feature, i) 
    {
	var response = xmlhttp[i].responseXML.documentElement;
	if (response == null)
		return;
	var seasonalinfoElements = response.getElementsByTagName("seasonalinfo");
	if (seasonalinfoElements.length == 0)
		return;

	var seasonalinfoAttributes = seasonalinfoElements[0].attributes;
	var weatherElement = response.getElementsByTagName("weather")[0];
	var weatherAttributes = weatherElement.attributes;
	var currentWeatherAttributes = weatherElement.getElementsByTagName("current")[0].attributes;
	
        var entityid = seasonalinfoAttributes.getNamedItem("entityid").value;
	var index = entityArray.indexOf(entityid);

	// Set weather icon
	element = document.getElementById("mruIcon" + index);
	element.setAttribute("src", weatherAttributes.getNamedItem("imagerelativeurl").value + "saw/" + currentWeatherAttributes.getNamedItem("skycode").value + ".gif");
	element.setAttribute("alt", currentWeatherAttributes.getNamedItem("skytext").value);

	// Set alert
	var alertValue = weatherAttributes.getNamedItem("alert").value;
	if (alertValue != "")
	{
		element = document.getElementById("mruAlert" + index);
		element.setAttribute("href", "http://" + hostname + "/bulletin.aspx?wealocations=wc:" + weatherAttributes.getNamedItem("entityid").value);
		var childElement = document.createElement("img");
		childElement.setAttribute("src", weatherAttributes.getNamedItem("imagerelativeurl").value + "../alert_icon.gif");
		childElement.setAttribute("alt", weatherAttributes.getNamedItem("alert").value);
		element.appendChild(childElement);
	}

	// Set temperature
	var temperature = currentWeatherAttributes.getNamedItem("temperature").value;
	if (temperature == "")
		temperature = "NA";
	else
		temperature += "°"
	document.getElementById("mruTemp" + index).innerText = temperature;

	// Set location name
	var element = document.getElementById("mruLink" + index);
	element.innerText = seasonalinfoAttributes.getNamedItem("name").value;

	// Set link
	element.setAttribute("href", "http://" + hostname + "/" + feature + "conditions.aspx?wealocations=wc:" + entityid);

	// Set city name
	document.getElementById("mruCity" + index).innerText = weatherAttributes.getNamedItem("weatherfullname").value;
	
	document.getElementById("mruRow" + i).style.display = '';
	document.getElementById("viewed").style.display = 'block';
    }
//--- End MRU for seasonal features

//--- Start cookie functions
	function setCookie(name, value, expires, path, domain, secure) 
	{
		var newCookie = name + "=" + escape(value) +
			((expires) ? "; expires=" + expires.toGMTString() : "") +
			((path) ? "; path=" + path : "; path=/") +
			((domain) ? "; domain=" + domain : "") +
			((secure) ? "; secure" : "");
		document.cookie = newCookie;
	}
	
	function getCookie(name) 
	{	
		var cookieString = document.cookie;
		var prefix = name + "=";
		var begin = cookieString.indexOf("; " + prefix);
		if (-1 == begin) 
		{
			begin = cookieString.indexOf(prefix);
			if (0 != begin)
			{
				return "";
			}
		}
		else
		{
			begin += 2;
		}
		var end = document.cookie.indexOf(";", begin);
		if (-1 == end)
		{    
			end = cookieString.length;
		}
		return unescape(cookieString.substring(begin + prefix.length, end));
	}
//--- End cookie functions

}
/*
     FILE ARCHIVED ON 17:08:04 Sep 28, 2011 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:40:53 Sep 20, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.761
  exclusion.robots: 0.051
  exclusion.robots.policy: 0.039
  esindex: 0.013
  cdx.remote: 68.725
  LoadShardBlock: 200.784 (3)
  PetaboxLoader3.datanode: 153.813 (4)
  PetaboxLoader3.resolve: 138.831 (2)
  load_resource: 136.083
*/