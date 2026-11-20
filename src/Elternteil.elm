module Elternteil exposing
    ( addAbzugsVorlage
    , addPosten
    , calculateDurchschnittseinkommen
    , calculateEinkommen
    , calculateGesamtEinkommen
    , calculateWeitereEinkuenfte
    , getAkusativElternTitle
    , getDativElternTitle
    , removePosten
    , sumAbzugsposten
    , toggleSelbstbehaltOption
    , updatePauschaleInAbzuege
    , updatePosten
    , updateSelbstbehalt
    )

import Constants exposing (getSelbstbehalt)
import Kind exposing (removeAt)
import Types
    exposing
        ( Elternteil
        , Model
        , Person(..)
        , PostenType(..)
        , Selbstbehalt(..)
        , StringFieldType
        )
import Utils.Format exposing (formatEuroRounded, formatInputToFloat)



-- Module Logic Eltern
-- Einkommen berechnen


calculateDurchschnittseinkommen : List StringFieldType -> Maybe Float
calculateDurchschnittseinkommen einkommen =
    let
        werte =
            einkommen
                |> List.filterMap (.kosten >> formatInputToFloat)
    in
    if List.isEmpty werte then
        Nothing

    else
        Just (List.sum werte / toFloat (List.length werte))


calculateWeitereEinkuenfte : List StringFieldType -> Float
calculateWeitereEinkuenfte postenList =
    List.sum (List.map (\field -> formatInputToFloat field.kosten |> Maybe.withDefault 0) postenList)


calculateEinkommen : Elternteil -> Float
calculateEinkommen elternteil =
    let
        haupttaetigkeit =
            formatInputToFloat elternteil.haupttaetigkeit
                |> Maybe.withDefault 0

        weitereEinkuenfte =
            calculateWeitereEinkuenfte elternteil.weitereEinkuenfte
    in
    haupttaetigkeit + weitereEinkuenfte


calculateGesamtEinkommen : Model -> Float
calculateGesamtEinkommen model =
    let
        einkommenVater =
            calculateEinkommen model.vater

        einkommenMutter =
            calculateEinkommen model.mutter

        gesamtAbzugsVater =
            sumAbzugsposten model.vater.abzugsposten

        gesamtAbzugsMutter =
            sumAbzugsposten model.mutter.abzugsposten

        bereinigtesEinkommenVater =
            einkommenVater - gesamtAbzugsVater

        bereinigtesEinkommenMutter =
            einkommenMutter - gesamtAbzugsMutter
    in
    bereinigtesEinkommenVater + bereinigtesEinkommenMutter



-- Hilfsfunktionen für Posten (Weitere Einkünfte / Abzugsposten)
-- add new empty posten too the list if the list has less than 5 items


addPosten : Person -> PostenType -> Model -> Model
addPosten person postenType model =
    let
        modelPerson =
            case person of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        currentPosten =
            case postenType of
                Abzugsposten ->
                    modelPerson.abzugsposten

                WeitereEinkuenfte ->
                    modelPerson.weitereEinkuenfte

                EinkommenzumDurchschnittsberechnung ->
                    modelPerson.einkommenZumDurchschnittsberechnung
    in
    if List.length currentPosten < maxPostenCount postenType then
        let
            newList =
                case postenType of
                    Abzugsposten ->
                        [ { kosten = "", bezeichnung = "" } ]

                    WeitereEinkuenfte ->
                        [ { kosten = "", bezeichnung = " " } ]

                    EinkommenzumDurchschnittsberechnung ->
                        [ { kosten = "", bezeichnung = "" } ]

            updatedData =
                case postenType of
                    Abzugsposten ->
                        { modelPerson
                            | abzugsposten = modelPerson.abzugsposten ++ newList
                        }

                    WeitereEinkuenfte ->
                        { modelPerson
                            | weitereEinkuenfte = modelPerson.weitereEinkuenfte ++ newList
                        }

                    EinkommenzumDurchschnittsberechnung ->
                        { modelPerson
                            | einkommenZumDurchschnittsberechnung = modelPerson.einkommenZumDurchschnittsberechnung ++ newList
                        }
        in
        case person of
            Vater ->
                { model | vater = updatedData }

            Mutter ->
                { model | mutter = updatedData }

    else
        { model | error = Just ("Zu viele Posten (Max. " ++ String.fromInt (maxPostenCount postenType) ++ ")") }


-- Trägt eine Vorlage (Bezeichnung + Betrag) in eine bestehende Zeile gleicher Bezeichnung
-- oder in die erste leere Abzugszeile ein, sonst in eine neue Zeile (max. 5).


addAbzugsVorlage : Person -> String -> String -> Model -> Model
addAbzugsVorlage person bezeichnung kosten model =
    let
        modelPerson =
            case person of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        isEmpty field =
            String.isEmpty (String.trim field.kosten) && String.isEmpty (String.trim field.bezeichnung)

        hasSameBezeichnung field =
            String.trim field.bezeichnung == String.trim bezeichnung

        vorlage =
            { kosten = kosten, bezeichnung = bezeichnung }

        maybeNewList =
            if List.any hasSameBezeichnung modelPerson.abzugsposten then
                Just
                    (List.map
                        (\f ->
                            if hasSameBezeichnung f then
                                { f | kosten = if String.isEmpty kosten then f.kosten else kosten }

                            else
                                f
                        )
                        modelPerson.abzugsposten
                    )

            else if List.any isEmpty modelPerson.abzugsposten then
                Just
                    (Tuple.second
                        (List.foldl
                            (\f ( done, acc ) ->
                                if not done && isEmpty f then
                                    ( True, acc ++ [ vorlage ] )

                                else
                                    ( done, acc ++ [ f ] )
                            )
                            ( False, [] )
                            modelPerson.abzugsposten
                        )
                    )

            else if List.length modelPerson.abzugsposten < maxPostenCount Abzugsposten then
                Just (modelPerson.abzugsposten ++ [ vorlage ])

            else
                Nothing
    in
    case maybeNewList of
        Just newList ->
            let
                updated =
                    { modelPerson | abzugsposten = newList }
            in
            case person of
                Vater ->
                    { model | vater = updated, showErgebnis = False, error = Nothing }

                Mutter ->
                    { model | mutter = updated, showErgebnis = False, error = Nothing }

        Nothing ->
            { model | error = Just ("Zu viele Posten (Max. " ++ String.fromInt (maxPostenCount Abzugsposten) ++ ")") }


updatePauschaleInAbzuege : String -> List StringFieldType -> List StringFieldType
updatePauschaleInAbzuege haupttaetigkeit abzugsposten =
    let
        netto =
            formatInputToFloat haupttaetigkeit |> Maybe.withDefault 0

        neuerBetrag =
            if netto > 0 then
                formatEuroRounded (netto * 0.05)

            else
                ""
    in
    List.map
        (\f ->
            if String.trim f.bezeichnung == "Berufskosten (5 % Pauschale)" then
                { f | kosten = neuerBetrag }

            else
                f
        )
        abzugsposten


removePosten : Person -> PostenType -> Int -> Model -> Model
removePosten person postenType index model =
    let
        modelPerson =
            case person of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        postenListe =
            case postenType of
                Abzugsposten ->
                    modelPerson.abzugsposten

                WeitereEinkuenfte ->
                    modelPerson.weitereEinkuenfte

                EinkommenzumDurchschnittsberechnung ->
                    modelPerson.einkommenZumDurchschnittsberechnung

        newList =
            removeAt index postenListe

        updatedData =
            case postenType of
                Abzugsposten ->
                    { modelPerson
                        | abzugsposten = newList
                    }

                WeitereEinkuenfte ->
                    { modelPerson
                        | weitereEinkuenfte = newList
                    }

                EinkommenzumDurchschnittsberechnung ->
                    { modelPerson
                        | einkommenZumDurchschnittsberechnung = newList
                    }
    in
    case person of
        Vater ->
            { model | vater = updatedData, error = Nothing }

        Mutter ->
            { model | mutter = updatedData, error = Nothing }


maxPostenCount : PostenType -> Int
maxPostenCount postenType =
    case postenType of
        EinkommenzumDurchschnittsberechnung ->
            12

        _ ->
            5



-- update posten at index with Kosten or Bezeichnung


updatePosten : Person -> PostenType -> Int -> StringFieldType -> Model -> Model
updatePosten person personType index field model =
    let
        modelPerson =
            case person of
                Vater ->
                    model.vater

                Mutter ->
                    model.mutter

        postenListe =
            case personType of
                Abzugsposten ->
                    modelPerson.abzugsposten

                WeitereEinkuenfte ->
                    modelPerson.weitereEinkuenfte

                EinkommenzumDurchschnittsberechnung ->
                    modelPerson.einkommenZumDurchschnittsberechnung

        updatedPosten =
            List.indexedMap
                (\i item ->
                    if i == index then
                        { item
                            | kosten = field.kosten
                            , bezeichnung = field.bezeichnung
                        }

                    else
                        item
                )
                postenListe

        updatedData =
            case personType of
                Abzugsposten ->
                    { modelPerson | abzugsposten = updatedPosten }

                WeitereEinkuenfte ->
                    { modelPerson | weitereEinkuenfte = updatedPosten }

                EinkommenzumDurchschnittsberechnung ->
                    { modelPerson | einkommenZumDurchschnittsberechnung = updatedPosten }
    in
    case person of
        Vater ->
            { model | vater = updatedData }

        Mutter ->
            { model | mutter = updatedData }


sumAbzugsposten : List StringFieldType -> Float
sumAbzugsposten postenList =
    postenList
        |> List.map (\a -> formatInputToFloat a.kosten |> Maybe.withDefault 0)
        |> List.sum


updateSelbstbehalt : Selbstbehalt -> String -> Selbstbehalt
updateSelbstbehalt selb jahr =
    case selb of
        Benutzerdefiniert val ->
            Benutzerdefiniert val

        Angemessen _ ->
            Angemessen (getSelbstbehalt jahr "Angemessen")

        NotwendigErwerbstaetig _ ->
            NotwendigErwerbstaetig (getSelbstbehalt jahr "Notwendig")

        NotwendigNichtErwerbstaetig _ ->
            NotwendigNichtErwerbstaetig (getSelbstbehalt jahr "Notwendig (nicht erwerbstätig)")


toggleSelbstbehaltOption : Elternteil -> Elternteil
toggleSelbstbehaltOption person =
    { person
        | showSelbstbehaltOptions = not person.showSelbstbehaltOptions
    }


getDativElternTitle : Person -> String
getDativElternTitle person =
    case person of
        Vater ->
            "dem Kindsvater"

        Mutter ->
            "der Kindsmutter"


getAkusativElternTitle : Person -> String
getAkusativElternTitle person =
    case person of
        Vater ->
            "den Kindsvater"

        Mutter ->
            "die Kindsmutter"
