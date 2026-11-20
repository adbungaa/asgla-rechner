module Types exposing
    ( AktionBedarf(..)
    , AktionCameraScanner(..)
    , AktionExport(..)
    , AktionImportFile(..)
    , AktionPosten(..)
    , AktionToggleViewComponent(..)
    , AktionUpdate(..)
    , AktionUpdateElternDaten(..)
    , AktionUpdateKind(..)
    , BedarfsTyp(..)
    , Einkommensgruppe
    , Elternteil
    , Ergebnis
    , FileType(..)
    , HaftungsbetragQuelle(..)
    , Jahrgangstabelle
    , Kind
    , Model
    , MonthYear
    , Msg(..)
    , Person(..)
    , PostenType(..)
    , Selbstbehalt(..)
    , StringFieldType
    , Tab(..)
    , TabelleEintrag
    , ZusatzbedarfTyp
    )

import File exposing (File)


type alias Model =
    { monat : String
    , jahr : String
    , kind : Kind
    , vater : Elternteil
    , mutter : Elternteil
    , kindergeldEmpfaenger : Person
    , freitext : String
    , showErgebnis : Bool
    , error : Maybe String
    , qrResult : Maybe String
    , qrIsProcessing : Bool
    , showCameraScanner : Bool
    , activeTab : Tab
    , showUeberUns : Bool
    , modalExportOpen : Bool
    , customRegelbedarf : Bool
    , durchschnittseinkommen : Bool
    , vorschlagHft : Bool

    -- Vorschlag oder manuelle (individuelle) Eingabe der Haftungsbeträge
    , haftungsbetragQuelle : Maybe HaftungsbetragQuelle
    , haftungsbetragVaterInput : String
    , haftungsbetragMutterInput : String
    , haftungsbetragVaterUebernommen : Maybe Float
    , haftungsbetragMutterUebernommen : Maybe Float
    , haftungsbetragVaterSpiegel : Maybe Float
    , haftungsbetragMutterSpiegel : Maybe Float
    }


type alias Elternteil =
    { haupttaetigkeit : String
    , weitereEinkuenfte : List StringFieldType
    , abzugsposten : List StringFieldType
    , selbstbehalt : Selbstbehalt
    , showSelbstbehaltOptions : Bool
    , einkommenZumDurchschnittsberechnung : List StringFieldType
    }


type alias Kind =
    { alter : Int
    , alterInput : String
    , mehrbedarf : List ZusatzbedarfTyp
    , sonderbedarf : List ZusatzbedarfTyp
    , erbrachteLeistungen : List ZusatzbedarfTyp
    , einkuenfte : List StringFieldType
    , regelbedarf : String
    }


type alias Ergebnis =
    { regelbedarf : Maybe Float
    , einkommenVater : Float
    , weitereEinkuenfteVater : Float
    , einkommenMutter : Float
    , weitereEinkuenfteMutter : Float
    , bereinigtesEinkommenVater : Float
    , bereinigtesEinkommenMutter : Float
    , gesamtEinkommen : Float
    , gesamtAbzugVater : Float
    , gesamtAbzugMutter : Float
    , haftungsanteilVater : Float
    , haftungsanteilMutter : Float
    , baranteilVater : Float
    , baranteilMutter : Float
    , betreuungsanteil : Float
    , ausgleichsanspruch : Maybe Float
    , anspruchsberechtigt : Person
    , nichtanspruchsberechtigt : Person
    , verteilbarerBetragVater : Float
    , verteilbarerBetragMutter : Float
    , verteilbarerBetragGesamt : Float
    , gesamtKindbedarf_mitGetrageneZusatzbedarf : Float
    , gesamtKindbedarf_ohneGetrageneZusatzbedarf : Float
    , anteilVaterGesamtbedarf : Float
    , anteilMutterGesamtbedarf : Float
    , differenzAnteil : Float
    , auszugleichenderBetrag : Float
    , abzufuehrendesKindergeld : Float
    , anteilVaterOhneZusatzbedarf : Float
    , anteilMutterOhneZusatzbedarf : Float
    , haftungsbetragVaterVorBegrenzung : Float
    , haftungsbetragMutterVorBegrenzung : Float
    , haftungsbetragVater : Float
    , haftungsbetragMutter : Float
    }


type alias MonthYear =
    { month : String
    , year : String
    }


type alias Einkommensgruppe =
    { einkommenVon : Int
    , einkommenBis : Int
    , regelbedarf : Float
    }


type alias TabelleEintrag =
    { altersgruppe : String
    , einkommensgruppen : List Einkommensgruppe
    }


type alias Jahrgangstabelle =
    { jahr : String
    , eintraege : List TabelleEintrag
    }


type Person
    = Vater
    | Mutter


type HaftungsbetragQuelle
    = Vorschlag
    | Individuell


type Selbstbehalt
    = Angemessen String
    | NotwendigErwerbstaetig String
    | NotwendigNichtErwerbstaetig String
    | Benutzerdefiniert String


type alias ZusatzbedarfTyp =
    { kosten : String
    , bezeichnung : String
    , bezahltVon : Maybe Person
    }


type alias StringFieldType =
    { kosten : String
    , bezeichnung : String
    }


type AktionUpdateElternDaten
    = UpdateHaupttaetigkeit String
    | ChangePosten AktionPosten
    | UpdateSelbstbehalt Selbstbehalt
    | ApplyDurchschnittseinkommen


type AktionPosten
    = AddPosten PostenType
    | RemovePosten PostenType Int
    | UpdatePosten PostenType Int StringFieldType
    | AddAbzugsVorlage String String


type PostenType
    = Abzugsposten
    | WeitereEinkuenfte
    | EinkommenzumDurchschnittsberechnung


type AktionUpdateKind
    = UpdateAlter String
    | AddEinkuenfte
    | RemoveEinkuenfte Int
    | UpdateEinkuenfte Int StringFieldType
    | ChangeBedarf AktionBedarf
    | UpdateRegelbedarf String


type AktionBedarf
    = AddBedarf BedarfsTyp
    | RemoveBedarf BedarfsTyp Int
    | UpdateBedarf BedarfsTyp Int ZusatzbedarfTyp


type BedarfsTyp
    = Mehrbedarf
    | Sonderbedarf
    | ErbrachteLeistungen


type FileType
    = ImageFile
    | JsonFile


type Tab
    = Left
    | Middle
    | Right


type AktionImportFile
    = OpenFile FileType
    | OnFileSelected FileType File
    | OnFileRead String
    | QRDecoded String
    | QRError String


type AktionCameraScanner
    = OpenCameraContainer
    | StopCameraScanner
    | CameraScannerStarted Bool


type AktionExport
    = ExportPdf
    | CopyJsonToClipboard
    | DownloadJson
    | DownloadQrCode


type AktionToggleViewComponent
    = ViewErgebnis
    | ToggleSelbstbehaltOptions Person
    | ToggleUeberUns
    | ToggleSaveModal
    | Select Tab
    | ToggleCustomRegelbedarf
    | ToggleDurchschnittseinkommen
    | ToggleVorschlagHft


type AktionUpdate
    = UpdateMonat String
    | UpdateJahr String
    | UpdateFreitext String
    | UpdateKindergeldEmpfaenger Person
    | GetMonthYear MonthYear


type Msg
    = Update AktionUpdate
    | UpdateKindDaten AktionUpdateKind
    | UpdateElternDaten Person AktionUpdateElternDaten
    | ImportFile AktionImportFile
    | CameraScanner AktionCameraScanner
    | ToggleView AktionToggleViewComponent
    | Export AktionExport
    | OpenSkriptPdf
    | UpdateHaftungsbetragInput Person String
    | ApplyHaftungsbetraege Float Float HaftungsbetragQuelle
