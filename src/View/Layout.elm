module View.Layout exposing (tabContent, viewFooter, viewForm, viewHeader)

import Html exposing (Html, a, div, form, h1, h2, i, img, label, li, span, text, textarea, ul)
import Html.Attributes exposing (alt, class, href, placeholder, rel, src, style, target, type_, value)
import Html.Events exposing (onClick, onInput)
import Types exposing (AktionToggleViewComponent(..), AktionUpdate(..), Model, Msg(..), Person(..), Tab(..))
import Utils.Validation exposing (inputAgeOrBirthdayToAge)
import View.Components exposing (saveModal, viewCheckboxDurchschnittseinkommen, viewMonth, viewYear)
import View.Eltern exposing (viewEltern)
import View.Kind exposing (viewKind)



-- View Module für Layout Komponente
-- Hauptansicht des Formulars


viewForm : Model -> Html Msg
viewForm model =
    form
        [ style "margin-top" "2rem" ]
        [ div [ class "columns" ]
            (if model.durchschnittseinkommen then
                [ viewYear "column is-12" model ]

             else
                [ viewMonth "column is-half" model
                , viewYear "column is-half" model
                ]
            )
        , div [ class "columns" ]
            [ div [ class "column is-half" ]
                [ viewCheckboxDurchschnittseinkommen model ]
            ]
        , viewTabs model
        , div [ class "field" ]
            [ label [ class "label", style "margin-top" "2rem" ] [ text "Zusätzliche Informationen" ]
            , div [ class "control" ]
                [ textarea
                    [ class "textarea"
                    , placeholder "Geben Sie hier zusätzliche Informationen oder Anmerkungen ein..."
                    , onInput (Update << UpdateFreitext)
                    , value model.freitext
                    ]
                    []
                ]
            ]
        , if model.modalExportOpen then
            saveModal model

          else
            text ""
        , div [ class "field" ]
            [ if model.durchschnittseinkommen && hasStufensprungAlterAmJahresende model then
                div [ class "notification is-warning is-light" ]
                    [ text "Hinweis: Das Kind ist zum 31.12. des zu berechnenden Jahres 6, 12 oder 18 Jahre alt. Dies bedeutet, im laufenden Jahr liegt ein Stufensprung in der Düsseldorfer Tabelle vor. Aufgrund dessen sind 2 Berechnungen vorzunehmen!" ]

              else
                text ""
            , div
                [ class "is-flex is-justify-content-space-between is-align-items-center"
                , style "margin-bottom" "1rem"
                ]
                [ -- LEFT SIDE
                  div [ class "buttons" ]
                    [ div [ class "control" ]
                        [ Html.button
                            [ class "button is-primary calculate-button"
                            , type_ "button"
                            , onClick (ToggleView ViewErgebnis)
                            ]
                            [ text "Berechnen" ]
                        ]
                    , div [ class "control" ]
                        [ Html.button
                            [ class "button is-primary"
                            , type_ "button"
                            , onClick (ToggleView ToggleSaveModal)
                            ]
                            [ text "Eingabe Zwischenspeichern" ]
                        ]
                    ]
                ]
            ]
        ]


hasStufensprungAlterAmJahresende : Model -> Bool
hasStufensprungAlterAmJahresende model =
    inputAgeOrBirthdayToAge "Dezember" model.jahr model.kind.alterInput
        |> Maybe.map (\alter -> List.member alter [ 6, 12, 18 ])
        |> Maybe.withDefault False



-- Header mit Logo und Titel


viewHeader : Html Msg
viewHeader =
    div [ class "box mb-5" ]
        [ -- DEVELOPMENT WARNING
          -- Comment the following line to remove the development warning before deploying to production (https://asgla-rechner.jtc.uni-halle.de)
          temporaryWarning
        , -- MOBILE VERSION
          --,
          div [ class "is-hidden-tablet" ]
            [ div [ class "columns is-mobile is-vcentered" ]
                [ div [ class "column" ]
                    [ img [ src "assets/JTCLogo_klein.png", alt "JTC Logo", style "max-height" "50px" ] [] ]
                , div [ class "column" ]
                    [ div [ class "has-text-right" ]
                        [ img [ src "assets/MLULogo_klein.png", alt "MLU Logo", style "max-height" "25px" ] []
                        ]
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
                    [ h1 [ class "title is-4 mb-3" ]
                        [ text "ASGLA-Rechner" ]
                    ]
                , div [ class "column" ]
                    [ div [ class "has-text-right", style "margin-top" "0rem" ]
                        [ img [ src "assets/vignette.png", alt "ASGLA-Rechner", style "max-height" "120px" ] []
                        ]
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
                    [ a
                        [ class "button jtc-primary mt-2"
                        , href "https://jtc.uni-halle.de/asgla-rechner/"
                        , target "_blank"
                        , rel "noopener noreferrer"
                        ]
                        [ text "Mehr Informationen" ]
                    ]
                ]
            , div [ class "has-text-centered" ]
                []
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
                    [ h1 [ class "title is-3 mb-4" ]
                        [ text "ASGLA-Rechner" ]
                    , h2 [ class "subtitle is-5 mb-3" ]
                        [ text "Zur Berechnung des Ausgleichsanspruchs für den Unterhalt im Wechselmodell" ]
                    , a
                        [ class "button jtc-primary mt-3"
                        , href "https://jtc.uni-halle.de/asgla-rechner/"
                        , target "_blank"
                        , rel "noopener noreferrer"
                        ]
                        [ text "Mehr Informationen" ]
                    ]
                , div [ class "column is-narrow" ]
                    [ img [ src "assets/vignette.png", alt "Illustration", style "max-height" "200px" ] [] ]
                ]
            ]
        ]


temporaryWarning : Html Msg
temporaryWarning =
    div [ class "notification is-danger is-light mb-4" ]
        [ div
            [ class "is-flex is-align-items-center is-justify-content-space-between"
            , style "gap" "0.75rem"
            , style "flex-wrap" "wrap"
            ]
            [ span []
                [ text "WICHTIGER HINWEIS: " ]
            , text "Bei dem ASGLA-Rechner handelt es sich um ein Projekt des JTC an der Uni Halle. Aufgrund von technischen Problemen ist der Rechner auf dem Uni-Server zurzeit nicht abrufbar. Aus diesem Grund wird der Rechner übergangsweise hier gehostet."
            , text "Der eigentliche Link des Rechners lautet: https://asgla-rechner.jtc.uni-halle.de/"
            , span [] [ text "!!WICHTIG: Bei der Kanzlei Wöhlert handelt es sich NICHT um eine existente Kanzlei, sondern lediglich um eine reservierte Domain für eine geplante Kanzleigründung in der Zukunft. Bei Viselle Wöhlert handelt es sich derzeit NICHT um einen zugelassenen Anwalt!!" ]
            ]
        ]


developmentWarning : Html Msg
developmentWarning =
    div [ class "notification is-danger is-light mb-4" ]
        [ div
            [ class "is-flex is-align-items-center is-justify-content-space-between"
            , style "gap" "0.75rem"
            , style "flex-wrap" "wrap"
            ]
            [ span []
                [ text "Dies ist eine Entwicklungsseite. Bitte nutzen Sie den offiziellen ASGLA-Rechner." ]
            , a
                [ class "button is-danger is-small"
                , href "https://asgla-rechner.jtc.uni-halle.de"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Zum Rechner" ]
            ]
        ]


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
                        [ a
                            [ class "button is-text footer-link"
                            , style "font-size" "14px"
                            , Html.Attributes.href "https://jtc.uni-halle.de/impressum/"
                            , Html.Attributes.target "_blank"
                            , Html.Attributes.rel "noopener noreferrer"
                            ]
                            [ text "Impressum" ]
                        , a
                            [ class "button is-text footer-link"
                            , style "font-size" "14px"
                            , Html.Attributes.href "https://jtc.uni-halle.de/datenschutz/"
                            , Html.Attributes.target "_blank"
                            , Html.Attributes.rel "noopener noreferrer"
                            ]
                            [ text "Datenschutz" ]
                        , a
                            [ class "button is-text footer-link"
                            , style "font-size" "14px"
                            , Html.Attributes.href "https://jtc.uni-halle.de/kontakt/"
                            , Html.Attributes.target "_blank"
                            , Html.Attributes.rel "noopener noreferrer"
                            ]
                            [ text "Kontakt" ]
                        , a
                            [ class "button is-text footer-link"
                            , style "font-size" "14px"
                            , Html.Attributes.href "https://jtc.uni-halle.de/asgla-rechner/"
                            , Html.Attributes.target "_blank"
                            , Html.Attributes.rel "noopener noreferrer"
                            ]
                            [ text "Link zum Projekt" ]
                        ]
                    ]
                ]
            ]
        ]



-- Tab-Ansicht für verschiedene Eingabebereiche
-- main view function for tabs


viewTabs : Model -> Html Msg
viewTabs model =
    div []
        [ -- MOBILE (scrollable) - visible only on small screens
          div [ class "tabs-mobile", style "margin-bottom" "0" ]
            [ div [ class "tabs m-0" ]
                [ ul []
                    [ tabItem Left "Einkünfte Vater" "fas fa-user" model.activeTab
                    , tabItem Middle "Einkünfte Mutter" "fas fa-user" model.activeTab
                    , tabItem Right "Bedarf Kind" "fas fa-child" model.activeTab
                    ]
                ]
            ]

        -- DESKTOP/TABLET (fullwidth)
        , div [ class "tabs-desktop" ]
            [ div [ class "tabs is-fullwidth m-0" ]
                [ ul []
                    [ tabItem Left "Einkünfte Vater" "fas fa-user" model.activeTab
                    , tabItem Middle "Einkünfte Mutter" "fas fa-user" model.activeTab
                    , tabItem Right "Bedarf Kind" "fas fa-child" model.activeTab
                    ]
                ]
            ]

        -- shared tab content
        , tabContent model.activeTab model
        ]



-- Einzelnes Tab-Item styling


tabItem : Tab -> String -> String -> Tab -> Html Msg
tabItem tab label icon active =
    let
        tabColor =
            case tab of
                Left ->
                    "#69a6b4"

                Middle ->
                    "#f9a374"

                Right ->
                    "#bbddc1"

        textColor =
            if tab == active then
                "white"

            else
                "black"

        liStyles =
            [ style "background-color" tabColor
            , style "border-radius" "8px 8px 0 0"
            , style "cursor" "pointer"
            ]
    in
    li (liStyles ++ [ onClick (ToggleView (Select tab)) ])
        [ a [ style "color" textColor ]
            [ span [ class "icon" ] [ i [ class icon, Html.Attributes.attribute "aria-hidden" "true" ] [] ]
            , span [] [ text label ]
            ]
        ]


tabContent : Tab -> Model -> Html Msg
tabContent tab model =
    let
        bgColor =
            case model.activeTab of
                Left ->
                    "rgba(9, 170, 195, 0.5)"

                Middle ->
                    "rgba(249, 163, 116, 0.5)"

                Right ->
                    "rgba(187, 221, 193, 0.5)"

        content =
            case tab of
                Left ->
                    div [ style "padding" "1.5rem" ]
                        [ label [ class "title is-5" ] [ text "Vater - Einkünfte und Abzüge" ]
                        , viewEltern model Vater
                        ]

                Middle ->
                    div [ style "padding" "1.5rem" ]
                        [ label [ class "title is-5" ] [ text "Mutter - Einkünfte und Abzüge" ]
                        , viewEltern model Mutter
                        ]

                Right ->
                    div [ style "padding" "1.5rem" ]
                        [ label [ class "title is-5" ] [ text "Bedarf Kind" ]
                        , viewKind model
                        ]
    in
    div
        [ style "background-color" bgColor
        , style "border-radius" "0 0 8px 8px"
        , style "overflow" "visible"
        , style "color" "black"
        ]
        [ div [ class "p-4" ] [ content ] ]
