# PDF aus `Skript_ASGLA.md` erstellen

Für das Skript muss die Markdown-Datei `Skript_ASGLA.md` zuerst in eine PDF-Datei umgewandelt werden. Dafür kann entweder ein Online-Konverter oder die lokale Konvertierung mit Pandoc und Tectonic verwendet werden. Anschließend wird die erzeugte PDF als statische Datei über die Schaltfläche „Skript/Anleitung“ in der Anwendung geöffnet.

Die dynamische PDF-Erzeugung des Berechnungsergebnisses in `public/app.js` wird für das Skript nicht verwendet.

## Möglichkeit 1: Online-Konverter

`Skript_ASGLA.md` kann mit einem geeigneten Markdown-zu-PDF-Online-Konverter umgewandelt werden. Die heruntergeladene Datei muss anschließend in `Skript_ASGLA.pdf` umbenannt und hier abgelegt werden:

```text
public/Skript_ASGLA.pdf
```

Bei vertraulichen Inhalten sollte kein Online-Dienst verwendet werden, da die Markdown-Datei dabei an einen externen Anbieter übertragen wird.

## Möglichkeit 2: Pandoc und Tectonic

Für die lokale Konvertierung werden folgende Kommandozeilenprogramme benötigt:

- [Pandoc](https://pandoc.org/) für die Konvertierung des Markdown-Dokuments
- [Tectonic](https://tectonic-typesetting.github.io/) als PDF-Engine

Installation unter macOS mit Homebrew:

```bash
brew install pandoc tectonic
```

Installationen überprüfen:

```bash
pandoc --version
tectonic --version
```

Eine Editor-Erweiterung und `pdflatex` sind nicht erforderlich.

### PDF erzeugen

Den folgenden Befehl im Projektverzeichnis `asgla-rechner` ausführen:

```bash
pandoc Skript_ASGLA.md \
  --from=gfm \
  --pdf-engine=tectonic \
  --metadata lang=de-DE \
  --output=public/Skript_ASGLA.pdf
```

## Ergebnis und Ablageort

Unabhängig von der gewählten Konvertierungsmethode muss die fertige Datei hier liegen:

```text
public/Skript_ASGLA.pdf
```

Sie ist in der Anwendung über den relativen Pfad `Skript_ASGLA.pdf` erreichbar. Eine PDF-Datei im Projektstamm wird nicht von der Anwendung ausgeliefert; maßgeblich ist die Datei im Verzeichnis `public`.

Ergebnis überprüfen:

```bash
ls -lh public/Skript_ASGLA.pdf
```

Die PDF muss nach jeder Änderung an `Skript_ASGLA.md` erneut erzeugt und zusammen mit der Anwendung veröffentlicht werden.

## Einbindung in die Anwendung

Unterhalb des Bereichs „Über uns“ befindet sich die Schaltfläche „Skript/Anleitung“. Beim Anklicken läuft folgender Ablauf ab:

1. `OpenSkriptPdf` wird als Elm-Nachricht ausgelöst.
2. `Main.elm` übergibt den Pfad `Skript_ASGLA.pdf` über den Port `openPdfBlob` an JavaScript.
3. `public/app.js` lädt die statische PDF mit `fetch`.
4. Aus den geladenen Daten wird ein Blob mit dem MIME-Type `application/pdf` erstellt.
5. Die vorhandene Funktion `saveBlob` erstellt eine temporäre `blob:`-URL und öffnet die PDF im PDF-Betrachter des Browsers.

Die PDF wird nicht unmittelbar heruntergeladen. Sie wird zunächst in einem neuen Tab geöffnet. Falls der Browser das neue Fenster blockiert, wird die Blob-URL im aktuellen Tab geöffnet.

Die relevanten Dateien sind:

- `src/View/Components.elm`: Schaltfläche „Skript/Anleitung“
- `src/Types.elm`: Nachricht `OpenSkriptPdf`
- `src/Main.elm`: Port-Aufruf `openPdfBlob`
- `public/app.js`: Laden der PDF, Erzeugen des Blobs und Aufruf von `saveBlob`
- `public/Skript_ASGLA.pdf`: veröffentlichte PDF-Datei

Die temporäre Blob-URL wird nach 60 Sekunden wieder freigegeben.

## Häufiger Fehler

Falls Pandoc meldet:

```text
'pdflatex' not found
```

wurde keine PDF-Engine angegeben. In diesem Projekt wird Tectonic verwendet; deshalb muss der Befehl die Option `--pdf-engine=tectonic` enthalten.
