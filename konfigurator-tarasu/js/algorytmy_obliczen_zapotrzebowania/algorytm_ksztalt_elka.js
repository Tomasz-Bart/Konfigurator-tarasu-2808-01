/**
 * algorytmy obliczen zapotrzebowania dla kształtu L (typ L)
 * @param {Taras} _taras
 */
function obliczZapotrzebowanieDlaKsztaltElka(_taras) {
    /**
     *
     * @type {Globalne}
     */
    this.globalne = window.zmienneGlobalne;
    /**
     * @type {Taras}
     */
    var taras = _taras;
    var excelFunctions = new excelFunctionsObj(this.globalne.debug);
    //adresy komorek wykorzystane do obliczen w oryginalnej formule w arkuszu z excela
    //zmienne doobliczen zapotrzebowania tarasu

    var C13, C15, C17, C22, C23, C25, C24, C26, E22, E23, E24, E25, E26, E27, E29, E31, E32, E33, E34, E35, E36, E37,
        E38, E39, E40, E41, E42, E44, E50, E68, E70, E72, E74, E76, E78, E80, E84, E86, F32, F34, F36, F38, F40, F42,
        F44, F50, F68, F70, F72, F74, F76, F78, F80, F84, F86, G32, G34, G36, G38, G40, G42, G44, G46, G48, G50, G68,
        G70, G72, G74, G76, G78, G80, G82, G84, G86, H3, H32, H34, H36, H38, H4, H40, H42, H44, H5, H50, H6, H68, H7,
        H70, H72, H74, H76, H78, H8, H80, H84, H86, I32, I34, I36, I38, I40, I42, I44, I50, I68, I70, I72, I74, I76,
        I78, I80, I84, I86, J10, J11, J3, J32, J34, J36, J38, J4, J40, J42, J44, J46, J48, J5, J50, J6, J68, J7, J70,
        J72, J74, J76, J78, J8, J80, J82, J84, J86, J9;


    this.oblicz = function () {
        var ret = new ReturnObj();
        var rs = this._konfiguruj();
        if (!rs.status) {
            return rs;
        }
        var obliczenia = new PodsumowanieElementowTarasu();
        if (taras.kierunek_ulozenia == this.globalne.KIERUNEK_ULOZENIA.PROSTOPADLE) {
            if (taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.CIAGLY) {
                switch (taras.deska.dlugosc) {
                    case 3000:
                        obliczenia = this._ukladCiaglyProstopadly3metry();
                        break;
                    case 4000 :
                    case  6000:
                        obliczenia = this._ukladCiaglyProstopadly4i6metry();
                        break;
                    default:
                        throw Error('Brak algorytmu dla deski o długości: ' + taras.deska.dlugosc);
                }
            } else if (taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.ZAMEK) {
                switch (taras.deska.dlugosc) {
                    case 3000:
                        obliczenia = this._ukladZamekProstopadly3metry();
                        break;
                    case 4000 :
                    case  6000:
                        obliczenia = this._ukladZamekProstopadly4i6metry();
                        break;
                    default:
                        throw Error('Brak algorytmu dla deski o długości: ' + taras.deska.dlugosc);
                }
            } else {
                throw Error('Brak algorytmu dla sposobu ulozenia: ' + taras.sposob_ulozenia);
            }
        } else if (taras.kierunek_ulozenia == this.globalne.KIERUNEK_ULOZENIA.ROWNOLEGLE) {
            if (taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.CIAGLY) {
                switch (taras.deska.dlugosc) {
                    case 3000:
                        obliczenia = this._ukladCiaglyRownolegle3metry();
                        break;
                    case 4000 :
                    case  6000:
                        obliczenia = this._ukladCiaglyRownolegle4i6metry();
                        break;
                    default:
                        throw Error('Brak algorytmu dla deski o długości: ' + taras.deska.dlugosc);
                }
            } else if (taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.ZAMEK) {
                switch (taras.deska.dlugosc) {
                    case 3000:
                        obliczenia = this._ukladZamekRownolegle3metry();
                        break;
                    case 4000 :
                    case  6000:
                        obliczenia = this._ukladZamekRownolegle4i6metry();
                        break;
                    default:
                        throw Error('Brak algorytmu dla deski o długości: ' + taras.deska.dlugosc);
                }
            } else {
                throw Error('Brak algorytmu dla sposobu ulozenia: ' + taras.sposob_ulozenia);
            }
        } else {
            throw Error('Brak algorytmu dla kierunku ulozenia ' + taras.kierunek_ulozenia);
        }
        if (obliczenia.wynikWalidacjiWarunkow().status) {
            ret.value = obliczenia;
        } else {
            ret.status = false;
            ret.message = obliczenia.wynikWalidacjiWarunkow().message;
        }
        return ret;
    };
    this._konfiguruj = function () {
        var ret = new ReturnObj();

        //dlugosc boku A
        H3 = taras.ksztaltObiekt.bokAdlugosc();
        //dlugosc boku B
        H4 = taras.ksztaltObiekt.bokBdlugosc();
        H5 = taras.ksztaltObiekt.bokCdlugosc();
        H6 = taras.ksztaltObiekt.bokDdlugosc();
        H7 = taras.ksztaltObiekt.bokEdlugosc();
        H8 = taras.ksztaltObiekt.bokFdlugosc();
        //dlugosc deski
        C22 = this.globalne.konwertujMilimetrynaMetry(taras.deska.dlugosc);
        //szerokosc deski
        C23 = this.globalne.konwertujMilimetrynaMetry(taras.deska.szerokosc);
        //szerokosc klipsa
        C25 = this.globalne.konwertujMilimetrynaMetry(taras.deski_odstep);
        //szerokośc deski z klipsem wybranym 0,003m  lub 0,005m  , czyli odpowiednio 3 mm lub 5 mm
        C24 = C23 + C25;
        //legar długość
        C26 = this.globalne.konwertujMilimetrynaMetry(taras.legar.dlugosc);
        var tab = [H3, H4, H5, H6, H7, H8, C22, C23, C25, C24, C26];
        for (var i = 0; i < tab.length; i++) {
            if (tab[i] <= 0 || tab[i] == undefined) {
                ret.status = false;
                ret.message = this.constructor.name + ' _konfiguruj - Jeden z parametrów jest <= 0 albo undefined. Parametry: ' + tab.toString();
                break;
            }
        }
        if (this.globalne.debug) {
            console.log('obliczZapotrzebowanie - parametry wejsciowe         var tab = [H3,H4,H5,H6,H7,H8,C22,C23,C25,C24,C26]: ', tab);
        }
        return ret;
    };

    function zbierzZmienne() {
        return {
            'C13': C13,
            'C15': C15,
            'C17': C17,
            'C22': C22,
            'C23': C23,
            'C24': C24,
            'C25': C25,
            'C26': C26,
            'E22': E22,
            'E23': E23,
            'E24': E24,
            'E25': E25,
            'E26': E26,
            'E27': E27,
            'E29': E29,
            'E31': E31,
            'E32': E32,
            'E33': E33,
            'E34': E34,
            'E35': E35,
            'E36': E36,
            'E37': E37,
            'E38': E38,
            'E39': E39,
            'E40': E40,
            'E41': E41,
            'E42': E42,
            'E44': E44,
            'E50': E50,
            'E68': E68,
            'E70': E70,
            'E72': E72,
            'E74': E74,
            'E76': E76,
            'E78': E78,
            'E80': E80,
            'E84': E84,
            'E86': E86,
            'F32': F32,
            'F34': F34,
            'F36': F36,
            'F38': F38,
            'F40': F40,
            'F42': F42,
            'F44': F44,
            'F50': F50,
            'F68': F68,
            'F70': F70,
            'F72': F72,
            'F74': F74,
            'F76': F76,
            'F78': F78,
            'F80': F80,
            'F84': F84,
            'F86': F86,
            'G32': G32,
            'G34': G34,
            'G36': G36,
            'G38': G38,
            'G40': G40,
            'G42': G42,
            'G44': G44,
            'G46': G46,
            'G48': G48,
            'G50': G50,
            'G68': G68,
            'G70': G70,
            'G72': G72,
            'G74': G74,
            'G76': G76,
            'G78': G78,
            'G80': G80,
            'G82': G82,
            'G84': G84,
            'G86': G86,
            'H3': H3,
            'H32': H32,
            'H34': H34,
            'H36': H36,
            'H38': H38,
            'H4': H4,
            'H40': H40,
            'H42': H42,
            'H44': H44,
            'H5': H5,
            'H50': H50,
            'H6': H6,
            'H68': H68,
            'H7': H7,
            'H70': H70,
            'H72': H72,
            'H74': H74,
            'H76': H76,
            'H78': H78,
            'H8': H8,
            'H80': H80,
            'H84': H84,
            'H86': H86,
            'I32': I32,
            'I34': I34,
            'I36': I36,
            'I38': I38,
            'I40': I40,
            'I42': I42,
            'I44': I44,
            'I50': I50,
            'I68': I68,
            'I70': I70,
            'I72': I72,
            'I74': I74,
            'I76': I76,
            'I78': I78,
            'I80': I80,
            'I84': I84,
            'I86': I86,
            'J10': J10,
            'J11': J11,
            'J3': J3,
            'J32': J32,
            'J34': J34,
            'J36': J36,
            'J38': J38,
            'J4': J4,
            'J40': J40,
            'J42': J42,
            'J44': J44,
            'J46': J46,
            'J48': J48,
            'J5': J5,
            'J50': J50,
            'J6': J6,
            'J68': J68,
            'J7': J7,
            'J70': J70,
            'J72': J72,
            'J74': J74,
            'J76': J76,
            'J78': J78,
            'J8': J8,
            'J80': J80,
            'J82': J82,
            'J84': J84,
            'J86': J86,
            'J9': J9,
        };

    };
    this._ukladCiaglyProstopadly3metry = function () {
        var result = new PodsumowanieElementowTarasu();
// [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP L Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY

//zmienne dla obliczen:
//var C22,C24,C26,E32,E34,E36,E38,E40,E42,E44,E50,F32,F34,F36,F38,F40,F42,F44,F50,G32,G34,G36,G38,G40,G42,G44,G46,G48,G50,H3,H4,H5,H6,H7,H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E32' : E32,'E34' : E34,'E36' : E36,'E38' : E38,'E40' : E40,'E42' : E42,'E44' : E44,'E50' : E50,'F32' : F32,'F34' : F34,'F36' : F36,'F38' : F38,'F40' : F40,'F42' : F42,'F44' : F44,'F50' : F50,'G32' : G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G46' : G46,'G48' : G48,'G50' : G50,'H3' : H3,'H4' : H4,'H5' : H5,'H6' : H6,'H7' :H7,'H8' : H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) * C22 >= 0.5, H8 / C22 - excelFunctions.rounddown(H8 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_F_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) * C22 >= 0.5, H6 / C22 - excelFunctions.rounddown(H6 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_D_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E32 = excelFunctions.roundup((excelFunctions.rounddown(H8 / C22, 0) * excelFunctions.round(H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (excelFunctions.round((H3 / C24), 0) / excelFunctions.rounddown(1 / (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)), 0)) * C22)), 0);
        F32 = excelFunctions.roundup((excelFunctions.rounddown(H6 / C22, 0) * excelFunctions.round(H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (excelFunctions.round((H5 / C24), 0) / excelFunctions.rounddown(1 / (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)), 0)) * C22)), 0);
        G32 = excelFunctions.sum('E32:F32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E34 = excelFunctions.roundup(excelFunctions.roundup(E32 / C22, 0) / 1, 0);
        F34 = excelFunctions.roundup(excelFunctions.roundup(F32 / C22, 0) / 1, 0);
        G34 = excelFunctions.sum('E34:F34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E36 = excelFunctions.roundup(H3 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, H3 * (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0);
        F36 = excelFunctions.roundup(H5 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, H5 * (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0);
        G36 = excelFunctions.sum('E36:F36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E38 = excelFunctions.roundup(E36 / C26, 0);
        F38 = excelFunctions.roundup(F36 / C26, 0);
        G38 = excelFunctions.sum('E38:F38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0);
        F44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0);
        G44 = excelFunctions.sum('E44:F44', zbierzZmienne()) - F44;
//ILOŚĆ KLIPS SRODKOWY KSR
        E40 = excelFunctions.roundup((H3 / C24 - 1) * excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, excelFunctions.roundup((2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1), 0)), 0), 0);
        F40 = excelFunctions.roundup((H5 / C24 - 1) * excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, excelFunctions.roundup((2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1), 0)), 0), 0);
        G40 = excelFunctions.sum('E40:F40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E42 = E44;
        F42 = F44;
        G42 = excelFunctions.sum('E42:F42', zbierzZmienne()) - F42;
//
//
//ILOŚĆ LISTWA 4m LLS
        G46 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / C26, 0);
//
//WYDAJNOŚC Z DESKI
        G48 = excelFunctions.if(excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0) / 1 > 1, 1, excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0) / 1);

//
//POWIERZCHNIA TARASU
        E50 = excelFunctions.round(H3 * H8, 1);
        F50 = excelFunctions.round(H5 * H6, 1);
        G50 = excelFunctions.sum('E50:F50', zbierzZmienne());


        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G32, G34, G36, G38, G40, G42, G44, G46, G48, G50);
        return result;
    };
    this._ukladCiaglyProstopadly4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();

        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP L Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY

//zmienne dla obliczen:
//var C22,C24,C26,E32,E34,E36,E38,E40,E42,E44,E50,F32,F34,F36,F38,F40,F42,F44,F50,G32,G34,G36,G38,G40,G42,G44,G46,G48,G5
        0, H3, H4, H5, H6, H7, H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E32' : E32,'E34' : E34,'E36' : E36,'E38' : E38,'E40' : E40,'E42' : E42,'E44' :E44,'E50' : E50,'F32' : F32,'F34' : F34,'F36' : F36,'F38' : F38,'F40' : F40,'F42' : F42,'F44' : F44,'F50' : F50,'G32' :G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G46' : G46,'G48' : G48,'G50' : G50,'H3' : H3,'H4' : H4,'H5' : H5,'H6' : H6,'H7' : H7,'H8' : H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) * C22 >= 0.5, H8 / C22 - excelFunctions.rounddown(H8 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_F_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) * C22 >= 0.5, H6 / C22 - excelFunctions.rounddown(H6 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_D_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E32 = excelFunctions.roundup((excelFunctions.rounddown(H8 / C22, 0) * excelFunctions.round(H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (excelFunctions.round((H3 / C24), 0) / excelFunctions.rounddown(1 / (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)), 0)) * C22)), 0);
        F32 = excelFunctions.roundup((excelFunctions.rounddown(H6 / C22, 0) * excelFunctions.round(H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (excelFunctions.round((H5 / C24), 0) / excelFunctions.rounddown(1 / (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)), 0)) * C22)), 0);
        G32 = excelFunctions.sum('E32:F32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E34 = excelFunctions.roundup(E32 / C22, 0);
        F34 = excelFunctions.roundup(F32 / C22, 0);
        G34 = excelFunctions.sum('E34:F34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E36 = excelFunctions.roundup(H3 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, H3 * (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0);
        F36 = excelFunctions.roundup(H5 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, H5 * (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0);
        G36 = excelFunctions.sum('E36:F36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E38 = excelFunctions.roundup(E36 / C26, 0);
        F38 = excelFunctions.roundup(F36 / C26, 0);
        G38 = excelFunctions.sum('E38:F38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0);
        F44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0);
        G44 = excelFunctions.sum('E44:F44', zbierzZmienne()) - F44;
//ILOŚĆ KLIPS SRODKOWY KSR
        E40 = excelFunctions.roundup((H3 / C24 - 1) * excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, excelFunctions.roundup((2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1), 0)), 0), 0);
        F40 = excelFunctions.roundup((H5 / C24 - 1) * excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, excelFunctions.roundup((2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1), 0)), 0), 0);
        G40 = excelFunctions.sum('E40:F40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E42 = E44;
        F42 = F44;
        G42 = excelFunctions.sum('E42:F42', zbierzZmienne()) - F42;
//
//
//ILOŚĆ LISTWA 4m LLS
        G46 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / C26, 0);
//
//WYDAJNOŚC Z DESKI
        G48 = excelFunctions.if(excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0) > 1, 1, excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0));
//
//POWIERZCHNIA TARASU
        E50 = excelFunctions.round(H3 * H8, 1);
        F50 = excelFunctions.round(H5 * H6, 1);
        G50 = excelFunctions.sum('E50:F50', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G32, G34, G36, G38, G40, G42, G44, G46, G48, G50);
        return result;
    };
    this._ukladZamekProstopadly3metry = function () {
        var result = new PodsumowanieElementowTarasu();

// [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP L Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY ZAMEK POŁÓWKOWY

//zmienne dla obliczen:
//var C22,C24,C26,E68,E70,E72,E74,E76,E78,E80,E84,E86,F68,F70,F72,F74,F76,F78,F80,F84,F86,G68,G70,G72,G74,G76,G78,G80,G82,G84,G86,H3,H4,H5,H6,H7,H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E68' : E68,'E70' : E70,'E72' : E72,'E74' : E74,'E76' : E76,'E78' : E78,'E80' : E80,'E84' : E84,'E86' : E86,'F68' : F68,'F70' : F70,'F72' : F72,'F74' : F74,'F76' : F76,'F78' : F78,'F80' : F80,'F84' : F84,'F86' : F86,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G82' : G82,'G84' : G84,'G86' : G86,'H3' : H3,'H4' : H4,'H5' : H5,'H6' : H6,'H7' : H7,'H8' : H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) * C22 >= 0.5, H8 / C22 - excelFunctions.rounddown(H8 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_F_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) * C22 >= 0.5, H6 / C22 - excelFunctions.rounddown(H6 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_D_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E68 = excelFunctions.if(H8 < C22, excelFunctions.roundup((excelFunctions.rounddown(H8 / C22, 0) * excelFunctions.round(H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (excelFunctions.round((H3 / C24), 0) / excelFunctions.rounddown(1 / (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H8 / C22, 0) * excelFunctions.round(H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (excelFunctions.round((H3 / C24), 0) / excelFunctions.rounddown(1 / (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)), 0)) * C22)) + H3 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H8 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H8 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H3 / C24), 0) / excelFunctions.rounddown(1 / ((H8 - 0.5 * C22) / C22 - excelFunctions.rounddown((H8 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        F68 = excelFunctions.if(H6 < C22, excelFunctions.roundup((excelFunctions.rounddown(H6 / C22, 0) * excelFunctions.round(H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (excelFunctions.round((H5 / C24), 0) / excelFunctions.rounddown(1 / (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H6 / C22, 0) * excelFunctions.round(H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (excelFunctions.round((H5 / C24), 0) / excelFunctions.rounddown(1 / (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)), 0)) * C22)) + H5 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H6 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H6 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H5 / C24), 0) / excelFunctions.rounddown(1 / ((H6 - 0.5 * C22) / C22 - excelFunctions.rounddown((H6 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        G68 = excelFunctions.sum('E68:F68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E70 = excelFunctions.roundup(excelFunctions.roundup(E68 / C22, 0) / 1, 0);
        F70 = excelFunctions.roundup(excelFunctions.roundup(F68 / C22, 0) / 1, 0);
        G70 = excelFunctions.sum('E70:F70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E72 = E74 * C26;
        F72 = F74 * C26;
        G72 = excelFunctions.sum('E72:F72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E74 = excelFunctions.roundup((excelFunctions.roundup(H3 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, H3 * (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H8 < C22, 1, H8 / C22), 0) * H3) / C26, 0);
        F74 = excelFunctions.roundup((excelFunctions.roundup(H5 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, H5 * (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H6 < C22, 1, H6 / C22), 0) * H5) / C26, 0);
        G74 = excelFunctions.sum('E74:F74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0);
        F80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0);
        G80 = excelFunctions.sum('E80:F80', zbierzZmienne()) - F80;
//ILOŚĆ KLIPS SRODKOWY KSR
        E76 = excelFunctions.roundup(E80 * (H3 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H8 < C22, 1, H8 / C22), 0) * excelFunctions.roundup(H3 / C24 - 1, 0);
        F76 = excelFunctions.roundup(F80 * (H5 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H6 < C22, 1, H6 / C22), 0) * excelFunctions.roundup(H5 / C24 - 1, 0);
        G76 = excelFunctions.sum('E76:F76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E78 = E80;
        F78 = F80;
        G78 = excelFunctions.sum('E78:F78', zbierzZmienne()) - F78;
//
//
//ILOŚĆ LISTWA 4m LLS
        G82 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI
        E84 = excelFunctions.if(excelFunctions.roundup(H3 * H8, 0) / excelFunctions.roundup(E70 * C22 * C24, 0) / 1 > 1, 1, excelFunctions.roundup(H3 * H8, 0) / excelFunctions.roundup(E70 * C22 * C24, 0) / 1);
        F84 = excelFunctions.if(excelFunctions.roundup(H5 * H6, 0) / excelFunctions.roundup(F70 * C22 * C24, 0) / 1 > 1, 1, excelFunctions.roundup(H5 * H6, 0) / excelFunctions.roundup(F70 * C22 * C24, 0) / 1);
        G84 = excelFunctions.if(excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0) / 1 > 1, 1, excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0) / 1);

//
//POWIERZCHNIA TARASU
        E86 = excelFunctions.round(H3 * H8, 1);
        F86 = excelFunctions.round(H5 * H6, 1);
        G86 = excelFunctions.sum('E86:F86', zbierzZmienne());


        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G68, G70, G72, G74, G76, G78, G80, G82, G84, G86);
        return result;
    };
    this._ukladZamekProstopadly4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP L Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY ZAMEK POŁÓWKOWY

//zmienne dla obliczen:
//var C22,C24,C26,E68,E70,E72,E74,E76,E78,E80,E84,E86,F68,F70,F72,F74,F76,F78,F80,F84,F86,G68,G70,G72,G74,G76,G78,G80,G82,G84,G86,H3,H4,H5,H6,H7,H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E68' : E68,'E70' : E70,'E72' : E72,'E74' : E74,'E76' : E76,'E78' : E78,'E80' :E80,'E84' : E84,'E86' : E86,'F68' : F68,'F70' : F70,'F72' : F72,'F74' : F74,'F76' : F76,'F78' : F78,'F80' : F80,'F84' :F84,'F86' : F86,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G82' : G82,'G84' :G84,'G86' : G86,'H3' : H3,'H4' : H4,'H5' : H5,'H6' : H6,'H7' : H7,'H8' : H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) * C22 >= 0.5, H8 / C22 - excelFunctions.rounddown(H8 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_F_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) * C22 >= 0.5, H6 / C22 - excelFunctions.rounddown(H6 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_D_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E68 = excelFunctions.if(H8 < C22, excelFunctions.roundup((excelFunctions.rounddown(H8 / C22, 0) * excelFunctions.round(H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (excelFunctions.round((H3 / C24), 0) / excelFunctions.rounddown(1 / (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H8 / C22, 0) * excelFunctions.round(H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (excelFunctions.round((H3 / C24), 0) / excelFunctions.rounddown(1 / (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)), 0)) * C22)) + H3 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H8 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H3 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H8 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H3 / C24), 0) / excelFunctions.rounddown(1 / ((H8 - 0.5 * C22) / C22 - excelFunctions.rounddown((H8 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        F68 = excelFunctions.if(H6 < C22, excelFunctions.roundup((excelFunctions.rounddown(H6 / C22, 0) * excelFunctions.round(H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (excelFunctions.round((H5 / C24), 0) / excelFunctions.rounddown(1 / (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H6 / C22, 0) * excelFunctions.round(H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (excelFunctions.round((H5 / C24), 0) / excelFunctions.rounddown(1 / (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)), 0)) * C22)) + H5 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H6 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H5 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H6 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H5 / C24), 0) / excelFunctions.rounddown(1 / ((H6 - 0.5 * C22) / C22 - excelFunctions.rounddown((H6 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        G68 = excelFunctions.sum('E68:F68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E70 = excelFunctions.roundup(E68 / C22, 0);
        F70 = excelFunctions.roundup(F68 / C22, 0);
        G70 = excelFunctions.sum('E70:F70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E72 = E74 * C26;
        F72 = F74 * C26;
        G72 = excelFunctions.sum('E72:F72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E74 = excelFunctions.roundup((excelFunctions.roundup(H3 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, H3 * (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H8 < C22, 1, H8 / C22), 0) * H3) / C26, 0);
        F74 = excelFunctions.roundup((excelFunctions.roundup(H5 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, H5 * (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H6 < C22, 1, H6 / C22), 0) * H5) / C26, 0);
        G74 = excelFunctions.sum('E74:F74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H8 / C22, 0) + excelFunctions.if(excelFunctions.mod(H8, C22) == 0, 0, (2 * C22 * (H8 / C22 - excelFunctions.rounddown(H8 / C22, 0)) + 1)), 0);
        F80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H6 / C22, 0) + excelFunctions.if(excelFunctions.mod(H6, C22) == 0, 0, (2 * C22 * (H6 / C22 - excelFunctions.rounddown(H6 / C22, 0)) + 1)), 0);
        G80 = excelFunctions.sum('E80:F80', zbierzZmienne()) - F80;
//ILOŚĆ KLIPS SRODKOWY KSR
        E76 = excelFunctions.roundup(E80 * (H3 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H8 < C22, 1, H8 / C22), 0) * excelFunctions.roundup(H3 / C24 - 1, 0);
        F76 = excelFunctions.roundup(F80 * (H5 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H6 < C22, 1, H6 / C22), 0) * excelFunctions.roundup(H5 / C24 - 1, 0);
        G76 = excelFunctions.sum('E76:F76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E78 = E80;
        F78 = F80;
        G78 = excelFunctions.sum('E78:F78', zbierzZmienne()) - F78;
//
//
//ILOŚĆ LISTWA 4m LLS
        G82 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI
        E84 = excelFunctions.if(excelFunctions.roundup(H3 * H8, 0) / excelFunctions.roundup(E70 * C22 * C24, 0) > 1, 1, excelFunctions.roundup(H3 * H8, 0) / excelFunctions.roundup(E70 * C22 * C24, 0));
        F84 = excelFunctions.if(excelFunctions.roundup(H5 * H6, 0) / excelFunctions.roundup(F70 * C22 * C24, 0) > 1, 1, excelFunctions.roundup(H5 * H6, 0) / excelFunctions.roundup(F70 * C22 * C24, 0));
        G84 = excelFunctions.if(excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0) > 1, 1, excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0));
//
//POWIERZCHNIA TARASU
        E86 = excelFunctions.round(H3 * H8, 1);
        F86 = excelFunctions.round(H5 * H6, 1);
        G86 = excelFunctions.sum('E86:F86', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G68, G70, G72, G74, G76, G78, G80, G82, G84, G86);
        return result;
    };


    this._ukladCiaglyRownolegle3metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP L Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY

//zmienne dla obliczen:
//var C22,C24,C26,E32,E34,E36,E38,E40,E42,E44,E50,F32,F34,F36,F38,F40,F42,F44,F50,G32,G34,G36,G38,G40,G42,G44,G46,G48,G50,H3,H4,H6,H7,H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E32' : E32,'E34' : E34,'E36' : E36,'E38' : E38,'E40' : E40,'E42' : E42,'E44' : E44,'E50' : E50,'F32' : F32,'F34' : F34,'F36' : F36,'F38' : F38,'F40' : F40,'F42' : F42,'F44' : F44,'F50' : F50,'G32' : G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G46' : G46,'G48' : G48,'G50' : G50,'H3' : H3,'H4' : H4,'H6' : H6,'H7' : H7,'H8' :H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) * C22 >= 0.5, H3 / C22 - excelFunctions.rounddown(H3 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) * C22 >= 0.5, H7 / C22 - excelFunctions.rounddown(H7 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_E_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E32 = excelFunctions.roundup((excelFunctions.rounddown(H3 / C22, 0) * excelFunctions.round(H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (excelFunctions.round((H4 / C24), 0) / excelFunctions.rounddown(1 / (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)), 0)) * C22)), 0);
        F32 = excelFunctions.roundup((excelFunctions.rounddown(H7 / C22, 0) * excelFunctions.round(H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (excelFunctions.round((H6 / C24), 0) / excelFunctions.rounddown(1 / (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)), 0)) * C22)), 0);
        G32 = excelFunctions.sum('E32:F32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E34 = excelFunctions.roundup(excelFunctions.roundup(E32 / C22, 0) / 1, 0);
        F34 = excelFunctions.roundup(excelFunctions.roundup(F32 / C22, 0) / 1, 0);
        G34 = excelFunctions.sum('E34:F34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E36 = excelFunctions.roundup(H4 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, H4 * (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0);
        F36 = excelFunctions.roundup(H6 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, H6 * (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0);
        G36 = excelFunctions.sum('E36:F36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E38 = excelFunctions.roundup(E36 / C26, 0);
        F38 = excelFunctions.roundup(F36 / C26, 0);
        G38 = excelFunctions.sum('E38:F38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0);
        F44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0);
        G44 = excelFunctions.sum('E44:F44', zbierzZmienne()) - E44;
//ILOŚĆ KLIPS SRODKOWY KSR
        E40 = excelFunctions.roundup(E44 * (H6 / C24 - 1), 0);
        F40 = excelFunctions.roundup(F44 * (H6 / C24 - 1), 0);
        G40 = excelFunctions.sum('E40:F40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E42 = E44;
        F42 = F44;
        G42 = excelFunctions.sum('E42:F42', zbierzZmienne()) - E42;
//
//
//ILOŚĆ LISTWA 4m LLS
        G46 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / C26, 0);
//
//WYDAJNOŚC Z DESKI
        G48 = excelFunctions.if(excelFunctions.roundup(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0) / 1 > 1, 1, excelFunctions.roundup(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0) / 1);

//
//POWIERZCHNIA TARASU
        E50 = excelFunctions.round(H3 * H4, 1);
        F50 = excelFunctions.round(H7 * H6, 1);
        G50 = excelFunctions.sum('E50:F50', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G32, G34, G36, G38, G40, G42, G44, G46, G48, G50);

        return result;
    };
    this._ukladCiaglyRownolegle4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP L Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY

//zmienne dla obliczen:
//var C22,C24,C26,E32,E34,E36,E38,E40,E42,E44,E50,F32,F34,F36,F38,F40,F42,F44,F50,G32,G34,G36,G38,G40,G42,G44,G46,G48,G50,H3,H4,H6,H7,H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E32' : E32,'E34' : E34,'E36' : E36,'E38' : E38,'E40' : E40,'E42' : E42,'E44' :E44,'E50' : E50,'F32' : F32,'F34' : F34,'F36' : F36,'F38' : F38,'F40' : F40,'F42' : F42,'F44' : F44,'F50' : F50,'G32' :G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G46' : G46,'G48' : G48,'G50' : G50,'H3' : H3,'H4' : H4,'H6' : H6,'H7' : H7,'H8' : H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) * C22 >= 0.5, H3 / C22 - excelFunctions.rounddown(H3 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) * C22 >= 0.5, H7 / C22 - excelFunctions.rounddown(H7 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_E_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E32 = excelFunctions.roundup((excelFunctions.rounddown(H3 / C22, 0) * excelFunctions.round(H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (excelFunctions.round((H4 / C24), 0) / excelFunctions.rounddown(1 / (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)), 0)) * C22)), 0);
        F32 = excelFunctions.roundup((excelFunctions.rounddown(H7 / C22, 0) * excelFunctions.round(H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (excelFunctions.round((H6 / C24), 0) / excelFunctions.rounddown(1 / (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)), 0)) * C22)), 0);
        G32 = excelFunctions.sum('E32:F32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E34 = excelFunctions.roundup(E32 / C22, 0);
        F34 = excelFunctions.roundup(F32 / C22, 0);
        G34 = excelFunctions.sum('E34:F34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E36 = excelFunctions.roundup(H4 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, H4 * (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0);
        F36 = excelFunctions.roundup(H6 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, H6 * (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0);
        G36 = excelFunctions.sum('E36:F36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E38 = excelFunctions.roundup(E36 / C26, 0);
        F38 = excelFunctions.roundup(F36 / C26, 0);
        G38 = excelFunctions.sum('E38:F38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0);
        F44 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0);
        G44 = excelFunctions.sum('E44:F44', zbierzZmienne()) - E44;
//ILOŚĆ KLIPS SRODKOWY KSR
        E40 = excelFunctions.roundup(E44 * (H6 / C24 - 1), 0);
        F40 = excelFunctions.roundup(F44 * (H6 / C24 - 1), 0);
        G40 = excelFunctions.sum('E40:F40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E42 = E44;
        F42 = F44;
        G42 = excelFunctions.sum('E42:F42', zbierzZmienne()) - E42;
//
//
//ILOŚĆ LISTWA 4m LLS
        G46 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / C26, 0);
//
//WYDAJNOŚC Z DESKI
        G48 = excelFunctions.if(excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0) > 1, 1, excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G34 * C22 * C24, 0));
//
//POWIERZCHNIA TARASU
        E50 = excelFunctions.round(H3 * H4, 1);
        F50 = excelFunctions.round(H7 * H6, 1);
        G50 = excelFunctions.sum('E50:F50', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G32, G34, G36, G38, G40, G42, G44, G46, G48, G50);
        return result;
    };
    this._ukladZamekRownolegle3metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP L Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY ZAMEK POŁÓWKOWY

//zmienne dla obliczen:
//var C22,C24,C26,E68,E70,E72,E74,E76,E78,E80,E84,E86,F68,F70,F72,F74,F76,F78,F80,F84,F86,G68,G70,G72,G74,G76,G78,G80,G82,G84,G86,H3,H4,H6,H7,H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E68' : E68,'E70' : E70,'E72' : E72,'E74' : E74,'E76' : E76,'E78' : E78,'E80' : E80,'E84' : E84,'E86' : E86,'F68' : F68,'F70' : F70,'F72' : F72,'F74' : F74,'F76' : F76,'F78' : F78,'F80' : F80,'F84' : F84,'F86' : F86,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G82' : G82,'G84' : G84,'G86' : G86,'H3' : H3,'H4' : H4,'H6' : H6,'H7' : H7,'H8' : H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) * C22 >= 0.5, H3 / C22 - excelFunctions.rounddown(H3 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) * C22 >= 0.5, H7 / C22 - excelFunctions.rounddown(H7 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_E_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E68 = excelFunctions.if(H3 < C22, excelFunctions.roundup((excelFunctions.rounddown(H3 / C22, 0) * excelFunctions.round(H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (excelFunctions.round((H4 / C24), 0) / excelFunctions.rounddown(1 / (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H3 / C22, 0) * excelFunctions.round(H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (excelFunctions.round((H4 / C24), 0) / excelFunctions.rounddown(1 / (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)), 0)) * C22)) + H4 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H3 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H3 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H4 / C24), 0) / excelFunctions.rounddown(1 / ((H3 - 0.5 * C22) / C22 - excelFunctions.rounddown((H3 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        F68 = excelFunctions.if(H7 < C22, excelFunctions.roundup((excelFunctions.rounddown(H7 / C22, 0) * excelFunctions.round(H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (excelFunctions.round((H6 / C24), 0) / excelFunctions.rounddown(1 / (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H7 / C22, 0) * excelFunctions.round(H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (excelFunctions.round((H6 / C24), 0) / excelFunctions.rounddown(1 / (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)), 0)) * C22)) + H6 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H7 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H7 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H6 / C24), 0) / excelFunctions.rounddown(1 / ((H7 - 0.5 * C22) / C22 - excelFunctions.rounddown((H7 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        G68 = excelFunctions.sum('E68:F68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E70 = excelFunctions.roundup(excelFunctions.roundup(E68 / C22, 0) / 1, 0);
        F70 = excelFunctions.roundup(excelFunctions.roundup(F68 / C22, 0) / 1, 0);
        G70 = excelFunctions.sum('E70:F70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E72 = E74 * C26;
        F72 = F74 * C26;
        G72 = excelFunctions.sum('E72:F72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E74 = excelFunctions.roundup((excelFunctions.roundup(H4 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, H4 * (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H3 < C22, 1, H3 / C22), 0) * H4) / C26, 0);
        F74 = excelFunctions.roundup((excelFunctions.roundup(H6 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, H6 * (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H7 < C22, 1, H7 / C22), 0) * H6) / C26, 0);
        G74 = excelFunctions.sum('E74:F74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0);
        F80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0);
        G80 = excelFunctions.sum('E80:F80', zbierzZmienne()) - E80;
//ILOŚĆ KLIPS SRODKOWY KSR
        E76 = excelFunctions.roundup(E80 * (H4 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H3 < C22, 1, H3 / C22), 0) * excelFunctions.roundup(H4 / C24 - 1, 0);
        F76 = excelFunctions.roundup(F80 * (H6 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H7 < C22, 1, H7 / C22), 0) * excelFunctions.roundup(H6 / C24 - 1, 0);
        G76 = excelFunctions.sum('E76:F76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E78 = E80;
        F78 = F80;
        G78 = excelFunctions.sum('E78:F78', zbierzZmienne()) - E78;
//
//
//ILOŚĆ LISTWA 4m LLS
        G82 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI
        E84 = excelFunctions.roundup(H3 * H4, 0) / excelFunctions.roundup(E70 * C22 * C24, 0) / 1;
        F84 = excelFunctions.roundup(H7 * H6, 0) / excelFunctions.roundup(F70 * C22 * C24, 0) / 1;
        G84 = excelFunctions.if(excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0) / 1 > 1, 1, excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0) / 1);

//
//POWIERZCHNIA TARASU
        E86 = excelFunctions.round(H3 * H4, 1);
        F86 = excelFunctions.round(H6 * H7, 1);
        G86 = excelFunctions.sum('E86:F86', zbierzZmienne());
        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G68, G70, G72, G74, G76, G78, G80, G82, G84, G86);
        return result;
    };
    this._ukladZamekRownolegle4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP L Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY ZAMEK POŁÓWKOWY

//zmienne dla obliczen:
//var C22,C24,C26,E68,E70,E72,E74,E76,E78,E80,E84,E86,F68,F70,F72,F74,F76,F78,F80,F84,F86,G68,G70,G72,G74,G76,G78,G80,G82,G84,G86,H3,H4,H6,H7,H8;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C22' : C22,'C24' : C24,'C26' : C26,'E68' : E68,'E70' : E70,'E72' : E72,'E74' : E74,'E76' : E76,'E78' : E78,'E80' :E80,'E84' : E84,'E86' : E86,'F68' : F68,'F70' : F70,'F72' : F72,'F74' : F74,'F76' : F76,'F78' : F78,'F80' : F80,'F84' :F84,'F86' : F86,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G82' : G82,'G84' :G84,'G86' : G86,'H3' : H3,'H4' : H4,'H6' : H6,'H7' : H7,'H8' : H8,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) * C22 >= 0.5, H3 / C22 - excelFunctions.rounddown(H3 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) * C22 >= 0.5, H7 / C22 - excelFunctions.rounddown(H7 / C22, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_E_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E68 = excelFunctions.if(H3 < C22, excelFunctions.roundup((excelFunctions.rounddown(H3 / C22, 0) * excelFunctions.round(H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (excelFunctions.round((H4 / C24), 0) / excelFunctions.rounddown(1 / (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H3 / C22, 0) * excelFunctions.round(H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (excelFunctions.round((H4 / C24), 0) / excelFunctions.rounddown(1 / (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)), 0)) * C22)) + H4 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H3 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H4 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H3 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H4 / C24), 0) / excelFunctions.rounddown(1 / ((H3 - 0.5 * C22) / C22 - excelFunctions.rounddown((H3 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        F68 = excelFunctions.if(H7 < C22, excelFunctions.roundup((excelFunctions.rounddown(H7 / C22, 0) * excelFunctions.round(H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (excelFunctions.round((H6 / C24), 0) / excelFunctions.rounddown(1 / (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)), 0)) * C22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(H7 / C22, 0) * excelFunctions.round(H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (excelFunctions.round((H6 / C24), 0) / excelFunctions.rounddown(1 / (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)), 0)) * C22)) + H6 / (2 * C24) * 0.5 * C22 + (excelFunctions.rounddown((H7 - 0.5 * C22) / C22, 0) * excelFunctions.round(0.5 * H6 / C24, 0) * C22 + excelFunctions.if(excelFunctions.mod((H7 - 0.5 * C22), C22) == 0, 0, (excelFunctions.round((0.5 * H6 / C24), 0) / excelFunctions.rounddown(1 / ((H7 - 0.5 * C22) / C22 - excelFunctions.rounddown((H7 - 0.5 * C22) / C22, 0)), 0)) * C22))), 0));
        G68 = excelFunctions.sum('E68:F68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST
        E70 = excelFunctions.roundup(E68 / C22, 0);
        F70 = excelFunctions.roundup(F68 / C22, 0);
        G70 = excelFunctions.sum('E70:F70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL
        E72 = E74 * C26;
        F72 = F74 * C26;
        G72 = excelFunctions.sum('E72:F72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E74 = excelFunctions.roundup((excelFunctions.roundup(H4 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, H4 * (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H3 < C22, 1, H3 / C22), 0) * H4) / C26, 0);
        F74 = excelFunctions.roundup((excelFunctions.roundup(H6 * ((C22 / 0.5) + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, H6 * (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0) / C26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(H7 < C22, 1, H7 / C22), 0) * H6) / C26, 0);
        G74 = excelFunctions.sum('E74:F74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST
        E80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H3 / C22, 0) + excelFunctions.if(excelFunctions.mod(H3, C22) == 0, 0, (2 * C22 * (H3 / C22 - excelFunctions.rounddown(H3 / C22, 0)) + 1)), 0);
        F80 = excelFunctions.roundup((2 * C22 + 1) * excelFunctions.rounddown(H7 / C22, 0) + excelFunctions.if(excelFunctions.mod(H7, C22) == 0, 0, (2 * C22 * (H7 / C22 - excelFunctions.rounddown(H7 / C22, 0)) + 1)), 0);
        G80 = excelFunctions.sum('E80:F80', zbierzZmienne()) - E80;
//ILOŚĆ KLIPS SRODKOWY KSR
        E76 = excelFunctions.roundup(E80 * (H4 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H3 < C22, 1, H3 / C22), 0) * excelFunctions.roundup(H4 / C24 - 1, 0);
        F76 = excelFunctions.roundup(F80 * (H6 / C24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(H7 < C22, 1, H7 / C22), 0) * excelFunctions.roundup(H6 / C24 - 1, 0);
        G76 = excelFunctions.sum('E76:F76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK
        E78 = E80;
        F78 = F80;
        G78 = excelFunctions.sum('E78:F78', zbierzZmienne()) - E78;
//
//
//ILOŚĆ LISTWA 4m LLS
        G82 = excelFunctions.roundup(excelFunctions.sum('H3:H8', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI
        E84 = excelFunctions.if(excelFunctions.roundup(H3 * H4, 0) / excelFunctions.roundup(E70 * C22 * C24, 0) > 1, 1, excelFunctions.roundup(H3 * H4, 0) / excelFunctions.roundup(E70 * C22 * C24, 0));
        F84 = excelFunctions.if(excelFunctions.roundup(H7 * H6, 0) / excelFunctions.roundup(F70 * C22 * C24, 0) > 1, 1, excelFunctions.roundup(H7 * H6, 0) / excelFunctions.roundup(F70 * C22 * C24, 0));
        G84 = excelFunctions.if(excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0) > 1, 1, excelFunctions.round(H3 * H4 + H6 * H7, 0) / excelFunctions.roundup(G70 * C22 * C24, 0));
//
//POWIERZCHNIA TARASU
        E86 = excelFunctions.roundup(H3 * H4, 0);
        F86 = excelFunctions.roundup(H6 * H7, 0);
        G86 = excelFunctions.sum('E86:F86', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.setup(G68, G70, G72, G74, G76, G78, G80, G82, G84, G86);
        return result;
    };

}