module ImportExport exposing (createQRCodeImage, decodeQRCodeData, encodeErgebnis, encodeModeltoQRCode, getQRCodeUrl)

import Calculation exposing (calculateAusgleichsanspruch, calculateVerteilbarerBetrag)
import Constants exposing (getKindergeld)
import Elternteil exposing (calculateEinkommen, calculateWeitereEinkuenfte, getAkusativElternTitle, getDativElternTitle, sumAbzugsposten)
import Html exposing (Html)
import Html.Attributes
import Image
import Json.Decode as Decode
import Json.Encode as Encode
import QRCode
import Types exposing (Elternteil, HaftungsbetragQuelle(..), Kind, Model, Person(..), Selbstbehalt(..), StringFieldType, ZusatzbedarfTyp)
import Utils.Format exposing (formatEuroRounded, formatInputToFloat, personToString, stringToMaybePerson)



-- Module Logic for Import & Export Functions
-- Encode Ergebnis für PDF-Erstellung mit Zwischenschritte and QR-Code URL


encodeErgebnis : Model -> Encode.Value
encodeErgebnis model =
    let
        ergebnis =
            calculateAusgleichsanspruch model

        qrCodeBase64 =
            getQRCodeUrl (encodeModeltoQRCode model)

        mehrbedarfSum =
            List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.mehrbedarf)

        sonderbedarfSum =
            List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.sonderbedarf)

        zusatzbedarfSum =
            mehrbedarfSum + sonderbedarfSum

        regelbedarfValue =
            Maybe.withDefault 0 ergebnis.regelbedarf

        kindEinkuenfteSum =
            List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.einkuenfte)

        bedarfOhneZusatzbedarf =
            max 0 (regelbedarfValue - kindEinkuenfteSum)

        anteilVaterOhneZusatzbedarf =
            ergebnis.haftungsanteilVater * bedarfOhneZusatzbedarf

        anteilMutterOhneZusatzbedarf =
            ergebnis.haftungsanteilMutter * bedarfOhneZusatzbedarf

        differenzOhneZusatzbedarf =
            abs (anteilVaterOhneZusatzbedarf - anteilMutterOhneZusatzbedarf)

        auszugleichenderBetragOhneZusatzbedarf =
            differenzOhneZusatzbedarf / 2

        anspruchsberechtigtOhneZusatzbedarf =
            if anteilVaterOhneZusatzbedarf > anteilMutterOhneZusatzbedarf then
                Mutter

            else
                Vater

        nichtAnspruchsberechtigtOhneZusatzbedarf =
            if anspruchsberechtigtOhneZusatzbedarf == Vater then
                Mutter

            else
                Vater

        zusatzbedarfItems =
            model.kind.mehrbedarf ++ model.kind.sonderbedarf

        zusatzbedarfVonVaterAnMutter =
            zusatzbedarfItems
                |> List.filter (\item -> item.bezahltVon == Just Mutter)
                |> List.map (\item -> (formatInputToFloat item.kosten |> Maybe.withDefault 0) * ergebnis.haftungsanteilVater)
                |> List.sum

        zusatzbedarfVonMutterAnVater =
            zusatzbedarfItems
                |> List.filter (\item -> item.bezahltVon == Just Vater)
                |> List.map (\item -> (formatInputToFloat item.kosten |> Maybe.withDefault 0) * ergebnis.haftungsanteilMutter)
                |> List.sum

        differenzNachAnrechnung =
            abs (ergebnis.anteilVaterGesamtbedarf - ergebnis.anteilMutterGesamtbedarf)

        auszugleichenderBetragNachAnrechnung =
            differenzNachAnrechnung / 2

        anspruchsberechtigtNachAnrechnung =
            if ergebnis.anteilVaterGesamtbedarf > ergebnis.anteilMutterGesamtbedarf then
                Mutter

            else
                Vater

        nichtAnspruchsberechtigtNachAnrechnung =
            if anspruchsberechtigtNachAnrechnung == Vater then
                Mutter

            else
                Vater

        kindergeldBetreuungsanteilAusgleich =
            toFloat (getKindergeld model.jahr) / 4

        ausgleichsanspruchNachAnrechnung =
            if anspruchsberechtigtNachAnrechnung == Mutter then
                if model.kindergeldEmpfaenger == Vater then
                    auszugleichenderBetragNachAnrechnung + kindergeldBetreuungsanteilAusgleich

                else
                    auszugleichenderBetragNachAnrechnung - kindergeldBetreuungsanteilAusgleich

            else if model.kindergeldEmpfaenger == Mutter then
                auszugleichenderBetragNachAnrechnung + kindergeldBetreuungsanteilAusgleich

            else
                auszugleichenderBetragNachAnrechnung - kindergeldBetreuungsanteilAusgleich

        encodeElternteil person =
            let
                p =
                    case person of
                        Vater ->
                            model.vater

                        Mutter ->
                            model.mutter

                einkommen =
                    calculateEinkommen p

                abzuege =
                    sumAbzugsposten p.abzugsposten

                bereinigt =
                    einkommen - abzuege

                ( haftungsanteil, baranteil ) =
                    case person of
                        Vater ->
                            ( ergebnis.haftungsanteilVater * 100, ergebnis.baranteilVater )

                        Mutter ->
                            ( ergebnis.haftungsanteilMutter * 100, ergebnis.baranteilMutter )

                verteilbarerBetrag =
                    calculateVerteilbarerBetrag bereinigt person model
            in
            Encode.object
                [ ( "haupttaetigkeit", Encode.string (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat p.haupttaetigkeit))) )
                , ( "weitereEinkuenfte"
                  , Encode.list encodeStringFieldType
                        (p.weitereEinkuenfte
                            |> List.filter (\item -> not (String.isEmpty item.kosten))
                        )
                  )
                , ( "weitereEinkuenfteGesamt", Encode.string (formatEuroRounded (calculateWeitereEinkuenfte p.weitereEinkuenfte)) )
                , ( "einkommen", Encode.string (formatEuroRounded einkommen) )
                , ( "abzugsposten"
                  , Encode.list encodeStringFieldType
                        (p.abzugsposten
                            |> List.filter (\item -> not (String.isEmpty item.kosten))
                        )
                  )
                , ( "abzuegeGesamt", Encode.string (formatEuroRounded abzuege) )
                , ( "bereinigtesEinkommen", Encode.string (formatEuroRounded bereinigt) )
                , ( "selbstbehalt", encodeSelbstbehalt p.selbstbehalt )
                , ( "haftungsanteil", Encode.string (formatEuroRounded haftungsanteil) )
                , ( "baranteil", Encode.string (formatEuroRounded baranteil) )
                , ( "betreuungsanteil", Encode.string (formatEuroRounded ergebnis.betreuungsanteil) )
                , ( "verteilbarerBetrag", Encode.string (formatEuroRounded verteilbarerBetrag) )
                ]
    in
    Encode.object
        [ ( "jahr", Encode.string model.jahr )
        , ( "monat", Encode.string model.monat )
        , ( "vater", encodeElternteil Vater )
        , ( "mutter", encodeElternteil Mutter )
        , ( "gesamtEinkommen", Encode.string (formatEuroRounded ergebnis.gesamtEinkommen) )
        , ( "verteilbarerBetragGesamt", Encode.string (formatEuroRounded ergebnis.verteilbarerBetragGesamt) )

        --
        , ( "kindsalter", Encode.int model.kind.alter )
        , ( "regelbedarf", Encode.string (formatEuroRounded (Maybe.withDefault 0 ergebnis.regelbedarf)) )
        , ( "customRegelbedarf", Encode.bool model.customRegelbedarf )
        , ( "kindeinkuenfte"
          , Encode.list encodeStringFieldType
                (model.kind.einkuenfte
                    |> List.filter
                        (\item -> not (String.isEmpty item.kosten))
                )
          )
        , ( "einkuenfteGesamt", Encode.string (formatEuroRounded (List.sum (List.map (\item -> formatInputToFloat item.kosten |> Maybe.withDefault 0) model.kind.einkuenfte))) )
        , ( "mehrbedarf"
          , Encode.list encodeZusatzbedarf
                (model.kind.mehrbedarf
                    |> List.filter
                        (\item -> not (String.isEmpty item.kosten))
                )
          )
        , ( "sonderbedarf"
          , Encode.list encodeZusatzbedarf
                (model.kind.sonderbedarf
                    |> List.filter
                        (\item -> not (String.isEmpty item.kosten))
                )
          )
        , ( "erbrachteLeistungen"
          , Encode.list encodeZusatzbedarf
                (model.kind.erbrachteLeistungen
                    |> List.filter
                        (\item -> not (String.isEmpty item.kosten))
                )
          )
        , ( "sonderbedarfSum", Encode.string (formatEuroRounded sonderbedarfSum) )
        , ( "mehrbedarfSum", Encode.string (formatEuroRounded mehrbedarfSum) )
        , ( "zusatzbedarfSum", Encode.string (formatEuroRounded zusatzbedarfSum) )
        , ( "gesamtbedarf_ohneGetrageneZusatzbedarf", Encode.string (formatEuroRounded ergebnis.gesamtKindbedarf_ohneGetrageneZusatzbedarf) )
        , ( "gesamtbedarf_mitGetrageneZusatzbedarf", Encode.string (formatEuroRounded ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf) )
        , ( "kindergeld", Encode.int (getKindergeld model.jahr) )
        , ( "kindergeldEmpfaenger", Encode.string (personToString model.kindergeldEmpfaenger) )
        , ( "anspruchsberechtigt", Encode.string (personToString ergebnis.anspruchsberechtigt) )
        , ( "nichtanspruchsberechtigt", Encode.string (personToString ergebnis.nichtanspruchsberechtigt) )
        , ( "haftungsbetragVater", Encode.string (formatEuroRounded ergebnis.haftungsbetragVater) )
        , ( "haftungsbetragMutter", Encode.string (formatEuroRounded ergebnis.haftungsbetragMutter) )
        , ( "haftungsbetragVaterVorBegrenzung", Encode.string (formatEuroRounded ergebnis.haftungsbetragVaterVorBegrenzung) )
        , ( "haftungsbetragMutterVorBegrenzung", Encode.string (formatEuroRounded ergebnis.haftungsbetragMutterVorBegrenzung) )
        , ( "anteilVaterGesamtbedarf", Encode.string (formatEuroRounded ergebnis.anteilVaterGesamtbedarf) )
        , ( "anteilMutterGesamtbedarf", Encode.string (formatEuroRounded ergebnis.anteilMutterGesamtbedarf) )
        , ( "haftungsbetragVaterSpiegel", Encode.string (formatEuroRounded (Maybe.withDefault 0 model.haftungsbetragVaterSpiegel)) )
        , ( "haftungsbetragMutterSpiegel", Encode.string (formatEuroRounded (Maybe.withDefault 0 model.haftungsbetragMutterSpiegel)) )
        , ( "differenzAnteil", Encode.string (formatEuroRounded ergebnis.differenzAnteil) )
        , ( "bedarfOhneZusatzbedarf", Encode.string (formatEuroRounded bedarfOhneZusatzbedarf) )
        , ( "anteilVaterOhneZusatzbedarf", Encode.string (formatEuroRounded anteilVaterOhneZusatzbedarf) )
        , ( "anteilMutterOhneZusatzbedarf", Encode.string (formatEuroRounded anteilMutterOhneZusatzbedarf) )
        , ( "differenzOhneZusatzbedarf", Encode.string (formatEuroRounded differenzOhneZusatzbedarf) )
        , ( "auszugleichenderBetragOhneZusatzbedarf", Encode.string (formatEuroRounded auszugleichenderBetragOhneZusatzbedarf) )
        , ( "anspruchsberechtigtOhneZusatzbedarf", Encode.string (personToString anspruchsberechtigtOhneZusatzbedarf) )
        , ( "nichtAnspruchsberechtigtOhneZusatzbedarf", Encode.string (personToString nichtAnspruchsberechtigtOhneZusatzbedarf) )
        , ( "zusatzbedarfVonVaterAnMutter", Encode.string (formatEuroRounded zusatzbedarfVonVaterAnMutter) )
        , ( "zusatzbedarfVonMutterAnVater", Encode.string (formatEuroRounded zusatzbedarfVonMutterAnVater) )
        , ( "differenzNachAnrechnung", Encode.string (formatEuroRounded differenzNachAnrechnung) )
        , ( "auszugleichenderBetragNachAnrechnung", Encode.string (formatEuroRounded auszugleichenderBetragNachAnrechnung) )
        , ( "anspruchsberechtigtNachAnrechnung", Encode.string (personToString anspruchsberechtigtNachAnrechnung) )
        , ( "nichtAnspruchsberechtigtNachAnrechnung", Encode.string (personToString nichtAnspruchsberechtigtNachAnrechnung) )
        , ( "haftungsbetragVaterInput"
          , Encode.string model.haftungsbetragVaterInput
          )
        , ( "haftungsbetragMutterInput"
          , Encode.string model.haftungsbetragMutterInput
          )
        , ( "hftInput"
          , Encode.string
                (case model.haftungsbetragQuelle of
                    Just Vorschlag ->
                        "Vorschlag"

                    Just Individuell ->
                        "Individuell"

                    Nothing ->
                        ""
                )
          )
        , ( "kindergeldBetreuungsanteilAusgleich", Encode.string (formatEuroRounded kindergeldBetreuungsanteilAusgleich) )
        , ( "ausgleichsanspruchNachAnrechnung", Encode.string (formatEuroRounded ausgleichsanspruchNachAnrechnung) )
        , ( "abzufuehrendesKindergeld", Encode.string (formatEuroRounded ergebnis.abzufuehrendesKindergeld) )
        , ( "abzVon", Encode.string (getDativElternTitle ergebnis.anspruchsberechtigt) )
        , ( "abzAn", Encode.string (getAkusativElternTitle ergebnis.nichtanspruchsberechtigt) )
        , ( "auszugleichenderBetrag", Encode.string (formatEuroRounded ergebnis.auszugleichenderBetrag) )
        , ( "haelftigesKindergeld", Encode.string (formatEuroRounded (toFloat (getKindergeld model.jahr) / 2)) )
        , ( "ausgleichsanspruch", Encode.string (formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)) )
        , ( "qrCodeBase64"
          , case qrCodeBase64 of
                Just base64 ->
                    Encode.string base64

                Nothing ->
                    Encode.null
          )
        , ( "freitext", Encode.string model.freitext )
        ]



-- ENCODE TO QR-Code Inhalt (JSON-Format)


encodeModeltoQRCode : Model -> String
encodeModeltoQRCode model =
    let
        qrData =
            Encode.object
                [ ( "mo", Encode.string model.monat )
                , ( "ja", Encode.string model.jahr )
                , ( "ki"
                  , Encode.object
                        [ ( "alt", Encode.int model.kind.alter )
                        , ( "alti", Encode.string model.kind.alterInput )
                        , ( "mehr", Encode.list encodeZusatzbedarf model.kind.mehrbedarf )
                        , ( "sonder", Encode.list encodeZusatzbedarf model.kind.sonderbedarf )
                        , ( "erbrachteLeistungen", Encode.list encodeZusatzbedarf model.kind.erbrachteLeistungen )
                        , ( "eink", Encode.list encodeStringFieldType model.kind.einkuenfte )
                        , ( "reg", Encode.string model.kind.regelbedarf )
                        ]
                  )
                , ( "vat"
                  , Encode.object
                        [ ( "hp", Encode.string model.vater.haupttaetigkeit )
                        , ( "we", Encode.list encodeStringFieldType model.vater.weitereEinkuenfte )
                        , ( "abz", Encode.list encodeStringFieldType model.vater.abzugsposten )
                        , ( "slb", encodeSelbstbehalt model.vater.selbstbehalt )
                        , ( "avg", Encode.list encodeStringFieldType model.vater.einkommenZumDurchschnittsberechnung )
                        ]
                  )
                , ( "mut"
                  , Encode.object
                        [ ( "hp", Encode.string model.mutter.haupttaetigkeit )
                        , ( "we", Encode.list encodeStringFieldType model.mutter.weitereEinkuenfte )
                        , ( "abz", Encode.list encodeStringFieldType model.mutter.abzugsposten )
                        , ( "slb", encodeSelbstbehalt model.mutter.selbstbehalt )
                        , ( "avg", Encode.list encodeStringFieldType model.mutter.einkommenZumDurchschnittsberechnung )
                        ]
                  )
                , ( "kemp", Encode.string (personToString model.kindergeldEmpfaenger) )
                , ( "frei", Encode.string model.freitext )
                , ( "togCustomReg", Encode.bool model.customRegelbedarf )
                ]
    in
    Encode.encode 0 qrData


encodeStringFieldType : { kosten : String, bezeichnung : String } -> Encode.Value
encodeStringFieldType field =
    Encode.object
        [ ( "kos", Encode.string (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat field.kosten))) )
        , ( "bez", Encode.string field.bezeichnung )
        ]


encodeZusatzbedarf : ZusatzbedarfTyp -> Encode.Value
encodeZusatzbedarf field =
    Encode.object
        [ ( "kos", Encode.string (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat field.kosten))) )
        , ( "bez", Encode.string field.bezeichnung )
        , ( "bezahltVon", Encode.string (getStringBezahltVon field.bezahltVon) )
        ]


getStringBezahltVon : Maybe Person -> String
getStringBezahltVon maybePerson =
    case maybePerson of
        Nothing ->
            "Nicht angegeben"

        Just Vater ->
            "Vater"

        Just Mutter ->
            "Mutter"



-- Encoder for Selbstbehalt


encodeSelbstbehalt : Selbstbehalt -> Encode.Value
encodeSelbstbehalt selbstbehalt =
    case selbstbehalt of
        Angemessen betrag ->
            Encode.object
                [ ( "typ", Encode.string "Angemessen" )
                , ( "betrag", Encode.string (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat betrag))) )
                ]

        NotwendigErwerbstaetig betrag ->
            Encode.object
                [ ( "typ", Encode.string "NotwendigErwerbstaetig" )
                , ( "betrag", Encode.string (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat betrag))) )
                ]

        NotwendigNichtErwerbstaetig betrag ->
            Encode.object
                [ ( "typ", Encode.string "NotwendigNichtErwerbstaetig" )
                , ( "betrag", Encode.string (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat betrag))) )
                ]

        Benutzerdefiniert betrag ->
            Encode.object
                [ ( "typ", Encode.string "Benutzerdefiniert" )
                , ( "betrag", Encode.string (formatEuroRounded (Maybe.withDefault 0 (formatInputToFloat betrag))) )
                ]



-- Generate QR-Code with ELM QRCode Library


getQRCodeUrl : String -> Maybe String
getQRCodeUrl message =
    QRCode.fromString message
        |> Result.map
            (\qrCode ->
                QRCode.toImage qrCode
                    |> Image.toPngUrl
             -- QR code als base64 string kodieren
            )
        |> Result.toMaybe



-- Create image display for QR-Code


createQRCodeImage : String -> Html msg
createQRCodeImage message =
    case getQRCodeUrl message of
        Just base64Url ->
            Html.img
                [ Html.Attributes.src base64Url
                , Html.Attributes.width 200 -- fix width
                , Html.Attributes.height 200 -- fix height
                ]
                []

        Nothing ->
            Html.text "Fehler bei der QR-Code-Erzeugung."



-- Decode QR-Code Inhalt (JSON-Format)


decodeQRCodeData : Decode.Decoder { monat : String, jahr : String, kind : Kind, vater : Elternteil, mutter : Elternteil, kindergeldEmpfaenger : String, freitext : String, customRegelbedarf : Bool }
decodeQRCodeData =
    Decode.map8
        (\monat jahr kind vater mutter kindergeldEmpfaenger freitext customRegelbedarf ->
            { monat = monat
            , jahr = jahr
            , kind = kind
            , vater = vater
            , mutter = mutter
            , kindergeldEmpfaenger = kindergeldEmpfaenger
            , freitext = freitext
            , customRegelbedarf = customRegelbedarf
            }
        )
        (Decode.field "mo" Decode.string)
        (Decode.field "ja" Decode.string)
        (Decode.field "ki" decodeKind)
        (Decode.field "vat" decodeElternteil)
        (Decode.field "mut" decodeElternteil)
        (Decode.field "kemp" Decode.string)
        (Decode.field "frei" Decode.string)
        (Decode.field "togCustomReg" Decode.bool)


decodeKind : Decode.Decoder Kind
decodeKind =
    Decode.map7 Kind
        (Decode.field "alt" Decode.int)
        (Decode.oneOf
            [ Decode.field "alti" Decode.string
            , Decode.field "alt" Decode.int |> Decode.map String.fromInt
            ]
        )
        (Decode.field "mehr" (Decode.list decodeZusatzbedarf))
        (Decode.field "sonder" (Decode.list decodeZusatzbedarf))
        (Decode.oneOf
            [ Decode.field "erbrachteLeistungen" (Decode.list decodeZusatzbedarf)
            , Decode.succeed []
            ]
        )
        (Decode.field "eink" (Decode.list decodeStringFieldType))
        (Decode.field "reg" Decode.string)


decodeElternteil : Decode.Decoder Elternteil
decodeElternteil =
    Decode.map6 Elternteil
        (Decode.field "hp" Decode.string)
        (Decode.field "we" (Decode.list decodeStringFieldType))
        (Decode.field "abz" (Decode.list decodeStringFieldType))
        (Decode.field "slb" decodeSelbstbehalt)
        (Decode.succeed False)
        (Decode.oneOf
            [ Decode.field "avg" (Decode.list decodeStringFieldType)
            , Decode.succeed [ { kosten = "", bezeichnung = "" } ]
            ]
        )


decodeStringFieldType : Decode.Decoder StringFieldType
decodeStringFieldType =
    Decode.map2 StringFieldType
        (Decode.field "kos" Decode.string)
        (Decode.field "bez" Decode.string)


decodeZusatzbedarf : Decode.Decoder ZusatzbedarfTyp
decodeZusatzbedarf =
    Decode.map3 ZusatzbedarfTyp
        (Decode.field "kos" Decode.string)
        (Decode.field "bez" Decode.string)
        (Decode.field "bezahltVon" (Decode.string |> Decode.andThen (Decode.succeed << stringToMaybePerson)))


decodeSelbstbehalt : Decode.Decoder Selbstbehalt
decodeSelbstbehalt =
    Decode.oneOf
        [ Decode.field "typ" Decode.string
            |> Decode.andThen
                (\typeString ->
                    case typeString of
                        "Angemessen" ->
                            Decode.map Angemessen (Decode.field "betrag" Decode.string)

                        "NotwendigErwerbstaetig" ->
                            Decode.map NotwendigErwerbstaetig (Decode.field "betrag" Decode.string)

                        "NotwendigNichtErwerbstaetig" ->
                            Decode.map NotwendigNichtErwerbstaetig (Decode.field "betrag" Decode.string)

                        "Benutzerdefiniert" ->
                            Decode.map Benutzerdefiniert (Decode.field "betrag" Decode.string)

                        _ ->
                            Decode.fail ("Unknown Selbstbehalt typ: " ++ typeString)
                )
        ]
