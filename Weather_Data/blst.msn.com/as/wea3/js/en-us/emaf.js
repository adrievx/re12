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

//email this
var emailLink = true;
function emailThis()
{
	if(emailLink)
	{
        var strTo,strSubject,strBody;
        strTo="";
        strSubject="I recommended a page for you at MSN";
        strPageURL = location.href + "&src=email";
        strPageTitle=document.title
//        var d = strPageURL.indexOf('page=');
//        if(d > 0)
//        {
//           strPageURL = strPageURL.substr(0,d+5) + "1";
//        }

		// Bug 461524: Deliberately leave strPageTitle unescaped to allow foreign language chars.
        strBody="I am sending this message to you so you can check out the following page:"+"%0d%0a%0d%0a" + strPageTitle + encodeForURL('\r\n')+escape(strPageURL)+"%0d%0a%0d%0a"+"To jump to the page, open your web browser and copy the address exactly as shown. Or, if your mail reader supports in-line links, simply click on the address.";

        window.location="mailto:"+strTo+"?subject="+strSubject+"&body="+strBody;
	}
	else
	{
		
		GetG();
		var strTo, strBody;
		var sBody1, sBody2;
		
		sBody1 = encodeForURL(bodyHeader + '\r\n\r\n');
		sBody2 = encodeForURL('\r\n\r\n' + bodyFooter );
		strTo = '';
		var pageTitle = document.title;
		var pageURL = location.href;
		
		strBody = sBody1 + escape(pageTitle) + encodeForURL('\r\n\r\n') + escape(pageURL) + sBody2;

		window.location.href = 'mailto:' + strTo + '?subject=' + encodeForURL(subjectText) + '&body=' + strBody;	
		
	}
}

function GetG()
{
	window.location = window.document.location;
}

function encodeForURL(str) {
	var out = str;
	var re1 = /%/g;
	var re2 = /%25%21%21%21/g;
	out = out.replace(re1, '%!!!');
	out = escape(out);
	out = out.replace(re2, '%');
	return(out);
}

}
/*
     FILE ARCHIVED ON 16:12:26 Mar 15, 2008 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:40:32 Sep 20, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.814
  exclusion.robots: 0.041
  exclusion.robots.policy: 0.026
  esindex: 0.018
  cdx.remote: 77.004
  LoadShardBlock: 261.57 (3)
  PetaboxLoader3.datanode: 157.081 (4)
  PetaboxLoader3.resolve: 646.108 (2)
  load_resource: 579.731
*/