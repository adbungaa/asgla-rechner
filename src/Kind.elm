module Kind exposing (..)

import Types exposing (BedarfsTyp(..), Model, Person(..), StringFieldType, ZusatzbedarfTyp)
import Utils.Format exposing (formatInputToFloat)



-- Module Logic Kind
-- Kindbedarf berechnen


calculateGesamtKindbedarf : Float -> List StringFieldType -> List ZusatzbedarfTyp -> List ZusatzbedarfTyp -> Float -> Int -> Float
calculateGesamtKindbedarf regelbedarf einkuenfte mehrbedarf sonderbedarf haelftigesKindergeld alter =
    let
        zusatzbedarfGes =
            List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) mehrbedarf) + List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) sonderbedarf)

        einkuenfteGes =
            if alter < 18 then
                List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) einkuenfte) / 2

            else
                List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) einkuenfte)
    in
    max 0 (regelbedarf + zusatzbedarfGes - einkuenfteGes - haelftigesKindergeld)



-- Hilfsfunktionen zur Verwaltung von Zusatzbedarf (Mehr- und Sonderbedarf)


addBedarf : BedarfsTyp -> Model -> Model
addBedarf bedarfsTyp model =
    let
        currentList =
            case bedarfsTyp of
                Mehrbedarf ->
                    model.kind.mehrbedarf

                Sonderbedarf ->
                    model.kind.sonderbedarf

                ErbrachteLeistungen ->
                    model.kind.erbrachteLeistungen
    in
    if List.length currentList < 5 then
        let
            modelPerson =
                model.kind

            newList =
                [ { bezeichnung = "", kosten = "", bezahltVon = Nothing } ]

            updatedData =
                case bedarfsTyp of
                    Mehrbedarf ->
                        { modelPerson | mehrbedarf = model.kind.mehrbedarf ++ newList }

                    Sonderbedarf ->
                        { modelPerson | sonderbedarf = model.kind.sonderbedarf ++ newList }

                    ErbrachteLeistungen ->
                        { modelPerson | erbrachteLeistungen = model.kind.erbrachteLeistungen ++ newList }
        in
        { model | kind = updatedData }

    else
        { model | error = Just "Zu viele Posten (Max. 5)" }


removeBedarf : BedarfsTyp -> Int -> Model -> Model
removeBedarf bedarfsTyp index model =
    let
        modelPerson =
            model.kind

        currentList =
            case bedarfsTyp of
                Mehrbedarf ->
                    model.kind.mehrbedarf

                Sonderbedarf ->
                    model.kind.sonderbedarf

                ErbrachteLeistungen ->
                    model.kind.erbrachteLeistungen

        newList =
            removeAt index currentList

        updatedData =
            case bedarfsTyp of
                Mehrbedarf ->
                    { modelPerson | mehrbedarf = newList }

                Sonderbedarf ->
                    { modelPerson | sonderbedarf = newList }

                ErbrachteLeistungen ->
                    { modelPerson | erbrachteLeistungen = newList }
    in
    { model | kind = updatedData, error = Nothing }


updateBedarf : BedarfsTyp -> Int -> ZusatzbedarfTyp -> Model -> Model
updateBedarf bedarfsTyp index field model =
    let
        modelPerson =
            model.kind

        currentList =
            case bedarfsTyp of
                Mehrbedarf ->
                    model.kind.mehrbedarf

                Sonderbedarf ->
                    model.kind.sonderbedarf

                ErbrachteLeistungen ->
                    model.kind.erbrachteLeistungen

        updatedPosten =
            List.indexedMap
                (\i item ->
                    if i == index then
                        { item
                            | kosten = field.kosten
                            , bezeichnung = field.bezeichnung
                            , bezahltVon = field.bezahltVon
                        }

                    else
                        item
                )
                currentList

        updatedData =
            case bedarfsTyp of
                Mehrbedarf ->
                    { modelPerson | mehrbedarf = updatedPosten }

                Sonderbedarf ->
                    { modelPerson | sonderbedarf = updatedPosten }

                ErbrachteLeistungen ->
                    { modelPerson | erbrachteLeistungen = updatedPosten }
    in
    { model | kind = updatedData }


removeAt : Int -> List a -> List a
removeAt index list =
    List.indexedMap Tuple.pair list
        |> List.filter (\( i, _ ) -> i /= index)
        |> List.map Tuple.second
