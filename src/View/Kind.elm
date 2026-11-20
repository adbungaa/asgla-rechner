module View.Kind exposing (viewKind)

import Html exposing (Html, button, div, input, label, option, p, select, span, text)
import Html.Attributes exposing (attribute, checked, class, classList, name, placeholder, selected, style, type_, value)
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
import View.Components exposing (moneyHelp, showTooltip, skriptLink, viewEntryActionButtons)



-- Module View for Kind section


viewKind : Model -> Html Msg
viewKind model =
    let
        -- Ein leeres Feld wird erst nach einem fehlgeschlagenen Berechnen als Fehler markiert;
        -- vorher zeigt nur der Platzhalter den Hinweis.
        altersFehler =
            if String.trim model.kind.alterInput == "" && model.error == Nothing then
                Nothing

            else
                validateAgeOrBirthday model.kind.alterInput
    in
    div [ class "content" ]
        [ div []
            [ div [ class "field", style "margin-top" "1.5rem" ]
                [ label [ class "label" ]
                    [ text "Alter oder Geburtsdatum des Kindes"
                    , span [ class "asgla-required", attribute "aria-hidden" "true" ] [ text " *" ]
                    , span [ class "is-sr-only" ] [ text " (Pflichtfeld)" ]
                    ]
                , p [ class "asgla-help asgla-help-top" ]
                    [ text "Entweder das Alter des Kindes in Jahren zum Zeitpunkt der Berechnung oder das Geburtsdatum im Format TT.MM.JJJJ." ]
                , div [ class "control half-width-control" ]
                    [ input
                        [ classList
                            [ ( "input", True )
                            , ( "entry-input", True )
                            , ( "is-danger", altersFehler /= Nothing )
                            ]
                        , type_ "text"
                        , placeholder "z.B. 5 oder 12.12.2000"
                        , value model.kind.alterInput
                        , onInput (\val -> UpdateKindDaten (UpdateAlter val))
                        ]
                        []
                    , case altersFehler of
                        Just error ->
                            p [ class "help is-danger" ] [ text error ]

                        Nothing ->
                            text ""
                    ]
                ]
            ]
        , div [ class "field", style "margin-top" "1.5rem" ]
            [ label [ class "label" ]
                [ text "Wer erhält das Kindergeld?" ]
            , p [ class "asgla-help asgla-help-top" ]
                [ text "Bitte prüfen: Vorausgewählt ist die Mutter. Wählen Sie den Vater, falls er das ", skriptLink "kindergeldverrechnung" "Kindergeld", text " erhält." ]
            , div [ class "control half-width-control" ]
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
                [ text "Eigene Einkünfte des Kindes (€) "
                , span [ class "asgla-optional" ] [ text "optional" ]
                , showTooltip "Hierzu gehören zum Beispiel Ausbildungsgeld oder BAföG-Zahlungen. Eigene Einkünfte des Kindes werden nur so weit angerechnet, wie es den Umständen angemessen ist. Zahlungen aus einem Schülerjob, die nur das Taschengeld erhöhen, werden zum Beispiel nicht angerechnet. Bei weiteren Einkünften wird unter Umständen nicht der volle Betrag angerechnet."
                ]
            , p [ class "asgla-help asgla-help-top" ]
                [ text "Zum Beispiel Ausbildungsvergütung oder BAföG. Taschengeld aus einem Schülerjob wird in der Regel nicht angesetzt." ]
            , div [ class "control" ]
                (List.indexedMap (viewKindEinkuenfte model) model.kind.einkuenfte)
            ]
        , div
            [ class "field asgla-subcard", style "margin-top" "1.5rem" ]
            [ label [ class "label" ]
                [ text "Mehrbedarf des Kindes (€) "
                , span [ class "asgla-optional" ] [ text "optional" ]
                , showTooltip "Mehrbedarf: zusätzliche Kosten des Kindes, die regelmäßig pro Monat anfallen, z. B. Nachhilfe oder Zahnspange."
                ]
            , p [ class "asgla-help asgla-help-top" ]
                [ text "Regelmäßige zusätzliche Kosten pro Monat (", skriptLink "mehrbedarf" "Mehrbedarf", text "), z. B. für Nachhilfe oder medizinische Behandlungen." ]
            , div [ class "control" ]
                (List.indexedMap (viewBedarf Mehrbedarf model) model.kind.mehrbedarf)
            ]
        , div [ class "field asgla-subcard" ]
            [ label [ class "label" ]
                [ text "Sonderbedarf des Kindes (€) "
                , span [ class "asgla-optional" ] [ text "optional" ]
                , showTooltip "Sonderbedarf: zusätzliche Kosten des Kindes, die einmalig anfallen, z. B. für eine größere Anschaffung."
                ]
            , p [ class "asgla-help asgla-help-top" ]
                [ text "Einmalige Kosten (", skriptLink "sonderbedarf" "Sonderbedarf", text "), z. B. für eine größere Anschaffung." ]
            , div [ class "control" ]
                (List.indexedMap (viewBedarf Sonderbedarf model) model.kind.sonderbedarf)
            ]
        , div [ class "field asgla-subcard" ]
            [ label [ class "label" ]
                [ text "Bereits erbrachte Leistungen der Eltern (€) "
                , span [ class "asgla-optional" ] [ text "optional" ]
                , showTooltip "Weitere bereits erbrachte Leistungen der Eltern (z.B. Kleidung, Essensgeld (Kita, Schule))"
                ]
            , p [ class "asgla-help asgla-help-top" ]
                [ text "Was Sie bereits bezahlt haben, z. B. Kleidung oder Essensgeld in Kita oder Schule." ]
            , div [ class "control" ]
                (List.indexedMap (viewBedarf ErbrachteLeistungen model) model.kind.erbrachteLeistungen)
            ]
        , label [ class "checkbox label asgla-checkbox-kind" ]
            [ input
                [ type_ "checkbox"
                , checked model.customRegelbedarf
                , onClick (ToggleView ToggleCustomRegelbedarf)
                , style "margin-right" "0.5rem"
                ]
                []
            , span [] [ text " Stattdessen einen individuellen Regelbedarf festsetzen" ]
            , showTooltip "Der Regelbedarf ist der übliche monatliche Betrag, den ein Kind laut Düsseldorfer Tabelle braucht. Der Rechner setzt ihn automatisch an. Die Tabelle endet bei einem Nettoeinkommen von 11.200 EUR. Bei höherem Einkommen können Sie hier einen eigenen Betrag festlegen."
            ]
        , if model.customRegelbedarf then
            viewIndividuelleRegelbedarf model

          else
            text ""
        ]


requiredMoneyHelp : String -> Html Msg
requiredMoneyHelp value =
    if String.trim value == "" then
        p [ class "help" ] [ text "Tragen Sie hier den monatlichen Betrag in Euro ein, z. B. 900." ]

    else
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
                    , placeholder "z. B. 120"
                    , value eingabe.kosten
                    , onInput (\newKosten -> UpdateKindDaten (ChangeBedarf (UpdateBedarf bedarfsTyp index { eingabe | kosten = newKosten })))
                    ]
                    []
                ]
            , div [ class "control entry-label" ]
                [ input
                    [ class "input entry-input"
                    , type_ "text"
                    , placeholder "z. B. Musikschule"
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
            )
        , if String.trim eingabe.kosten == "" then
            text ""

          else
            div [ class "control asgla-bezahlt", style "display" "flex", style "flex-wrap" "wrap", style "align-items" "center", style "gap" "1rem", style "margin-top" "0.5rem" ]
            [ p [ class "asgla-help", style "flex-basis" "100%", style "margin-bottom" "0" ]
                [ text "Wählen Sie, wer die Kosten schon getragen hat. Das beeinflusst das Ergebnis." ]
            , div [ style "display" "flex", style "flex-wrap" "wrap", style "align-items" "center", style "gap" "1rem" ]
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


viewKindEinkuenfte : Model -> Int -> StringFieldType -> Html Msg
viewKindEinkuenfte model index eingabe =
    let
        modelPerson =
            model.kind

        typeList =
            modelPerson.einkuenfte
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
                    , placeholder "z. B. 120"
                    , value eingabe.kosten
                    , onInput (\newKosten -> UpdateKindDaten (UpdateEinkuenfte index { eingabe | kosten = newKosten }))
                    ]
                    []
                ]
            , div [ class "control entry-label" ]
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
            )
        , div [ style "flex-basis" "100%" ]
            [ moneyHelp eingabe.kosten ]
        ]


viewIndividuelleRegelbedarf : Model -> Html Msg
viewIndividuelleRegelbedarf model =
    div [ class "field", style "margin-top" "1.5rem" ]
        [ label [ class "label" ]
            [ text "Individueller Regelbedarf für das Kind (€) "
            ]
        , div [ class "control half-width-control" ]
            [ input
                [ classList
                    [ ( "input", True )
                    , ( "is-fullwidth", True )
                    , ( "is-danger", validateMoney model.kind.regelbedarf /= Nothing )
                    ]
                , type_ "text"
                , placeholder "z. B. 900"
                , value model.kind.regelbedarf
                , onInput (\val -> UpdateKindDaten (UpdateRegelbedarf val))
                ]
                []
            , requiredMoneyHelp model.kind.regelbedarf
            ]
        , div [ style "color" "red", style "margin-top" "0.5rem" ]
            [ text "Bitte nutzen Sie diese Funktion nur, wenn bei Ihnen ein Sonderfall vorliegt." ]
        ]
