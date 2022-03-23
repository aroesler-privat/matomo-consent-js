# matomo-consent.js

Das ist eine kleine Java-Bibliothek, die in statische Webseiten eingebunden werden kann. Sie kümmert sich darum, dass Matomo Besucherstatistiken erstellt und achtet darauf, dass Besucher dem zustimmen. Haben Besucher der Webseite noch nicht zugestimmt, so sehen sie die bekannte kleine Cookie-Leiste.

Alle Texte sind konfigurierbar. Die Bibliothek nutzt ausschließlich Funktionalitäten, die in Matomo enthalten sind. 

## Installation
Lade die Datei matomo-consent.js auf Deinen Webserver herunter und speichere sie in einem per URL erreichbaren Verzeichnis. Auf den HTMl-Seiten wird das Skript wie folgt eingebunden:
```
<script type="text/javascript" src="path/to/matomo-consent.js"></script>
```
Diese Zeile kann im Head- oder Body-Bereich der Webseite stehen. **Wichtig:** Achte darauf, dass der von Matomo vorgegebene Tracking-Code _nicht_ gleichzeitig auf der Seite eingebunden ist. Das Skript kümmert sich bereits darum.

Im JS-Skript sind dann mindestens die drei mit "FIXME" markierten Zeilen zu editieren:
```
var showMatomoCookieBanner_url = "FIXME";
var showMatomoCookieBanner_id  = "FIXME";
var showMatomoCookieBannerReadmoreLink = "FIXME";

```
Die beiden ersten Zeilen verweisen auf die URL der Matomo-Instanz und die ID der zu trackenden Seite. Die ID lässt sich leicht auf der Matomo-Seite unter Settings -> Websites -> Manage herausfinden.

Ist der `showMatomoCookieBannerReadmoreLink` eine leere Zeichenkette (also: ""), dann wird kein Button dafür angezeigt. Ansonsten verlinkt dieser Button typischer Weise das Impressum oder die Cookie-Richtlinie. 

## Konfiguration
Ich denke, die Text-Parameter sind selbsterklärend:
```
var showMatomoCookieBannerText = "I use cookies on my website. Almost everyone else does too &#x1f643;. The cookies help me to understand how often which content is called. So I can adapt my page. For this purpose, I use the anonymous evaluation of Matomo.";
var showMatomoCookieBannerReadmoreText = "Read more";
var showMatomoCookieBannerAcceptText = "Accept";
var showMatomoCookieBanner_NoConsentGiven = "No consent given";
var showMatomoCookieBanner_ConsentGiven = "Consent given on ";
var showMatomoCookieBanner_ConsentError = "Error";
var showMatomoCookieBanner_ConsentForget = "Forget consent";
```
Die vier letzten Zeichenketten werden nur von der Funktion matomo_writeRememberedConsent genutzt.

Sind im CSS die Root-Parameter `--col` (Vordergrundfarbe) und `--background` (Hintergrundfarbe) definiert, so werden diese genutzt. Ansonsten ist weiß und schwarz voreingestellt.

Die CSS-Klasse stehen in Kommentaren über den Textfeldern. Eine typische CSS-Datei könnte wie folgt aussehen:
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

## Fehlersuche
Wird `showMatomoCookieBannerDebug` auf true gesetzt, so schreibt das Skript ein paar weiterführende Informationen in die Konsole. Außerdem wird dann eine gesetzte Zustimmung bei jedem Aufruf wieder vergessen.

## Hintergrund
In einem [Post](https://developer.matomo.org/guides/tracking-consent) beschreibt das Matomo-Team in einfachen Schritten, wie die Zustimmung abgefragt werden kann. Etwas knifflig war es, mit einer Callback-Funktion Informationen von Matomo zu bekommen. Es ist zum Beispiel wichtig zu wissen, ob denn eine Zustimmung erteilt wurde. Dann ist es ja nicht mehr nötig, das Banner einzublenden. Diese Abfrage sieht so aus:
```
window._paq.push([function()
{
	consent = this.hasRememberedConsent();
}]);
```
