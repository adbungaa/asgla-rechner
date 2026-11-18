module View.Eltern exposing (viewEltern)

import Constants exposing (getSelbstbehalt)
import Html exposing (Html, button, div, input, label, option, p, select, text)
import Html.Attributes exposing (checked, class, classList, disabled, id, name, placeholder, selected, style, type_, value)
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
import View.Components exposing (showTooltip, viewEntryActionButtons)



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
                [ div [ class "field", style "margin-top" "1.5rem" ]
                    [ label [ class "label" ]
                        [ text "Abzugsposten "
                        , showTooltip ("Zu den Abzügen vom Nettoeinkommen gehören Schulden (soweit berücksichtigungsfähig) und Belastungen, insb. Altersvorsorge-Leistungen, berufsbedingte Fahrtkosten, etc.)." ++ " Üblicherweise werden 5 % des Nettoeinkommens als pauschale berufsbedingte Aufwendungen abgezogen, soweit höhere Kosten nicht konkret nachgewiesen sind.")
                        ]
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


viewEinkommenMonat : Model -> String -> Person -> Html Msg
viewEinkommenMonat model textLabel p =
    let
        modelPerson =
            case p of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter
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
                    , ( "is-danger", validateMoney modelPerson.haupttaetigkeit /= Nothing )
                    ]
                , type_ "text"
                , placeholder "z.B. 5000"
                , value modelPerson.haupttaetigkeit
                , onInput
                    (\val ->
                        UpdateElternDaten
                            p
                            (UpdateHaupttaetigkeit val)
                    )
                ]
                []
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
    div [ class "field" ]
        [ label [ class "label" ]
            [ text "Weitere Einkünfte (€) "
            , showTooltip ("Hierzu gehören z.B. Mieteinnahmen, Kapitalerträge, Steuererstattungen (1/12 je Monat), Elterngeld, etc. " ++ "Auch der Wohnvorteil durch mietfreies Wohnen im eigenen Heim ist hier zu berücksichtigen.")
            ]
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
                [ label [ class "label" ] [ text "Einkommen zum Durchschnittsberechnung" ]
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
                    [ class "button is-primary"
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
                    , placeholder "Kosten (€)"
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
                            , placeholder "Bezeichnung z.B. Fahrtkosten"
                            , value eingabe.bezeichnung
                            , onInput (\newBezeichnung -> UpdateElternDaten p (ChangePosten (UpdatePosten postenType index { kosten = eingabe.kosten, bezeichnung = newBezeichnung })))
                            ]
                            []

                    EinkommenzumDurchschnittsberechnung ->
                        input
                            [ class "input  entry-input"
                            , type_ "text"
                            , placeholder "Bezeichnung z.B. Monat 1"
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
            [ moneyHelp eingabe.kosten ]
        ]



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
                    "Kindsvater"

                Mutter ->
                    "Kindsmutter"

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
                [ text
                    ("Für den "
                        ++ elternText
                        ++ " wird "
                        ++ typText
                        ++ " von "
                        ++ renderSelbstbehaltBetrag selbstbehalt
                        ++ " € berücksichtigt. (Jahr: "
                        ++ jahr
                        ++ ") "
                    )
                , showTooltip "Der Selbstbehalt ist der Betrag, der dem unterhaltspflichtigen Elternteil mindestens verbleiben muss, um seinen eigenen Lebensunterhalt zu sichern."
                ]
            ]
        , div [ class "field" ]
            [ div [ class "control" ]
                [ Html.button
                    [ Html.Attributes.type_ "button"
                    , class "button is-primary is-small selbstbehalt-button"
                    , onClick (ToggleView (ToggleSelbstbehaltOptions person))
                    ]
                    [ text "Ändern" ]
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
