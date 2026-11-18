module View.Kind exposing (viewKind)

import Html exposing (Html, button, div, input, label, option, p, select, span, text)
import Html.Attributes exposing (checked, class, classList, name, placeholder, selected, style, type_, value)
import Html.Events exposing (onClick, onInput)
import Types
    exposing
        ( AktionBedarf(..)
        , AktionToggleViewComponent(..)
        , AktionUpdate(..)
        , AktionUpdateKind(..)
        , BedarfsTyp(..)
        , Model
        , Msg(..)
        , Person(..)
        , StringFieldType
        , ZusatzbedarfTyp
        )
import Utils.Format exposing (personToString, stringToPerson)
import Utils.Validation exposing (validateAgeOrBirthday, validateMoney, validateRequiredMoney)
import View.Components exposing (showTooltip, viewEntryActionButtons)



-- Module View for Kind section


viewKind : Model -> Html Msg
viewKind model =
    div [ class "content" ]
        [ div []
            [ div [ class "field", style "margin-top" "1.5rem" ]
                [ label [ class "label" ]
                    [ text "Alter / Geburtsdatum des Kindes* "
                    , showTooltip "Geben Sie hier entweder das Alter des Kindes in Jahren zum Zeitpunkt der Berechnung oder das Geburtsdatum im Format TT.MM.JJJJ ein."
                    ]
                , div [ class "control", style "width" "50%" ]
                    [ input
                        [ classList
                            [ ( "input", True )
                            , ( "entry-input", True )
                            , ( "is-danger", validateAgeOrBirthday model.kind.alterInput /= Nothing )
                            ]
                        , type_ "text"
                        , placeholder "z.B. 5 oder 12.12.2000"
                        , value model.kind.alterInput
                        , onInput (\val -> UpdateKindDaten (UpdateAlter val))
                        ]
                        []
                    , case validateAgeOrBirthday model.kind.alterInput of
                        Just error ->
                            p [ class "help is-danger" ] [ text error ]

                        Nothing ->
                            text ""
                    ]
                ]
            ]
        , div [ class "field", style "margin-top" "1.5rem" ]
            [ label [ class "label" ]
                [ text "Kindergeld Empfänger "
                , showTooltip "Elternteil, der das Kindergeld für das Kind erhält"
                ]
            , div [ class "control", style "width" "50%" ]
                [ div [ class "select is-fullwidth" ]
                    [ select
                        [ onInput (\val -> Update (UpdateKindergeldEmpfaenger (stringToPerson val))) ]
                        (List.map
                            (\person ->
                                option
                                    [ value (personToString person)
                                    , selected (person == model.kindergeldEmpfaenger)
                                    ]
                                    [ text (personToString person) ]
                            )
                            [ Vater, Mutter ]
                        )
                    ]
                ]
            ]
        , div [ class "field", style "margin-top" "1.5rem" ]
            [ label [ class "label" ]
                [ text "Kind Einkünfte (€) "
                , showTooltip "Hierzu gehören zum Beispiel Ausbildungsgeld oder BAföG-Zahlungen, allerdings sind eigene Einkünfte des Kindes nur soweit anzusetzen, wie es unter Berücksichtigung der wirtschaftlichen Verhältnisse der Billigkeit entspricht. Daher sind z.B. taschengeld-erhöhende Schülerjob-Zahlungen nicht anzusetzen und bei weiteren Einkünften ggfl. nicht der vollständige Betrag."
                ]
            , div [ class "control" ]
                (List.indexedMap (viewKindEinkuenfte model) model.kind.einkuenfte)
            ]
        , div
            [ class "field", style "margin-top" "1.5rem" ]
            [ label [ class "label" ]
                [ text "Kind Mehrbedarf (€) "
                , showTooltip "Monatlicher Mehrbedarf des Kindes (z.B. für besondere Ausgaben wie Nachhilfe, medizinische Kosten)"
                ]
            , div [ class "control" ]
                (List.indexedMap (viewBedarf Mehrbedarf model) model.kind.mehrbedarf)
            ]
        , div [ class "field" ]
            [ label [ class "label" ]
                [ text "Kind Sonderbedarf (€) "
                , showTooltip "Einmaliger Sonderbedarf des Kindes (z.B. für größere Anschaffungen oder besondere Ereignisse)"
                ]
            , div [ class "control" ]
                (List.indexedMap (viewBedarf Sonderbedarf model) model.kind.sonderbedarf)
            ]
        , div [ class "field" ]
            [ label [ class "label" ]
                [ text "Weitere bereits erbrachte Leistungen der Eltern (€) "
                , showTooltip "Weitere bereits erbrachte Leistungen der Eltern (z.B. Kleidung, Essensgeld (Kita, Schule))"
                ]
            , div [ class "control" ]
                (List.indexedMap (viewBedarf ErbrachteLeistungen model) model.kind.erbrachteLeistungen)
            ]
        , label [ class "checkbox label" ]
            [ input
                [ type_ "checkbox"
                , checked model.customRegelbedarf
                , onClick (ToggleView ToggleCustomRegelbedarf)
                , style "transform" "scale(1.75)"
                , style "margin-right" "0.5rem"
                , style "margin-top" "0.5rem"
                ]
                []
            , text "   Stattdessen individuellen Regelbedarf festsetzen"
            , showTooltip "Der ASGLA-Rechner setzt automatisch den Regelbedarf nach der Düsseldorfer Tabelle an.\n\nDa die Tabelle nur ein Nettoeinkommen bis 11.200 EUR berücksichtigt, müssen Eltern mit einem höheren Nettoeinkommen einen individuellen Bedarf ansetzen, der die Tabelle denklogisch unter Berücksichtigung des jeweiligen Einzelfalles fortsetzt.\n\nZudem wird nach den Leitlinien des OLG Naumburg in Sachsen-Anhalt kein Bedarfskontrollbetrag angewendet. Für Eltern in deren OLG-Bezirk der Bedarfskontrollbetrag angewendet wird, kann dieser durch Ansetzen eines individuellen Regelbedarfs berücksichtigt werden."
            ]
        , if model.customRegelbedarf then
            viewIndividuelleRegelbedarf model

          else
            text ""
        ]


moneyHelp : String -> Html Msg
moneyHelp value =
    case validateMoney value of
        Just message ->
            p [ class "help is-danger" ] [ text message ]

        Nothing ->
            text ""


requiredMoneyHelp : String -> Html Msg
requiredMoneyHelp value =
    case validateRequiredMoney value of
        Just message ->
            p [ class "help is-danger" ] [ text message ]

        Nothing ->
            text ""



-- Zusatzbedarf (Sonderbedarf und Mehrbedarf) mit Typ ZusatzbedarfTyp (Kosten, Bezeichnung, BezahltVon) Eingabefelder


viewBedarf : BedarfsTyp -> Model -> Int -> ZusatzbedarfTyp -> Html Msg
viewBedarf bedarfsTyp model index eingabe =
    let
        modelPerson =
            model.kind

        typeList =
            case bedarfsTyp of
                Mehrbedarf ->
                    modelPerson.mehrbedarf

                Sonderbedarf ->
                    modelPerson.sonderbedarf

                ErbrachteLeistungen ->
                    modelPerson.erbrachteLeistungen

        radioName =
            case bedarfsTyp of
                Mehrbedarf ->
                    "mehrbedarfBezahltVon" ++ String.fromInt index

                Sonderbedarf ->
                    "sonderbedarfBezahltVon" ++ String.fromInt index

                ErbrachteLeistungen ->
                    "erbrachteLeistungenBezahltVon" ++ String.fromInt index
    in
    div [ class "field has-addons entry-row", style "flex-wrap" "wrap", style "align-items" "flex-start" ]
        ([ div [ class "control entry-cost", style "width" "20%" ]
            [ input
                [ classList
                    [ ( "input", True )
                    , ( "entry-input", True )
                    , ( "is-danger", validateMoney eingabe.kosten /= Nothing )
                    ]
                , type_ "text"
                , placeholder "Kosten (€)"
                , value eingabe.kosten
                , onInput (\newKosten -> UpdateKindDaten (ChangeBedarf (UpdateBedarf bedarfsTyp index { eingabe | kosten = newKosten })))
                ]
                []
            ]
        , div [ class "control entry-label", style "width" "23%" ]
            [ input
                [ class "input entry-input"
                , type_ "text"
                , placeholder "Bezeichnung z.B. Musikschule"
                , value eingabe.bezeichnung
                , onInput (\newBezeichnung -> UpdateKindDaten (ChangeBedarf (UpdateBedarf bedarfsTyp index { eingabe | bezeichnung = newBezeichnung })))
                ]
                []
            ]
        ]
            ++ viewEntryActionButtons
                { isRemovable = List.length typeList > 1
                , isAtLimit = List.length typeList >= 5
                , onRemove = UpdateKindDaten (ChangeBedarf (RemoveBedarf bedarfsTyp index))
                , onAdd = UpdateKindDaten (ChangeBedarf (AddBedarf bedarfsTyp))
                }
            ++ [ div [ class "control", style "flex-basis" "100%", style "display" "flex", style "flex-wrap" "wrap", style "align-items" "center", style "gap" "1rem" ]
            [ div [ style "display" "flex", style "flex-wrap" "wrap", style "align-items" "center", style "gap" "1rem" ]
                [ span [ class "has-text-weight-light", style "white-space" "nowrap" ]
                    [ text "Bereits bezahlt von:" ]
                , div [ class "field is-grouped" ]
                    [ div [ class "field is-narrow" ]
                        [ div [ class "control" ]
                            [ div [ class "buttons has-addons is-flex-wrap-wrap" ]
                                [ label
                                    [ class "button"
                                    , classList
                                        [ ( "is-primary is-selected", eingabe.bezahltVon == Just Vater )
                                        , ( "is-light", eingabe.bezahltVon /= Just Vater )
                                        ]
                                    , style "cursor" "pointer"
                                    , style "margin-bottom" "0"
                                    , style "border-bottom"
                                        (if eingabe.bezahltVon == Just Vater then
                                            "3px solid rgb(67, 67, 67)"

                                         else
                                            "3px solid transparent"
                                        )
                                    , onClick (UpdateKindDaten (ChangeBedarf (UpdateBedarf bedarfsTyp index { eingabe | bezahltVon = Just Vater })))
                                    ]
                                    [ input
                                        [ type_ "radio"
                                        , name radioName
                                        , value "Vater"
                                        , checked (eingabe.bezahltVon == Just Vater)
                                        , style "display" "none"
                                        ]
                                        []
                                    , text "Vater"
                                    ]
                                , label
                                    [ class "button"
                                    , classList
                                        [ ( "is-primary is-selected", eingabe.bezahltVon == Just Mutter )
                                        , ( "is-light", eingabe.bezahltVon /= Just Mutter )
                                        ]
                                    , style "cursor" "pointer"
                                    , style "margin-bottom" "0"
                                    , style "border-bottom"
                                        (if eingabe.bezahltVon == Just Mutter then
                                            "3px solid rgb(67, 67, 67)"

                                         else
                                            "3px solid transparent"
                                        )
                                    , onClick (UpdateKindDaten (ChangeBedarf (UpdateBedarf bedarfsTyp index { eingabe | bezahltVon = Just Mutter })))
                                    ]
                                    [ input
                                        [ type_ "radio"
                                        , name radioName
                                        , value "Mutter"
                                        , checked (eingabe.bezahltVon == Just Mutter)
                                        , style "display" "none"
                                        ]
                                        []
                                    , text "Mutter"
                                    ]
                                , label
                                    [ class "button"
                                    , classList
                                        [ ( "is-primary is-selected", eingabe.bezahltVon == Maybe.Nothing )
                                        , ( "is-light", eingabe.bezahltVon /= Maybe.Nothing )
                                        ]
                                    , style "cursor" "pointer"
                                    , style "margin-bottom" "0"
                                    , style "border-bottom"
                                        (if eingabe.bezahltVon == Maybe.Nothing then
                                            "3px solid rgb(67, 67, 67)"

                                         else
                                            "3px solid transparent"
                                        )
                                    , onClick (UpdateKindDaten (ChangeBedarf (UpdateBedarf bedarfsTyp index { eingabe | bezahltVon = Maybe.Nothing })))
                                    ]
                                    [ input
                                        [ type_ "radio"
                                        , name radioName
                                        , value "Nicht angegeben"
                                        , checked (eingabe.bezahltVon == Maybe.Nothing)
                                        , style "display" "none"
                                        ]
                                        []
                                    , text "Wurde noch nicht bezahlt"
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        , div [ style "flex-basis" "100%" ]
            [ moneyHelp eingabe.kosten ]
        ]
        )


viewKindEinkuenfte : Model -> Int -> StringFieldType -> Html Msg
viewKindEinkuenfte model index eingabe =
    let
        modelPerson =
            model.kind

        typeList =
            modelPerson.einkuenfte
    in
    div [ class "field has-addons entry-row", style "flex-wrap" "wrap", style "align-items" "flex-start" ]
        ([ div [ class "control entry-cost", style "width" "20%" ]
            [ input
                [ classList
                    [ ( "input", True )
                    , ( "entry-input", True )
                    , ( "is-danger", validateMoney eingabe.kosten /= Nothing )
                    ]
                , type_ "text"
                , placeholder "Kosten (€)"
                , value eingabe.kosten
                , onInput (\newKosten -> UpdateKindDaten (UpdateEinkuenfte index { eingabe | kosten = newKosten }))
                ]
                []
            ]
        , div [ class "control entry-label", style "width" "23%" ]
            [ input
                [ class "input entry-input"
                , type_ "text"
                , placeholder "Bezeichnung"
                , value eingabe.bezeichnung
                , onInput (\newBezeichnung -> UpdateKindDaten (UpdateEinkuenfte index { kosten = eingabe.kosten, bezeichnung = newBezeichnung }))
                ]
                []
            ]
        ]
            ++ viewEntryActionButtons
                { isRemovable = List.length typeList > 1
                , isAtLimit = List.length typeList >= 5
                , onRemove = UpdateKindDaten (RemoveEinkuenfte index)
                , onAdd = UpdateKindDaten AddEinkuenfte
                }
            ++ [ div [ style "flex-basis" "100%" ]
                    [ moneyHelp eingabe.kosten ]
               ]
        )


viewIndividuelleRegelbedarf : Model -> Html Msg
viewIndividuelleRegelbedarf model =
    div [ class "field", style "margin-top" "1.5rem" ]
        [ label [ class "label" ]
            [ text "Individueller Regelbedarf für das Kind (€) "
            ]
        , div [ class "control", style "width" "50%" ]
            [ input
                [ classList
                    [ ( "input", True )
                    , ( "is-fullwidth", True )
                    , ( "is-danger", validateRequiredMoney model.kind.regelbedarf /= Nothing )
                    ]
                , type_ "text"
                , placeholder "z.B. 1500"
                , value model.kind.regelbedarf
                , onInput (\val -> UpdateKindDaten (UpdateRegelbedarf val))
                ]
                []
            , requiredMoneyHelp model.kind.regelbedarf
            ]
        , div [ style "color" "red", style "margin-top" "0.5rem" ]
            [ text "Bitte nutzen Sie diese Funktion nur, wenn Sie einen ausnahmsweisen Sonderfall haben!" ]
        ]
