# matomo-consent.js

This is a small Java library that can be included in static web pages. It takes care that Matomo creates visitor statistics and makes sure that visitors consent to it. If visitors have not yet given their consent, they will see the familiar small cookie bar.

All texts are configurable. The library uses only functionalities that are included in Matomo. 

## Installation
Download the file matomo-consent.js to your web server and save it in a directory accessible by URL. On the HTMl pages include the script as follows:
```
<script type="text/javascript" src="path/to/matomo-consent.js"></script>
```
This line can be in the head or body section of the web page. **Important:** Make sure that the tracking code provided by Matomo is _not_ included on the page at the same time. The script already takes care of that.

In the JS script, you then need to edit at least the three lines marked "FIXME":
```
var showMatomoCookieBanner_url = "FIXME";
var showMatomoCookieBanner_id = "FIXME";
var showMatomoCookieBannerReadmoreLink = "FIXME";

```
The first two lines point to the URL of the Matomo instance and the ID of the page to track. The ID can be easily found out on the Matomo page under Settings -> Websites -> Manage.

If the `showMatomoCookieBannerReadmoreLink` is an empty string (i.e.: ""), then no button is displayed for it. Otherwise this button typically links to the imprint or cookie policy. 

## Configuration
I think the text parameters are self-explanatory:
```
var showMatomoCookieBannerText = "I use cookies on my website. Almost everyone else does too. The cookies help me to understand how often which content is called. So I can adapt my page. For this purpose, I use the anonymous evaluation of Matomo.";
var showMatomoCookieBannerReadmoreText = "Read more";
var showMatomoCookieBannerAcceptText = "Accept";
var showMatomoCookieBanner_NoConsentGiven = "No consent given";
var showMatomoCookieBanner_ConsentGiven = "Consent given on ";
var showMatomoCookieBanner_ConsentError = "Error";
var showMatomoCookieBanner_ConsentForget = "Forget consent."
```
The last four strings are only used by the matomo_writeRememberedConsent function.

If the root parameters `--col` (foreground color) and `--background` (background color) are defined in the CSS, they are used. Otherwise white and black are used by default.

The CSS class are in comments above the text fields. A typical CSS file could look like this:
```
.MatomoCookieBanner .theText {
        display: inline-block;
}

.MatomoCookieBanner .theReadmore, .MatomoCookieBanner .theAccept {
        display: block;
        width: 7em;
        margin: 0.2em auto;
        text-align: center;
}

.MatomoCookieBanner .theReadmore a, .MatomoCookieBanner .theAccept a {
        display: block;
        padding: 0.2em 0.5em;
        white-space: nowrap;
}

.MatomoCookieBanner .theReadmore a {
        border: 1px solid var(--col);
        color: var(-col);
}

.MatomoCookieBanner .theAccept a {
        border: 1px solid var(--highlight);
        color: var(--background);
        background-color: var(--col);
}

@media screen and (min-width: 480px) {

        .MatomoCookieBanner .theReadmore, .MatomoCookieBanner .theAccept {
                display: inline-block;
                margin: 0.2em 1em 0.2em 0;
        }

}

@media screen and (min-width: 1000px) {

        .MatomoCookieBanner {
                display: flex;
                flex-wrap: nowrap;
                flex-direction: row;
                justify-content: space-evenly;
                align-items: center;
        }

        .MatomoCookieBanner .theReadmore, .MatomoCookieBanner .theAccept {
                margin: 0.2em 0.5em;
        }

}
```

## Troubleshooting
If `showMatomoCookieBannerDebug` is set to true, the script writes some further information to the console. In addition, a set consent is then forgotten again with each call.

## Background
In a [post](https://developer.matomo.org/guides/tracking-consent) the Matomo team describes in simple steps how to query the consent. It was a bit tricky to get information from Matomo using a callback function. For example, it is important to know if consent has been given. If so, it is no longer necessary to show the banner. This query looks like this:
```
window._paq.push([function()
{
	consent = this.hasRememberedConsent();
}]);
```
