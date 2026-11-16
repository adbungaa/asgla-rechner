module Elternteil exposing
    ( addPosten
    , calculateEinkommen
    , calculateGesamtEinkommen
    , calculateWeitereEinkuenfte
    , getAkusativElternTitle
    , getDativElternTitle
    , removePosten
    , sumAbzugsposten
    , toggleSelbstbehaltOption
    , updatePosten
    , updateSelbstbehalt
    )

import Constants exposing (getSelbstbehalt)
import Types
    exposing
        ( Elternteil
        , Model
        , Person(..)
        , PostenType(..)
        , Selbstbehalt(..)
        , StringFieldType
        )
import Utils.Format exposing (formatInputToFloat)



-- Module Logic Eltern
-- Einkommen berechnen


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


removeAt : Int -> List a -> List a
removeAt index list =
    List.indexedMap Tuple.pair list
        |> List.filter (\( i, _ ) -> i /= index)
        |> List.map Tuple.second



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
                        [ { kosten = "", bezeichnung = " " } ]

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
