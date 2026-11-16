module View.Components exposing
    ( cameraScanner
    , importFileSection
    , saveModal
    , showErgebnis
    , showTooltip
    , ueberUnsSection
    , viewCheckboxDurchschnittseinkommen
    , viewMonth
    , viewYear
    )

import Calculation exposing (calculateAusgleichsanspruch)
import Constants exposing (getHoechstbetrag, getKindergeld)
import Html exposing (Html, br, button, div, h3, h4, header, hr, i, input, label, li, option, p, section, select, span, strong, table, tbody, td, text, textarea, th, thead, tr, ul)
import Html.Attributes exposing (attribute, checked, class, classList, disabled, id, placeholder, readonly, rows, style, type_, value)
import Html.Events exposing (onClick, onInput)
import ImportExport exposing (createQRCodeImage, encodeModeltoQRCode)
import Types
    exposing
        ( AktionCameraScanner(..)
        , AktionExport(..)
        , AktionImportFile(..)
        , AktionToggleViewComponent(..)
        , AktionUpdate(..)
        , Ergebnis
        , FileType(..)
        , HaftungsbetragQuelle(..)
        , Model
        , Msg(..)
        , Person(..)
        , Selbstbehalt(..)
        , Tab(..)
        )
import Utils.Format exposing (formatEuroRounded, formatInputToFloat, personToString, renderSelbstbehaltBetrag)



-- Daten für Monat und Jahr Auswahl


monate : List String
monate =
    [ "Januar"
    , "Februar"
    , "März"
    , "April"
    , "Mai"
    , "Juni"
    , "Juli"
    , "August"
    , "September"
    , "Oktober"
    , "November"
    , "Dezember"
    ]


jahre : List String
jahre =
    [ "2023", "2024", "2025", "2026" ]



-- Module View for reusable components


viewMonth : String -> Model -> Html Msg
viewMonth columnClass model =
    div [ class columnClass ]
        [ label [ class "label" ]
            [ text "Monat * "
            , showTooltip "Wählen Sie den Monat aus, für den die Berechnung durchgeführt werden soll."
            ]
        , div [ class "control" ]
            [ div [ class "select is-fullwidth" ]
                [ select
                    [ onInput (Update << UpdateMonat)
                    , value model.monat
                    ]
                    (List.map (\m -> option [ value m ] [ text m ]) monate)
                ]
            ]
        ]


viewYear : String -> Model -> Html Msg
viewYear columnClass model =
    div [ class columnClass ]
        [ label [ class "label" ]
            [ text "Jahr * "
            , showTooltip "Wählen Sie das Jahr aus, für das die Berechnung durchgeführt werden soll."
            ]
        , div [ class "control" ]
            [ div [ class "select is-fullwidth" ]
                [ select
                    [ onInput (Update << UpdateJahr)
                    , value model.jahr
                    ]
                    (List.map (\j -> option [ value j ] [ text j ]) jahre)
                ]
            ]
        ]


viewCheckboxDurchschnittseinkommen : Model -> Html Msg
viewCheckboxDurchschnittseinkommen model =
    div [ class "field", style "margin-top" "1rem" ]
        [ div [ class "control" ]
            [ label [ class "checkbox" ]
                [ input
                    [ type_ "checkbox"
                    , checked model.durchschnittseinkommen
                    , onClick (ToggleView ToggleDurchschnittseinkommen)
                    ]
                    []
                , span [ class "ml-2" ] [ text "Statt Monatsberechnung Durchschnittsberechnung durchführen" ]
                , showTooltip "Aktivieren Sie diese Option, um die durchschnittliche Monatszahlung zu berechnen."
                ]
            ]
        ]


showTooltip : String -> Html msg
showTooltip tooltipText =
    span [ class "tooltip-container" ]
        [ i [ class "fas fa-question-circle" ] []
        , span [ class "tooltip-text" ]
            [ text tooltipText ]
        ]


ueberUnsSection : Model -> Html Msg
ueberUnsSection model =
    div [ class "card", style "margin-top" "-1rem" ]
        [ header [ class "card-header", onClick (ToggleView ToggleUeberUns) ]
            [ p [ class "card-header-title" ] [ text "Über uns" ]
            , span [ class "card-header-icon" ]
                [ i
                    [ class
                        ("fas "
                            ++ (if model.showUeberUns then
                                    "fa-angle-up"

                                else
                                    "fa-angle-down"
                               )
                        )
                    ]
                    []
                ]
            ]
        , if model.showUeberUns then
            ueberUns

          else
            text ""
        ]


ueberUns : Html msg
ueberUns =
    div [ class "content", style "padding" "1rem" ]
        [ h3 [ class "title is-4" ] [ text "ASGLA-Rechner – Zur Berechnung des Kindesunterhalts in Sachsen-Anhalt" ]
        , p []
            [ text "Wir entwickeln einen Rechner, der die Berechnung von Unterhaltsansprüchen für Kinder im Wechselmodell transparent und nachvollziehbar macht und gleichzeitig den Berechnungsaufwand erheblich reduziert." ]
        , p []
            [ text "Jährlich werden in Deutschland zahlreiche Unterhaltsberechnungen für das Wechselmodell erstellt, und fast jede davon ist eine Herausforderung. Warum? Weil die Berechnung nach aktuellen Gerichtsleitlinien so komplex ist, dass selbst erfahrene Jurist:innen regelmäßig zum Taschenrechner greifen müssen." ]
        , p []
            [ text "Unser digitaler Rechner löst dieses Problem für alle Beteiligten: In wenigen Klicks erhalten Eltern eine verlässliche erste Einschätzung ihrer finanziellen Situation, während Richter:innen und Jugendämter ihre Berechnungen standardisiert und effizient durchführen können." ]
        , p []
            [ text "Ihre Daten bleiben dabei vollständig geschützt: Das integrierte QR-Code-System ermöglicht die sichere lokale Speicherung direkt auf Ihrem Gerät – ohne zentrale Server, ohne Datenweitergabe." ]
        , p []
            [ text "Ein Tool, zwei Perspektiven, eine gemeinsame Basis für faire Entscheidungen." ]
        , h3 [ class "title is-4 mt-5" ] [ text "Hintergrund" ]
        , p []
            [ text "Das Projekt wurde von Steuerrechtler:in Viselle Wöhlert initiiert, die im Januar 2025 einen ersten Python-Prototyp entwickelte." ]
        , p []
            [ text "Seit März 2025 wird sie dabei professionell unterstützt: Adelia Arvinta, Entwickler:in, übernimmt die moderne Webentwicklung in Elm und implementiert nutzerfreundliche Funktionen. Luis Bartsch, Student der Rechtswissenschaften an der Uni Halle und ehemalige wissenschaftliche Hilfskraft des JTC Legal Tech Labs, gewährleistet die rechtliche Korrektheit sowie kommunikative Zusammenarbeit mit wichtigen Praxispartner:innen." ]
        , p []
            [ text "Diese interdisziplinäre Zusammenarbeit zwischen Recht, Technik und Praxis stellt sicher, dass das Tool sowohl juristisch fundiert als auch intuitiv bedienbar ist." ]
        , h3 [ class "title is-4 mt-5" ] [ text "Aktueller Stand" ]
        , p []
            [ text "Der Rechner wird in enger Zusammenarbeit mit Jugendämtern, Richter:innen, Eltern sowie Fachanwält:innen für Familienrecht getestet und optimiert." ]
        , p []
            [ text "Der Rechner steht allen Interessierten kostenlos zur Verfügung. Wir freuen uns über Ihr Feedback und laden Sie ein, das Tool zu testen und bei der Weiterentwicklung mitzuwirken." ]
        , h3 [ class "title is-4 mt-5" ] [ text "Kontakt " ]
        , p [] [ text "Kontakt: legaltech@jtc.uni-halle.de" ]
        , p [] [ text "Martin-Luther-Universität Halle-Wittenberg" ]
        , p [] [ text "Juristische und Wirtschaftswissenschaftliche Fakultät" ]
        , p [] [ text "Adresse: Große Steinstraße 79/80, 06108 Halle (Saale)" ]

        -- , p [] [ text "E-Mail:\u{00A0}legaltech@jtc.uni-halle.de" ]
        , h3 [ class "title is-4 mt-5" ] [ text "Team" ]
        , ul []
            [ li [] [ text "Viselle Wöhlert" ]
            , li [] [ text "Adelia Arvinta" ]
            , li [] [ text "Luis Bartsch" ]
            , li [] [ text "in Zusammenarbeit mit dem JTC Halle" ]
            ]
        , p [ class "has-text-danger mt-5" ]
            [ text "Hinweis: Der Rechner ersetzt keine rechtliche Beratung und erhebt keinen Anspruch auf Vollständigkeit oder Richtigkeit im Einzelfall." ]
        ]



-- File Upload, QR-Code Scan und Textarea für JSON-String


importFileSection : Model -> Html Msg
importFileSection model =
    div [ class "mx-5" ]
        [ div
            [ class "is-flex is-justify-content-space-between is-align-items-flex-start"
            , style "gap" "2rem"
            , style "flex-wrap" "wrap"
            , style "margin-bottom" "1.5rem"
            ]
            [ button
                [ class "button is-text"
                , style "background-color" "#bbddc1"
                , type_ "button"
                , onClick OpenSkriptPdf
                ]
                [ text "Skript/Anleitung" ]
            , div [ class "buttons is-flex is-justify-content-flex-end" ]
                [ button
                    [ class "button is-primary tooltip-container"
                    , onClick (ImportFile (OpenFile JsonFile))
                    ]
                    [ span [ class "icon" ]
                        [ i [ class "fas fa-file-upload" ] [] ]
                    , text "Import JSON File"
                    , span [ class "tooltip-text" ]
                        [ text "Importiert Eingabedaten aus einer zuvor gespeicherten JSON-Datei (lokal, ohne Datenweitergabe)."
                        ]
                    ]
                , button
                    [ class "button is-primary tooltip-container"
                    , classList [ ( "is-loading", model.qrIsProcessing ) ]
                    , onClick (ImportFile (OpenFile ImageFile))
                    , disabled model.qrIsProcessing
                    ]
                    [ span [ class "icon" ]
                        [ i [ class "fas fa-qrcode" ] [] ]
                    , span [ class "ml-2" ]
                        [ text
                            (if model.qrIsProcessing then
                                "Processing... "

                             else
                                "QR-Code importieren "
                            )
                        , span [ class "tooltip-text" ]
                            [ text "Importiert Eingabedaten aus einem zuvor gespeicherten QR-Code (lokal, ohne Datenweitergabe)."
                            ]
                        ]
                    ]
                , button
                    [ class "button is-primary tooltip-container"
                    , classList [ ( "is-loading", model.qrIsProcessing ) ]
                    , onClick (CameraScanner OpenCameraContainer)
                    , disabled model.qrIsProcessing
                    ]
                    [ span [ class "icon" ]
                        [ i [ class "fas fa-camera" ] [] ]
                    , span [ class "ml-2" ]
                        [ text
                            (if model.qrIsProcessing then
                                "Processing..."

                             else
                                "QR-Code Scannen"
                            )
                        , span [ class "tooltip-text" ]
                            [ text "Öffnet die Kamera, um einen QR-Code mit Eingabedaten zu scannen (lokal, ohne Datenweitergabe)."
                            ]
                        ]
                    ]
                ]
            ]
        , div [ class "card" ]
            [ div [ class "field" ]
                [ textarea
                    [ class "textarea"
                    , placeholder "JSON-String hier einfügen"
                    , rows 1
                    , onInput (\input -> ImportFile (QRDecoded input))
                    ]
                    []
                ]
            ]
        , case model.qrResult of
            Just result ->
                div
                    [ class "notification is-success mt-4" ]
                    [ div [ class "content" ]
                        [ h4 [ class "title is-5" ] [ text "Datenimport erfolgreich!" ]
                        ]
                    ]

            Nothing ->
                text ""
        , case model.error of
            Just errorMsg ->
                div
                    [ class "notification is-danger mt-4" ]
                    [ div [ class "content" ]
                        [ h4 [ class "title is-5" ] [ text "Error:" ]
                        , p [] [ text errorMsg ]
                        ]
                    ]

            Nothing ->
                text ""
        ]



-- Camera Scanner Modal Container


cameraScanner : Model -> Html Msg
cameraScanner model =
    if model.showCameraScanner then
        div [ class "modal is-active" ]
            [ div [ class "modal-background", onClick (CameraScanner StopCameraScanner) ] []
            , div [ class "modal-content" ]
                [ div [ class "box has-background-dark" ]
                    [ div [ class "has-text-centered mb-4" ]
                        [ p [ class "has-text-white" ]
                            [ text "QR-Code im Rahmen positionieren – automatischer Scan ..." ]
                        , p [ class "has-text-white" ]
                            [ text "Hinweis: Sollte der QR-Code Scan mit der Kamera nicht funktionieren, beachten Sie die Hilfestellung im Skript." ]
                        ]
                    , div
                        [ id "qr-camera-reader"
                        , class "has-background-black"
                        , style "width" "100%"
                        , style "max-width" "450px"
                        , style "min-height" "260px"
                        , style "margin" "0 auto"
                        ]
                        []
                    , div [ class "has-text-centered mt-4" ]
                        [ p [ class "has-text-warning has-text-weight-bold" ]
                            [ text
                                (if model.qrIsProcessing then
                                    "Kamera wird gestartet..."

                                 else
                                    "Kamera bereit"
                                )
                            ]
                        ]
                    ]
                ]
            , button
                [ class "modal-close is-large"
                , attribute "aria-label" "close"
                , onClick (CameraScanner StopCameraScanner)
                ]
                []
            ]

    else
        text ""



-- Eingabe Zwischenspeicher Modal


saveModal : Model -> Html Msg
saveModal model =
    div [ class "modal is-active" ]
        [ div [ class "modal-background", onClick (ToggleView ToggleSaveModal) ] []
        , div [ class "modal-card" ]
            [ header [ class "modal-card-head" ]
                [ p [ class "modal-card-title" ] [ text "Eingabe zwischenspeichern" ]
                , button [ class "delete", type_ "button", onClick (ToggleView ToggleSaveModal) ] []
                ]
            , section [ class "modal-card-body" ]
                [ div [ class "field" ]
                    [ p [] [ text "QR Code:" ]
                    , showQRCode model
                    , button [ class "button is-small mr-2", type_ "button", onClick (Export DownloadQrCode) ] [ text "QR Code speichern" ]
                    ]
                , div [ class "field", style "margin-top" "1rem" ]
                    [ p [] [ text "JSON String:" ]
                    , textarea [ class "textarea is-family-monospace", readonly True, value (encodeModeltoQRCode model) ] []
                    , button [ class "button is-small mt-2", type_ "button", onClick (Export CopyJsonToClipboard) ] [ text "Copy" ]
                    , button [ class "button is-small mt-2", style "margin-left" "0.5rem", type_ "button", onClick (Export DownloadJson) ] [ text "JSON speichern" ]
                    ]
                ]
            ]
        ]


showQRCode : Model -> Html Msg
showQRCode model =
    div [ class "mt-4" ]
        [ createQRCodeImage (encodeModeltoQRCode model) ]



-- Ergebnis tabellarisch Zwischenschritte und Endergebnis


showErgebnis :
    Model
    -> Html Msg -- TABELLE
showErgebnis model =
    let
        ergebnis =
            calculateAusgleichsanspruch
                model

        renderPersonSection : String -> Person -> Html msg
        renderPersonSection title person =
            let
                modelPerson =
                    case person of
                        Vater ->
                            model.vater

                        Mutter ->
                            model.mutter

                weitereEinkuenfte =
                    case person of
                        Vater ->
                            ergebnis.weitereEinkuenfteVater

                        Mutter ->
                            ergebnis.weitereEinkuenfteMutter

                einkommen =
                    case person of
                        Vater ->
                            ergebnis.einkommenVater

                        Mutter ->
                            ergebnis.einkommenMutter

                gesamtAbzug =
                    case person of
                        Vater ->
                            ergebnis.gesamtAbzugVater

                        Mutter ->
                            ergebnis.gesamtAbzugMutter

                bereinigtesEinkommen =
                    case person of
                        Vater ->
                            ergebnis.bereinigtesEinkommenVater

                        Mutter ->
                            ergebnis.bereinigtesEinkommenMutter

                verteilbarerBetrag =
                    case person of
                        Vater ->
                            ergebnis.verteilbarerBetragVater

                        Mutter ->
                            ergebnis.verteilbarerBetragMutter

                textPerson =
                    case person of
                        Vater ->
                            "den Kindsvater"

                        Mutter ->
                            "die Kindsmutter"

                selbstbehaltText =
                    case modelPerson.selbstbehalt of
                        Angemessen _ ->
                            "angemessener Selbstbehalt"

                        NotwendigErwerbstaetig _ ->
                            "notwendiger Selbstbehalt (erwerbstätig)"

                        NotwendigNichtErwerbstaetig _ ->
                            "notwendiger Selbstbehalt (nicht erwerbstätig)"

                        Benutzerdefiniert _ ->
                            "benutzerdefinierter Selbstbehalt"

                selbstbehaltTextMitArtikel =
                    case modelPerson.selbstbehalt of
                        Angemessen _ ->
                            "angemessene Selbstbehalt"

                        NotwendigErwerbstaetig _ ->
                            "notwendige Selbstbehalt (erwerbstätig)"

                        NotwendigNichtErwerbstaetig _ ->
                            "notwendige Selbstbehalt (nicht erwerbstätig)"

                        Benutzerdefiniert _ ->
                            "benutzerdefinierte Selbstbehalt"
            in
            div []
                [ h3 [ class "title is-5" ] [ text title ]
                , table [ class "table is-striped is-bordered is-hoverable", style "width" "100%" ]
                    [ thead []
                        [ header "Bezeichnung" "Betrag"
                        ]
                    , tbody []
                        ([ row "Einkommen" (formatEuroRounded einkommen ++ " €")
                         , row "\u{00A0}\u{00A0}Einkünfte aus Haupttätigkeit" (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat modelPerson.haupttaetigkeit)) ++ " €")
                         , row "\u{00A0}\u{00A0}Weitere Einkünfte Gesamt" (formatEuroRounded weitereEinkuenfte ++ " €")
                         ]
                            ++ (modelPerson.weitereEinkuenfte
                                    |> List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00")
                                    |> List.map
                                        (\item ->
                                            row
                                                ("\u{00A0}\u{00A0}\u{00A0}\u{00A0}" ++ item.bezeichnung)
                                                (formatEuroRounded (Maybe.withDefault 0.0 (formatInputToFloat item.kosten)) ++ " €")
                                        )
                               )
                            ++ (row "Abzug Gesamt" (formatEuroRounded gesamtAbzug ++ " €")
                                    :: (modelPerson.abzugsposten
                                            |> List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00")
                                            |> List.map
                                                (\item ->
                                                    row
                                                        ("\u{00A0}\u{00A0}Abzug " ++ item.bezeichnung)
                                                        (formatEuroRounded (Maybe.withDefault 0.0 (formatInputToFloat item.kosten)) ++ " €")
                                                )
                                       )
                               )
                            ++ [ row "Bereinigtes Einkommen" (formatEuroRounded bereinigtesEinkommen ++ " €")
                               , row ("Selbstbehalt (" ++ selbstbehaltText ++ ")") (formatEuroRounded (Maybe.withDefault 0.0 (formatInputToFloat (renderSelbstbehaltBetrag modelPerson.selbstbehalt))) ++ " €")
                               , row "= verteilbarer Betrag " (formatEuroRounded verteilbarerBetrag ++ " €")
                               ]
                        )
                    ]
                , p [ class "mt-4" ] [ text ("Für " ++ textPerson ++ " wurde der " ++ selbstbehaltTextMitArtikel ++ " berücksichtigt.") ]
                ]

        header label1 label2 =
            tr []
                [ th [ class "has-text-left has-text-centered" ] [ text label1 ]
                , th [ class "has-text-right has-text-centered" ] [ text label2 ]
                ]

        row label value =
            tr []
                [ td [ class "has-text-left", style "padding" "0.5rem", style "vertical-align" "top" ] [ text label ]
                , td [ class "has-text-right", style "padding" "0.5rem" ] [ text value ]
                ]

        rowWithLines lines value =
            tr []
                [ td [ class "has-text-left", style "padding" "0.5rem", style "vertical-align" "top" ]
                    (List.intersperse (br [] []) (List.map text lines))
                , td [ class "has-text-right", style "padding" "0.5rem" ] [ text value ]
                ]

        kindEinkuenfteSum =
            List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.einkuenfte)

        anzurechnendeKindEinkuenfte =
            if model.kind.alter < 18 then
                kindEinkuenfteSum / 2

            else
                kindEinkuenfteSum

        kindEinkuenftePositionen =
            model.kind.einkuenfte
                |> List.filter
                    (\item ->
                        (formatInputToFloat item.kosten |> Maybe.withDefault 0) /= 0
                    )

        kindEinkuenfteUeberschrift =
            "Abzug "
                ++ (if model.kind.alter < 18 then
                        "hälftiger"

                    else
                        "vollständiger"
                   )
                ++ " Einkünfte des Kindes iHv. "
                ++ formatEuroRounded kindEinkuenfteSum
                ++ " €"

        kindEinkuenfteZeilen =
            kindEinkuenfteUeberschrift
                :: List.map
                    (\item ->
                        "\u{00A0}\u{00A0}"
                            ++ (if String.isEmpty (String.trim item.bezeichnung) then
                                    "Ohne Bezeichnung"

                                else
                                    item.bezeichnung
                               )
                            ++ " ("
                            ++ formatEuroRounded (formatInputToFloat item.kosten |> Maybe.withDefault 0)
                            ++ " €)"
                    )
                    kindEinkuenftePositionen

        differenzNachAnrechnung =
            abs (ergebnis.anteilVaterGesamtbedarf - ergebnis.anteilMutterGesamtbedarf)

        auszugleichenderBetragNachAnrechnung =
            differenzNachAnrechnung / 2

        ausgleichsanspruchNachAnrechnung =
            if anspruchsberechtigtNachAnrechnung == Mutter then
                -- Wenn die Mutter anspruchsberechtigt ist, und das Kindergeld geht an den Vater:
                if model.kindergeldEmpfaenger == Vater then
                    -- Kindergeld wird oben draufgerechnet
                    auszugleichenderBetragNachAnrechnung + (toFloat (getKindergeld model.jahr) / 4)

                else
                    -- Kindergeld wird abgezogen
                    auszugleichenderBetragNachAnrechnung - (toFloat (getKindergeld model.jahr) / 4)

            else if model.kindergeldEmpfaenger == Mutter then
                auszugleichenderBetragNachAnrechnung + (toFloat (getKindergeld model.jahr) / 4)

            else
                auszugleichenderBetragNachAnrechnung
                    - (toFloat (getKindergeld model.jahr) / 4)

        anspruchsberechtigtNachAnrechnung =
            if ergebnis.anteilVaterGesamtbedarf > ergebnis.anteilMutterGesamtbedarf then
                Mutter

            else
                Vater

        nichtAnspruchsberechtigtNachAnrechnung =
            if anspruchsberechtigtNachAnrechnung == Vater then
                Mutter

            else
                Vater

        hoechstbetragFallback =
            Maybe.withDefault 0 ergebnis.regelbedarf
                - (if model.kind.alter < 18 then
                    toFloat (getKindergeld model.jahr) / 2

                   else
                    toFloat (getKindergeld model.jahr)
                  )

        hoechstbetragVater =
            Maybe.withDefault
                hoechstbetragFallback
                (getHoechstbetrag model.jahr ergebnis.bereinigtesEinkommenVater model.kind.alter)

        hoechstbetragMutter =
            Maybe.withDefault
                hoechstbetragFallback
                (getHoechstbetrag model.jahr ergebnis.bereinigtesEinkommenMutter model.kind.alter)

        nichtKindergeldEmpfänger =
            case model.kindergeldEmpfaenger of
                Vater ->
                    Mutter

                Mutter ->
                    Vater

        kindergeldBetreuungsanteil =
            toFloat (getKindergeld model.jahr) / 4

        kindergeldWirdAddiert =
            anspruchsberechtigtNachAnrechnung == nichtKindergeldEmpfänger

        ausgleichsanspruchRechenzeichen =
            if kindergeldWirdAddiert then
                "+"

            else
                "-"

        ausgleichsanspruchZwischenschritt =
            formatEuroRounded auszugleichenderBetragNachAnrechnung
                ++ " € "
                ++ ausgleichsanspruchRechenzeichen
                ++ " "
                ++ formatEuroRounded kindergeldBetreuungsanteil
                ++ " € = "
                ++ formatEuroRounded ausgleichsanspruchNachAnrechnung
                ++ " €"
    in
    div
        [ class "mt-5", style "margin" "1rem" ]
        [ div [ class "is-flex is-justify-content-space-between is-align-items-center" ]
            [ Html.h2 [ class "title is-4 mb-0" ] [ text "Ausgleichsanspruch Berechnung" ]
            , Html.button
                [ class "button is-primary"
                , Html.Attributes.type_ "button"
                , Html.Attributes.attribute "aria-label" "Export PDF"
                , Html.Attributes.title "Export PDF"
                , onClick (Export ExportPdf)
                ]
                [ span [ class "icon" ]
                    [ i [ class "fas fa-file-export" ] [] ]
                ]
            ]
        , div [ class "columns is-variable is-3" ]
            [ div [ class "column" ] [ renderPersonSection "Vater" Vater ]
            , div [ class "column" ] [ renderPersonSection "Mutter" Mutter ]
            ]
        , p [ class "mt-4" ] [ text ("Relevantes Gesamteinkommen für den Regelbedarf: " ++ formatEuroRounded ergebnis.gesamtEinkommen ++ " €") ]
        , p [ class "mt-4" ] [ text ("Verteilbarer Betrag Gesamt: " ++ formatEuroRounded ergebnis.verteilbarerBetragGesamt ++ " €") ]
        , div [ class "columns is-variable is-3" ]
            [ div [ class "column" ]
                [ p [ class "mt-4" ] [ text ("Haftungsanteil Vater: " ++ formatEuroRounded (ergebnis.haftungsanteilVater * 100) ++ "%") ]
                , if ergebnis.haftungsanteilVater == 0 then
                    p [ class "mt-4 has-text-danger" ] [ text "Da der Haftungsanteil des Vaters bei 0 Prozent liegt, berechnet sich der Regelbedarf des Kindes allein aufgrund des Einkommens der Mutter." ]

                  else if ergebnis.haftungsanteilMutter == 0 then
                    p [ class "mt-4 has-text-danger" ] [ text "Da der Haftungsanteil der Mutter bei 0 Prozent liegt, berechnet sich der Regelbedarf des Kindes allein aufgrund des Einkommens des Vaters." ]

                  else
                    text ""
                ]
            , div [ class "column" ]
                [ p [ class "mt-4" ] [ text ("Haftungsanteil Mutter: " ++ formatEuroRounded (ergebnis.haftungsanteilMutter * 100) ++ "%") ]
                ]
            ]
        , hr [] []
        , h4 [ class "title is-5 mt-5" ] [ text ("Bedarf des Kindes (Alter: " ++ String.fromInt model.kind.alter ++ " Jahre)") ]
        , table [ class "table is-striped is-bordered is-hoverable is-fullwidth" ]
            [ thead []
                [ header "Bezeichnung" "Betrag"
                ]
            , tbody []
                ([ row
                    ("Regelbedarf"
                        ++ (if model.customRegelbedarf then
                                "**"

                            else
                                ""
                           )
                    )
                    (formatEuroRounded (Maybe.withDefault 0 ergebnis.regelbedarf) ++ " €")
                 , row "Zusatzbedarf" (formatEuroRounded (List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.mehrbedarf) + List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.sonderbedarf)) ++ " €")
                 , row "davon Mehrbedarf" (formatEuroRounded (List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.mehrbedarf)) ++ " €")
                 ]
                    -- mehrbedarf list rows
                    ++ List.map
                        (\item -> row ("\u{00A0}\u{00A0}" ++ item.bezeichnung ++ " \u{00A0}\u{00A0} (Bereits bezahlt von: " ++ (item.bezahltVon |> Maybe.map personToString |> Maybe.withDefault "Nicht angegeben") ++ ")") (formatEuroRounded (formatInputToFloat item.kosten |> Maybe.withDefault 0) ++ " €"))
                        (List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00") model.kind.mehrbedarf)
                    ++ [ row "davon Sonderbedarf" (formatEuroRounded (List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.sonderbedarf)) ++ " €") ]
                    -- sonderbedarf list rows
                    ++ List.map
                        (\item -> row ("\u{00A0}\u{00A0}" ++ item.bezeichnung ++ "\u{00A0}\u{00A0} (Bereits bezahlt von: " ++ (item.bezahltVon |> Maybe.map personToString |> Maybe.withDefault "Nicht angegeben") ++ ")") (formatEuroRounded (formatInputToFloat item.kosten |> Maybe.withDefault 0) ++ " €"))
                        (List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00") model.kind.sonderbedarf)
                    ++ (if not (List.isEmpty kindEinkuenftePositionen) then
                            [ rowWithLines kindEinkuenfteZeilen (formatEuroRounded anzurechnendeKindEinkuenfte ++ " €") ]

                        else
                            []
                       )
                    ++ [ row "Abzug hälftiges Kindergeld" (formatEuroRounded (toFloat (getKindergeld model.jahr) / 2) ++ " €")
                       , row "Gesamtbedarf" (formatEuroRounded ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf ++ " €")
                       ]
                )
            ]
        , hr [] []

        -- , h4 [ class "title is-5 mt-5" ] [ text "Anteile ohne getragene Zusatzbedarfe" ]
        , div [ class "columns is-variable is-3 mt-4" ]
            [ div [ class "column" ]
                [ p [] [ text ("Anteil Vater am Gesamtbedarf: " ++ formatEuroRounded ergebnis.haftungsbetragVater ++ " €") ]
                , viewBegrenzungHinweis
                    "Vaters"
                    ergebnis.haftungsbetragVaterVorBegrenzung
                    ergebnis.haftungsbetragVater
                    ergebnis.verteilbarerBetragVater
                , if (model.haftungsbetragVaterSpiegel |> Maybe.withDefault 0) > hoechstbetragVater then
                    viewHHinweisAnteilEltern model ergebnis Vater ergebnis.bereinigtesEinkommenVater ergebnis.haftungsbetragVater ergebnis.haftungsbetragMutter

                  else
                    text ""
                ]
            , div [ class "column" ]
                [ p [] [ text ("Anteil Mutter am Gesamtbedarf: " ++ formatEuroRounded ergebnis.haftungsbetragMutter ++ " €") ]
                , viewBegrenzungHinweis
                    "Mutters"
                    ergebnis.haftungsbetragMutterVorBegrenzung
                    ergebnis.haftungsbetragMutter
                    ergebnis.verteilbarerBetragMutter
                , if (model.haftungsbetragMutterSpiegel |> Maybe.withDefault 0) > hoechstbetragMutter then
                    viewHHinweisAnteilEltern model ergebnis Mutter ergebnis.bereinigtesEinkommenMutter ergebnis.haftungsbetragVater ergebnis.haftungsbetragMutter

                  else
                    text ""
                ]
            ]
        , if ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf - ergebnis.verteilbarerBetragGesamt > 0 then
            div []
                [ p [ style "color" "#ff0000", class "has-text-centered" ] [ text ("Ungedeckter Kindsbedarf: " ++ formatEuroRounded (ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf - ergebnis.verteilbarerBetragGesamt) ++ " €") ]
                , div [ class "notification mt-4" ]
                    [ p []
                        [ text "Hinweis: Der Bedarf des Kindes ist höher als der verteilbare Betrag."
                        , case model.vater.selbstbehalt of
                            Angemessen _ ->
                                text " Es sollte gegebenenfalls in Erwägung gezogen werden, statt des angemessenen Selbstbehalts den notwendigen Selbstbehalt anzusetzen."

                            _ ->
                                text " Da der Bedarf des Kindes nicht durch die Eltern gedeckt werden kann, sollte geprüft werden, ob Ergänzen weitere finanzielle Unterstützungsmöglichkeiten in Anspruch genommen werden können, z. B. durch die Inanspruchnahme sozialrechtlicher Leistungen."
                        ]
                    ]
                ]

          else
            text ""
        , viewZusatzbedarfLeistungen model ergebnis
        , p [ class "mt-4" ] [ text ("Differenz: " ++ formatEuroRounded differenzNachAnrechnung ++ " €") ]
        , p [ class "mt-4" ] [ text ("Auszugleichender Betrag (1/2) von " ++ personToString nichtAnspruchsberechtigtNachAnrechnung ++ " zu leisten an " ++ personToString anspruchsberechtigtNachAnrechnung ++ ": " ++ formatEuroRounded auszugleichenderBetragNachAnrechnung ++ " €") ]
        , h4 [ class "title is-5 mt-5" ] [ text "Kindergeldverrechnung " ]
        , table [ class "table is-striped is-bordered is-hoverable is-fullwidth" ]
            [ thead []
                [ header "Bezeichnung" "Betrag"
                ]
            , tbody []
                [ row "Kindergeld" (formatEuroRounded (toFloat (getKindergeld model.jahr)) ++ " €")
                , row "Kindergeldempfänger" (personToString model.kindergeldEmpfaenger)
                , row "Betreuungsanteil Mutter" (formatEuroRounded ergebnis.betreuungsanteil ++ " €")
                , row "Baranteil Mutter" (formatEuroRounded ergebnis.baranteilMutter ++ " €")
                , row "Betreuungsanteil Vater" (formatEuroRounded ergebnis.betreuungsanteil ++ " €")
                , row "Baranteil Vater" (formatEuroRounded ergebnis.baranteilVater ++ " €")
                ]
            ]
        , p [ class "mt-4" ] [ text ("Durch den Abzug des hälftigen Kindergeldes vom Bedarf wurde der Baranteil bereits abgegolten. Verbleibend ist allein die Verrechnung des Betreuungsanteils in Höhe von " ++ formatEuroRounded kindergeldBetreuungsanteil ++ " € von " ++ personToString model.kindergeldEmpfaenger ++ " an " ++ personToString nichtKindergeldEmpfänger ++ ": ") ]
        , table [ class "table is-striped is-bordered is-hoverable is-fullwidth mt-4" ]
            [ thead []
                [ header "Zwischenschritt" "Betrag"
                ]
            , tbody []
                [ row "Auszugleichender Betrag (1/2)" (formatEuroRounded auszugleichenderBetragNachAnrechnung ++ " €")
                , row ("Betreuungsanteil Kindergeld von " ++ personToString model.kindergeldEmpfaenger ++ " an " ++ personToString nichtKindergeldEmpfänger) (ausgleichsanspruchRechenzeichen ++ " " ++ formatEuroRounded kindergeldBetreuungsanteil ++ " €")
                , row "Rechnung Ausgleichsanspruch" ausgleichsanspruchZwischenschritt
                ]
            ]
        , p [ class "mt-4" ] [ text "Der Ausgleichsanspruch ist auf volle Euro aufzurunden." ]
        , hr [] []
        , div
            [ class "box content has-text-weight-bold mt-4 has-text-centered"
            , style "border" "1px solid #ccc"
            , style "border-radius" "8px"
            , style "padding" "1rem"
            ]
            [ if ausgleichsanspruchNachAnrechnung < 0 then
                text ("Daher insgesamt von " ++ personToString anspruchsberechtigtNachAnrechnung ++ " an " ++ personToString nichtAnspruchsberechtigtNachAnrechnung ++ " zu leistende Ausgleichszahlung: " ++ formatEuroRounded (toFloat (ceiling (abs ausgleichsanspruchNachAnrechnung))) ++ " €")

              else
                text ("Daher insgesamt von " ++ personToString nichtAnspruchsberechtigtNachAnrechnung ++ " an " ++ personToString anspruchsberechtigtNachAnrechnung ++ " zu leistende Ausgleichszahlung: " ++ formatEuroRounded (toFloat (ceiling ausgleichsanspruchNachAnrechnung)) ++ " €")
            ]
        , div [ class "title is-5 mt-5" ]
            [ text "Erläuterungen und Anmerkungen:"
            , p
                [ class "is-size-6 mt-3"
                , style "font-weight" "normal"
                , style "white-space" "pre-wrap"
                ]
                [ text model.freitext ]
            ]
        , div []
            (if model.customRegelbedarf then
                [ div [ class "is-5 mt-5" ]
                    [ text "** Individueller Regelbedarf wurde verwendet." ]
                ]

             else
                []
            )
        , Html.button
            [ class "button is-primary"
            , Html.Attributes.type_ "button"
            , style "margin-top" "1rem"
            , onClick (Export ExportPdf)
            ]
            [ text "Export PDF" ]
        ]


viewBegrenzungHinweis : String -> Float -> Float -> Float -> Html msg
viewBegrenzungHinweis elternteilGenitiv urspruenglicherBetrag begrenzterBetrag verteilbarerBetrag =
    if urspruenglicherBetrag > begrenzterBetrag then
        div [ class "notification is-warning is-light mt-2" ]
            [ text
                ("Der ursprünglich berechnete Haftungsbetrag "
                    ++ elternteilGenitiv
                    ++ " von "
                    ++ formatEuroRounded urspruenglicherBetrag
                    ++ " € übersteigt den verteilbaren Betrag von "
                    ++ formatEuroRounded verteilbarerBetrag
                    ++ " €. Der Haftungsbetrag wurde entsprechend begrenzt."
                )
            ]

    else
        text ""


viewHHinweisAnteilEltern : Model -> Ergebnis -> Person -> Float -> Float -> Float -> Html Msg
viewHHinweisAnteilEltern model ergebnis elterenteil einkommen anteilVater anteilMutter =
    let
        elternText =
            case elterenteil of
                Vater ->
                    "Kindsvater"

                Mutter ->
                    "Kindsmutter"

        hoechstbetrag =
            getHoechstbetrag model.jahr einkommen model.kind.alter

        vaterWert =
            if elterenteil == Vater then
                Maybe.withDefault 0 hoechstbetrag

            else
                anteilVater

        mutterWert =
            if elterenteil == Mutter then
                Maybe.withDefault 0 hoechstbetrag

            else
                anteilMutter

        spiegelWert =
            if elterenteil == Vater then
                model.haftungsbetragVaterSpiegel |> Maybe.withDefault 0

            else
                model.haftungsbetragMutterSpiegel |> Maybe.withDefault 0
    in
    div [ class "mt-4" ]
        [ div
            [ class "notification is-info"
            , style "background-color" "#ddddeb"
            ]
            [ text ("Der Haftungsbetrag von " ++ elternText ++ " (" ++ formatEuroRounded spiegelWert ++ " €) ist höher als der Zahlungsbetrag, der im Residenzmodell zu leisten wäre. Daher wird der Haftungsanteil auf diesen Zahlungsbetrag gedeckelt.")
            , p [ class "mt-2" ] [ text ("Daher der Haftungsanteil von " ++ elternText ++ ": " ++ formatEuroRounded (Maybe.withDefault 0 hoechstbetrag) ++ " €") ]
            ]
        , button [ class "button is-small mt-2", type_ "button", onClick (ApplyHaftungsbetraege vaterWert mutterWert Vorschlag) ] [ text "Vorgeschlagenen Haftungsanteil übernehmen" ]
        , button [ class "button is-small mt-2", type_ "button", onClick (ToggleView ToggleVorschlagHft) ] [ text "Stattdessen Haftungsanteile für Eltern individuell festsetzen" ]
        , if model.vorschlagHft == True then
            viewVorschlagHaftungsanteil model ergebnis elterenteil (Maybe.withDefault 0 hoechstbetrag)

          else
            text ""
        ]


viewZusatzbedarfLeistungen : Model -> Ergebnis -> Html Msg
viewZusatzbedarfLeistungen model ergebnis =
    let
        zusatzbedarfItems =
            List.map (\item -> ( "Mehrbedarf", item )) model.kind.mehrbedarf
                ++ List.map (\item -> ( "Sonderbedarf", item )) model.kind.sonderbedarf
                ++ List.map (\item -> ( "Erbrachte Leistung", item )) model.kind.erbrachteLeistungen

        isFilledZusatzbedarf ( _, item ) =
            not (String.isEmpty (String.trim item.kosten))
                && (formatInputToFloat item.kosten |> Maybe.withDefault 0)
                /= 0

        paidBy person =
            zusatzbedarfItems
                |> List.filter (\( _, item ) -> item.bezahltVon == Just person)
                |> List.filter isFilledZusatzbedarf

        paidByVater =
            sumItems (paidBy Vater)

        paidByMutter =
            sumItems (paidBy Mutter)

        abzugVater =
            case model.kindergeldEmpfaenger of
                Vater ->
                    toFloat (getKindergeld model.jahr) / 2

                _ ->
                    0

        abzugMutter =
            case model.kindergeldEmpfaenger of
                Mutter ->
                    toFloat (getKindergeld model.jahr) / 2

                _ ->
                    0

        sumItems items =
            items
                |> List.map (\( _, item ) -> formatInputToFloat item.kosten |> Maybe.withDefault 0)
                |> List.sum

        renderItem ( typ, item ) =
            li []
                [ strong [] [ text (typ ++ ": ") ]
                , text
                    ((if String.isEmpty (String.trim item.bezeichnung) then
                        "Ohne Bezeichnung"

                      else
                        item.bezeichnung
                     )
                        ++ " - "
                        ++ formatEuroRounded (formatInputToFloat item.kosten |> Maybe.withDefault 0)
                        ++ " €"
                    )
                ]

        renderItems items =
            if List.isEmpty items then
                text "Keine"

            else
                ul [] (List.map renderItem items)
    in
    div [ class "mt-4" ]
        [ h4 [ class "title is-6" ] [ text "Bereits getragene Zusatzbedarfe und erbrachte Leistungen" ]
        , table [ class "table is-striped is-bordered is-hoverable is-fullwidth" ]
            [ thead []
                [ tr []
                    [ th [ class "has-text-left" ] [ text "Vater" ]
                    , th [ class "has-text-left" ] [ text "Mutter" ]
                    ]
                ]
            , tbody []
                [ tr []
                    [ td [] [ renderItems (paidBy Vater) ]
                    , td [] [ renderItems (paidBy Mutter) ]
                    ]
                , tr []
                    [ td []
                        [ strong [] [ text ("Summe: " ++ formatEuroRounded paidByVater ++ " €") ]
                        ]
                    , td []
                        [ strong [] [ text ("Summe: " ++ formatEuroRounded paidByMutter ++ " €") ]
                        ]
                    ]
                , tr []
                    [ td [] [ text "Anrechnung hälftiges Kindergeld beim Kindergeldempfänger: " ]
                    , td [] [ text "Anrechnung hälftiges Kindergeld beim Kindergeldempfänger: " ]
                    ]
                , tr []
                    [ td [] [ text ("" ++ formatEuroRounded ergebnis.haftungsbetragVater ++ " - " ++ formatEuroRounded paidByVater ++ " + " ++ formatEuroRounded abzugVater ++ " = " ++ formatEuroRounded ergebnis.anteilVaterGesamtbedarf ++ " €") ]
                    , td [] [ text ("" ++ formatEuroRounded ergebnis.haftungsbetragMutter ++ " - " ++ formatEuroRounded paidByMutter ++ " + " ++ formatEuroRounded abzugMutter ++ " = " ++ formatEuroRounded ergebnis.anteilMutterGesamtbedarf ++ " €") ]
                    ]
                , tr []
                    [ td [] [ text ("Haftungsbetrag nach Anrechnung " ++ personToString Vater ++ ": " ++ formatEuroRounded ergebnis.anteilVaterGesamtbedarf ++ " €") ]
                    , td [] [ text ("Haftungsbetrag nach Anrechnung " ++ personToString Mutter ++ ": " ++ formatEuroRounded ergebnis.anteilMutterGesamtbedarf ++ " €") ]
                    ]
                ]
            ]
        ]


viewVorschlagHaftungsanteil : Model -> Ergebnis -> Person -> Float -> Html Msg
viewVorschlagHaftungsanteil model ergebnis elterenteil vorschlag =
    let
        vorschlagVater =
            if elterenteil == Vater then
                vorschlag

            else
                model.haftungsbetragVaterSpiegel
                    |> Maybe.withDefault ergebnis.haftungsbetragVater

        vorschlagMutter =
            if elterenteil == Mutter then
                vorschlag

            else
                model.haftungsbetragMutterSpiegel
                    |> Maybe.withDefault ergebnis.haftungsbetragMutter

        vaterWert =
            formatInputToFloat model.haftungsbetragVaterInput
                |> Maybe.withDefault vorschlagVater

        mutterWert =
            formatInputToFloat model.haftungsbetragMutterInput
                |> Maybe.withDefault vorschlagMutter
    in
    div [ class "mt-4", style "margin-bottom" "1rem", style "background-color" "#f5f5f5", style "padding" "1rem", style "border-radius" "8px" ]
        [ div [ class "field" ]
            [ label [ class "label" ] [ text "Vater (€)" ]
            , input
                [ class "input"
                , type_ "text"
                , placeholder (formatEuroRounded vorschlagVater)
                , value model.haftungsbetragVaterInput
                , onInput (UpdateHaftungsbetragInput Vater)
                ]
                []
            ]
        , div [ class "field" ]
            [ label [ class "label" ] [ text "Mutter (€)" ]
            , input
                [ class "input"
                , type_ "text"
                , placeholder (formatEuroRounded vorschlagMutter)
                , value model.haftungsbetragMutterInput
                , onInput (UpdateHaftungsbetragInput Mutter)
                ]
                []
            ]
        , button
            [ class "button is-primary"
            , type_ "button"
            , onClick (ApplyHaftungsbetraege vaterWert mutterWert Individuell)
            ]
            [ text "Werte Übernehmen" ]
        , p [] [ text "Bitte nutzen Sie diese Funktion nur, wenn Sie einem ausnahmsweisen Sonderfall haben." ]
        ]
