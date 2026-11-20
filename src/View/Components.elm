module View.Components exposing
    ( cameraScanner
    , importFileSection
    , saveModal
    , showErgebnis
    , showTooltip
    , skriptLink
    , ueberUnsSection
    , viewCheckboxDurchschnittseinkommen
    , viewEntryActionButtons
    , viewMonth
    , viewYear
    )

import Calculation exposing (calculateAusgleichsanspruch)
import Constants exposing (getHoechstbetrag, getKindergeld)
import Html exposing (Html, a, br, button, details, div, h3, h4, header, hr, i, input, label, li, option, p, section, select, span, strong, summary, table, tbody, td, text, textarea, th, thead, tr, ul)
import Html.Attributes exposing (attribute, checked, class, classList, disabled, for, href, id, placeholder, readonly, rows, selected, style, type_, value)
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
        [ label [ class "label", for "monat" ]
            [ text "Monat"
            , span [ class "asgla-required", attribute "aria-hidden" "true" ] [ text " *" ]
            , span [ class "asgla-sr-only" ] [ text " (Pflichtfeld)" ]
            ]
        , div [ class "control" ]
            [ div [ class "select is-fullwidth" ]
                [ select
                    [ id "monat"
                    , onInput (Update << UpdateMonat)
                    , value model.monat
                    ]
                    (List.map (\m -> option [ value m, selected (m == model.monat) ] [ text m ]) monate)
                ]
            ]
        , p [ class "asgla-help" ]
            [ text "Der Monat, für den die Berechnung gelten soll." ]
        ]


viewYear : String -> Model -> Html Msg
viewYear columnClass model =
    div [ class columnClass ]
        [ label [ class "label", for "jahr" ]
            [ text "Jahr"
            , span [ class "asgla-required", attribute "aria-hidden" "true" ] [ text " *" ]
            , span [ class "asgla-sr-only" ] [ text " (Pflichtfeld)" ]
            ]
        , div [ class "control" ]
            [ div [ class "select is-fullwidth" ]
                [ select
                    [ id "jahr"
                    , onInput (Update << UpdateJahr)
                    , value model.jahr
                    ]
                    (List.map (\j -> option [ value j, selected (j == model.jahr) ] [ text j ]) jahre)
                ]
            ]
        , p [ class "asgla-help" ]
            [ text "Das Jahr, in dem die Berechnung gelten soll." ]
        ]


viewCheckboxDurchschnittseinkommen : Model -> Html Msg
viewCheckboxDurchschnittseinkommen model =
    div [ class "field asgla-checkbox-block" ]
        [ div [ class "control" ]
            [ label [ class "checkbox asgla-checkbox" ]
                [ input
                    [ type_ "checkbox"
                    , checked model.durchschnittseinkommen
                    , onClick (ToggleView ToggleDurchschnittseinkommen)
                    ]
                    []
                , span [ class "ml-2" ] [ text "Durchschnitt aus mehreren Monaten berechnen" ]
                ]
            , p [ class "asgla-help" ]
                [ text "Nutzen Sie diese Option, wenn das Einkommen schwankt. Sie tragen dann bei den Einkünften mehrere Monate ein und der Rechner bildet den Durchschnitt." ]
            ]
        ]


skriptLink : String -> String -> Html msg
skriptLink anker label =
    a [ href "#", attribute "data-skript" anker, class "skript-link", attribute "title" "Im Skript nachlesen" ] [ text label ]


showTooltip : String -> Html msg
showTooltip tooltipText =
    span
        [ class "tooltip-container"
        , attribute "tabindex" "0"
        , attribute "aria-label" "Hilfe anzeigen"
        ]
        [ i [ class "fas fa-question-circle", attribute "aria-hidden" "true" ] []
        , span [ class "tooltip-text" ]
            [ text tooltipText ]
        ]


ueberUnsSection : Model -> Html Msg
ueberUnsSection model =
    div [ class "card asgla-ueberuns" ]
        [ header [ class "card-header asgla-ueberuns-header" ]
            [ button
                [ class "asgla-ueberuns-toggle"
                , type_ "button"
                , attribute "aria-expanded" (if model.showUeberUns then "true" else "false")
                , onClick (ToggleView ToggleUeberUns)
                ]
                [ span [ class "asgla-ueberuns-title" ] [ text "Über uns" ]
                , span [ class "asgla-ueberuns-icon" ]
                    [ i
                        [ class
                            ("fas "
                                ++ (if model.showUeberUns then
                                        "fa-angle-up"

                                    else
                                        "fa-angle-down"
                                   )
                            )
                        , attribute "aria-hidden" "true"
                        ]
                        []
                    ]
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
            [ text "Jährlich werden in Deutschland zahlreiche Unterhaltsberechnungen für das Wechselmodell erstellt, und fast jede davon ist eine Herausforderung. Warum? Weil die Berechnung nach den üblichen Berechnungsgrundlagen der Gerichte so komplex ist, dass selbst erfahrene Jurist:innen regelmäßig zum Taschenrechner greifen müssen." ]
        , p []
            [ text "Der digitale Rechner soll Eltern eine erste Einschätzung ihrer finanziellen Situation ermöglichen und Richter:innen sowie Jugendämtern helfen, Berechnungen einheitlich durchzuführen." ]
        , p []
            [ text "Eingaben können über das Menü „Eingabe zwischenspeichern“ als QR-Code oder als Datei gespeichert und später wieder importiert werden." ]
        , h3 [ class "title is-4 mt-5" ] [ text "Hintergrund" ]
        , p []
            [ text "Das Projekt wurde von Steuerrechtler:in Viselle Wöhlert initiiert, die im Januar 2025 einen ersten Python-Prototyp entwickelte." ]
        , p []
            [ text "Seit März 2025 wird sie dabei professionell unterstützt: Adelia Arvinta, Entwickler:in, übernimmt die moderne Webentwicklung in Elm und implementiert nutzerfreundliche Funktionen. Luis Bartsch, Student der Rechtswissenschaften an der Uni Halle und ehemalige wissenschaftliche Hilfskraft des JTC Legal Tech Labs, begleitet die rechtlichen Fragen und die Zusammenarbeit mit Praxispartner:innen." ]
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
    div [ class "asgla-import" ]
        [ div [ class "asgla-import-top" ]
            [ button
                [ class "button asgla-link-button"
                , type_ "button"
                , onClick OpenSkriptPdf
                ]
                [ span [ class "icon" ] [ i [ class "fas fa-book-open", attribute "aria-hidden" "true" ] [] ]
                , span [] [ text "Skript/Anleitung", span [ class "is-sr-only" ] [ text " (öffnet Seitenleiste)" ] ]
                ]
            , details [ class "asgla-import-details" ]
                [ summary [ class "asgla-import-summary" ]
                    [ span [ class "icon" ] [ i [ class "fas fa-file-import", attribute "aria-hidden" "true" ] [] ]
                    , span [] [ text "Gespeicherte Berechnung importieren" ]
                    ]
                ]
            ]
        , div [ class "asgla-import-collapse" ]
            [ div [ class "asgla-import-body" ]
                    [ p [ class "asgla-import-intro" ]
                        [ text "Haben Sie eine Berechnung früher gespeichert (als Datei, QR-Code oder Text)? Dann können Sie sie hier wieder laden, ohne alles neu einzutippen." ]
                    , div [ class "asgla-import-buttons" ]
                        [ button
                            [ class "button is-primary"
                            , type_ "button"
                            , onClick (ImportFile (OpenFile JsonFile))
                            ]
                            [ span [ class "icon" ] [ i [ class "fas fa-file-upload", attribute "aria-hidden" "true" ] [] ]
                            , span [] [ text "Gespeicherte Datei öffnen" ]
                            ]
                        , button
                            [ class "button is-primary"
                            , classList [ ( "is-loading", model.qrIsProcessing ) ]
                            , type_ "button"
                            , onClick (ImportFile (OpenFile ImageFile))
                            , disabled model.qrIsProcessing
                            ]
                            [ span [ class "icon" ] [ i [ class "fas fa-qrcode", attribute "aria-hidden" "true" ] [] ]
                            , span [] [ text "Foto/Bild vom QR-Code öffnen" ]
                            ]
                        , button
                            [ class "button is-primary"
                            , classList [ ( "is-loading", model.qrIsProcessing ) ]
                            , type_ "button"
                            , onClick (CameraScanner OpenCameraContainer)
                            , disabled model.qrIsProcessing
                            ]
                            [ span [ class "icon" ] [ i [ class "fas fa-camera", attribute "aria-hidden" "true" ] [] ]
                            , span [] [ text "QR-Code mit Kamera lesen" ]
                            ]
                        ]
                    , p [ class "asgla-help" ]
                        [ text "Die Datei oder den QR-Code erhalten Sie über „Eingabe zwischenspeichern“." ]
                    , label [ class "label", for "json-import" ] [ text "Gespeicherten Text hier einfügen" ]
                    , textarea
                        [ id "json-import"
                        , class "textarea"
                        , placeholder "Gespeicherten Text hier einfügen"
                        , rows 3
                        , onInput (\input -> ImportFile (QRDecoded input))
                        ]
                        []
                    ]
            ]
        , case model.qrResult of
            Just _ ->
                div [ class "notification is-success asgla-msg" ]
                    [ h4 [ class "title is-5" ] [ text "Datenimport erfolgreich!" ] ]

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
                [ p [ class "mb-4" ]
                    [ text "Speichern Sie Ihre Eingaben, um später weiterzuarbeiten. Sie können sie danach über „Gespeicherte Berechnung importieren“ wieder laden." ]
                , div [ class "field" ]
                    [ p [] [ text "QR Code:" ]
                    , showQRCode model
                    , button [ class "button is-small mr-2", type_ "button", onClick (Export DownloadQrCode) ] [ text "QR-Code als Bild speichern" ]
                    ]
                , div [ class "field", style "margin-top" "1rem" ]
                    [ details []
                        [ summary [ style "cursor" "pointer" ] [ text "Gespeicherten Text anzeigen (zum Kopieren)" ]
                        , textarea [ class "textarea is-family-monospace mt-2", readonly True, value (encodeModeltoQRCode model) ] []
                        , button [ class "button is-small mt-2", type_ "button", onClick (Export CopyJsonToClipboard) ] [ text "Text kopieren" ]
                        ]
                    ]
                , div [ class "field", style "margin-top" "1rem" ]
                    [ button [ class "button is-small", type_ "button", onClick (Export DownloadJson) ] [ text "Als Datei speichern" ]
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
                            "den Vater"

                        Mutter ->
                            "die Mutter"

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
                        ([ row "Einkommen" (formatEuroRounded einkommen ++ "\u{00A0}€")
                         , row "\u{00A0}\u{00A0}Einkünfte aus Haupttätigkeit" (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat modelPerson.haupttaetigkeit)) ++ "\u{00A0}€")
                         , row "\u{00A0}\u{00A0}Weitere Einkünfte Gesamt" (formatEuroRounded weitereEinkuenfte ++ "\u{00A0}€")
                         ]
                            ++ (modelPerson.weitereEinkuenfte
                                    |> List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00")
                                    |> List.map
                                        (\item ->
                                            row
                                                ("\u{00A0}\u{00A0}\u{00A0}\u{00A0}" ++ item.bezeichnung)
                                                (formatEuroRounded (Maybe.withDefault 0.0 (formatInputToFloat item.kosten)) ++ "\u{00A0}€")
                                        )
                               )
                            ++ (row "Abzug Gesamt" (formatEuroRounded gesamtAbzug ++ "\u{00A0}€")
                                    :: (modelPerson.abzugsposten
                                            |> List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00")
                                            |> List.map
                                                (\item ->
                                                    row
                                                        ("\u{00A0}\u{00A0}Abzug " ++ item.bezeichnung)
                                                        (formatEuroRounded (Maybe.withDefault 0.0 (formatInputToFloat item.kosten)) ++ "\u{00A0}€")
                                                )
                                       )
                               )
                            ++ [ row "Bereinigtes Einkommen" (formatEuroRounded bereinigtesEinkommen ++ "\u{00A0}€")
                               , row ("Selbstbehalt (" ++ selbstbehaltText ++ ")") (formatEuroRounded (Maybe.withDefault 0.0 (formatInputToFloat (renderSelbstbehaltBetrag modelPerson.selbstbehalt))) ++ "\u{00A0}€")
                               , row "= verteilbarer Betrag " (formatEuroRounded verteilbarerBetrag ++ "\u{00A0}€")
                               ]
                        )
                    ]
                , p [ class "mt-4" ] [ text ("Für " ++ textPerson ++ " wurde der "), skriptLink "sockelbetrag" selbstbehaltTextMitArtikel, text " berücksichtigt." ]
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
                ++ "\u{00A0}€"

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
                            ++ "\u{00A0}€)"
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
                ++ "\u{00A0}€ "
                ++ ausgleichsanspruchRechenzeichen
                ++ " "
                ++ formatEuroRounded kindergeldBetreuungsanteil
                ++ "\u{00A0}€ = "
                ++ formatEuroRounded ausgleichsanspruchNachAnrechnung
                ++ "\u{00A0}€"

        zahler =
            if ausgleichsanspruchNachAnrechnung < 0 then
                anspruchsberechtigtNachAnrechnung

            else
                nichtAnspruchsberechtigtNachAnrechnung

        empfaenger =
            if ausgleichsanspruchNachAnrechnung < 0 then
                nichtAnspruchsberechtigtNachAnrechnung

            else
                anspruchsberechtigtNachAnrechnung

        zahlbetrag =
            if ausgleichsanspruchNachAnrechnung < 0 then
                toFloat (ceiling (abs ausgleichsanspruchNachAnrechnung))

            else
                toFloat (ceiling ausgleichsanspruchNachAnrechnung)

        hinweisNoetig =
            ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf - ergebnis.verteilbarerBetragGesamt > 0
                || ergebnis.haftungsbetragVaterVorBegrenzung > ergebnis.haftungsbetragVater
                || ergebnis.haftungsbetragMutterVorBegrenzung > ergebnis.haftungsbetragMutter
                || (model.haftungsbetragVaterSpiegel |> Maybe.withDefault 0) > hoechstbetragVater
                || (model.haftungsbetragMutterSpiegel |> Maybe.withDefault 0) > hoechstbetragMutter

    in
    div
        [ class "mt-5", style "margin" "1rem" ]
        [ div [ class "ergebnis-karte" ]
            [ Html.h2 [ class "title is-4 ergebnis-titel" ] [ text "Wer zahlt an wen?" ]
            , div [ class "ergebnis-flow" ]
                [ viewErgebnisPerson "Zahlt" zahler
                , div [ class "ergebnis-mitte" ]
                    [ span [ class "ergebnis-pfeil" ]
                        [ i [ class "fas fa-arrow-right", attribute "aria-hidden" "true" ] [] ]
                    , p [ class "ergebnis-betrag" ] [ text (formatEuroRounded zahlbetrag ++ "\u{00A0}€") ]
                    , p [ class "ergebnis-betrag-label" ] [ text "Ausgleichszahlung pro Monat" ]
                    ]
                , viewErgebnisPerson "Erhält" empfaenger
                ]
            , p [ class "ergebnis-satz" ]
                [ text (nominativMitArtikel zahler ++ " zahlt " ++ dativMitArtikel empfaenger ++ " " ++ formatEuroRounded zahlbetrag ++ "\u{00A0}€ pro Monat.") ]
            , if hinweisNoetig then
                div [ class "notification is-warning is-light ergebnis-hinweis" ]
                    [ p [] [ text "Hinweis: Das Ergebnis oben beruht auf den berechneten Kostenanteilen. Im Rechenweg können Sie prüfen, ob für einen Elternteil eine ", skriptLink "haftungsanteile" "Begrenzung", text " des Anteils in Betracht kommt, und sie bei Bedarf übernehmen." ]
                    ]

              else
                text ""
            , div [ class "ergebnis-kacheln" ]
                [ viewErgebnisKachel "fa-percent" [ text "Haftungsanteil Vater", zusatzKachel ] (formatEuroRounded (ergebnis.haftungsanteilVater * 100) ++ " %")
                , viewErgebnisKachel "fa-percent" [ text "Haftungsanteil Mutter", zusatzKachel ] (formatEuroRounded (ergebnis.haftungsanteilMutter * 100) ++ " %")
                , viewErgebnisKachel "fa-child" [ text "Gesamtbedarf des Kindes" ] (formatEuroRounded ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf ++ "\u{00A0}€")
                ]
            , div [ class "ergebnis-aktion" ]
                [ button
                    [ class "button is-primary"
                    , type_ "button"
                    , onClick (Export ExportPdf)
                    ]
                    [ span [ class "icon" ] [ i [ class "fas fa-download", attribute "aria-hidden" "true" ] [] ]
                    , span [] [ text "PDF exportieren" ]
                    ]
                ]
            ]
        , p [ class "ergebnis-disclaimer" ] [ text "Der Rechner liefert eine Einschätzung und ersetzt keine rechtliche Beratung." ]
        , details
            (class "ergebnis-details" :: (if hinweisNoetig then [ attribute "open" "" ] else []))
            [ summary [ class "button is-primary is-outlined ergebnis-details-summary" ]
                [ span [ class "icon" ] [ i [ class "fas fa-list-ol", attribute "aria-hidden" "true" ] [] ]
                , span [] [ text "Rechenweg im Detail" ]
                , span [ class "icon ergebnis-chevron" ]
                    [ i [ class "fas fa-chevron-down", attribute "aria-hidden" "true" ] [] ]
                ]
            , div [ class "ergebnis-details-inhalt" ]
                [ Html.h2 [ class "title is-4 mb-0" ] [ text "Rechenweg" ]
                , div [ class "columns is-variable is-3" ]
                    [ div [ class "column" ] [ renderPersonSection "Vater" Vater ]
                    , div [ class "column" ] [ renderPersonSection "Mutter" Mutter ]
                    ]
        , p [ class "mt-4" ] [ text ("Relevantes Gesamteinkommen für den Regelbedarf: " ++ formatEuroRounded ergebnis.gesamtEinkommen ++ "\u{00A0}€") ]
        , p [ class "mt-4" ] [ text ("Verteilbarer Betrag Gesamt: " ++ formatEuroRounded ergebnis.verteilbarerBetragGesamt ++ "\u{00A0}€") ]
        , div [ class "columns is-variable is-3" ]
            [ div [ class "column" ]
                [ p [ class "mt-4" ] [ text ("Haftungsanteil Vater: " ++ formatEuroRounded (ergebnis.haftungsanteilVater * 100) ++ "%") ]
                , if ergebnis.haftungsanteilVater == 0 then
                    p [ class "mt-4 has-text-danger" ] [ text "Da der Haftungsanteil des Vaters bei 0 Prozent liegt, berechnet sich der ", skriptLink "regelbedarf-grundbedarf" "Regelbedarf", text " des Kindes allein aufgrund des Einkommens der Mutter." ]

                  else if ergebnis.haftungsanteilMutter == 0 then
                    p [ class "mt-4 has-text-danger" ] [ text "Da der Haftungsanteil der Mutter bei 0 Prozent liegt, berechnet sich der ", skriptLink "regelbedarf-grundbedarf" "Regelbedarf", text " des Kindes allein aufgrund des Einkommens des Vaters." ]

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
                    (formatEuroRounded (Maybe.withDefault 0 ergebnis.regelbedarf) ++ "\u{00A0}€")
                 , row "Zusätzliche Kosten des Kindes" (formatEuroRounded (List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.mehrbedarf) + List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.sonderbedarf)) ++ "\u{00A0}€")
                 , row "davon Mehrbedarf" (formatEuroRounded (List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.mehrbedarf)) ++ "\u{00A0}€")
                 ]
                    -- mehrbedarf list rows
                    ++ List.map
                        (\item -> row ("\u{00A0}\u{00A0}" ++ item.bezeichnung ++ " \u{00A0}\u{00A0} (" ++ (item.bezahltVon |> Maybe.map (\bezahler -> "bezahlt von " ++ personToString bezahler) |> Maybe.withDefault "noch nicht bezahlt") ++ ")") (formatEuroRounded (formatInputToFloat item.kosten |> Maybe.withDefault 0) ++ "\u{00A0}€"))
                        (List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00") model.kind.mehrbedarf)
                    ++ [ row "davon Sonderbedarf" (formatEuroRounded (List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.sonderbedarf)) ++ "\u{00A0}€") ]
                    -- sonderbedarf list rows
                    ++ List.map
                        (\item -> row ("\u{00A0}\u{00A0}" ++ item.bezeichnung ++ "\u{00A0}\u{00A0} (" ++ (item.bezahltVon |> Maybe.map (\bezahler -> "bezahlt von " ++ personToString bezahler) |> Maybe.withDefault "noch nicht bezahlt") ++ ")") (formatEuroRounded (formatInputToFloat item.kosten |> Maybe.withDefault 0) ++ "\u{00A0}€"))
                        (List.filter (\item -> not (String.isEmpty item.kosten) && item.kosten /= "0,00") model.kind.sonderbedarf)
                    ++ (if not (List.isEmpty kindEinkuenftePositionen) then
                            [ rowWithLines kindEinkuenfteZeilen (formatEuroRounded anzurechnendeKindEinkuenfte ++ "\u{00A0}€") ]

                        else
                            []
                       )
                    ++ [ row "Abzug hälftiges Kindergeld" (formatEuroRounded (toFloat (getKindergeld model.jahr) / 2) ++ "\u{00A0}€")
                       , row "Gesamtbedarf" (formatEuroRounded ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf ++ "\u{00A0}€")
                       ]
                )
            ]
        , hr [] []

        -- , h4 [ class "title is-5 mt-5" ] [ text "Anteile ohne getragene Zusatzbedarfe" ]
        , div [ class "columns is-variable is-3 mt-4" ]
            [ div [ class "column" ]
                [ p [] [ text ("Anteil Vater am Gesamtbedarf: " ++ formatEuroRounded ergebnis.haftungsbetragVater ++ "\u{00A0}€") ]
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
                [ p [] [ text ("Anteil Mutter am Gesamtbedarf: " ++ formatEuroRounded ergebnis.haftungsbetragMutter ++ "\u{00A0}€") ]
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
                [ p [ style "color" "#ff0000", class "has-text-centered" ] [ text ("Ungedeckter Kindsbedarf: " ++ formatEuroRounded (ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf - ergebnis.verteilbarerBetragGesamt) ++ "\u{00A0}€") ]
                , div [ class "notification mt-4" ]
                    [ p []
                        [ text "Hinweis: Der Bedarf des Kindes ist höher als der verteilbare Betrag."
                        , case model.vater.selbstbehalt of
                            Angemessen _ ->
                                span []
                                    [ text " Es sollte gegebenenfalls in Erwägung gezogen werden, statt des angemessenen "
                                    , skriptLink "sockelbetrag" "Selbstbehalts"
                                    , text " den notwendigen Selbstbehalt anzusetzen."
                                    ]

                            _ ->
                                text " Da der Bedarf des Kindes nicht durch die Eltern gedeckt werden kann, sollte geprüft werden, ob Ergänzen weitere finanzielle Unterstützungsmöglichkeiten in Anspruch genommen werden können, z. B. durch die Inanspruchnahme sozialrechtlicher Leistungen."
                        ]
                    ]
                ]

          else
            text ""
        , viewZusatzbedarfLeistungen model ergebnis
        , p [ class "mt-4" ] [ text ("Differenz: " ++ formatEuroRounded differenzNachAnrechnung ++ "\u{00A0}€") ]
        , p [ class "mt-4" ] [ text ("Auszugleichender Betrag (1/2) von " ++ personToString nichtAnspruchsberechtigtNachAnrechnung ++ " zu leisten an " ++ personToString anspruchsberechtigtNachAnrechnung ++ ": " ++ formatEuroRounded auszugleichenderBetragNachAnrechnung ++ "\u{00A0}€") ]
        , h4 [ class "title is-5 mt-5" ] [ text "Kindergeldverrechnung " ]
        , table [ class "table is-striped is-bordered is-hoverable is-fullwidth" ]
            [ thead []
                [ header "Bezeichnung" "Betrag"
                ]
            , tbody []
                [ row "Kindergeld" (formatEuroRounded (toFloat (getKindergeld model.jahr)) ++ "\u{00A0}€")
                , row "Kindergeldempfänger" (personToString model.kindergeldEmpfaenger)
                , row "Betreuungsanteil Mutter" (formatEuroRounded ergebnis.betreuungsanteil ++ "\u{00A0}€")
                , row "Baranteil Mutter" (formatEuroRounded ergebnis.baranteilMutter ++ "\u{00A0}€")
                , row "Betreuungsanteil Vater" (formatEuroRounded ergebnis.betreuungsanteil ++ "\u{00A0}€")
                , row "Baranteil Vater" (formatEuroRounded ergebnis.baranteilVater ++ "\u{00A0}€")
                ]
            ]
        , p [ class "mt-4" ] [ text "Durch den Abzug des hälftigen Kindergeldes vom Bedarf wurde der Baranteil bereits abgegolten. Verbleibend ist allein die Verrechnung des ", skriptLink "kindergeldverrechnung" "Betreuungsanteils", text (" in Höhe von " ++ formatEuroRounded kindergeldBetreuungsanteil ++ "\u{00A0}€ von " ++ personToString model.kindergeldEmpfaenger ++ " an " ++ personToString nichtKindergeldEmpfänger ++ ": ") ]
        , table [ class "table is-striped is-bordered is-hoverable is-fullwidth mt-4" ]
            [ thead []
                [ header "Zwischenschritt" "Betrag"
                ]
            , tbody []
                [ row "Auszugleichender Betrag (1/2)" (formatEuroRounded auszugleichenderBetragNachAnrechnung ++ "\u{00A0}€")
                , row ("Betreuungsanteil Kindergeld von " ++ personToString model.kindergeldEmpfaenger ++ " an " ++ personToString nichtKindergeldEmpfänger) (ausgleichsanspruchRechenzeichen ++ " " ++ formatEuroRounded kindergeldBetreuungsanteil ++ "\u{00A0}€")
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
            [ text ("Daher insgesamt von " ++ personToString zahler ++ " an " ++ personToString empfaenger ++ " zu leistende Ausgleichszahlung: " ++ formatEuroRounded zahlbetrag ++ "\u{00A0}€")
            ]
                , details [ class "ergebnis-glossar" ]
                    [ summary [] [ text "Begriffe kurz erklärt" ]
                    , Html.dl []
                        [ Html.dt [] [ text "Ausgleichszahlung" ]
                        , Html.dd [] [ text "Betrag, den ein Elternteil dem anderen monatlich zahlt, damit die Kosten des Kindes fair verteilt sind." ]
                        , Html.dt [] [ text "Bedarf des Kindes" ]
                        , Html.dd [] [ text "Die monatlichen Kosten des Kindes." ]
                        , Html.dt [] [ skriptLink "sockelbetrag" "Selbstbehalt" ]
                        , Html.dd [] [ text "Betrag, der einem Elternteil für den eigenen Lebensunterhalt bleibt." ]
                        , Html.dt [] [ skriptLink "bereinigtes-einkommen" "Bereinigtes Einkommen" ]
                        , Html.dd [] [ text "Einkommen nach Abzügen." ]
                        , Html.dt [] [ skriptLink "haftungsanteile" "Haftungsanteil" ]
                        , Html.dd [] [ text "Anteil an den Kosten des Kindes, den ein Elternteil nach seinem Einkommen trägt." ]
                        , Html.dt [] [ skriptLink "kindergeldverrechnung" "Betreuungsanteil / Baranteil" ]
                        , Html.dd [] [ text "Betreuungsanteil: der Anteil, den ein Elternteil durch Zeit mit dem Kind leistet. Baranteil: der Anteil, den er mit Geld leistet." ]
                        , Html.dt [] [ skriptLink "kindergeldverrechnung" "Kindergeldverrechnung" ]
                        , Html.dd [] [ text "Das Kindergeld wird zwischen den Eltern angerechnet, weil es nur an eine Person gezahlt wird." ]
                        , Html.dt [] [ skriptLink "haftungsanteile" "Begrenzung" ]
                        , Html.dd [] [ text "Der Anteil wird auf einen Höchstbetrag beschränkt." ]
                        ]
                    ]
                ]
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
        ]


viewErgebnisPerson : String -> Person -> Html msg
viewErgebnisPerson rolle person =
    let
        klasse =
            case person of
                Vater ->
                    "vater"

                Mutter ->
                    "mutter"
    in
    div [ class ("ergebnis-person ergebnis-person--" ++ klasse) ]
        [ p [ class "ergebnis-person-rolle" ] [ text rolle ]
        , span [ class "ergebnis-person-icon" ] [ i [ class "fas fa-user", attribute "aria-hidden" "true" ] [] ]
        , p [ class "ergebnis-person-name" ] [ text (personToString person) ]
        ]


nominativMitArtikel : Person -> String
nominativMitArtikel person =
    case person of
        Vater ->
            "Der Vater"

        Mutter ->
            "Die Mutter"


dativMitArtikel : Person -> String
dativMitArtikel person =
    case person of
        Vater ->
            "dem Vater"

        Mutter ->
            "der Mutter"


zusatzKachel : Html msg
zusatzKachel =
    span [ style "display" "block", style "font-size" "0.8em", style "font-weight" "400" ]
        [ text "Anteil an den Kosten des Kindes" ]


viewErgebnisKachel : String -> List (Html msg) -> String -> Html msg
viewErgebnisKachel icon labelInhalt wert =
    div [ class "ergebnis-kachel" ]
        [ span [ class "ergebnis-kachel-icon" ] [ i [ class ("fas " ++ icon), attribute "aria-hidden" "true" ] [] ]
        , div []
            [ p [ class "ergebnis-kachel-label" ] labelInhalt
            , p [ class "ergebnis-kachel-wert" ] [ text wert ]
            ]
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
                    ++ "\u{00A0}€ übersteigt den verteilbaren Betrag von "
                    ++ formatEuroRounded verteilbarerBetrag
                    ++ "\u{00A0}€. Der Haftungsbetrag wurde entsprechend begrenzt."
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
                    "Vater"

                Mutter ->
                    "Mutter"

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
            [ text ("Der Haftungsbetrag von " ++ elternText ++ " (" ++ formatEuroRounded spiegelWert ++ "\u{00A0}€) ist höher als der Zahlungsbetrag, der im ")
            , skriptLink "haftungsanteile" "Residenzmodell"
            , text (" (Kind lebt überwiegend bei einem Elternteil) zu leisten wäre. Eine Begrenzung des Haftungsanteils auf diesen Zahlungsbetrag kommt daher in Betracht. (Haftungsanteil = der Teil der Kosten des Kindes, den ein Elternteil nach seinem Einkommen trägt)")
            , p [ class "mt-2" ] [ text ("Möglicher Anteil von " ++ elternText ++ " bei Begrenzung: " ++ formatEuroRounded (Maybe.withDefault 0 hoechstbetrag) ++ "\u{00A0}€ (noch nicht angewendet)") ]
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
                        ++ "\u{00A0}€"
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
                        [ strong [] [ text ("Summe: " ++ formatEuroRounded paidByVater ++ "\u{00A0}€") ]
                        ]
                    , td []
                        [ strong [] [ text ("Summe: " ++ formatEuroRounded paidByMutter ++ "\u{00A0}€") ]
                        ]
                    ]
                , tr []
                    [ td [] [ text "Anrechnung hälftiges Kindergeld beim Kindergeldempfänger: " ]
                    , td [] [ text "Anrechnung hälftiges Kindergeld beim Kindergeldempfänger: " ]
                    ]
                , tr []
                    [ td [] [ text ("" ++ formatEuroRounded ergebnis.haftungsbetragVater ++ " - " ++ formatEuroRounded paidByVater ++ " + " ++ formatEuroRounded abzugVater ++ " = " ++ formatEuroRounded ergebnis.anteilVaterGesamtbedarf ++ "\u{00A0}€") ]
                    , td [] [ text ("" ++ formatEuroRounded ergebnis.haftungsbetragMutter ++ " - " ++ formatEuroRounded paidByMutter ++ " + " ++ formatEuroRounded abzugMutter ++ " = " ++ formatEuroRounded ergebnis.anteilMutterGesamtbedarf ++ "\u{00A0}€") ]
                    ]
                , tr []
                    [ td [] [ text ("Haftungsbetrag nach Anrechnung " ++ personToString Vater ++ ": " ++ formatEuroRounded ergebnis.anteilVaterGesamtbedarf ++ "\u{00A0}€") ]
                    , td [] [ text ("Haftungsbetrag nach Anrechnung " ++ personToString Mutter ++ ": " ++ formatEuroRounded ergebnis.anteilMutterGesamtbedarf ++ "\u{00A0}€") ]
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
        , p [] [ text "Bitte nutzen Sie diese Funktion nur, wenn bei Ihnen ein Sonderfall vorliegt." ]
        ]


viewEntryActionButtons : { isRemovable : Bool, isAtLimit : Bool, onRemove : msg, onAdd : msg } -> List (Html msg)
viewEntryActionButtons { isRemovable, isAtLimit, onRemove, onAdd } =
    [ if isRemovable then
        div [ class "control entry-remove-control" ]
            [ button
                [ class "button is-light entry-action entry-remove"
                , onClick onRemove
                , type_ "button"
                , attribute "aria-label" "Zeile entfernen"
                ]
                [ text "-" ]
            ]

      else
        text ""
    , div [ class "control entry-add-control" ]
        [ button
            [ class "button is-primary entry-action entry-add"
            , type_ "button"
            , disabled isAtLimit
            , onClick onAdd
            , attribute "aria-label" "Zeile hinzufügen"
            ]
            [ text "+" ]
        ]
    ]
