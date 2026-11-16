module Utils.Validation exposing (areInputsValid, inputAgeOrBirthdayToAge, isAgeOrBirthdayFormatValid, isInputAgeorBirthday, validateAgeOrBirthday, validateMoney, validateRequiredMoney)

import Types exposing (Model)
import Utils.Format exposing (formatInputToFloat, renderSelbstbehaltBetrag)



-- Validates inputs


areInputsValid : Model -> Bool
areInputsValid model =
    let
        requiredString =
            [ model.vater.haupttaetigkeit
            , model.mutter.haupttaetigkeit
            ]
                |> List.filter (not << String.isEmpty)

        -- Remove empty strings
        -- Only one parent required to have income
        totalSum =
            requiredString
                |> List.filterMap formatInputToFloat
                |> List.sum

        allStrings =
            requiredString
                ++ [ renderSelbstbehaltBetrag model.vater.selbstbehalt
                   , renderSelbstbehaltBetrag model.mutter.selbstbehalt
                   ]
                ++ (model.vater.abzugsposten
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )
                ++ (model.mutter.abzugsposten
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )
                ++ (model.vater.weitereEinkuenfte
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )
                ++ (model.mutter.weitereEinkuenfte
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )
                ++ (if model.durchschnittseinkommen then
                        (model.vater.einkommenZumDurchschnittsberechnung
                            ++ model.mutter.einkommenZumDurchschnittsberechnung
                        )
                            |> List.map .kosten
                            |> List.filter (not << String.isEmpty)

                    else
                        []
                   )
                ++ (model.kind.einkuenfte
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )
                ++ (model.kind.mehrbedarf
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )
                ++ (model.kind.sonderbedarf
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )
                ++ (model.kind.erbrachteLeistungen
                        |> List.map .kosten
                        |> List.filter (not << String.isEmpty)
                   )

        customRegelbedarfValid =
            not model.customRegelbedarf
                || validateRequiredMoney model.kind.regelbedarf
                == Nothing

        ageValid =
            validateAgeOrBirthday model.kind.alterInput == Nothing
    in
    (totalSum > 0)
        && List.all isValidNumber allStrings
        && customRegelbedarfValid
        && ageValid



-- Check if format valid (can be converted to Float)


isValidNumber : String -> Bool
isValidNumber str =
    case formatInputToFloat str of
        Just _ ->
            True

        Nothing ->
            False


validateMoney : String -> Maybe String
validateMoney value =
    if String.trim value == "" then
        Nothing

    else if isValidNumber value then
        Nothing

    else
        Just "Bitte nur Zahlen eingeben, z.B. 300 oder 300,50."


validateRequiredMoney : String -> Maybe String
validateRequiredMoney value =
    if String.trim value == "" then
        Just "Dieses Feld darf nicht leer sein."

    else
        validateMoney value


isInputAgeorBirthday : String -> Bool
isInputAgeorBirthday =
    isAgeOrBirthdayFormatValid


isAgeOrBirthdayFormatValid : String -> Bool
isAgeOrBirthdayFormatValid value =
    isValidAgeInput value || isValidBirthdayInput value


validateAgeOrBirthday : String -> Maybe String
validateAgeOrBirthday value =
    if String.trim value == "" then
        Just "Dieses Feld darf nicht leer sein."

    else if isAgeOrBirthdayFormatValid value then
        Nothing

    else
        Just "Bitte Alter als Zahl oder Geburtsdatum im Format TT.MM.JJJJ eingeben."


inputAgeOrBirthdayToAge : String -> String -> String -> Maybe Int
inputAgeOrBirthdayToAge calculationMonth calculationYear value =
    let
        trimmedValue =
            String.trim value
    in
    case String.toInt trimmedValue of
        Just age ->
            if isValidAge age then
                Just age

            else
                Nothing

        Nothing ->
            Maybe.map3 calculateAge
                (monthToInt calculationMonth)
                (String.toInt calculationYear)
                (parseBirthday trimmedValue)
                |> Maybe.andThen
                    (\age ->
                        if isValidAge age then
                            Just age

                        else
                            Nothing
                    )


isValidAgeInput : String -> Bool
isValidAgeInput value =
    case String.toInt (String.trim value) of
        Just age ->
            isValidAge age

        Nothing ->
            False


isValidAge : Int -> Bool
isValidAge age =
    age >= 0 && age <= 120


isValidBirthdayInput : String -> Bool
isValidBirthdayInput value =
    parseBirthday (String.trim value)
        |> Maybe.map (\_ -> True)
        |> Maybe.withDefault False


parseBirthday : String -> Maybe { day : Int, month : Int, year : Int }
parseBirthday value =
    case String.split "." value of
        [ dayText, monthText, yearText ] ->
            if String.length dayText == 2 && String.length monthText == 2 && String.length yearText == 4 && List.all (String.all Char.isDigit) [ dayText, monthText, yearText ] then
                Maybe.map3
                    (\day month year ->
                        { day = day, month = month, year = year }
                    )
                    (String.toInt dayText)
                    (String.toInt monthText)
                    (String.toInt yearText)
                    |> Maybe.andThen
                        (\birthday ->
                            if isValidDate birthday then
                                Just birthday

                            else
                                Nothing
                        )

            else
                Nothing

        _ ->
            Nothing


isValidDate : { day : Int, month : Int, year : Int } -> Bool
isValidDate { day, month, year } =
    (year >= 1900)
        && (month >= 1)
        && (month <= 12)
        && (day >= 1)
        && (day <= daysInMonth month year)


daysInMonth : Int -> Int -> Int
daysInMonth month year =
    case month of
        2 ->
            if isLeapYear year then
                29

            else
                28

        4 ->
            30

        6 ->
            30

        9 ->
            30

        11 ->
            30

        _ ->
            31


isLeapYear : Int -> Bool
isLeapYear year =
    modBy 400 year == 0 || (modBy 4 year == 0 && modBy 100 year /= 0)


calculateAge : Int -> Int -> { day : Int, month : Int, year : Int } -> Int
calculateAge calculationMonth calculationYear birthday =
    let
        baseAge =
            calculationYear - birthday.year
    in
    if birthday.month > calculationMonth then
        baseAge - 1

    else
        baseAge


monthToInt : String -> Maybe Int
monthToInt month =
    case String.trim month of
        "1" ->
            Just 1

        "01" ->
            Just 1

        "Januar" ->
            Just 1

        "2" ->
            Just 2

        "02" ->
            Just 2

        "Februar" ->
            Just 2

        "3" ->
            Just 3

        "03" ->
            Just 3

        "März" ->
            Just 3

        "Maerz" ->
            Just 3

        "4" ->
            Just 4

        "04" ->
            Just 4

        "April" ->
            Just 4

        "5" ->
            Just 5

        "05" ->
            Just 5

        "Mai" ->
            Just 5

        "6" ->
            Just 6

        "06" ->
            Just 6

        "Juni" ->
            Just 6

        "7" ->
            Just 7

        "07" ->
            Just 7

        "Juli" ->
            Just 7

        "8" ->
            Just 8

        "08" ->
            Just 8

        "August" ->
            Just 8

        "9" ->
            Just 9

        "09" ->
            Just 9

        "September" ->
            Just 9

        "10" ->
            Just 10

        "Oktober" ->
            Just 10

        "11" ->
            Just 11

        "November" ->
            Just 11

        "12" ->
            Just 12

        "Dezember" ->
            Just 12

        _ ->
            Nothing
