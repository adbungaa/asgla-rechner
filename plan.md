# ASGLA Rechner

## Next TODO (noch nicht umsetzen)

- UI für „Erbrachte Leistungen“: nur „Vater“ und „Mutter“ als Auswahl anzeigen; „Wurde noch nicht bezahlt“ entfernen.
- `elm-test` reparieren und die Tests an das aktuelle Model sowie die aktuellen Funktionssignaturen anpassen.
- Grenzen der Düsseldorfer Tabelle technisch eindeutig behandeln: Die ganzzahligen Bereiche (z. B. bis 4.100 / ab 4.101) lassen bei Einkommen mit Centbeträgen Lücken. Vor dem Lookup entweder das Einkommen nach der fachlich festgelegten Regel runden oder die Bereiche lückenlos vergleichen.
- Die Vorprüfung des Regelbedarfs in `Main.elm` entfernen bzw. durch das Ergebnis der zentralen Berechnung ersetzen. Sie verwendet aktuell das Einkommen beider Eltern, obwohl die Berechnung bei einem Haftungsanteil von 0 % nur das relevante Einkommen berücksichtigt.
- Sonderfall behandeln, wenn beide Eltern einen Haftungsanteil von 0 % haben: relevantes Gesamteinkommen explizit auf 0 setzen, beide Haftungsbeträge auf 0 setzen und verständlich anzeigen, dass aus dem verfügbaren Einkommen kein Elternteil Barunterhalt leisten kann.
- Fehlerfälle typisieren: `calculateAusgleichsanspruch` soll ein `Result CalculationError Ergebnis` liefern, statt fehlende Tabellenwerte mit `0` oder Dummywerten wie `111` zu ersetzen.
- Die mehrfach vorhandene Berechnung des endgültigen Ausgleichsanspruchs in `Calculation.elm`, `View/Components.elm` und `ImportExport.elm` zentralisieren. Alle endgültigen Werte einmal in `Ergebnis` berechnen und UI/PDF ausschließlich daraus rendern.
- Nach der Zentralisierung aufräumen: nicht mehr verwendete lokale Variablen, alte `Ergebnis`-Felder, ungenutzte PDF-JSON-Felder sowie sonstigen toten oder verwirrenden Code entfernen.

- Offene Frage Python vs Elm
  - AH: Elm ist besser als Python + Service

- QR Codes
  - encoding mit HTML + [QR-Codes in Elm](https://package.elm-lang.org/packages/pablohirafuji/elm-qrcode/latest/QRCode)
  - [decoding JS](http://qrlogo.kaarposoft.dk/qrdecode.html) ([github](https://github.com/kaarposoft/qrlogo)) oder [Browser native](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API)
  - Zeichensatz muss sicher codiert und decodiert werden

- PDF direkt im Browser erzeugen mit [PDFlib.js](https://pdf-lib.js.org/)

- UI spezifizieren mit Informationsfluss
  - UX Storyboard mit User Stories

- Berechnungen 
  - Düsseldorfer Tabelle
  - python code von Frau Wöhlert
     - implementiert OLG Naumburg
  - Offene Frage: Berechnungsweg flexibel in json-Datei repräsentieren?
    - Berechnungsvorschrift als Sprache definieren und für 
    verschiedene OLGs als json Datei hinterlegen, Zuarbeit des JTC notwendig
    - Oberfläche für Spezifikation der JSON-Datei bauen. 
