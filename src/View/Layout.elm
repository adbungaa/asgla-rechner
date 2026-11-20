module View.Layout exposing (tabContent, viewFooter, viewForm, viewHeader)

import Html exposing (Html, a, button, div, form, h1, h2, h3, h4, header, i, img, label, li, ol, p, section, span, text, textarea)
import Html.Attributes exposing (alt, attribute, class, classList, for, href, id, placeholder, rel, rows, src, style, target, type_, value)
import Html.Events exposing (onClick, onInput)
import Types exposing (AktionToggleViewComponent(..), AktionUpdate(..), Model, Msg(..), Person(..), Tab(..))
import Utils.Format exposing (formatInputToFloat)
import Utils.Validation exposing (inputAgeOrBirthdayToAge, validateAgeOrBirthday)
import View.Components exposing (saveModal, viewCheckboxDurchschnittseinkommen, viewMonth, viewYear)
import View.Eltern exposing (viewEltern)
import View.Kind exposing (viewKind)



-- View Module für Layout Komponente
-- Hauptansicht des Formulars: Zeitraum (Schritt 1), Einkünfte der Eltern (Schritt 2),
-- Bedarf des Kindes (Schritt 3), danach Berechnen / Zwischenspeichern


viewForm : Model -> Html Msg
viewForm model =
    form [ class "asgla-form" ]
        [ p [ class "asgla-hinweis" ]
            [ text "Felder mit * sind Pflichtfelder. Felder mit „optional“ dürfen leer bleiben." ]
        , viewSchritt "1"
            "Zeitraum wählen"
            "Wählen Sie den Monat und das Jahr der Berechnung. Bei der Durchschnittsberechnung zählt nur das Jahr."
            [ div [ class "columns is-multiline" ]
                (if model.durchschnittseinkommen then
                    [ viewYear "column is-12" model ]

                 else
                    [ viewMonth "column is-half" model
                    , viewYear "column is-half" model
                    ]
                )
            , div [ class "columns" ]
                [ div [ class "column is-full" ]
                    [ viewCheckboxDurchschnittseinkommen model ]
                ]
            ]
        , viewSchrittFuerTab model
        , div [ class "asgla-freitext" ]
            [ label [ class "label", for "freitext" ]
                [ text "Zusätzliche Informationen"
                , span [ class "asgla-optional" ] [ text "optional" ]
                ]
            , p [ class "asgla-help" ]
                [ text "Zum Beispiel Hinweise zu besonderen Umständen." ]
            , textarea
                [ id "freitext"
                , class "textarea"
                , rows 3
                , placeholder "Ihre Anmerkungen"
                , onInput (Update << UpdateFreitext)
                , value model.freitext
                ]
                []
            ]
        , if model.modalExportOpen then
            saveModal model

          else
            text ""
        , if model.durchschnittseinkommen && hasStufensprungAlterAmJahresende model then
            div [ class "notification is-warning is-light asgla-stufensprung" ]
                [ text "Hinweis: Das Kind ist zum 31.12. des zu berechnenden Jahres 6, 12 oder 18 Jahre alt. Dies bedeutet, im laufenden Jahr liegt ein Stufensprung beim Bedarf des Kindes vor. Aufgrund dessen sind 2 Berechnungen vorzunehmen!" ]

          else
            text ""
        , case model.error of
            Just errorMsg ->
                div [ class "notification form-error", attribute "role" "alert" ]
                    [ h4 [ class "title is-5" ] [ text "Bitte prüfen Sie Ihre Eingaben" ]
                    , p [] [ text errorMsg ]
                    ]

            Nothing ->
                text ""
        , viewFortschritt model
        , p [ class "asgla-disclaimer" ] [ text "Der Rechner liefert eine Einschätzung und ersetzt keine rechtliche Beratung." ]
        , div [ class "asgla-actions" ]
            [ button
                [ class "button calculate-button"
                , type_ "button"
                , onClick (ToggleView ViewErgebnis)
                ]
                [ span [ class "icon" ] [ i [ class "fas fa-calculator", attribute "aria-hidden" "true" ] [] ]
                , span [] [ text "Berechnen" ]
                ]
            , button
                [ class "button save-button"
                , type_ "button"
                , onClick (ToggleView ToggleSaveModal)
                , attribute "title" "Speichert Ihre Eingaben als Datei oder QR-Code, damit Sie später weiterarbeiten können."
                ]
                [ span [ class "icon" ] [ i [ class "fas fa-floppy-disk", attribute "aria-hidden" "true" ] [] ]
                , span [] [ text "Eingabe zwischenspeichern" ]
                ]
            ]
        ]


{-| Fortschrittsanzeige vor dem Berechnen-Button: zeigt, was noch fehlt.
-}
viewFortschritt : Model -> Html Msg
viewFortschritt model =
    let
        hatEinkommen =
            [ model.vater.haupttaetigkeit, model.mutter.haupttaetigkeit ]
                |> List.filterMap formatInputToFloat
                |> List.any (\v -> v > 0)

        hatAlter =
            validateAgeOrBirthday model.kind.alterInput == Nothing

        punkte =
            [ ( True, "Zeitraum gewählt", "" )
            , ( hatEinkommen, "Einkommen eingetragen", "Einkommen von Vater oder Mutter eintragen (Reiter „Vater“ oder „Mutter“)" )
            , ( hatAlter, "Alter des Kindes eingetragen", "Alter des Kindes eintragen (Reiter „Kind“)" )
            ]

        fehlend =
            List.filter (\( ok, _, _ ) -> not ok) punkte
    in
    div [ class "asgla-fortschritt", attribute "aria-live" "polite" ]
        [ p [ class "asgla-fortschritt-titel" ]
            [ text
                (if List.isEmpty fehlend then
                    "Alles ausgefüllt. Sie können jetzt berechnen."

                 else
                    "Vor dem Berechnen fehlt noch:"
                )
            ]
        , Html.ul [ class "asgla-fortschritt-liste" ]
            (List.map
                (\( ok, erledigt, offen ) ->
                    li [ classList [ ( "is-done", ok ), ( "is-open", not ok ) ] ]
                        [ span [ class "asgla-fortschritt-icon", attribute "aria-hidden" "true" ]
                            [ i [ class (if ok then "fas fa-circle-check" else "far fa-circle") ] [] ]
                        , text (if ok then erledigt else offen)
                        ]
                )
                punkte
            )
        ]


{-| Schrittkarte für die Reiter: Vater/Mutter = Schritt 2, Kind = Schritt 3.
-}
viewSchrittFuerTab : Model -> Html Msg
viewSchrittFuerTab model =
    case model.activeTab of
        Right ->
            viewSchritt "3"
                "Bedarf des Kindes eintragen"
                "Tragen Sie das Alter des Kindes ein. Zusätzliche Kosten sind optional."
                [ viewTabs model ]

        _ ->
            viewSchritt "2"
                "Einkünfte der Eltern eintragen"
                "Tragen Sie das monatliche Netto-Einkommen von Vater und Mutter ein. Ungefähre Beträge reichen aus."
                [ viewTabs model ]


{-| Ein nummerierter Abschnitt mit Überschrift und Hilfesatz in einfacher Sprache.
-}
viewSchritt : String -> String -> String -> List (Html Msg) -> Html Msg
viewSchritt nummer titel hilfe inhalt =
    section [ class "asgla-step" ]
        [ div [ class "asgla-step-header" ]
            [ span [ class "asgla-step-number", attribute "aria-hidden" "true" ] [ text nummer ]
            , div []
                [ h2 [ class "asgla-step-title" ] [ text titel ]
                , p [ class "asgla-step-help" ] [ text hilfe ]
                ]
            ]
        , div [] inhalt
        ]


hasStufensprungAlterAmJahresende : Model -> Bool
hasStufensprungAlterAmJahresende model =
    inputAgeOrBirthdayToAge "Dezember" model.jahr model.kind.alterInput
        |> Maybe.map (\alter -> List.member alter [ 6, 12, 18 ])
        |> Maybe.withDefault False



-- Kopfbereich: Logos, Titel, Untertitel, Link, Schrittleiste


viewHeader : Html Msg
viewHeader =
    header [ class "box mb-5 asgla-header" ]
        [ -- MOBILE VERSION
          div [ class "is-hidden-tablet" ]
            [ div [ class "columns is-mobile is-vcentered" ]
                [ div [ class "column" ]
                    [ img [ src "assets/JTCLogo_klein.png", alt "JTC Logo", style "max-height" "50px" ] [] ]
                , div [ class "column" ]
                    [ div [ class "has-text-right" ]
                        [ img [ src "assets/MLULogo_klein.png", alt "MLU Logo", style "max-height" "25px" ] [] ]
                    ]
                ]
            , div [ class "columns is-mobile has-text-right", style "margin-top" "-3rem" ]
                [ div [ class "column" ]
                    [ div [ class "has-text-right", style "font-size" "0.8rem" ]
                        [ text "Finanziert von der Europäischen Union 🇪🇺" ]
                    ]
                ]
            , div [ class "columns is-mobile is-vcentered" ]
                [ div [ class "column is-8" ]
                    [ h1 [ class "title is-4 mb-3" ] [ text "ASGLA-Rechner" ] ]
                , div [ class "column" ]
                    [ div [ class "has-text-right" ]
                        [ img [ src "assets/vignette.png", alt "", style "max-height" "120px" ] [] ]
                    ]
                ]
            , div [ class "columns is-mobile" ]
                [ div [ class "column", style "margin-top" "-2rem" ]
                    [ h2 [ class "subtitle is-6 mb-3" ]
                        [ text "Zur Berechnung des Ausgleichsanspruchs für den Unterhalt im Wechselmodell" ]
                    ]
                ]
            , div [ class "columns is-mobile" ]
                [ div [ class "column", style "margin-top" "-2rem" ]
                    [ infoButton ]
                ]
            ]

        -- DESKTOP VERSION
        , div [ class "is-hidden-mobile" ]
            [ div [ class "columns is-vcentered", style "margin-bottom" "1rem" ]
                [ div [ class "column " ]
                    [ img [ src "assets/JTCLogo.png", alt "JTC Logo", style "max-height" "100px" ] [] ]
                , div [ class "column" ]
                    [ div [ class "has-text-right" ]
                        [ div [ style "margin-bottom" "0.5rem" ]
                            [ img [ src "assets/MLULogo.png", alt "MLU Logo", style "max-height" "35px" ] [] ]
                        , div [ style "font-size" "0.9rem" ]
                            [ text "Finanziert von der Europäischen Union 🇪🇺" ]
                        ]
                    ]
                ]
            , div [ class "columns is-vcentered", style "padding" "1rem" ]
                [ div [ class "column" ]
                    [ h1 [ class "title is-3 mb-4" ] [ text "ASGLA-Rechner" ]
                    , h2 [ class "subtitle is-5 mb-3" ]
                        [ text "Zur Berechnung des Ausgleichsanspruchs für den Unterhalt im Wechselmodell" ]
                    , div [ class "mt-3" ] [ infoButton ]
                    ]
                , div [ class "column is-narrow" ]
                    [ img [ src "assets/vignette.png", alt "", style "max-height" "200px" ] [] ]
                ]
            ]

        -- Schrittleiste (einmalig, gilt für beide Ansichten)
        , div [ class "asgla-so-gehts" ]
            [ p [ class "asgla-so-gehts-title" ] [ text "So geht’s:" ]
            , ol [ class "asgla-steps" ]
                [ viewSchrittLeiste "1" "fa-calendar-days" "Zeitraum wählen"
                , viewSchrittLeiste "2" "fa-euro-sign" "Einkünfte der Eltern"
                , viewSchrittLeiste "3" "fa-child" "Bedarf des Kindes"
                , viewSchrittLeiste "" "fa-calculator" "Berechnen"
                ]
            ]
        ]


infoButton : Html Msg
infoButton =
    a
        [ class "button jtc-primary"
        , href "https://jtc.uni-halle.de/asgla-rechner/"
        , target "_blank"
        , rel "noopener noreferrer"
        ]
        [ text "Mehr Informationen", externerHinweis ]


viewSchrittLeiste : String -> String -> String -> Html Msg
viewSchrittLeiste nummer icon titel =
    li [ class "asgla-step-chip" ]
        [ span [ class "asgla-step-chip-nr" ] [ text nummer ]
        , i [ class ("fas " ++ icon), attribute "aria-hidden" "true" ] []
        , span [] [ text titel ]
        ]



-- Kennzeichnung externer Links (nur für Screenreader)


externerHinweis : Html msg
externerHinweis =
    span [ class "is-sr-only" ] [ text " (öffnet in neuem Tab)" ]


footerLink : String -> String -> Html Msg
footerLink url titel =
    a
        [ class "button is-text footer-link"
        , style "font-size" "14px"
        , href url
        , target "_blank"
        , rel "noopener noreferrer"
        ]
        [ text titel, externerHinweis ]


viewFooter : Html Msg
viewFooter =
    div
        [ style "background-color" "#000000"
        , style "color" "#ffffff"
        , style "width" "100%"
        ]
        [ div [ class "container" ]
            [ div [ class "columns is-vcentered is-mobile", style "flex-wrap" "wrap" ]
                [ -- Left side: JTC Logo
                  img
                    [ src "assets/JTCLogo.png"
                    , alt "JTC Logo"
                    , style "max-height" "30px"
                    , style "filter" "brightness(0) invert(1)"
                    , style "margin-left" "2rem"
                    ]
                    []
                , -- Right side: Footer Links
                  div [ class "column" ]
                    [ div [ class "buttons is-pulled-right", style "font-size" "0rem" ]
                        [ footerLink "https://jtc.uni-halle.de/impressum/" "Impressum"
                        , footerLink "https://jtc.uni-halle.de/datenschutz/" "Datenschutz"
                        , footerLink "https://jtc.uni-halle.de/kontakt/" "Kontakt"
                        , footerLink "https://jtc.uni-halle.de/asgla-rechner/" "Link zum Projekt"
                        ]
                    ]
                ]
            ]
        ]



-- Tabs für Vater, Mutter und Kind (alle drei müssen ausgefüllt werden)


viewTabs : Model -> Html Msg
viewTabs model =
    div []
        [ p [ class "asgla-tabs-hint" ]
            [ i [ class "fas fa-circle-info", attribute "aria-hidden" "true" ] []
            , text " Bitte füllen Sie alle drei Reiter aus: Vater und Mutter (Schritt 2) sowie das Kind (Schritt 3)."
            ]
        , div
            [ class "asgla-tabs"
            , attribute "role" "tablist"
            , attribute "aria-label" "Eingabebereiche"
            ]
            [ tabButton Left "Einkünfte " "Vater" "fa-user" model.activeTab
            , tabButton Middle "Einkünfte " "Mutter" "fa-user" model.activeTab
            , tabButton Right "Bedarf " "Kind" "fa-child" model.activeTab
            ]
        , tabContent model.activeTab model
        ]


tabButton : Tab -> String -> String -> String -> Tab -> Html Msg
tabButton tab prefix titel icon aktiv =
    let
        istAktiv =
            tab == aktiv
    in
    button
        [ type_ "button"
        , class ("asgla-tab " ++ accentKlasse tab)
        , classList [ ( "is-active", istAktiv ) ]
        , attribute "role" "tab"
        , attribute "aria-selected"
            (if istAktiv then
                "true"

             else
                "false"
            )
        , onClick (ToggleView (Select tab))
        ]
        [ span [ class "icon asgla-tab-icon" ] [ i [ class ("fas " ++ icon), attribute "aria-hidden" "true" ] [] ]
        , span [ class "asgla-tab-text" ]
            [ span [ class "asgla-tab-prefix" ] [ text prefix ]
            , text titel
            ]
        ]


accentKlasse : Tab -> String
accentKlasse tab =
    case tab of
        Left ->
            "asgla-accent-vater"

        Middle ->
            "asgla-accent-mutter"

        Right ->
            "asgla-accent-kind"


tabContent : Tab -> Model -> Html Msg
tabContent tab model =
    div [ class ("asgla-panel " ++ accentKlasse tab) ]
        [ case tab of
            Left ->
                div []
                    [ h3 [ class "asgla-panel-title" ] [ text "Vater - Einkünfte und Abzüge" ]
                    , viewEltern model Vater
                    ]

            Middle ->
                div []
                    [ h3 [ class "asgla-panel-title" ] [ text "Mutter - Einkünfte und Abzüge" ]
                    , viewEltern model Mutter
                    ]

            Right ->
                div []
                    [ viewKind model
                    ]
        ]
