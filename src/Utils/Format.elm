module Utils.Format exposing (formatEuroRounded, formatInputToFloat, personToString, renderSelbstbehaltBetrag, selbstbehaltToString, stringToMaybePerson, stringToPerson)

import Types exposing (Person(..), Selbstbehalt(..))



-- Module for formatting values and converting between types
-- Converts any format to standardized Float string: "10.40"


formatInputToFloat :
    String
    -> Maybe Float
formatInputToFloat input =
    let
        cleaned =
            String.trim input

        dotCount =
            String.indexes "." cleaned |> List.length

        commaCount =
            String.indexes "," cleaned |> List.length

        totalSeparators =
            dotCount + commaCount

        normalized =
            if totalSeparators == 0 then
                cleaned

            else if totalSeparators == 1 then
                -- Single separator: treat as decimal
                String.replace "," "." cleaned

            else
                -- Multiple separators: last one is decimal
                let
                    lastDotIndex =
                        String.indexes "." cleaned
                            |> List.reverse
                            |> List.head
                            |> Maybe.withDefault -1

                    lastCommaIndex =
                        String.indexes "," cleaned
                            |> List.reverse
                            |> List.head
                            |> Maybe.withDefault -1
                in
                if lastCommaIndex > lastDotIndex then
                    -- German format: 1.000,50 -> remove dots, replace comma with dot
                    cleaned
                        |> String.replace "." ""
                        |> String.replace "," "."

                else
                    -- International format: 1,000.50 -> remove commas, keep dots
                    String.replace "," "" cleaned
    in
    String.toFloat normalized
        |> Maybe.map (\euros -> toFloat (round (euros * 100)) / 100)



-- Format Float to Euro rounding up to 2 decimals: "10,40"


formatEuroRounded : Float -> String
formatEuroRounded number =
    let
        roundedUp =
            toFloat (round (number * 100)) / 100

        parts =
            String.split "." (String.fromFloat roundedUp)

        euros =
            List.head parts |> Maybe.withDefault "0"

        cents =
            case List.tail parts of
                Just [ decimals ] ->
                    String.padRight 2 '0' (String.left 2 decimals)

                _ ->
                    "00"
    in
    euros ++ "," ++ cents


renderSelbstbehaltBetrag : Selbstbehalt -> String
renderSelbstbehaltBetrag selb =
    case selb of
        Angemessen betrag ->
            betrag

        NotwendigErwerbstaetig betrag ->
            betrag

        NotwendigNichtErwerbstaetig betrag ->
            betrag

        Benutzerdefiniert betrag ->
            betrag


selbstbehaltToString :
    Selbstbehalt
    -> String -- Render SelbstbehaltTyp for View
selbstbehaltToString typ =
    case typ of
        Angemessen _ ->
            "Angemessen"

        NotwendigNichtErwerbstaetig _ ->
            "Notwendig (nicht erwerbstätig)"

        NotwendigErwerbstaetig _ ->
            "Notwendig"

        Benutzerdefiniert _ ->
            "Benutzerdefiniert"


stringToMaybePerson :
    String
    -> Maybe Person -- Zusatzbedarf wurde noch nicht bezahlt möglich
stringToMaybePerson str =
    case str of
        "Vater" ->
            Just Vater

        "Mutter" ->
            Just Mutter

        "Nicht angegeben" ->
            Nothing

        _ ->
            Nothing


personToString : Person -> String
personToString person =
    case person of
        Vater ->
            "Vater"

        Mutter ->
            "Mutter"


stringToPerson : String -> Person
stringToPerson str =
    case str of
        "Vater" ->
            Vater

        "Mutter" ->
            Mutter

        _ ->
            Vater
