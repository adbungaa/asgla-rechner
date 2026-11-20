module View.Eltern exposing (viewEltern)

import Constants exposing (getSelbstbehalt)
import Html exposing (Html, button, div, h4, input, label, option, p, select, span, text)
import Html.Attributes exposing (attribute, checked, class, classList, disabled, id, name, placeholder, selected, style, type_, value)
import Html.Events exposing (onClick, onInput)
import Types
    exposing
        ( AktionPosten(..)
        , AktionToggleViewComponent(..)
        , AktionUpdateElternDaten(..)
        , Model
        , Msg(..)
        , Person(..)
        , PostenType(..)
        , Selbstbehalt(..)
        , StringFieldType
        )
import Utils.Format exposing (formatEuroRounded, formatInputToFloat, renderSelbstbehaltBetrag, selbstbehaltToString)
import Utils.Validation exposing (validateMoney)
import View.Components exposing (showTooltip, skriptLink, viewEntryActionButtons)



-- Module View Eltern Components
-- View Eltern Eingabefelder


viewEltern : Model -> Person -> Html Msg
viewEltern model p =
    let
        modelPerson =
            case p of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter
    in
    div []
        [ div [ class "columns" ]
            [ div [ class "column is-half" ]
                [ case model.durchschnittseinkommen of
                    True ->
                        div []
                            [ viewEinkommenMonat model "Durchschnittliches Einkommen" p
                            , viewDurchschnittseinkommen model p
                            ]

                    False ->
                        div []
                            [ viewEinkommenMonat model "Haupttätigkeit" p
                            , viewWeitereEinkuenfte model p
                            ]
                ]
            , div [ class "column is-half" ]
                [ div [ class "field asgla-subsection asgla-subcard" ]
                    [ h4 [ class "asgla-subsection-title" ]
                        [ text "Abzüge vom Nettoeinkommen "
                        , span [ class "asgla-optional" ] [ text "optional" ]
                        , showTooltip ("Abzüge sind zum Beispiel Schulden, Beiträge zur Altersvorsorge oder Fahrtkosten zur Arbeit." ++ " Je nach Fall werden berufsbedingte Kosten pauschal oder einzeln berücksichtigt. Tragen Sie hier die Beträge ein, die Sie kennen.")
                        ]
                    , Html.p [ class "asgla-help asgla-help-top" ]
                        [ text "Nur ausfüllen, wenn es solche Posten gibt. Tragen Sie je Posten den Betrag in Euro und eine Bezeichnung ein, z. B. 120 € für Fahrtkosten." ]
                    , viewAbzugsVorlagen p modelPerson.haupttaetigkeit
                    , div
                        [ class "control" ]
                        (List.indexedMap (viewElternPosten Abzugsposten model p) modelPerson.abzugsposten)
                    ]
                ]
            ]
        , div [ class "field" ]
            [ viewSelbstbehalt model p
            ]
        ]


-- Vorlagen für Abzüge (Werte laut Skript: 5 % Pauschale, Fahrtkosten 0,42 €/km)


viewAbzugsVorlagen : Person -> String -> Html Msg
viewAbzugsVorlagen p haupttaetigkeit =
    let
        netto =
            formatInputToFloat haupttaetigkeit |> Maybe.withDefault 0

        pauschale =
            netto * 0.05

        hatEinkommen =
            netto > 0

        pauschaleText =
            if hatEinkommen then
                "5\u{00A0}% Pauschale (" ++ formatEuroRounded pauschale ++ "\u{00A0}€)"

            else
                "5\u{00A0}% Pauschale"
    in
    div [ class "asgla-vorlagen" ]
        [ span [ class "asgla-vorlagen-titel" ]
            [ text "Schnell hinzufügen: "
            , showTooltip "Fahrtkosten gehören zu den berufsbedingten Kosten. In der Regel setzen Sie entweder die 5\u{00A0}%-Pauschale oder die tatsächlichen Fahrtkosten an. Fahrtkosten: 0,42\u{00A0}€ je gefahrenem Kilometer, bei langen Strecken (ab ca. 30\u{00A0}km einfach) meist 0,28\u{00A0}€. Den Betrag tragen Sie selbst ein."
            ]
        , div [ class "asgla-vorlagen-buttons" ]
            [ button
                [ class "button is-small is-light asgla-vorlage"
                , type_ "button"
                , disabled (not hatEinkommen)
                , attribute "title"
                    (if hatEinkommen then
                        "Berufsbedingte Aufwendungen: im Allgemeinen 5 % des Nettoeinkommens"

                     else
                        "Bitte tragen Sie zuerst das Einkommen ein."
                    )
                , onClick (UpdateElternDaten p (ChangePosten (AddAbzugsVorlage "Berufskosten (5 % Pauschale)" (formatEuroRounded pauschale))))
                ]
                [ span [ class "icon is-small" ] [ Html.i [ class "fas fa-percent", attribute "aria-hidden" "true" ] [] ]
                , span [] [ text pauschaleText ]
                ]
            , button
                [ class "button is-small is-light asgla-vorlage"
                , type_ "button"
                , attribute "title" "Pro gefahrenem Kilometer 0,42 € (bei langen Strecken ab ca. 30 km einfach 0,28 €)"
                , onClick (UpdateElternDaten p (ChangePosten (AddAbzugsVorlage "Fahrtkosten (0,42 € je km)" "")))
                ]
                [ span [ class "icon is-small" ] [ Html.i [ class "fas fa-car", attribute "aria-hidden" "true" ] [] ]
                , span [] [ text "Fahrtkosten" ]
                ]
            ]
        ]


viewEinkommenMonat : Model -> String -> Person -> Html Msg
viewEinkommenMonat model textLabel p =
    let
        modelPerson =
            case p of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        -- Nach einem fehlgeschlagenen Berechnen (model.error gesetzt) werden leere Einkommensfelder
        -- rot markiert, solange bei keinem Elternteil ein Einkommen steht.
        einkommenFehlt =
            model.error
                /= Nothing
                && (String.trim modelPerson.haupttaetigkeit == "")
                && not
                    (List.any (\v -> (formatInputToFloat v |> Maybe.withDefault 0) > 0)
                        [ model.vater.haupttaetigkeit, model.mutter.haupttaetigkeit ]
                    )
    in
    div [ class "field", style "margin-top" "1.5rem" ]
        [ label [ class "label" ]
            [ text (textLabel ++ " (€) ")
            , showTooltip "Monatliches Nettoeinkommen aus der Haupttätigkeit (z.B. Gehalt, Lohn)"
            ]
        , div [ class "control" ]
            [ input
                [ classList
                    [ ( "input", True )
                    , ( "is-danger", validateMoney modelPerson.haupttaetigkeit /= Nothing || einkommenFehlt )
                    ]
                , type_ "text"
                , placeholder "z. B. 2500"
                , value modelPerson.haupttaetigkeit
                , onInput
                    (\val ->
                        UpdateElternDaten
                            p
                            (UpdateHaupttaetigkeit val)
                    )
                ]
                []
            , Html.p [ class "asgla-help" ]
                [ text "Das monatliche Netto-Einkommen, also nach Abzug von Steuern und Sozialabgaben. Ungefähre Beträge reichen aus." ]
            , moneyHelp modelPerson.haupttaetigkeit
            ]
        ]


viewWeitereEinkuenfte : Model -> Person -> Html Msg
viewWeitereEinkuenfte model p =
    let
        modelPerson =
            case p of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter
    in
    div [ class "field asgla-subcard" ]
        [ label [ class "label" ]
            [ text "Weitere Einkünfte (€) "
            , span [ class "asgla-optional" ] [ text "optional" ]
            , showTooltip ("Hierzu gehören z.B. Mieteinnahmen, Kapitalerträge, Steuererstattungen (1/12 je Monat), Elterngeld, etc. " ++ "Auch der Vorteil durch mietfreies Wohnen im eigenen Haus ist hier zu berücksichtigen.")
            ]
        , Html.p [ class "asgla-help asgla-help-top" ]
            [ text "Zum Beispiel Mieteinnahmen, Zinsen oder Elterngeld. Steuererstattungen tragen Sie anteilig je Monat ein (1/12)." ]
        , div
            [ class "control" ]
            (List.indexedMap (viewElternPosten WeitereEinkuenfte model p) modelPerson.weitereEinkuenfte)
        ]


viewDurchschnittseinkommen : Model -> Person -> Html Msg
viewDurchschnittseinkommen model p =
    let
        modelPerson =
            case p of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        einkommenWerte =
            modelPerson.einkommenZumDurchschnittsberechnung
                |> List.filterMap (.kosten >> formatInputToFloat)

        durchschnitt =
            if List.isEmpty einkommenWerte then
                Nothing

            else
                Just (List.sum einkommenWerte / toFloat (List.length einkommenWerte))

        hasInvalidEinkommen =
            modelPerson.einkommenZumDurchschnittsberechnung
                |> List.any (.kosten >> validateMoney >> (/=) Nothing)
    in
    if model.durchschnittseinkommen then
        div [ class "field", style "margin-top" "1.5rem" ]
            [ div [ class "box", style "padding" "0.75rem" ]
                [ label [ class "label" ] [ text "Einkommen für die Durchschnittsberechnung" ]
                , div [ class "control" ]
                    (List.indexedMap (viewElternPosten EinkommenzumDurchschnittsberechnung model p) modelPerson.einkommenZumDurchschnittsberechnung)
                , Html.p [ class "help" ]
                    [ text
                        ("Durchschnitt: "
                            ++ (durchschnitt
                                    |> Maybe.map formatEuroRounded
                                    |> Maybe.withDefault "0,00"
                               )
                            ++ " €"
                        )
                    ]
                , button
                    [ class "button is-primary durchschnitt-fertig-button mt-3"
                    , type_ "button"
                    , disabled (durchschnitt == Nothing || hasInvalidEinkommen)
                    , onClick (UpdateElternDaten p ApplyDurchschnittseinkommen)
                    ]
                    [ text "Fertig" ]
                ]
            ]

    else
        text ""


moneyHelp : String -> Html Msg
moneyHelp value =
    case validateMoney value of
        Just message ->
            p [ class "help is-danger" ] [ text message ]

        Nothing ->
            text ""



-- Weitere Einkünfte / Abzugsposten in Type StringFieldType (Kosten, Bezeichnung) Eingabefelder


viewElternPosten : PostenType -> Model -> Person -> Int -> StringFieldType -> Html Msg
viewElternPosten postenType model p index eingabe =
    let
        modelPerson =
            case p of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        typeList =
            case postenType of
                Abzugsposten ->
                    modelPerson.abzugsposten

                WeitereEinkuenfte ->
                    modelPerson.weitereEinkuenfte

                EinkommenzumDurchschnittsberechnung ->
                    modelPerson.einkommenZumDurchschnittsberechnung

        maxPosten =
            case postenType of
                EinkommenzumDurchschnittsberechnung ->
                    12

                _ ->
                    5
    in
    div [ class "entry-row" ]
        [ div [ class "field has-addons entry-controls" ]
            ([ div [ class "control entry-cost" ]
                [ input
                    [ classList
                        [ ( "input", True )
                        , ( "entry-input", True )
                        , ( "is-danger", validateMoney eingabe.kosten /= Nothing )
                        ]
                    , type_ "text"
                    , placeholder "z. B. 150"
                    , attribute "aria-label" "Betrag in Euro"
                    , value eingabe.kosten
                    , onInput (\newKosten -> UpdateElternDaten p (ChangePosten (UpdatePosten postenType index { eingabe | kosten = newKosten })))
                    ]
                    []
                ]
            , div [ class "control is-expanded entry-label" ]
                [ case postenType of
                    WeitereEinkuenfte ->
                        let
                            selectId =
                                case p of
                                    Vater ->
                                        "weitereEinkuenfteVater" ++ String.fromInt index

                                    Mutter ->
                                        "weitereEinkuenfteMutter" ++ String.fromInt index

                            currentBezeichnung =
                                eingabe.bezeichnung
                        in
                        div [ class "select is-fullwidth" ]
                            [ select
                                [ Html.Attributes.attribute "key" selectId -- Add this!
                                , id selectId
                                , class "input entry-input"
                                , value currentBezeichnung
                                , onInput (\newBezeichnung -> UpdateElternDaten p (ChangePosten (UpdatePosten postenType index { eingabe | bezeichnung = newBezeichnung })))
                                ]
                                [ option [ value " ", selected (currentBezeichnung == " ") ] [ text "Bitte wählen" ]
                                , option [ value "Nebentätigkeit", selected (currentBezeichnung == "Nebentätigkeit") ] [ text "Nebentätigkeit" ]
                                , option [ value "Überstundenvergütungen", selected (currentBezeichnung == "Überstundenvergütungen") ] [ text "Überstundenvergütungen" ]
                                , option [ value "Sozialleistungen", selected (currentBezeichnung == "Sozialleistungen") ] [ text "Sozialleistungen" ]
                                , option [ value "Selbstständige Tätigkeit", selected (currentBezeichnung == "Selbstständige Tätigkeit") ] [ text "Selbstständige Tätigkeit" ]
                                , option [ value "1/12 Steuererstattung", selected (currentBezeichnung == "1/12 Steuererstattung") ] [ text "1/12 Steuererstattung" ]
                                , option [ value "Fiktives Einkommen", selected (currentBezeichnung == "Fiktives Einkommen") ] [ text "Fiktives Einkommen" ]
                                , option [ value "Sonstige Einkünfte", selected (currentBezeichnung == "Sonstige Einkünfte") ] [ text "Sonstige Einkünfte" ]
                                ]
                            ]

                    Abzugsposten ->
                        input
                            [ class "input  entry-input"
                            , type_ "text"
                            , placeholder "z. B. Fahrtkosten"
                            , value eingabe.bezeichnung
                            , onInput (\newBezeichnung -> UpdateElternDaten p (ChangePosten (UpdatePosten postenType index { kosten = eingabe.kosten, bezeichnung = newBezeichnung })))
                            ]
                            []

                    EinkommenzumDurchschnittsberechnung ->
                        input
                            [ class "input  entry-input"
                            , type_ "text"
                            , placeholder "z. B. Monat 1"
                            , value eingabe.bezeichnung
                            , onInput (\newBezeichnung -> UpdateElternDaten p (ChangePosten (UpdatePosten postenType index { kosten = eingabe.kosten, bezeichnung = newBezeichnung })))
                            ]
                            []
                ]
            ]
                ++ viewEntryActionButtons
                    { isRemovable = List.length typeList > 1
                    , isAtLimit = List.length typeList >= maxPosten
                    , onRemove = UpdateElternDaten p (ChangePosten (RemovePosten postenType index))
                    , onAdd = UpdateElternDaten p (ChangePosten (AddPosten postenType))
                    }
            )
        , div []
            [ moneyHelp eingabe.kosten
            , if postenType == WeitereEinkuenfte && String.isEmpty (String.trim eingabe.bezeichnung) && not (String.isEmpty (String.trim eingabe.kosten)) then
                Html.p [ class "asgla-art-hinweis" ] [ text "Bitte wählen Sie die Art der Einkunft." ]

              else
                text ""
            ]
        ]



-- Klartext-Erklärung je Selbstbehalt-Option


selbstbehaltErklaerung : Selbstbehalt -> String
selbstbehaltErklaerung typOption =
    case typOption of
        Angemessen _ ->
            "Standard: Dieser Betrag gilt, wenn Sie nichts anderes angeben."

        NotwendigErwerbstaetig _ ->
            "Ein niedrigerer Betrag, z. B. bei geringem Einkommen. Mit dem Häkchen darunter gilt er für nicht erwerbstätige Personen."

        NotwendigNichtErwerbstaetig _ ->
            "Ein niedrigerer Betrag, z. B. bei geringem Einkommen, für nicht erwerbstätige Personen."

        Benutzerdefiniert _ ->
            "Sie tragen einen eigenen Betrag ein."



-- Selbstbehalt view with radio button


viewSelbstbehalt : Model -> Person -> Html Msg
viewSelbstbehalt model person =
    let
        modelPerson =
            case person of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        jahr =
            model.jahr

        selbstbehalt =
            modelPerson.selbstbehalt

        elternText =
            case person of
                Vater ->
                    "den Vater"

                Mutter ->
                    "die Mutter"

        typText =
            case selbstbehalt of
                Angemessen _ ->
                    "der angemessene Selbstbehalt"

                NotwendigNichtErwerbstaetig _ ->
                    "der notwendige Selbstbehalt für nicht erwerbstätige Personen"

                NotwendigErwerbstaetig _ ->
                    "der notwendige Selbstbehalt für erwerbstätige Personen"

                Benutzerdefiniert _ ->
                    "ein benutzerdefinierter Selbstbehalt"
    in
    let
        personClass =
            case person of
                Vater ->
                    "is-vater"

                Mutter ->
                    "is-mutter"
    in
    div
        [ class ("box mt-5 selbstbehalt-box " ++ personClass)
        ]
        [ div [ class "content" ]
            [ p
                [ class "is-size-6"
                , style "color" "#1b3a57"
                ]
                [ text ("Für " ++ elternText ++ " wird ")
                , skriptLink "sockelbetrag" typText
                , text
                    (" von "
                        ++ renderSelbstbehaltBetrag selbstbehalt
                        ++ " € berücksichtigt. (Jahr: "
                        ++ jahr
                        ++ ") "
                    )
                , showTooltip "Der Selbstbehalt ist der Betrag, der den Eltern für den eigenen Lebensbedarf bleibt, bevor sie Unterhalt zahlen."
                ]
            , p [ class "asgla-help" ]
                [ text "Für die meisten Fälle ist die Voreinstellung passend. Ändern Sie sie nur, wenn Sie sicher sind." ]
            ]
        , div [ class "field" ]
            [ div [ class "control" ]
                [ Html.button
                    [ Html.Attributes.type_ "button"
                    , class "button is-primary is-small selbstbehalt-button"
                    , onClick (ToggleView (ToggleSelbstbehaltOptions person))
                    ]
                    [ text "Selbstbehalt ändern" ]
                ]
            ]
        , if modelPerson.showSelbstbehaltOptions then
            let
                radioName =
                    case person of
                        Vater ->
                            "selbstbehaltVater"

                        Mutter ->
                            "selbstbehaltMutter"
            in
            div [ class "field mt-4" ]
                [ div [ class "control" ]
                    (List.map
                        (\typOption ->
                            div [ class "field" ]
                                [ div [ class "control" ]
                                    [ if selbstbehaltTypEqual typOption (NotwendigErwerbstaetig "0") then
                                        div [ class "is-flex is-align-items-center" ]
                                            [ label [ class "radio mr-4" ]
                                                [ input
                                                    [ type_ "radio"
                                                    , name radioName
                                                    , checked (selbstbehaltTypEqual typOption selbstbehalt || (selbstbehaltTypEqual typOption (NotwendigErwerbstaetig "0") && selbstbehaltTypEqual selbstbehalt (NotwendigNichtErwerbstaetig "0")))
                                                    , onClick (UpdateElternDaten person (UpdateSelbstbehalt typOption))
                                                    ]
                                                    []
                                                , text (" " ++ selbstbehaltToString typOption)
                                                ]
                                            , if selbstbehaltTypEqual modelPerson.selbstbehalt (NotwendigErwerbstaetig "0") || selbstbehaltTypEqual modelPerson.selbstbehalt (NotwendigNichtErwerbstaetig "0") then
                                                label [ class "checkbox" ]
                                                    [ input
                                                        [ type_ "checkbox"
                                                        , checked (selbstbehaltTypEqual modelPerson.selbstbehalt (NotwendigNichtErwerbstaetig "0"))
                                                        , onClick
                                                            (if selbstbehaltTypEqual modelPerson.selbstbehalt (NotwendigNichtErwerbstaetig "0") then
                                                                UpdateElternDaten person (UpdateSelbstbehalt (NotwendigErwerbstaetig (getSelbstbehalt jahr "Notwendig")))

                                                             else
                                                                UpdateElternDaten person (UpdateSelbstbehalt (NotwendigNichtErwerbstaetig (getSelbstbehalt jahr "Notwendig (nicht erwerbstätig)")))
                                                            )
                                                        ]
                                                        []
                                                    , text " Nicht Erwerbstätig"
                                                    ]

                                              else
                                                text ""
                                            ]

                                      else
                                        label [ class "radio" ]
                                            [ input
                                                [ type_ "radio"
                                                , name radioName
                                                , checked (selbstbehaltTypEqual typOption selbstbehalt || (selbstbehaltTypEqual typOption (NotwendigErwerbstaetig "0") && selbstbehaltTypEqual selbstbehalt (NotwendigNichtErwerbstaetig "0")))
                                                , onClick (UpdateElternDaten person (UpdateSelbstbehalt typOption))
                                                ]
                                                []
                                            , text (" " ++ selbstbehaltToString typOption)
                                            ]
                                    , p [ class "asgla-help" ] [ text (selbstbehaltErklaerung typOption) ]
                                    ]
                                ]
                        )
                        [ Angemessen "0", NotwendigErwerbstaetig "0", Benutzerdefiniert "0" ]
                        -- Add custom input for Benutzerdefiniert
                        ++ (if selbstbehaltTypEqual modelPerson.selbstbehalt (Benutzerdefiniert "0") then
                                [ div [ class "field mt-3" ]
                                    [ div [ class "control" ]
                                        [ input
                                            [ type_ "text"
                                            , classList
                                                [ ( "input", True )
                                                , ( "is-danger", validateMoney (renderSelbstbehaltBetrag modelPerson.selbstbehalt) /= Nothing )
                                                ]
                                            , placeholder "Betrag in €"
                                            , value (renderSelbstbehaltBetrag modelPerson.selbstbehalt)
                                            , onInput (\val -> UpdateElternDaten person (UpdateSelbstbehalt (Benutzerdefiniert val)))
                                            ]
                                            []
                                        , moneyHelp (renderSelbstbehaltBetrag modelPerson.selbstbehalt)
                                        ]
                                    ]
                                ]

                            else
                                []
                           )
                    )
                ]

          else
            text ""
        ]



-- check Selbstbehalt type option for radio button


selbstbehaltTypEqual : Selbstbehalt -> Selbstbehalt -> Bool
selbstbehaltTypEqual a b =
    case ( a, b ) of
        ( Angemessen _, Angemessen _ ) ->
            True

        ( NotwendigErwerbstaetig _, NotwendigErwerbstaetig _ ) ->
            True

        ( NotwendigNichtErwerbstaetig _, NotwendigNichtErwerbstaetig _ ) ->
            True

        ( Benutzerdefiniert _, Benutzerdefiniert _ ) ->
            True

        _ ->
            False
