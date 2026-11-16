module Tests exposing (..)

import Calculation exposing (calculateAusgleichsanspruch, calculateBereitsGezahlterZusatzbedarf)
import Expect exposing (equal)
import Kind exposing (calculateGesamtKindbedarf)
import Test exposing (..)
import Types exposing (Person(..), Selbstbehalt(..), Tab(..))
import Utils.Format exposing (formatEuroRounded)



-- Module Tests
-- to run:
-- npm install -g elm-test
-- to check installation: elm-test --version
-- elm-test tests/Tests.elm


suite : Test
suite =
    describe "Ausgleichsanspruch"
        [ test "Fall 1 Einfacher Test" <|
            \_ ->
                let
                    model =
                        { monat = "06"
                        , jahr = "2023"
                        , kind =
                            { alter = 10
                            , mehrbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
                            , sonderbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
                            , einkuenfte = [ { kosten = "", bezeichnung = "" } ]
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "5000"
                            , weitereEinkuenfte = [ { kosten = "300", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = " ", bezeichnung = "" } ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "2500"
                            , weitereEinkuenfte = [ { kosten = "100", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = " ", bezeichnung = "" } ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "109,49"
        , test "Fall 2 Einfacher Test mit mehreren Eingaben" <|
            \_ ->
                let
                    model =
                        { monat = "01"
                        , jahr = "2023"
                        , kind =
                            { alter = 10
                            , mehrbedarf = [ { kosten = "80", bezeichnung = "Zahnspange", bezahltVon = Nothing } ]
                            , sonderbedarf = [ { kosten = "60", bezeichnung = "Hort", bezahltVon = Nothing } ]
                            , einkuenfte = [ { kosten = "", bezeichnung = "" } ]
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "5000"
                            , weitereEinkuenfte = [ { kosten = "300", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = "100", bezeichnung = "Abzugsposten 1" } ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "2500"
                            , weitereEinkuenfte = [ { kosten = "100", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = "200", bezeichnung = "Abzugsposten 1" } ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "180,72"
        , test "Fall 3 Mehrere Abzugsposten" <|
            \_ ->
                let
                    model =
                        { monat = "06"
                        , jahr = "2023"
                        , kind =
                            { alter = 10
                            , mehrbedarf = [ { kosten = "80", bezeichnung = "Zahnspange", bezahltVon = Nothing } ]
                            , sonderbedarf = [ { kosten = "60", bezeichnung = "Hort", bezahltVon = Nothing } ]
                            , einkuenfte = [ { kosten = "", bezeichnung = "" } ]
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "5000"
                            , weitereEinkuenfte = [ { kosten = "300", bezeichnung = " " } ]
                            , abzugsposten =
                                [ { kosten = "100", bezeichnung = "Abzugsposten 1" }
                                , { kosten = "50", bezeichnung = "Abzugsposten 2" }
                                , { kosten = "30", bezeichnung = "Abzugsposten 3" }
                                , { kosten = "10", bezeichnung = "Abzugsposten 4" }
                                , { kosten = "5", bezeichnung = "Abzugsposten 5" }
                                ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "2500"
                            , weitereEinkuenfte = [ { kosten = "100", bezeichnung = " " } ]
                            , abzugsposten =
                                [ { kosten = "100", bezeichnung = "Abzugsposten 1" }
                                , { kosten = "50", bezeichnung = "Abzugsposten 2" }
                                , { kosten = "10", bezeichnung = "Abzugsposten 3" }
                                , { kosten = "10", bezeichnung = "Abzugsposten 4" }
                                , { kosten = "10", bezeichnung = "Abzugsposten 5" }
                                ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "173,37"
        , test "Fall 4 Einfacher Test nur Vater hat Einkommen" <|
            \_ ->
                let
                    model =
                        { monat = "06"
                        , jahr = "2023"
                        , kind =
                            { alter = 10
                            , mehrbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
                            , sonderbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
                            , einkuenfte = [ { kosten = "", bezeichnung = "" } ]
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "5000"
                            , weitereEinkuenfte = [ { kosten = "300", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = " ", bezeichnung = "" } ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = ""
                            , weitereEinkuenfte = [ { kosten = "", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = " ", bezeichnung = "" } ]
                            , selbstbehalt = Angemessen "1650"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "214,50"
        , test "Fall 5 Komplexer Fall" <|
            \_ ->
                let
                    model =
                        { monat = "06"
                        , jahr = "2025"
                        , kind =
                            { alter = 15
                            , mehrbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
                            , sonderbedarf = [ { kosten = "", bezeichnung = "", bezahltVon = Nothing } ]
                            , einkuenfte = [ { kosten = "", bezeichnung = "" } ]
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "4500"
                            , weitereEinkuenfte = [ { kosten = "200", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = "100", bezeichnung = "" } ]
                            , selbstbehalt = Benutzerdefiniert "1500"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "5000"
                            , weitereEinkuenfte = [ { kosten = "300", bezeichnung = " " } ]
                            , abzugsposten = [ { kosten = "200", bezeichnung = "" } ]
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "149,20"
        , test "Fall 6 Einfacher Standardfall" <|
            \_ ->
                let
                    model =
                        { monat = "01"
                        , jahr = "2025"
                        , kind =
                            { alter = 5
                            , mehrbedarf = []
                            , sonderbedarf = []
                            , einkuenfte = []
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "3000"
                            , weitereEinkuenfte = []
                            , abzugsposten = []
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "1800"
                            , weitereEinkuenfte = []
                            , abzugsposten = []
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Vater
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "389,42"
        , test "Fall 7 Beide Elternteile verdienen gleich viel" <|
            \_ ->
                let
                    model =
                        { monat = "02"
                        , jahr = "2025"
                        , kind =
                            { alter = 10
                            , mehrbedarf = []
                            , sonderbedarf = []
                            , einkuenfte = []
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "2800"
                            , weitereEinkuenfte = [ { kosten = "", bezeichnung = "" } ]
                            , abzugsposten = []
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "2800"
                            , weitereEinkuenfte = [ { kosten = "", bezeichnung = "" } ]
                            , abzugsposten = []
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "127,50"
        , test "Fall 8 Hohe Mehrbedarfe" <|
            \_ ->
                let
                    model =
                        { monat = "03"
                        , jahr = "2025"
                        , kind =
                            { alter = 12
                            , mehrbedarf =
                                [ { kosten = "200", bezeichnung = "Nachhilfe", bezahltVon = Nothing }
                                , { kosten = "100", bezeichnung = "Sport", bezahltVon = Nothing }
                                ]
                            , sonderbedarf = []
                            , einkuenfte = []
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "4200"
                            , weitereEinkuenfte = []
                            , abzugsposten = [ { kosten = "150", bezeichnung = "" } ]
                            , selbstbehalt = Benutzerdefiniert "1600"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "3000"
                            , weitereEinkuenfte = []
                            , abzugsposten = []
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "85,82"
        , test "Fall 9 Mutter mit mehreren Einkommen" <|
            \_ ->
                let
                    model =
                        { monat = "05"
                        , jahr = "2025"
                        , kind =
                            { alter = 7
                            , mehrbedarf = []
                            , sonderbedarf = []
                            , einkuenfte = []
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "2300"
                            , weitereEinkuenfte = []
                            , abzugsposten = []
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "1800"
                            , weitereEinkuenfte =
                                [ { kosten = "120", bezeichnung = "" }
                                , { kosten = "80", bezeichnung = "" }
                                ]
                            , abzugsposten = []
                            , selbstbehalt = Benutzerdefiniert "1400"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Vater
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "-113,88"

        -- Negative Ausgleichsanspruch bedeutet, dass der anspruchsberechtigte Elternteil statt zahlen muss bekommt eine Zahlung
        , test "Fall 10 Beide Eltern mit sehr geringem Einkommen" <|
            \_ ->
                let
                    model =
                        { monat = "06"
                        , jahr = "2025"
                        , kind =
                            { alter = 4
                            , mehrbedarf = []
                            , sonderbedarf = []
                            , einkuenfte = []
                            , regelbedarf = ""
                            }
                        , vater =
                            { haupttaetigkeit = "1200"
                            , weitereEinkuenfte = []
                            , abzugsposten = []
                            , selbstbehalt = Angemessen "1750"
                            , showSelbstbehaltOptions = False
                            }
                        , mutter =
                            { haupttaetigkeit = "1000"
                            , weitereEinkuenfte = []
                            , abzugsposten = []
                            , selbstbehalt = Benutzerdefiniert "1400"
                            , showSelbstbehaltOptions = False
                            }
                        , kindergeldEmpfaenger = Mutter
                        , freitext = ""
                        , error = Nothing
                        , showErgebnis = False
                        , showInfo = False
                        , qrResult = Nothing
                        , qrIsProcessing = False
                        , showCameraScanner = False
                        , activeTab = Left
                        , showUeberUns = False
                        , modalExportOpen = False
                        , customRegelbedarf = False
                        }

                    ergebnis =
                        calculateAusgleichsanspruch model

                    ausgleichsanspruch =
                        formatEuroRounded (Maybe.withDefault 0 ergebnis.ausgleichsanspruch)
                in
                Expect.equal ausgleichsanspruch "63,75"
        , test "Kindbedarf zieht Einkünfte des Kindes ab" <|
            \_ ->
                let
                    kind =
                        { alter = 10
                        , mehrbedarf = [ { kosten = "80", bezeichnung = "Nachhilfe", bezahltVon = Nothing } ]
                        , sonderbedarf = [ { kosten = "40", bezeichnung = "Klassenfahrt", bezahltVon = Nothing } ]
                        , einkuenfte = [ { kosten = "70", bezeichnung = "Ausbildung" } ]
                        , regelbedarf = ""
                        }
                in
                Expect.equal (formatEuroRounded (calculateGesamtKindbedarf 500 kind)) "550,00"
        , test "Kindbedarf zieht mehrere Einkünfte des Kindes ab" <|
            \_ ->
                let
                    kind =
                        { alter = 16
                        , mehrbedarf = []
                        , sonderbedarf = []
                        , einkuenfte =
                            [ { kosten = "75", bezeichnung = "Ausbildung" }
                            , { kosten = "50", bezeichnung = "Nebenjob" }
                            ]
                        , regelbedarf = ""
                        }
                in
                Expect.equal (formatEuroRounded (calculateGesamtKindbedarf 500 kind)) "375,00"
        , test "Kindbedarf wird bei höheren Einkünften nicht negativ" <|
            \_ ->
                let
                    kind =
                        { alter = 8
                        , mehrbedarf = [ { kosten = "20", bezeichnung = "Sport", bezahltVon = Nothing } ]
                        , sonderbedarf = []
                        , einkuenfte = [ { kosten = "150", bezeichnung = "Einkünfte" } ]
                        , regelbedarf = ""
                        }
                in
                Expect.equal (formatEuroRounded (calculateGesamtKindbedarf 100 kind)) "0,00"
        , test "Bereits gezahlter Zusatzbedarf summiert Mehrbedarf und Sonderbedarf für den Vater" <|
            \_ ->
                let
                    mehrbedarf =
                        [ { kosten = "25", bezeichnung = "Nachhilfe", bezahltVon = Just Vater }
                        , { kosten = "10", bezeichnung = "Sport", bezahltVon = Nothing }
                        ]

                    sonderbedarf =
                        [ { kosten = "80", bezeichnung = "Klassenfahrt", bezahltVon = Just Vater }
                        , { kosten = "50", bezeichnung = "Brille", bezahltVon = Just Mutter }
                        ]
                in
                Expect.equal (formatEuroRounded (calculateBereitsGezahlterZusatzbedarf Vater mehrbedarf sonderbedarf)) "105,00"
        , test "Bereits gezahlter Sonderbedarf wird nur der zahlenden Mutter gutgeschrieben" <|
            \_ ->
                let
                    mehrbedarf =
                        [ { kosten = "25", bezeichnung = "Nachhilfe", bezahltVon = Just Vater } ]

                    sonderbedarf =
                        [ { kosten = "50", bezeichnung = "Brille", bezahltVon = Just Mutter }
                        , { kosten = "30", bezeichnung = "Laptop", bezahltVon = Nothing }
                        ]
                in
                Expect.equal (formatEuroRounded (calculateBereitsGezahlterZusatzbedarf Mutter mehrbedarf sonderbedarf)) "50,00"
        ]
