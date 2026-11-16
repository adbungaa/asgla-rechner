**Unterhaltsrechner JTC LegalTech Lab ASGLA**
-

Ein laufendes Projekt zur Berechnung des Kindesunterhalts nach Trennung oder Scheidung der Eltern in Wechselmodell. 

Entwickelt mit der Programmiersprache **Elm**.

UX Storyboard: -


Design Prototype (Vorschlag): -

**Figma Design:**
https://www.figma.com/proto/6McYAZYAPg2XUlAZSux68v/ASGLA-Rechner?node-id=19-218&t=5VuI34S2e6GscjLc-1&scaling=contain&content-scaling=fixed&page-id=0%3A1


**GitLab Pages mit Demo**: 

https://asgla-rechner-72683a.gpages.informatik.uni-halle.de


**Voraussetzungen**:
Um die Anwendung auszuführen, müssen folgende Werkzeuge installiert sein:
Node.js (inkl. npm)
https://nodejs.org

Elm (https://elm-lang.org)
```bash
npm install -g elm
```

Überprüfung der Installation:
```bash
elm --version
```

**Start der Anwendung**
Die Anwendung wird mit elm-live gestartet.

Installation von elm-live:
```bash
npm install -g elm-live
```

Führe dazu im Projektverzeichnis folgenden Befehl aus: 
```bash
elm-live src/Main.elm --dir=public --open -- --output=public/asgla.js
```

