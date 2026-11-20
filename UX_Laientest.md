# UX-Laientest: Dashboard v2

Branch: `design/dashboard-v2` (abgezweigt von `Design-Fixes,-Sprint-vom-2026-11-18`).
Orientierung: Stitch-Projekt „ASGLA“ (Screens „Initialzustand“ und „Unterhaltsberechnung im Wechselmodell“).
Texte aus dem Stitch-Entwurf wie „Wechselmodell nach § 1606 BGB“ und „Konform mit BGH …“ wurden bewusst **nicht** übernommen.

## Vorgehen

- Mehrere unabhängige Tester-Agenten ohne Zugriff auf den Quellcode haben die Seite als Laie in Edge (Playwright) bedient, auf Desktop (1440×900) und Mobil (390×844).
- Nach jeder Runde wurden die Befunde umgesetzt, dann prüfte ein frischer Tester neu.
- An der Berechnungslogik wurde nichts geändert. Geändert wurden nur Views, Texte, CSS und ein kleiner Scroll-Zusatz in `app.js`.

## Verlauf der Laien-Note (1–5, 5 = „selbstständig gut bedienbar“)

| Runde | Note | Wichtigste Befunde |
|---|---|---|
| 1 | 3 | Fehlermeldung nicht im Blick, Ergebnis unter der Falz, Mobil-Überlauf |
| 2 | 4 | Gelbe Hinweiskarte verunsichert, Fehlertext bei hohem Einkommen, Fachbegriffe |
| 3 | 3,5 | Label-Klick bei Checkboxen, Jahr springt auf 2023 bei Durchschnitt, Stufensprung-Hinweis |
| 4 | 3,5 | Deckelungs-Hinweis im Rechenweg, fehlender Beratungshinweis, Begriffe |
| 5 | 3,5 | Gelbe Hinweiskarte und Rechenweg-Fachwörter verunsichern weiterhin (Begrenzung, Residenzmodell); rote Fehlerbox bleibt nach Anhaken des Regelbedarfs stehen |
| 6 | 3,5 | Nach Rückkehr zum Originaldesign: Begrenzungs-Hinweis, langer Rechenweg mit Fachwörtern, Fahrtkosten-Vorlage ohne Betrag, Pauschalen-Bezeichnung abgeschnitten, Mutter-Icon unsichtbar, Rechenweg-Button mobil zu breit |

Die Note stagnierte bei 3,5 bis 4. Die verbleibenden Verständnisprobleme gehen von der bestehenden Berechnungslogik aus (Begrenzung/Deckelung des Haftungsanteils, Regelbedarf). Sie lassen sich ohne Änderung der Logik nur durch Texte entschärfen. Hier ist fachliche Rückmeldung nötig: Wann ist die Begrenzung relevant, und wie soll sie Laien erklärt werden?

## Was sich geändert hat

- Nummerierte Schritte, Hilfetexte unter den Feldern, „optional“ und Pflichtmarkierung.
- JSON-Import nur noch hinter „Gespeicherte Berechnung importieren“ (natives `<details>`, keine Modeländerung).
- Ergebniskarte „Wer zahlt an wen?“ mit Icons, Betrag und Klartextsatz. Der Rechenweg liegt darunter.
- Die Seite scrollt automatisch zum Ergebnis bzw. zur Fehlermeldung.
- Ein Hinweis, dass der Rechner eine Einschätzung liefert und keine rechtliche Beratung ersetzt.
- „Begriffe kurz erklärt“ im Rechenweg.

## Überarbeitung nach Nutzerfeedback (2026-11-20)

- Originalfarben (Seitenhintergrund `#69a6b4`, Teal und Orange) und Font Barlow wiederhergestellt.
- „+“ und „–“ statt „Weitere Zeile hinzufügen“, Buttonhöhe gleich Feldhöhe.
- Kind-Abschnitte als eigene Karten, „Bereits bezahlt von“ erst nach Betragseingabe, kleine Checkbox mit Abstand.
- Import klappt in eigenem Container unter der Button-Zeile auf.
- Geschütztes Leerzeichen vor „€“, Akkordeons mit Chevron, neues PDF-Icon.
- **Neu:** Schnellvorlagen bei den Abzügen (5 % Pauschale mit berechnetem Betrag, Fahrtkosten). Die Werte stammen aus dem Skript. Dafür wurde die Logik bewusst minimal erweitert (`AddAbzugsVorlage` in `Types.elm`, `addAbzugsVorlage` in `Elternteil.elm`, zwei Zweige in `update`). Die Berechnung selbst blieb unverändert.
- **Neu:** Das Skript öffnet als Slider von rechts (`public/skript.md`, gerendert mit `marked`, Inhaltsverzeichnis, Escape schließt, PDF bleibt als Download).

## Weitere Überarbeitung (2026-11-20, zweite Runde)

- Skript-Slider: Inhaltsverzeichnis mit Hover und aktiver Markierung (Scrollspy), Skript-Links mit Hover-Unterstreichung, Breite per Ziehen oder Pfeiltasten veränderbar (wird gemerkt), Download-Icon bei „PDF herunterladen“, Escape schließt.
- Escape schließt auch das Zwischenspeichern-Fenster.
- Links zu den Unterhaltsleitlinien des OLG Naumburg im Skript ergänzt. Die genaue Unterseite der Website ist nicht belegt, deshalb zeigt der Link auf die Startseite. Der Direktlink geht auf Stand 01.01.2025, es gibt auch einen Hinweis für 2026 (bitte prüfen).
- Fachbegriffe im Rechner (Selbstbehalt, Begrenzung, Residenzmodell, Betreuungsanteil, Kindergeld, Mehr-/Sonderbedarf, Regelbedarf) verlinken per `data-skript` ins Skript, der Slider springt zur Erklärung.
- Fortschrittsanzeige vor „Berechnen“: zeigt, was noch fehlt (Einkommen, Alter des Kindes).
- Leere Pflichtfelder (Einkommen) werden nach einem fehlgeschlagenen Berechnen rot markiert. Ungültige Eingaben waren schon vorher rot.
- „+“/„–“ sind auf Desktop exakt so hoch wie die Felder (40 px, gemessen).
- „Bereits bezahlt von“ blendet kurz ein (respektiert „Bewegung reduzieren“).

## Offene Fragen aus Runde 6 (fachlich zu klären)

- Gelten 5 % Pauschale und tatsächliche Fahrtkosten wahlweise oder zusätzlich? Der Hilfetext sagt vorsichtig „in der Regel entweder oder“.
- Die Fahrtkosten-Vorlage trägt nur die Bezeichnung ein. Ein km-Rechner wäre möglich, braucht aber Angaben zu Arbeitstagen pro Monat.
- Der Rechenweg bleibt lang. Eine Kurzfassung davor wäre sinnvoll.

## Bekannte offene Punkte (bewusst nicht gelöst)

- **Deckelung des Haftungsanteils:** Das Ergebnis nutzt die berechneten Anteile. Der Begrenzungs-Vorschlag gilt erst nach „übernehmen“. Das ist bestehende Logik. Der Text ist nur klarer formuliert.
- **Kindergeld-Empfänger ist mit „Mutter“ vorbelegt** (Initialwert in der Logik). Das UI weist nur darauf hin.
- **Escape schließt das Zwischenspeichern-Fenster nicht**, dafür wäre eine neue Nachricht in `update` nötig.
- **Fehlerfelder werden nicht rot markiert**, wenn die Eingabe unvollständig ist. Die Prüfung liegt in `Utils/Validation`.
- **Rechenweg:** Er ist aufgeklappt, sobald ein Hinweis auftritt, sonst zugeklappt. Das wirkt für manche inkonsistent.
- **„Bitte füllen Sie alle drei Reiter aus“:** Die Reiter zeigen keinen Fortschritt.
- **Begriffe**, die trotz Glossar noch Vorwissen erfordern: Residenzmodell, Selbstbehalt-Varianten, Düsseldorfer Tabelle.
- **`tests/Tests.elm` kompiliert nicht** gegen das aktuelle `Model`. Das war schon vor dieser Arbeit so. Mit `elm-test@0.19.1-revision12` lässt sich das prüfen.
- **Nicht getestet:** PDF-Export, Import per Datei oder QR-Code, echte Touch-Geräte, die Inhalte von Impressum und Datenschutz.
- **Stitch-Heatmap:** Im verbundenen Stitch-MCP gibt es kein Heatmap-Werkzeug (nur Projekte, Screens, Design-Systeme). Sie wurde deshalb nicht genutzt.


