/* ***********************************************************************
 * Minimalistic script to manage the GDPR-consent with Matomo's onboard-
 * functionality (https://developer.matomo.org/guides/tracking-consent)
 *
 * Basic usage:
 * - fill in showMatomoCookieBanner_url and showMatomoCookieBanner_id
 * - include the script in your page
 * - DO NOT INCLUDE THE MATOMO-JAVASCRIPT CODE ANYMORE
 * *********************************************************************** */

var showMatomoCookieBanner_url = "FIXME";
var showMatomoCookieBanner_id  = "FIXME";

/* class: .MatomoCookieBanner .theText */
var showMatomoCookieBannerText = "Ich verwende Cookies auf meiner Website. Das machen fast alle anderen auch &#x1f643;. Die Cookies helfen mir zu verstehen, wie oft welche Inhalte aufgerufen werden und meine Seite anzupassen. Dazu nutze ich die anonymisierte Auswertung von Matomo.";

/* class: .MatomoCookieBanner .theReadmore */
var showMatomoCookieBannerReadmoreText = "Mehr lesen";
var showMatomoCookieBannerReadmoreLink = "FIXME";

/* class: .MatomoCookieBanner .theAccept */
var showMatomoCookieBannerAcceptText = "Akzeptieren";

/* texts when printing the time when consent was given */
var showMatomoCookieBanner_NoConsentGiven = "Keine Zustimmung erteilt";
var showMatomoCookieBanner_ConsentGiven = "Zustimmung erteilt am ";
var showMatomoCookieBanner_ConsentError = "Fehler";
var showMatomoCookieBanner_ConsentForget = "Zustimmung zurückziehen";

/* 0 -> no debug, any other integer: amount of hours to remember cookies */
var showMatomoCookieBannerDebug = false; 

/* ---[ grep default colors from CSS or set to black and white ]---------- */

var showMatomoCookieBannerRoot       = getComputedStyle(document.querySelector(':root'));
var showMatomoCookieBannerColor      = showMatomoCookieBannerRoot.getPropertyValue('--col')        != "" ? showMatomoCookieBannerRoot.getPropertyValue("--col")        : "#FFFFFF";
var showMatomoCookieBannerBackground = showMatomoCookieBannerRoot.getPropertyValue('--background') != "" ? showMatomoCookieBannerRoot.getPropertyValue("--background") : "#000000";

/* -----------------------------------------------------------------------
   helper function to convert #RRGGBB-colors into rgba-colors with given
   opacity. Inspired by https://stackoverflow.com/a/28056903 ;-)
   ----------------------------------------------------------------------- */
function hexToRGB(hex, alpha) 
{
	var r = parseInt(hex.trim().slice(1, 3), 16),
	    g = parseInt(hex.trim().slice(3, 5), 16),
	    b = parseInt(hex.trim().slice(5, 7), 16);

	if (alpha) 
	{
		return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";

	} else {

		return "rgb(" + r + ", " + g + ", " + b + ")";
	}
}

/* -----------------------------------------------------------------------
   returns true when consent is required
   ----------------------------------------------------------------------- */
function matomo_isConsentRequired()
{
	let consent = null;

	window._paq.push([function()
	{
		consent = this.isConsentRequired();
	}]);

	if ( showMatomoCookieBannerDebug == true ) console.log("matomo_isConsentRequired: " + consent);

	return consent;
}

/* -----------------------------------------------------------------------
   returns true when consent has been set before
   ----------------------------------------------------------------------- */
function matomo_hasRememberedConsent()
{
	let consent = null;

	window._paq.push([function()
	{
		consent = this.hasRememberedConsent();
	}]);

	if ( showMatomoCookieBannerDebug == true ) console.log("matomo_hasRememberedConsent: " + consent);

	return consent;
}

/* -----------------------------------------------------------------------
   consent has been given, store it in a cookie
   ----------------------------------------------------------------------- */
function matomo_rememberConsentGiven()
{
	_paq.push(['rememberConsentGiven']);
	document.getElementById("theMatomoCookieBanner").style.display = "none";

	return true;
}

/* -----------------------------------------------------------------------
   forget consent
   ----------------------------------------------------------------------- */
function matomo_forgetConsentGiven()
{
	_paq.push(['forgetConsentGiven']);

	return true;
}

/* -----------------------------------------------------------------------
   receives the time when consent was given:
   * if 'id' is given: add time to the element with 'id'
   * if revoke is given and true: add link to revoke consent
   * without parameters: just return the time
   ----------------------------------------------------------------------- */
function matomo_writeRememberedConsent(id, revoke)
{
	let element = ( id != null ) ? document.getElementById(id) : null;
	let value = "";

	if ( matomo_hasRememberedConsent() != true ) 
	{
		value = showMatomoCookieBanner_NoConsentGiven;

	} else {

		let time = null;

		_paq.push([function()
		{
			let consentTime = this.getRememberedConsent();

			if ( typeof consentTime != "undefined" )
			{
				time = new Date(Number(consentTime));
			}
		}]);

		value = ( time != null ) ? showMatomoCookieBanner_ConsentGiven + time.toString() : showMatomoCookieBanner_ConsentError;

		if ( time != null && revoke != null && revoke == true && element != null )
		{
			value += " <a href='javascript:;' onClick='matomo_forgetConsentGiven(); location.reload();'>" + showMatomoCookieBanner_ConsentForget + '</a>';
		}
	}

	if ( element != null )
	{
		element.innerHTML = value;
	}

	if ( showMatomoCookieBannerDebug == true ) console.log(value);

	return value;
}
/* -----------------------------------------------------------------------
   draw the banner
   ----------------------------------------------------------------------- */
function showMatomoCookieBanner()
{
	if ( showMatomoCookieBannerDebug == true && matomo_hasRememberedConsent() === true)
	{
		matomo_forgetConsentGiven();
	}

	if ( matomo_isConsentRequired() === false || matomo_hasRememberedConsent() === true ) 
	{
		return true;
	}

	let banner = document.createElement('div');
	banner.className = "MatomoCookieBanner";
	banner.id = "theMatomoCookieBanner";
	document.body.appendChild(banner);

	banner.style.position = "fixed";
	banner.style.padding = "1em 2em";
	banner.style.backgroundColor = hexToRGB(showMatomoCookieBannerBackground, "0.3");
	banner.style.color = showMatomoCookieBannerColor;
	banner.style.bottom = "0";
	banner.style.left = "0";
	banner.style.right = "0";

	let text = document.createElement('div');
	text.className = "theText";
	text.innerHTML = showMatomoCookieBannerText;
	banner.appendChild(text);

	if ( showMatomoCookieBannerReadmoreLink != "" )
	{
		let readmore = document.createElement('div');
		readmore.className = "theReadmore";
		readmore.innerHTML = "<a href='" + showMatomoCookieBannerReadmoreLink + "' target='_blank'>" + showMatomoCookieBannerReadmoreText + "</a>";
		banner.appendChild(readmore);
	}

	let accept = document.createElement('div');
	accept.className = "theAccept";
	accept.innerHTML = "<a href='javascript:;' onClick='matomo_rememberConsentGiven();'>Akzeptieren</a>";
	banner.appendChild(accept);
}

/* -----------------------------------------------------------------------
   Add the banner to the window.onload-event. If there already is an
   event, then queue it behind this one.
   ----------------------------------------------------------------------- */
if(window.attachEvent) 
{
	window.attachEvent('onload', showMatomoCookieBanner);

} else {

	if(window.onload) 
	{
		var onloadEvent = window.onload;
		var newEvent = function(e) 
				{
					onloadEvent(e);
					showMatomoCookieBanner(e);
				};
		window.onload = newEvent;

	} else {

		window.onload = showMatomoCookieBanner;
	}
}

/* -----------------------------------------------------------------------
   The Matomo tracking code
   ----------------------------------------------------------------------- */
var _paq = window._paq || [];
_paq.push(['requireConsent']);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
var u=showMatomoCookieBanner_url;
_paq.push(['setTrackerUrl', u+'matomo.php']);
_paq.push(['setSiteId', showMatomoCookieBanner_id]);
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();





