module Calculation exposing (calculateAusgleichsanspruch, calculateBereitsGezahlterZusatzbedarf, calculateVerteilbarerBetrag)

import Constants exposing (getKindergeld, getRegelbedarf)
import Elternteil exposing (calculateEinkommen, calculateWeitereEinkuenfte, sumAbzugsposten)
import Kind exposing (calculateGesamtKindbedarf)
import Types exposing (Ergebnis, Model, Person(..), ZusatzbedarfTyp)
import Utils.Format exposing (formatInputToFloat, renderSelbstbehaltBetrag)



-- Module for all calculations related to the Ausgleichsanspruch
-- verteilbarer Betrag (Eltern Einkommen - Selbstbehalt)


calculateVerteilbarerBetrag : Float -> Person -> Model -> Float
calculateVerteilbarerBetrag bereinigtesEinkommen person model =
    let
        selbstbehaltString =
            case person of
                Vater ->
                    renderSelbstbehaltBetrag model.vater.selbstbehalt

                Mutter ->
                    renderSelbstbehaltBetrag model.mutter.selbstbehalt

        selbstbehalt =
            selbstbehaltString
                |> formatInputToFloat
                |> Maybe.withDefault 0
    in
    -- Wenn das bereinigte Einkommen kleiner oder gleich dem Selbstbehalt ist, ist der verteilbare Betrag 0
    if selbstbehalt >= bereinigtesEinkommen then
        0

    else
        bereinigtesEinkommen - selbstbehalt



-- percentage of anteil


calculateAnteil : Float -> Float -> Float
calculateAnteil verteilbarerBetrag verteilbarerBetragGesamt =
    -- Wenn der verteilbare Betrag negativ ist, setze ihn auf 0
    if verteilbarerBetragGesamt == 0 then
        0

    else
        verteilbarerBetrag / verteilbarerBetragGesamt



-- Haftungsanteile in %


calculateBarAnteil : Float -> Float -> Float
calculateBarAnteil baranteil anteil =
    baranteil * anteil


calculateBereitsGezahlterZusatzbedarf : Person -> List ZusatzbedarfTyp -> List ZusatzbedarfTyp -> List ZusatzbedarfTyp -> Float
calculateBereitsGezahlterZusatzbedarf person mehrbedarf sonderbedarf erbrachteLeistungen =
    let
        paidByPerson item =
            item.bezahltVon == Just person

        kosten item =
            formatInputToFloat item.kosten
                |> Maybe.withDefault 0
    in
    (mehrbedarf ++ sonderbedarf ++ erbrachteLeistungen)
        |> List.filter paidByPerson
        |> List.map kosten
        |> List.sum


calculateAusgleichsanspruch : Model -> Ergebnis
calculateAusgleichsanspruch model =
    let
        kindergeld =
            getKindergeld (model.jahr |> String.trim)

        -- Bereinigung der Einkommen
        einkommenVater =
            calculateEinkommen model.vater

        weitereEinkuenfteVater =
            calculateWeitereEinkuenfte model.vater.weitereEinkuenfte

        einkommenMutter =
            calculateEinkommen model.mutter

        weitereEinkuenfteMutter =
            calculateWeitereEinkuenfte model.mutter.weitereEinkuenfte

        gesamtAbzugsVater =
            sumAbzugsposten model.vater.abzugsposten

        gesamtAbzugsMutter =
            sumAbzugsposten model.mutter.abzugsposten

        bereinigtesEinkommenVater =
            einkommenVater - gesamtAbzugsVater

        bereinigtesEinkommenMutter =
            einkommenMutter - gesamtAbzugsMutter

        verteilbarerBetragVater =
            calculateVerteilbarerBetrag bereinigtesEinkommenVater Vater model

        verteilbarerBetragMutter =
            calculateVerteilbarerBetrag bereinigtesEinkommenMutter Mutter model

        verteilbarerBetragGesamt =
            verteilbarerBetragVater + verteilbarerBetragMutter

        -- Haftungsanteile in %
        anteilVater =
            calculateAnteil verteilbarerBetragVater verteilbarerBetragGesamt

        anteilMutter =
            calculateAnteil verteilbarerBetragMutter verteilbarerBetragGesamt

        gesamtEinkommen =
            if anteilVater == 0 && anteilMutter == 0 then
                0

            else if anteilVater == 0 then
                bereinigtesEinkommenMutter

            else if anteilMutter == 0 then
                bereinigtesEinkommenVater

            else
                bereinigtesEinkommenVater
                    + bereinigtesEinkommenMutter

        -- find regelbedarf for the given year, age, and ( ) gesamt Einkommen
        regelbedarf =
            if model.customRegelbedarf then
                formatInputToFloat model.kind.regelbedarf

            else
                getRegelbedarf model.jahr gesamtEinkommen model.kind.alter
    in
    case regelbedarf of
        Nothing ->
            { regelbedarf = Nothing
            , einkommenVater = einkommenVater
            , weitereEinkuenfteVater = weitereEinkuenfteVater
            , einkommenMutter = einkommenMutter
            , weitereEinkuenfteMutter = weitereEinkuenfteMutter
            , bereinigtesEinkommenVater = bereinigtesEinkommenVater
            , bereinigtesEinkommenMutter = bereinigtesEinkommenMutter
            , baranteilVater = 0
            , baranteilMutter = 0
            , gesamtAbzugVater = 0
            , gesamtAbzugMutter = 0
            , betreuungsanteil = 0
            , haftungsanteilVater = 0
            , haftungsanteilMutter = 0
            , ausgleichsanspruch = Nothing
            , anspruchsberechtigt = Vater
            , nichtanspruchsberechtigt = Mutter
            , gesamtEinkommen = gesamtEinkommen
            , verteilbarerBetragVater = 111 -- Dummy-Wert
            , verteilbarerBetragMutter = 111 -- Dummy-Wert
            , verteilbarerBetragGesamt = 0
            , gesamtKindbedarf_ohneGetrageneZusatzbedarf = 0
            , gesamtKindbedarf_mitGetrageneZusatzbedarf = 0
            , haftungsbetragVaterVorBegrenzung = 0
            , haftungsbetragMutterVorBegrenzung = 0
            , haftungsbetragVater = 0
            , haftungsbetragMutter = 0
            , anteilVaterGesamtbedarf = 0
            , anteilMutterGesamtbedarf = 0
            , anteilVaterOhneZusatzbedarf = 0
            , anteilMutterOhneZusatzbedarf = 0
            , differenzAnteil = 0
            , auszugleichenderBetrag = 0
            , abzufuehrendesKindergeld = 0
            }

        Just rBedarf ->
            let
                -- Gesamtbedarf des Kindes
                gesamtKindbedarf_ohneGetrageneZusatzbedarf =
                    calculateGesamtKindbedarf rBedarf model.kind.einkuenfte [] [] (toFloat kindergeld / 2) model.kind.alter

                gesamtKindbedarf_mitGetrageneZusatzbedarf =
                    calculateGesamtKindbedarf rBedarf model.kind.einkuenfte model.kind.mehrbedarf model.kind.sonderbedarf (toFloat kindergeld / 2) model.kind.alter

                -- Kindergeldverrechnung (hälftig)
                -- Verteilung des Betreuungsanteils (gleichmäßig)
                betreuungsanteil =
                    (toFloat kindergeld / 2) / 2

                baranteil =
                    toFloat kindergeld / 2

                -- Verteilung des Baranteils (nach Haftungsanteil)
                baranteilVater =
                    calculateBarAnteil baranteil anteilVater

                baranteilMutter =
                    calculateBarAnteil baranteil anteilMutter

                -- Anteil der Eltern am Gesamtbedarf in Geldbetragshöhe
                haftungsbetragVaterVorBegrenzung =
                    Maybe.withDefault
                        (anteilVater * gesamtKindbedarf_mitGetrageneZusatzbedarf)
                        model.haftungsbetragVaterUebernommen

                haftungsbetragMutterVorBegrenzung =
                    Maybe.withDefault
                        (anteilMutter * gesamtKindbedarf_mitGetrageneZusatzbedarf)
                        model.haftungsbetragMutterUebernommen

                anteil_mutter_gesamtbedarf =
                    min verteilbarerBetragMutter haftungsbetragMutterVorBegrenzung

                anteil_vater_gesamtbedarf =
                    min verteilbarerBetragVater haftungsbetragVaterVorBegrenzung

                anteil_vater_ohne_zusatzbedarf =
                    anteilVater
                        * gesamtKindbedarf_ohneGetrageneZusatzbedarf

                anteil_mutter_ohne_zusatzbedarf =
                    anteilMutter
                        * gesamtKindbedarf_ohneGetrageneZusatzbedarf

                bereitsGezahlterZusatzbedarfLeistungenVater =
                    calculateBereitsGezahlterZusatzbedarf Vater model.kind.mehrbedarf model.kind.sonderbedarf model.kind.erbrachteLeistungen

                bereitsGezahlterZusatzbedarfLeistungenMutter =
                    calculateBereitsGezahlterZusatzbedarf Mutter model.kind.mehrbedarf model.kind.sonderbedarf model.kind.erbrachteLeistungen

                anteil_vater_nach_gezahltem_zusatzbedarf =
                    if model.kindergeldEmpfaenger == Vater then
                        anteil_vater_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenVater + toFloat kindergeld / 2

                    else
                        anteil_vater_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenVater

                anteil_mutter_nach_gezahltem_zusatzbedarf =
                    if model.kindergeldEmpfaenger == Mutter then
                        anteil_mutter_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenMutter + toFloat kindergeld / 2

                    else
                        anteil_mutter_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenMutter

                -- Berechnung der Differenz der Anteile als absolute Differenz
                differenzAnteil =
                    abs (anteil_mutter_nach_gezahltem_zusatzbedarf - anteil_vater_nach_gezahltem_zusatzbedarf)

                auszugleichender_betrag =
                    differenzAnteil
                        / 2

                anspruchsberechtigt =
                    if anteil_vater_nach_gezahltem_zusatzbedarf > anteil_mutter_nach_gezahltem_zusatzbedarf then
                        Mutter

                    else
                        Vater

                abzufuehrendesKindergeld =
                    case model.kindergeldEmpfaenger of
                        Mutter ->
                            betreuungsanteil + baranteilVater

                        -- Wenn der Vater das Kindergeld kriegt und er abführen muss
                        Vater ->
                            betreuungsanteil
                                + baranteilMutter

                ausgleichsanspruch =
                    if anspruchsberechtigt == Mutter then
                        -- Wenn die Mutter anspruchsberechtigt ist, und das Kindergeld geht an den Vater:
                        if model.kindergeldEmpfaenger == Vater then
                            -- Kindergeld wird oben draufgerechnet
                            auszugleichender_betrag + abzufuehrendesKindergeld

                        else
                            -- Kindergeld wird abgezogen
                            auszugleichender_betrag - abzufuehrendesKindergeld

                    else if model.kindergeldEmpfaenger == Mutter then
                        auszugleichender_betrag + abzufuehrendesKindergeld

                    else
                        auszugleichender_betrag
                            - abzufuehrendesKindergeld
            in
            { regelbedarf = Just rBedarf
            , einkommenVater = einkommenVater
            , weitereEinkuenfteVater = weitereEinkuenfteVater
            , einkommenMutter = einkommenMutter
            , weitereEinkuenfteMutter = weitereEinkuenfteMutter
            , bereinigtesEinkommenVater = bereinigtesEinkommenVater
            , bereinigtesEinkommenMutter = bereinigtesEinkommenMutter
            , gesamtAbzugVater = gesamtAbzugsVater
            , gesamtAbzugMutter = gesamtAbzugsMutter
            , baranteilVater = baranteilVater
            , baranteilMutter = baranteilMutter
            , betreuungsanteil = betreuungsanteil
            , haftungsanteilVater = anteilVater
            , haftungsanteilMutter = anteilMutter
            , ausgleichsanspruch = Just ausgleichsanspruch
            , anspruchsberechtigt = anspruchsberechtigt
            , nichtanspruchsberechtigt =
                if anspruchsberechtigt == Vater then
                    Mutter

                else
                    Vater
            , gesamtEinkommen = gesamtEinkommen
            , verteilbarerBetragVater = verteilbarerBetragVater
            , verteilbarerBetragMutter = verteilbarerBetragMutter
            , verteilbarerBetragGesamt = verteilbarerBetragGesamt
            , haftungsbetragVaterVorBegrenzung = haftungsbetragVaterVorBegrenzung
            , haftungsbetragMutterVorBegrenzung = haftungsbetragMutterVorBegrenzung
            , haftungsbetragVater = anteil_vater_gesamtbedarf
            , haftungsbetragMutter = anteil_mutter_gesamtbedarf
            , gesamtKindbedarf_ohneGetrageneZusatzbedarf = gesamtKindbedarf_ohneGetrageneZusatzbedarf
            , gesamtKindbedarf_mitGetrageneZusatzbedarf = gesamtKindbedarf_mitGetrageneZusatzbedarf
            , anteilVaterGesamtbedarf = anteil_vater_nach_gezahltem_zusatzbedarf
            , anteilMutterGesamtbedarf = anteil_mutter_nach_gezahltem_zusatzbedarf
            , anteilVaterOhneZusatzbedarf = anteil_vater_ohne_zusatzbedarf
            , anteilMutterOhneZusatzbedarf = anteil_mutter_ohne_zusatzbedarf
            , differenzAnteil = differenzAnteil
            , auszugleichenderBetrag = auszugleichender_betrag
            , abzufuehrendesKindergeld = abzufuehrendesKindergeld
            }
