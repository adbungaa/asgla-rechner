port module Main exposing (..)

import Browser
import Calculation exposing (calculateAusgleichsanspruch)
import Constants exposing (getRegelbedarf)
import Elternteil exposing (addAbzugsVorlage, addPosten, calculateGesamtEinkommen, removePosten, toggleSelbstbehaltOption, updatePosten, updateSelbstbehalt)
import File
import File.Select as Select
import Html exposing (a, div, i, section, text)
import Html.Attributes exposing (class, style, value)
import ImportExport exposing (decodeQRCodeData, encodeErgebnis, encodeModeltoQRCode, getQRCodeUrl)
import Json.Decode as Decode
import Json.Encode as Encode
import Kind exposing (addBedarf, removeAt, removeBedarf, updateBedarf)
import Task
import Types
    exposing
        ( AktionBedarf(..)
        , AktionCameraScanner(..)
        , AktionExport(..)
        , AktionImportFile(..)
        , AktionPosten(..)
        , AktionToggleViewComponent(..)
        , AktionUpdate(..)
        , AktionUpdateElternDaten(..)
        , AktionUpdateKind(..)
        , Elternteil
        , FileType(..)
        , Kind
        , Model
        , MonthYear
        , Msg(..)
        , Person(..)
        , Selbstbehalt(..)
        , StringFieldType
        , Tab(..)
        , ZusatzbedarfTyp
        )
import Utils.Format exposing (formatEuroRounded, formatInputToFloat, stringToPerson)
import Utils.Validation exposing (areInputsValid, inputAgeOrBirthdayToAge)
import View.Components exposing (cameraScanner, importFileSection, showErgebnis, ueberUnsSection)
import View.Layout exposing (viewFooter, viewForm, viewHeader)


init : () -> ( Model, Cmd msg )
init _ =
    ( { monat = "Januar" -- FALLBACK
      , jahr = "2023" -- FALLBACK
      , kind =
            { alter = 0
            , alterInput = ""
            , mehrbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
            , sonderbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
            , einkuenfte = [ { kosten = "", bezeichnung = "" } ]
            , regelbedarf = ""
            , erbrachteLeistungen = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
            }
      , vater =
            { haupttaetigkeit = ""
            , weitereEinkuenfte = [ { kosten = "", bezeichnung = " " } ]

            -- " " fix that "" is being ignored as empty input by browser
            , abzugsposten = [ { kosten = "", bezeichnung = "" } ]
            , selbstbehalt = Angemessen "1750"
            , showSelbstbehaltOptions = False
            , einkommenZumDurchschnittsberechnung = [ { kosten = "", bezeichnung = "" } ]
            }
      , mutter =
            { haupttaetigkeit = ""
            , weitereEinkuenfte = [ { kosten = "", bezeichnung = " " } ]
            , abzugsposten = [ { kosten = "", bezeichnung = "" } ]
            , selbstbehalt = Angemessen "1750"
            , showSelbstbehaltOptions = False
            , einkommenZumDurchschnittsberechnung = [ { kosten = "", bezeichnung = "" } ]
            }
      , kindergeldEmpfaenger = Mutter
      , freitext = ""
      , error = Nothing
      , showErgebnis = False
      , qrResult = Nothing
      , qrIsProcessing = False
      , showCameraScanner = False
      , activeTab = Left
      , showUeberUns = False
      , modalExportOpen = False
      , customRegelbedarf = False
      , durchschnittseinkommen = False
      , vorschlagHft = False
      , haftungsbetragQuelle = Nothing
      , haftungsbetragVaterInput = ""
      , haftungsbetragMutterInput = ""
      , haftungsbetragVaterUebernommen = Nothing
      , haftungsbetragMutterUebernommen = Nothing
      , haftungsbetragVaterSpiegel = Nothing
      , haftungsbetragMutterSpiegel = Nothing
      }
    , getMonthandYear ()
      -- Auto-update current month and year to model
    )


resetHaftungswerte : Model -> Model
resetHaftungswerte model =
    { model
        | haftungsbetragQuelle = Nothing
        , haftungsbetragVaterInput = ""
        , haftungsbetragMutterInput = ""
        , haftungsbetragVaterUebernommen = Nothing
        , haftungsbetragMutterUebernommen = Nothing
        , haftungsbetragVaterSpiegel = Nothing
        , haftungsbetragMutterSpiegel = Nothing
        , vorschlagHft = False
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateHaftungsbetragInput person inputValue ->
            case person of
                Vater ->
                    ( { model | haftungsbetragVaterInput = inputValue }, Cmd.none )

                Mutter ->
                    ( { model | haftungsbetragMutterInput = inputValue }, Cmd.none )

        ApplyHaftungsbetraege vater mutter quelle ->
            ( { model
                | haftungsbetragVaterUebernommen = Just vater
                , haftungsbetragMutterUebernommen = Just mutter
                , haftungsbetragQuelle = Just quelle
              }
            , Cmd.none
            )

        Update a ->
            case a of
                UpdateMonat val ->
                    ( { model | showErgebnis = False, monat = val, kind = recalculateKindAlter val model.jahr model.kind }, Cmd.none )

                UpdateJahr val ->
                    let
                        updatedSelbstbehaltVater =
                            updateSelbstbehalt model.vater.selbstbehalt val

                        updatedVater =
                            updateElternDaten model.vater model.vater.haupttaetigkeit model.vater.weitereEinkuenfte model.vater.abzugsposten updatedSelbstbehaltVater

                        updatedSelbstbehaltMutter =
                            updateSelbstbehalt model.mutter.selbstbehalt val

                        updatedMutter =
                            updateElternDaten model.mutter model.mutter.haupttaetigkeit model.mutter.weitereEinkuenfte model.mutter.abzugsposten updatedSelbstbehaltMutter

                        showTabelle =
                            False
                    in
                    ( { model | jahr = val, vater = updatedVater, mutter = updatedMutter, kind = recalculateKindAlter model.monat val model.kind, showErgebnis = showTabelle }, Cmd.none )

                UpdateFreitext val ->
                    ( { model | showErgebnis = False, freitext = val }, Cmd.none )

                UpdateKindergeldEmpfaenger person ->
                    ( { model | showErgebnis = False, kindergeldEmpfaenger = person }, Cmd.none )

                GetMonthYear val ->
                    ( { model | monat = val.month, jahr = val.year }
                    , Cmd.none
                    )

        UpdateKindDaten a ->
            let
                modelKind =
                    model.kind
            in
            case a of
                UpdateAlter alterInput ->
                    let
                        alter =
                            inputAgeOrBirthdayToAge model.monat model.jahr alterInput
                                |> Maybe.withDefault model.kind.alter

                        updatedKind =
                            updateKindDaten alter alterInput model.kind.mehrbedarf model.kind.sonderbedarf model.kind.regelbedarf model.kind
                    in
                    ( { model | showErgebnis = False, kind = updatedKind }, Cmd.none )

                AddEinkuenfte ->
                    if List.length model.kind.einkuenfte < 5 then
                        let
                            newList =
                                [ { kosten = "", bezeichnung = "" } ]

                            updatedKind =
                                { modelKind | einkuenfte = model.kind.einkuenfte ++ newList }
                        in
                        ( { model | showErgebnis = False, kind = updatedKind, error = Nothing }, Cmd.none )

                    else
                        ( { model | showErgebnis = False, error = Just "Zu viele Posten (Max. 5)" }, Cmd.none )

                RemoveEinkuenfte index ->
                    let
                        newList =
                            removeAt index model.kind.einkuenfte

                        updatedKind =
                            { modelKind | einkuenfte = newList }
                    in
                    ( { model | showErgebnis = False, kind = updatedKind, error = Nothing }, Cmd.none )

                UpdateEinkuenfte index field ->
                    let
                        updatedEinkuenfte =
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
                                model.kind.einkuenfte

                        updatedKind =
                            { modelKind | einkuenfte = updatedEinkuenfte }
                    in
                    ( { model | showErgebnis = False, kind = updatedKind }, Cmd.none )

                ChangeBedarf action ->
                    case action of
                        AddBedarf typ ->
                            ( addBedarf typ model, Cmd.none )

                        RemoveBedarf typ index ->
                            ( removeBedarf typ index model, Cmd.none )

                        UpdateBedarf typ index field ->
                            ( updateBedarf typ index field model, Cmd.none )

                UpdateRegelbedarf val ->
                    let
                        updatedKind =
                            updateKindDaten model.kind.alter model.kind.alterInput model.kind.mehrbedarf model.kind.sonderbedarf val model.kind
                    in
                    ( { model | showErgebnis = False, kind = updatedKind }, Cmd.none )

        UpdateElternDaten person aktion ->
            case ( person, aktion ) of
                ( Vater, UpdateHaupttaetigkeit haupttaetigkeit ) ->
                    let
                        updatedVater =
                            updateElternDaten model.vater haupttaetigkeit model.vater.weitereEinkuenfte model.vater.abzugsposten model.vater.selbstbehalt
                    in
                    ( { model | showErgebnis = False, vater = updatedVater }, Cmd.none )

                ( Mutter, UpdateHaupttaetigkeit haupttaetigkeit ) ->
                    let
                        updatedMutter =
                            updateElternDaten model.mutter haupttaetigkeit model.mutter.weitereEinkuenfte model.mutter.abzugsposten model.mutter.selbstbehalt
                    in
                    ( { model | showErgebnis = False, mutter = updatedMutter }, Cmd.none )

                ( Vater, UpdateSelbstbehalt selb ) ->
                    let
                        updatedVater =
                            updateElternDaten model.vater model.vater.haupttaetigkeit model.vater.weitereEinkuenfte model.vater.abzugsposten (updateSelbstbehalt selb model.jahr)
                    in
                    ( { model | showErgebnis = False, vater = updatedVater }, Cmd.none )

                ( Mutter, UpdateSelbstbehalt selb ) ->
                    let
                        updatedMutter =
                            updateElternDaten model.mutter model.mutter.haupttaetigkeit model.mutter.weitereEinkuenfte model.mutter.abzugsposten (updateSelbstbehalt selb model.jahr)
                    in
                    ( { model | showErgebnis = False, mutter = updatedMutter }, Cmd.none )

                ( Vater, ApplyDurchschnittseinkommen ) ->
                    case calculateDurchschnittseinkommen model.vater.einkommenZumDurchschnittsberechnung of
                        Just durchschnitt ->
                            let
                                updatedVater =
                                    updateElternDaten model.vater (formatEuroRounded durchschnitt) model.vater.weitereEinkuenfte model.vater.abzugsposten model.vater.selbstbehalt
                            in
                            ( { model | showErgebnis = False, vater = updatedVater }, Cmd.none )

                        Nothing ->
                            ( model, Cmd.none )

                ( Mutter, ApplyDurchschnittseinkommen ) ->
                    case calculateDurchschnittseinkommen model.mutter.einkommenZumDurchschnittsberechnung of
                        Just durchschnitt ->
                            let
                                updatedMutter =
                                    updateElternDaten model.mutter (formatEuroRounded durchschnitt) model.mutter.weitereEinkuenfte model.mutter.abzugsposten model.mutter.selbstbehalt
                            in
                            ( { model | showErgebnis = False, mutter = updatedMutter }, Cmd.none )

                        Nothing ->
                            ( model, Cmd.none )

                ( Vater, ChangePosten a ) ->
                    case a of
                        AddPosten postenType ->
                            ( addPosten Vater postenType model, Cmd.none )

                        RemovePosten postenType index ->
                            ( removePosten Vater postenType index model, Cmd.none )

                        UpdatePosten postenType index field ->
                            ( updatePosten Vater postenType index field model, Cmd.none )

                        AddAbzugsVorlage bezeichnung kosten ->
                            ( addAbzugsVorlage Vater bezeichnung kosten model, Cmd.none )

                ( Mutter, ChangePosten a ) ->
                    case a of
                        AddPosten postenType ->
                            ( addPosten Mutter postenType model, Cmd.none )

                        UpdatePosten postenType index field ->
                            ( updatePosten Mutter postenType index field model, Cmd.none )

                        AddAbzugsVorlage bezeichnung kosten ->
                            ( addAbzugsVorlage Mutter bezeichnung kosten model, Cmd.none )

                        RemovePosten postenType index ->
                            ( removePosten Mutter postenType index model, Cmd.none )

        ImportFile a ->
            case a of
                OpenFile fileType ->
                    case fileType of
                        ImageFile ->
                            ( model, Select.file [ "image/*" ] (ImportFile << OnFileSelected ImageFile) )

                        JsonFile ->
                            ( model, Select.file [ "application/json" ] (ImportFile << OnFileSelected JsonFile) )

                OnFileSelected fileType file ->
                    case fileType of
                        ImageFile ->
                            ( model, Task.perform (ImportFile << OnFileRead) (File.toUrl file) )

                        JsonFile ->
                            ( model, Task.perform (ImportFile << QRDecoded) (File.toString file) )

                OnFileRead imageDataUrl ->
                    ( model, sendImageForQRDecode imageDataUrl )

                -- Decode and Update Model
                QRDecoded result ->
                    case Decode.decodeString decodeQRCodeData result of
                        Ok decodedData ->
                            ( { model
                                | qrResult = Just result
                                , qrIsProcessing = False
                                , error = Nothing
                                , monat = decodedData.monat
                                , jahr = decodedData.jahr
                                , kind = decodedData.kind
                                , vater = decodedData.vater
                                , mutter = decodedData.mutter
                                , kindergeldEmpfaenger = stringToPerson decodedData.kindergeldEmpfaenger
                                , freitext = decodedData.freitext
                                , showCameraScanner = False
                                , showErgebnis = False
                                , customRegelbedarf = decodedData.customRegelbedarf
                              }
                            , stopCameraScanner ()
                            )

                        Err err ->
                            ( { model
                                | error = Just ("Error decoding QR code: " ++ Debug.toString err)
                                , qrIsProcessing = False
                                , qrResult = Nothing
                              }
                            , Cmd.none
                            )

                QRError errorMsg ->
                    ( { model
                        | error = Just errorMsg
                        , qrIsProcessing = False
                        , qrResult = Nothing
                        , showCameraScanner = False
                      }
                    , Cmd.none
                    )

        CameraScanner a ->
            case a of
                OpenCameraContainer ->
                    ( { model | showCameraScanner = True, error = Nothing, qrIsProcessing = True }
                    , startCameraScanner ()
                    )

                StartCameraScanner ->
                    ( model, startCameraScanner () )

                StopCameraScanner ->
                    ( { model | showCameraScanner = False, qrIsProcessing = False }
                    , stopCameraScanner ()
                    )

                CameraScannerStarted isStarted ->
                    ( { model | showCameraScanner = isStarted, qrIsProcessing = False }
                    , Cmd.none
                    )

        ToggleView a ->
            case a of
                ViewErgebnis ->
                    let
                        neuesBerechnungsModel =
                            resetHaftungswerte model
                    in
                    if not (areInputsValid neuesBerechnungsModel) then
                        ( { neuesBerechnungsModel
                            | error = Just "Bitte geben Sie mindestens ein Einkommen ein oder korrigieren Sie rot markierte Felder."
                            , showErgebnis = False
                          }
                        , Cmd.none
                        )

                    else if neuesBerechnungsModel.customRegelbedarf then
                        let
                            ergebnisVorAenderung =
                                calculateAusgleichsanspruch neuesBerechnungsModel
                        in
                        ( { neuesBerechnungsModel
                            | haftungsbetragVaterSpiegel = Just ergebnisVorAenderung.haftungsbetragVater
                            , haftungsbetragMutterSpiegel = Just ergebnisVorAenderung.haftungsbetragMutter
                            , error = Nothing
                            , showErgebnis = True
                          }
                        , Cmd.none
                        )

                    else
                        let
                            regelbedarf =
                                getRegelbedarf neuesBerechnungsModel.jahr (calculateGesamtEinkommen neuesBerechnungsModel) neuesBerechnungsModel.kind.alter
                        in
                        case regelbedarf of
                            Nothing ->
                                ( { neuesBerechnungsModel | error = Just "Das Einkommen der Eltern übersteigt die Beträge für die Regelbedarfssätze aus der Düsseldorfer Tabelle. Bitte tragen Sie unter dem Reiter Kind einen individuellen Regelbedarf ein!", showErgebnis = False }, Cmd.none )

                            Just _ ->
                                let
                                    ergebnisVorAenderung =
                                        calculateAusgleichsanspruch neuesBerechnungsModel
                                in
                                ( { neuesBerechnungsModel
                                    | haftungsbetragVaterSpiegel = Just ergebnisVorAenderung.haftungsbetragVater
                                    , haftungsbetragMutterSpiegel = Just ergebnisVorAenderung.haftungsbetragMutter
                                    , error = Nothing
                                    , showErgebnis = True
                                  }
                                , Cmd.none
                                )

                ToggleSelbstbehaltOptions person ->
                    case person of
                        Vater ->
                            let
                                updatedVater =
                                    toggleSelbstbehaltOption model.vater
                            in
                            ( { model | vater = updatedVater }, Cmd.none )

                        Mutter ->
                            let
                                updatedMutter =
                                    toggleSelbstbehaltOption model.mutter
                            in
                            ( { model | mutter = updatedMutter }, Cmd.none )

                ToggleUeberUns ->
                    ( { model | showUeberUns = not model.showUeberUns }, Cmd.none )

                ToggleSaveModal ->
                    { model | modalExportOpen = not model.modalExportOpen }
                        |> (\m -> ( m, Cmd.none ))

                Select tab ->
                    ( { model | activeTab = tab }, Cmd.none )

                ToggleCustomRegelbedarf ->
                    ( { model | customRegelbedarf = not model.customRegelbedarf, showErgebnis = False }, Cmd.none )

                ToggleDurchschnittseinkommen ->
                    ( { model | durchschnittseinkommen = not model.durchschnittseinkommen }, Cmd.none )

                ToggleVorschlagHft ->
                    ( { model | vorschlagHft = not model.vorschlagHft }, Cmd.none )

        Export a ->
            case a of
                ExportPdf ->
                    ( model, generatePdf (encodeErgebnis model) )

                CopyJsonToClipboard ->
                    let
                        jsonString =
                            encodeModeltoQRCode model
                    in
                    ( model, copyToClipboard jsonString )

                DownloadJson ->
                    ( model, downloadFile { name = "Ausgleichsanspruch.json", content = encodeModeltoQRCode model, mimeType = "application/json" } )

                DownloadQrCode ->
                    let
                        pngData =
                            getQRCodeUrl (encodeModeltoQRCode model)

                        -- base64-encoded PNG string
                    in
                    ( model
                    , downloadFile
                        { name = "Ausgleichsanspruch.png"
                        , content = Maybe.withDefault "" pngData
                        , mimeType = "image/png"
                        }
                    )

        OpenSkriptPdf ->
            ( model, openPdfBlob "Skript_ASGLA.pdf" )


updateElternDaten : Elternteil -> String -> List StringFieldType -> List StringFieldType -> Selbstbehalt -> Elternteil
updateElternDaten model haupttaetigkeit weitereEinkuenfte abzugsposten selbstbehalt =
    { model
        | haupttaetigkeit = haupttaetigkeit
        , weitereEinkuenfte = weitereEinkuenfte
        , abzugsposten = abzugsposten
        , selbstbehalt = selbstbehalt
    }


updateKindDaten : Int -> String -> List ZusatzbedarfTyp -> List ZusatzbedarfTyp -> String -> Kind -> Kind
updateKindDaten alter alterInput mehrbedarf sonderbedarf regelbedarf kind =
    { kind
        | alter = alter
        , alterInput = alterInput
        , mehrbedarf = mehrbedarf
        , sonderbedarf = sonderbedarf
        , regelbedarf = regelbedarf
    }


recalculateKindAlter : String -> String -> Kind -> Kind
recalculateKindAlter monat jahr kind =
    { kind
        | alter =
            inputAgeOrBirthdayToAge monat jahr kind.alterInput
                |> Maybe.withDefault kind.alter
    }


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


monthYearDecoder : Decode.Decoder MonthYear
monthYearDecoder =
    Decode.map2 MonthYear
        (Decode.field "month" Decode.string)
        (Decode.field "year" Decode.string)


view : Model -> Browser.Document Msg
view model =
    { title = "ASGLA-Rechner"
    , body =
        [ -- Desktop Version
          section
            [ class "section  is-hidden-mobile"
            , style "background-image" "url('assets/background.png')"
            , style "background-size" "cover"
            , style "background-repeat" "no-repeat"
            , style "background-position" "center"
            , style "background-attachment" "fixed"
            , style "position" "relative"
            , style "background-color" "rgba(255, 255, 255)"
            , style "min-height" "100vh"
            , style "padding" "2rem"
            ]
            [ div
                [ style "position" "absolute"
                , style "top" "0"
                , style "left" "0"
                , style "right" "0"
                , style "bottom" "0"
                , style "background-color" "rgba(0, 0, 0, 0.4)"
                , style "z-index" "1"
                ]
                []
            , div
                [ class "container"
                , style "position" "relative"
                , style "z-index" "2"
                ]
                [ div
                    [ class "box"
                    , style "background-color" " rgb(254, 234, 210)"
                    , style "padding" "1.5rem"
                    , style "margin-bottom" "1.5rem"
                    , style "border-radius" "18px"
                    ]
                    [ viewHeader
                    , ueberUnsSection model
                    , importFileSection model
                    , viewForm model
                    , case model.error of
                        Just msg ->
                            div [ class "notification is-danger ", style "margin-top" "1rem" ] [ text msg ]

                        Nothing ->
                            text ""
                    , if model.showErgebnis then
                        div [ class "box", style "margin" "1rem" ] [ showErgebnis model ]

                      else
                        text ""
                    ]
                ]
            ]

        -- Mobile Version
        , section
            [ class "section is-hidden-tablet"
            , style "background-color" "rgb(254, 234, 210)"
            , style "min-height" "100vh"
            , style "padding" "0.5rem"
            ]
            [ div [ class "container" ]
                [ div
                    [ class "box"
                    , style "background-color" "rgb(254, 234, 210)"
                    , style "padding" "0.75rem"
                    , style "margin-bottom" "0.75rem"
                    , style "border-radius" "12px"
                    ]
                    [ viewHeader
                    , ueberUnsSection model
                    , importFileSection model
                    , viewForm model
                    , case model.error of
                        Just msg ->
                            div [ class "notification is-danger", style "margin-top" "1rem" ] [ text msg ]

                        Nothing ->
                            text ""
                    , if model.showErgebnis then
                        div [ class "box", style "margin" "1rem" ] [ showErgebnis model ]

                      else
                        text ""
                    ]
                ]
            ]
        , cameraScanner model
        , viewFooter
        ]
    }



-- SUBSCRIPTIONS


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Subscriptions to listen for incoming port messages


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ qrDecoded (ImportFile << QRDecoded)
        , qrError (ImportFile << QRError)
        , cameraScannerStarted (CameraScanner << CameraScannerStarted)
        , receiveMonthandYear
            (\value ->
                case Decode.decodeValue monthYearDecoder value of
                    Ok result ->
                        Update (GetMonthYear result)

                    Err _ ->
                        Update (GetMonthYear { month = "", year = "" })
            )
        ]



-- Outgoing Ports


port getMonthandYear : () -> Cmd msg


port generatePdf : Encode.Value -> Cmd msg


port startCameraScanner : () -> Cmd msg


port stopCameraScanner : () -> Cmd msg


port sendImageForQRDecode : String -> Cmd msg


port downloadFile : { name : String, content : String, mimeType : String } -> Cmd msg


port copyToClipboard : String -> Cmd msg


port openPdfBlob : String -> Cmd msg



-- Incoming Ports


port receiveMonthandYear : (Decode.Value -> msg) -> Sub msg


port qrDecoded :
    (String -> msg)
    -> Sub msg -- QR Code Results


port qrError : (String -> msg) -> Sub msg


port cameraScannerStarted :
    (Bool -> msg)
    -> Sub msg -- Camera Status
