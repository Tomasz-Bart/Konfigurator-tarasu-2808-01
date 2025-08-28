/**
 * algorytmy obliczen zapotrzebowania dla kształtu U (typ U lub inna nazwa typ C)
 * @param {Taras} _taras
 */
function obliczZapotrzebowanieDlaKsztaltUtka(_taras) {
    /**
     *
     * @type {Globalne}
     */
    this.globalne = window.zmienneGlobalne;
    var excelFunctions = new excelFunctionsObj(this.globalne.debug);
    /**
     * @type {Taras}
     */
    var taras = _taras;
    //adresy komorek wykorzystane do obliczen w oryginalnej formule w arkuszu z excela
    //zmienne tarasu do obliczen
    var C13, C15, C17, C22, C24, C26, E22, E23, E24, E25, E26, E27, E29, E31, E32, E33, E34, E35, E36, E37, E38, E39,
        E40, E41, E42, E44, E50, E68, E70, E72, E74, E76, E78, E80, E84, E86, F32, F34, F36, F38, F40, F42, F44, F50,
        F68, F70, F72, F74, F76, F78, F80, F84, F86, G32, G34, G36, G38, G40, G42, G44, G46, G48, G50, G68, G70, G72,
        G74, G76, G78, G80, G82, G84, G86, H3, H32, H34, H36, H38, H4, H40, H42, H44, H5, H50, H6, H68, H7, H70, H72,
        H74, H76, H78, H8, H80, H84, H86, I32, I34, I36, I38, I40, I42, I44, I50, I68, I70, I72, I74, I76, I78, I80,
        I84, I86, J10, J11, J3, J32, J34, J36, J38, J4, J40, J42, J44, J46, J48, J5, J50, J6, J68, J7, J70, J72, J74,
        J76, J78, J8, J80, J82, J84, J86, J9;

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

        //dlugosc boków
        J3 = taras.ksztaltObiekt.bokAdlugosc();
        J4 = taras.ksztaltObiekt.bokBdlugosc();
        J5 = taras.ksztaltObiekt.bokCdlugosc();
        J6 = taras.ksztaltObiekt.bokDdlugosc();
        J7 = taras.ksztaltObiekt.bokEdlugosc();
        J8 = taras.ksztaltObiekt.bokFdlugosc();
        J9 = taras.ksztaltObiekt.bokGdlugosc();
        J10 = taras.ksztaltObiekt.bokHdlugosc();
        J11 = J4 - J6;
        //dlugosc deski
        E22 = this.globalne.konwertujMilimetrynaMetry(taras.deska.dlugosc);
        //szerokosc deski
        E23 = this.globalne.konwertujMilimetrynaMetry(taras.deska.szerokosc);
        //szerokosc klipsa
        E25 = this.globalne.konwertujMilimetrynaMetry(taras.deski_odstep);
        //szerokośc deski z klipsem wybranym 0,003m  lub 0,005m  , czyli odpowiednio 3 mm lub 5 mm
        E24 = E23 + E25;
        //legar długość
        E26 = this.globalne.konwertujMilimetrynaMetry(taras.legar.dlugosc);
        var tab = [J3, J4, J5, J6, J7, J8, J9, J10, J11, E22, E23, E24, E25, E26];
        for (var i = 0; i < tab.length; i++) {
            if (tab[i] <= 0 || tab[i] == undefined) {
                ret.status = false;
                ret.message = this.constructor.name + ' _konfiguruj - Jeden z parametrów jest <= 0 albo undefined. Parametry: ' + tab.toString();
                break;
            }
        }
        if (this.globalne.debug) {
            console.log('obliczZapotrzebowanieDlaKsztaltU - konfiguruj parametry         var tab = [J3,J4,J5,J6,J7,J8,J9,J10,J11,E22,E23,E24,E25,E26]: ', tab);
        }
        return ret;
    };

    function zbierzZmienne() {
        return {
            'C13': C13,
            'C15': C15,
            'C17': C17,
            'C22': C22,
            'C24': C24,
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
        // [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP C Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY


//zmienne dla obliczen:

//var E22,E24,E26,G32,G34,G36,G38,G40,G42,G44,G50,H32,H34,H36,H38,H40,H42,H44,H50,I32,I34,I36,I38,I40,I42,I44,I50,J10,J11,J3,J32,J34,J36,J38,J4,J40,J42,J44,J46,J48,J5,J50,J6,J7,J8,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G32' : G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G50' : G50,'H32' : H32,'H34' : H34,'H36' : H36,'H38' : H38,'H40' : H40,'H42' : H42,'H44' : H44,'H50' : H50,'I32' : I32,'I34' : I34,'I36' : I36,'I38' : I38,'I40' : I40,'I42' : I42,'I44' : I44,'I50' : I50,'J10' : J10,'J11' : J11,'J3' : J3,'J32' : J32,'J34' : J34,'J36' : J36,'J38' : J38,'J4' : J4,'J40' : J40,'J42' : J42,'J44' : J44,'J46' : J46,'J48' : J48,'J5' : J5,'J50' : J50,'J6' : J6,'J7' : J7,'J8' : J8,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) * E22 >= 0.5, J11 / E22 - excelFunctions.rounddown(J11 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar D lub B tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) * E22 >= 0.5, J4 / E22 - excelFunctions.rounddown(J4 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar  B tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) * E22 >= 0.5, J10 / E22 - excelFunctions.rounddown(J10 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar H tarasu/długość deski");
//ILOŚC DESKI METRY BIEŻACE MBD

        G32 = excelFunctions.roundup((excelFunctions.rounddown(J10 / E22, 0) * excelFunctions.round(J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (excelFunctions.round((J9 / E24), 0) / excelFunctions.rounddown(1 / (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)), 0)) * E22)), 0);

        H32 = excelFunctions.roundup((excelFunctions.rounddown(J11 / E22, 0) * excelFunctions.round(J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (excelFunctions.round((J7 / E24), 0) / excelFunctions.rounddown(1 / (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)), 0)) * E22)), 0);

        I32 = excelFunctions.roundup((excelFunctions.rounddown(J4 / E22, 0) * excelFunctions.round(J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (excelFunctions.round((J5 / E24), 0) / excelFunctions.rounddown(1 / (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)), 0)) * E22)), 0);

        J32 = excelFunctions.sum('G32:I32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G34 = excelFunctions.roundup(excelFunctions.roundup(G32 / E22, 0) / 1, 0);

        H34 = excelFunctions.roundup(excelFunctions.roundup(H32 / E22, 0) / 1, 0);

        I34 = excelFunctions.roundup(excelFunctions.roundup(I32 / E22, 0) / 1, 0);

        J34 = excelFunctions.sum('G34:I34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G36 = excelFunctions.roundup(J9 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, J9 * (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0);

        H36 = excelFunctions.roundup(J7 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, J7 * (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0);

        I36 = excelFunctions.roundup(J5 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, J5 * (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0);

        J36 = excelFunctions.sum('G36:I36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G38 = excelFunctions.roundup(G36 / E26, 0);

        H38 = excelFunctions.roundup(H36 / E26, 0);

        I38 = excelFunctions.roundup(I36 / E26, 0);

        J38 = excelFunctions.sum('G38:I38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0);

        H44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0);

        I44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0);

        J44 = G44 - H44 + I44;
//ILOŚĆ KLIPS SRODKOWY KSR

        G40 = excelFunctions.roundup((J9 / E24 - 1) * excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, excelFunctions.roundup((2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1), 0)), 0), 0);

        H40 = excelFunctions.roundup((J7 / E24 - 1) * excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, excelFunctions.roundup((2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1), 0)), 0), 0);

        I40 = excelFunctions.roundup((J5 / E24 - 1) * excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, excelFunctions.roundup((2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1), 0)), 0), 0);

        J40 = excelFunctions.sum('G40:I40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G42 = G44;

        H42 = H44;

        I42 = I44;

        J42 = G42 - H42 + I42;
//
//
//ILOŚĆ LISTWA 4m LLS

        J46 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / E26, 0);
//
//WYDAJNOŚC Z DESKI

        J48 = excelFunctions.if(excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0) / 1 > 1, 1, excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0) / 1);
//
//POWIERZCHNIA TARASU

        G50 = excelFunctions.round(J9 * J10, 1);

        H50 = excelFunctions.round(J7 * J11, 1);

        I50 = excelFunctions.round(J4 * J5, 1);

        J50 = excelFunctions.sum('G50:I50', zbierzZmienne());


        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J32, J34, J36, J38, J40, J42, J44, J46, J48, J50);
        return result;
    };
    this._ukladCiaglyProstopadly4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP C Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY


//zmienne dla obliczen:

//var E22,E24,E26,G32,G34,G36,G38,G40,G42,G44,G50,H32,H34,H36,H38,H40,H42,H44,H50,I32,I34,I36,I38,I40,I42,I44,I50,J10,J11,J3,J32,J34,J36,J38,J4,J40,J42,J44,J46,J48,J5,J50,J6,J7,J8,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G32' : G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G50' : G50,'H32' : H32,'H34' : H34,'H36' : H36,'H38' : H38,'H40' : H40,'H42' : H42,'H44' : H44,'H50' : H50,'I32' : I32,'I34' : I34,'I36' : I36,'I38' : I38,'I40' : I40,'I42' : I42,'I44' : I44,'I50' : I50,'J10' : J10,'J11' : J11,'J3' : J3,'J32' : J32,'J34' : J34,'J36' : J36,'J38' : J38,'J4' : J4,'J40' : J40,'J42' : J42,'J44' : J44,'J46' : J46,'J48' : J48,'J5' : J5,'J50' : J50,'J6' : J6,'J7' : J7,'J8' : J8,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) * E22 >= 0.5, J11 / E22 - excelFunctions.rounddown(J11 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar D lub B tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) * E22 >= 0.5, J4 / E22 - excelFunctions.rounddown(J4 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar  B tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) * E22 >= 0.5, J10 / E22 - excelFunctions.rounddown(J10 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar H tarasu/długość deski");
//ILOŚC DESKI METRY BIEŻACE MBD

        G32 = excelFunctions.roundup((excelFunctions.rounddown(J10 / E22, 0) * excelFunctions.round(J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (excelFunctions.round((J9 / E24), 0) / excelFunctions.rounddown(1 / (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)), 0)) * E22)), 0);

        H32 = excelFunctions.roundup((excelFunctions.rounddown(J11 / E22, 0) * excelFunctions.round(J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (excelFunctions.round((J7 / E24), 0) / excelFunctions.rounddown(1 / (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)), 0)) * E22)), 0);

        I32 = excelFunctions.roundup((excelFunctions.rounddown(J4 / E22, 0) * excelFunctions.round(J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (excelFunctions.round((J5 / E24), 0) / excelFunctions.rounddown(1 / (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)), 0)) * E22)), 0);

        J32 = excelFunctions.sum('G32:I32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G34 = excelFunctions.roundup(G32 / E22, 0);

        H34 = excelFunctions.roundup(H32 / E22, 0);

        I34 = excelFunctions.roundup(I32 / E22, 0);

        J34 = excelFunctions.sum('G34:I34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G36 = excelFunctions.roundup(J9 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, J9 * (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0);

        H36 = excelFunctions.roundup(J7 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, J7 * (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0);

        I36 = excelFunctions.roundup(J5 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, J5 * (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0);

        J36 = excelFunctions.sum('G36:I36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G38 = excelFunctions.roundup(G36 / E26, 0);

        H38 = excelFunctions.roundup(H36 / E26, 0);

        I38 = excelFunctions.roundup(I36 / E26, 0);

        J38 = excelFunctions.sum('G38:I38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0);

        H44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0);

        I44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0);

        J44 = G44 - H44 + I44;
//ILOŚĆ KLIPS SRODKOWY KSR

        G40 = excelFunctions.roundup((J9 / E24 - 1) * excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, excelFunctions.roundup((2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1), 0)), 0), 0);

        H40 = excelFunctions.roundup((J7 / E24 - 1) * excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, excelFunctions.roundup((2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1), 0)), 0), 0);

        I40 = excelFunctions.roundup((J5 / E24 - 1) * excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, excelFunctions.roundup((2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1), 0)), 0), 0);

        J40 = excelFunctions.sum('G40:I40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G42 = G44;

        H42 = H44;

        I42 = I44;

        J42 = G42 - H42 + I42;
//
//
//ILOŚĆ LISTWA 4m LLS

        J46 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / E26, 0);
//
//WYDAJNOŚC Z DESKI

        J48 = excelFunctions.if(excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0) > 1, 1, excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0));
//
//POWIERZCHNIA TARASU

        G50 = excelFunctions.round(J9 * J10, 1);

        H50 = excelFunctions.round(J7 * J11, 1);

        I50 = excelFunctions.round(J4 * J5, 1);

        J50 = excelFunctions.sum('G50:I50', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J32, J34, J36, J38, J40, J42, J44, J46, J48, J50);
        return result;
    };
    this._ukladZamekProstopadly3metry = function () {
        var result = new PodsumowanieElementowTarasu();
// [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP C Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY ZAMEK POŁÓWKOWY


//zmienne dla obliczen:

//var E22,E24,E26,G68,G70,G72,G74,G76,G78,G80,G84,G86,H68,H70,H72,H74,H76,H78,H80,H84,H86,I68,I70,I72,I74,I76,I78,I80,I84,I86,J10,J11,J3,J4,J5,J6,J68,J7,J70,J72,J74,J76,J78,J8,J80,J82,J84,J86,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G84' : G84,'G86' : G86,'H68' : H68,'H70' : H70,'H72' : H72,'H74' : H74,'H76' : H76,'H78' : H78,'H80' : H80,'H84' : H84,'H86' : H86,'I68' : I68,'I70' : I70,'I72' : I72,'I74' : I74,'I76' : I76,'I78' : I78,'I80' : I80,'I84' : I84,'I86' : I86,'J10' : J10,'J11' : J11,'J3' : J3,'J4' : J4,'J5' : J5,'J6' : J6,'J68' : J68,'J7' : J7,'J70' : J70,'J72' : J72,'J74' : J74,'J76' : J76,'J78' : J78,'J8' : J8,'J80' : J80,'J82' : J82,'J84' : J84,'J86' : J86,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) * E22 >= 0.5, J11 / E22 - excelFunctions.rounddown(J11 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar D lub B tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) * E22 >= 0.5, J4 / E22 - excelFunctions.rounddown(J4 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar  B tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) * E22 >= 0.5, J10 / E22 - excelFunctions.rounddown(J10 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar H tarasu/długość deski");
//ILOŚC DESKI METRY BIEŻACE MBD

        G68 = excelFunctions.if(J10 < E22, excelFunctions.roundup((excelFunctions.rounddown(J10 / E22, 0) * excelFunctions.round(J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (excelFunctions.round((J9 / E24), 0) / excelFunctions.rounddown(1 / (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J10 / E22, 0) * excelFunctions.round(J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (excelFunctions.round((J9 / E24), 0) / excelFunctions.rounddown(1 / (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)), 0)) * E22)) + J9 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J10 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J10 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J9 / E24), 0) / excelFunctions.rounddown(1 / ((J10 - 0.5 * E22) / E22 - excelFunctions.rounddown((J10 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        H68 = excelFunctions.if(J11 < E22, excelFunctions.roundup((excelFunctions.rounddown(J11 / E22, 0) * excelFunctions.round(J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (excelFunctions.round((J7 / E24), 0) / excelFunctions.rounddown(1 / (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J11 / E22, 0) * excelFunctions.round(J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (excelFunctions.round((J7 / E24), 0) / excelFunctions.rounddown(1 / (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)), 0)) * E22)) + J7 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J11 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J11 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J7 / E24), 0) / excelFunctions.rounddown(1 / ((J11 - 0.5 * E22) / E22 - excelFunctions.rounddown((J11 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        I68 = excelFunctions.if(J4 < E22, excelFunctions.roundup((excelFunctions.rounddown(J4 / E22, 0) * excelFunctions.round(J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (excelFunctions.round((J5 / E24), 0) / excelFunctions.rounddown(1 / (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J4 / E22, 0) * excelFunctions.round(J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (excelFunctions.round((J5 / E24), 0) / excelFunctions.rounddown(1 / (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)), 0)) * E22)) + J5 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J4 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J4 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J5 / E24), 0) / excelFunctions.rounddown(1 / ((J4 - 0.5 * E22) / E22 - excelFunctions.rounddown((J4 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        J68 = excelFunctions.sum('G68:I68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G70 = excelFunctions.roundup(excelFunctions.roundup(G68 / E22, 0) / 1, 0);

        H70 = excelFunctions.roundup(excelFunctions.roundup(H68 / E22, 0) / 1, 0);

        I70 = excelFunctions.roundup(excelFunctions.roundup(I68 / E22, 0) / 1, 0);

        J70 = excelFunctions.sum('G70:I70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G72 = G74 * E26;

        H72 = H74 * E26;

        I72 = I74 * E26;

        J72 = excelFunctions.sum('G72:I72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G74 = excelFunctions.roundup((excelFunctions.roundup(J9 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, J9 * (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J10 < E22, 1, J10 / E22), 0) * J9) / E26, 0);

        H74 = excelFunctions.roundup((excelFunctions.roundup(J7 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, J7 * (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J11 < E22, 1, J11 / E22), 0) * J7) / E26, 0);

        I74 = excelFunctions.roundup((excelFunctions.roundup(J5 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, J5 * (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J4 < E22, 1, J4 / E22), 0) * J5) / E26, 0);

        J74 = excelFunctions.sum('G74:I74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0);

        H80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0);

        I80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0);

        J80 = G80 - H80 + I80;
//ILOŚĆ KLIPS SRODKOWY KSR

        G76 = excelFunctions.roundup(G80 * (J9 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J10 < E22, 1, J10 / E22), 0) * excelFunctions.roundup(J9 / E24 - 1, 0);

        H76 = excelFunctions.roundup(H80 * (J7 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J11 < E22, 1, J11 / E22), 0) * excelFunctions.roundup(J7 / E24 - 1, 0);

        I76 = excelFunctions.roundup(I80 * (J5 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J4 < E22, 1, J4 / E22), 0) * excelFunctions.roundup(J5 / E24 - 1, 0);

        J76 = excelFunctions.sum('G76:I76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G78 = G80;

        H78 = H80;

        I78 = I80;

        J78 = G78 - H78 + I78;
//
//
//ILOŚĆ LISTWA 4m LLS

        J82 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI

        G84 = excelFunctions.roundup(J9 * J10, 0) / excelFunctions.roundup(G70 * E22 * E24, 0) / 1;

        H84 = excelFunctions.roundup(J7 * J11, 0) / excelFunctions.roundup(H70 * E22 * E24, 0) / 1;

        I84 = excelFunctions.roundup(J5 * J4, 0) / excelFunctions.roundup(I70 * E22 * E24, 0) / 1;

        J84 = excelFunctions.if(excelFunctions.roundup(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0) / 1 > 1, 1, excelFunctions.roundup(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0) / 1);
//
//POWIERZCHNIA TARASU

        G86 = excelFunctions.round(J10 * J9, 1);

        H86 = excelFunctions.round(J7 * J11, 1);

        I86 = excelFunctions.round(J4 * J5, 1);

        J86 = excelFunctions.sum('G86:I86', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J68, J70, J72, J74, J76, J78, J80, J82, J84, J86);
        return result;
    };
    this._ukladZamekProstopadly4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();

// [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP C Prostopadły
// DESKA TARASOWA UKŁAD PROSTOPADŁY ZAMEK POŁÓWKOWY


//zmienne dla obliczen:

//var E22,E24,E26,G68,G70,G72,G74,G76,G78,G80,G84,G86,H68,H70,H72,H74,H76,H78,H80,H84,H86,I68,I70,I72,I74,I76,I78,I80,I84,I86,J10,J11,J3,J4,J5,J6,J68,J7,J70,J72,J74,J76,J78,J8,J80,J82,J84,J86,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G84' : G84,'G86' : G86,'H68' : H68,'H70' : H70,'H72' : H72,'H74' : H74,'H76' : H76,'H78' : H78,'H80' : H80,'H84' : H84,'H86' : H86,'I68' : I68,'I70' : I70,'I72' : I72,'I74' : I74,'I76' : I76,'I78' : I78,'I80' : I80,'I84' : I84,'I86' : I86,'J10' : J10,'J11' : J11,'J3' : J3,'J4' : J4,'J5' : J5,'J6' : J6,'J68' : J68,'J7' : J7,'J70' : J70,'J72' : J72,'J74' : J74,'J76' : J76,'J78' : J78,'J8' : J8,'J80' : J80,'J82' : J82,'J84' : J84,'J86' : J86,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) * E22 >= 0.5, J11 / E22 - excelFunctions.rounddown(J11 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar D lub B tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) * E22 >= 0.5, J4 / E22 - excelFunctions.rounddown(J4 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar  B tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) * E22 >= 0.5, J10 / E22 - excelFunctions.rounddown(J10 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar H tarasu/długość deski");
//ILOŚC DESKI METRY BIEŻACE MBD

        G68 = excelFunctions.if(J10 < E22, excelFunctions.roundup((excelFunctions.rounddown(J10 / E22, 0) * excelFunctions.round(J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (excelFunctions.round((J9 / E24), 0) / excelFunctions.rounddown(1 / (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J10 / E22, 0) * excelFunctions.round(J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (excelFunctions.round((J9 / E24), 0) / excelFunctions.rounddown(1 / (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)), 0)) * E22)) + J9 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J10 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J9 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J10 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J9 / E24), 0) / excelFunctions.rounddown(1 / ((J10 - 0.5 * E22) / E22 - excelFunctions.rounddown((J10 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        H68 = excelFunctions.if(J11 < E22, excelFunctions.roundup((excelFunctions.rounddown(J11 / E22, 0) * excelFunctions.round(J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (excelFunctions.round((J7 / E24), 0) / excelFunctions.rounddown(1 / (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J11 / E22, 0) * excelFunctions.round(J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (excelFunctions.round((J7 / E24), 0) / excelFunctions.rounddown(1 / (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)), 0)) * E22)) + J7 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J11 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J7 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J11 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J7 / E24), 0) / excelFunctions.rounddown(1 / ((J11 - 0.5 * E22) / E22 - excelFunctions.rounddown((J11 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        I68 = excelFunctions.if(J4 < E22, excelFunctions.roundup((excelFunctions.rounddown(J4 / E22, 0) * excelFunctions.round(J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (excelFunctions.round((J5 / E24), 0) / excelFunctions.rounddown(1 / (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J4 / E22, 0) * excelFunctions.round(J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (excelFunctions.round((J5 / E24), 0) / excelFunctions.rounddown(1 / (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)), 0)) * E22)) + J5 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J4 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J5 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J4 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J5 / E24), 0) / excelFunctions.rounddown(1 / ((J4 - 0.5 * E22) / E22 - excelFunctions.rounddown((J4 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        J68 = excelFunctions.sum('G68:I68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G70 = excelFunctions.roundup(G68 / E22, 0);

        H70 = excelFunctions.roundup(H68 / E22, 0);

        I70 = excelFunctions.roundup(I68 / E22, 0);

        J70 = excelFunctions.sum('G70:I70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G72 = G74 * E26;

        H72 = H74 * E26;

        I72 = I74 * E26;

        J72 = excelFunctions.sum('G72:I72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G74 = excelFunctions.roundup((excelFunctions.roundup(J9 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, J9 * (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J10 < E22, 1, J10 / E22), 0) * J9) / E26, 0);

        H74 = excelFunctions.roundup((excelFunctions.roundup(J7 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, J7 * (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J11 < E22, 1, J11 / E22), 0) * J7) / E26, 0);

        I74 = excelFunctions.roundup((excelFunctions.roundup(J5 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, J5 * (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J4 < E22, 1, J4 / E22), 0) * J5) / E26, 0);

        J74 = excelFunctions.sum('G74:I74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J10 / E22, 0) + excelFunctions.if(excelFunctions.mod(J10, E22) == 0, 0, (2 * E22 * (J10 / E22 - excelFunctions.rounddown(J10 / E22, 0)) + 1)), 0);

        H80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J11 / E22, 0) + excelFunctions.if(excelFunctions.mod(J11, E22) == 0, 0, (2 * E22 * (J11 / E22 - excelFunctions.rounddown(J11 / E22, 0)) + 1)), 0);

        I80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J4 / E22, 0) + excelFunctions.if(excelFunctions.mod(J4, E22) == 0, 0, (2 * E22 * (J4 / E22 - excelFunctions.rounddown(J4 / E22, 0)) + 1)), 0);

        J80 = G80 - H80 + I80;
//ILOŚĆ KLIPS SRODKOWY KSR

        G76 = excelFunctions.roundup(G80 * (J9 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J10 < E22, 1, J10 / E22), 0) * excelFunctions.roundup(J9 / E24 - 1, 0);

        H76 = excelFunctions.roundup(H80 * (J7 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J11 < E22, 1, J11 / E22), 0) * excelFunctions.roundup(J7 / E24 - 1, 0);

        I76 = excelFunctions.roundup(I80 * (J5 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J4 < E22, 1, J4 / E22), 0) * excelFunctions.roundup(J5 / E24 - 1, 0);

        J76 = excelFunctions.sum('G76:I76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G78 = G80;

        H78 = H80;

        I78 = I80;

        J78 = G78 - H78 + I78;
//
//
//ILOŚĆ LISTWA 4m LLS

        J82 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI

        G84 = excelFunctions.if(excelFunctions.roundup(J9 * J10, 0) / excelFunctions.roundup(G70 * E22 * E24, 0) > 1, 1, excelFunctions.roundup(J9 * J10, 0) / excelFunctions.roundup(G70 * E22 * E24, 0));

        H84 = excelFunctions.if(excelFunctions.roundup(J7 * J11, 0) / excelFunctions.roundup(H70 * E22 * E24, 0) > 1, 1, excelFunctions.roundup(J7 * J11, 0) / excelFunctions.roundup(H70 * E22 * E24, 0));

        I84 = excelFunctions.if(excelFunctions.roundup(J5 * J4, 0) / excelFunctions.roundup(I70 * E22 * E24, 0) > 1, 1, excelFunctions.roundup(J5 * J4, 0) / excelFunctions.roundup(I70 * E22 * E24, 0));

        J84 = excelFunctions.if(excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0) > 1, 1, excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0));
//
//POWIERZCHNIA TARASU

        G86 = excelFunctions.roundup(J10 * J9, 1);

        H86 = excelFunctions.roundup(J7 * J11, 1);

        I86 = excelFunctions.roundup(J4 * J5, 1);

        J86 = excelFunctions.sum('G86:I86', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J68, J70, J72, J74, J76, J78, J80, J82, J84, J86);
        return result;
    };


    this._ukladCiaglyRownolegle3metry = function () {
        var result = new PodsumowanieElementowTarasu();
// [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP C Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY


//zmienne dla obliczen:

//var E22,E24,E26,G32,G34,G36,G38,G40,G42,G44,G50,H32,H34,H36,H38,H40,H42,H44,H50,I32,I34,I36,I38,I40,I42,I44,I50,J10,J11,J3,J32,J34,J36,J38,J40,J42,J44,J46,J48,J5,J50,J6,J8,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G32' : G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G50' : G50,'H32' : H32,'H34' : H34,'H36' : H36,'H38' : H38,'H40' : H40,'H42' : H42,'H44' : H44,'H50' : H50,'I32' : I32,'I34' : I34,'I36' : I36,'I38' : I38,'I40' : I40,'I42' : I42,'I44' : I44,'I50' : I50,'J10' : J10,'J11' : J11,'J3' : J3,'J32' : J32,'J34' : J34,'J36' : J36,'J38' : J38,'J40' : J40,'J42' : J42,'J44' : J44,'J46' : J46,'J48' : J48,'J5' : J5,'J50' : J50,'J6' : J6,'J8' : J8,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) * E22 >= 0.5, J3 / E22 - excelFunctions.rounddown(J3 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar A tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) * E22 >= 0.5, J5 / E22 - excelFunctions.rounddown(J5 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar C tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) * E22 >= 0.5, J9 / E22 - excelFunctions.rounddown(J9 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar G tarasu/długość deski");
//ILOŚC DESKI METRY BIEŻACE MBD

        G32 = excelFunctions.roundup((excelFunctions.rounddown(J3 / E22, 0) * excelFunctions.round(J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (excelFunctions.round((J11 / E24), 0) / excelFunctions.rounddown(1 / (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)), 0)) * E22)), 0);

        H32 = excelFunctions.roundup((excelFunctions.rounddown(J5 / E22, 0) * excelFunctions.round(J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (excelFunctions.round((J6 / E24), 0) / excelFunctions.rounddown(1 / (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)), 0)) * E22)), 0);

        I32 = excelFunctions.roundup((excelFunctions.rounddown(J9 / E22, 0) * excelFunctions.round(J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (excelFunctions.round((J8 / E24), 0) / excelFunctions.rounddown(1 / (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)), 0)) * E22)), 0);

        J32 = excelFunctions.sum('G32:I32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G34 = excelFunctions.roundup(excelFunctions.roundup(G32 / E22, 0) / 1, 0);

        H34 = excelFunctions.roundup(excelFunctions.roundup(H32 / E22, 0) / 1, 0);

        I34 = excelFunctions.roundup(excelFunctions.roundup(I32 / E22, 0) / 1, 0);

        J34 = excelFunctions.sum('G34:I34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G36 = excelFunctions.roundup(J11 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, J11 * (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0);

        H36 = excelFunctions.roundup(J6 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, J6 * (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0);

        I36 = excelFunctions.roundup(J8 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, J8 * (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0);

        J36 = excelFunctions.sum('G36:I36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G38 = excelFunctions.roundup(G36 / E26, 0);

        H38 = excelFunctions.roundup(H36 / E26, 0);

        I38 = excelFunctions.roundup(I36 / E26, 0);

        J38 = excelFunctions.sum('G38:I38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0);

        H44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0);

        I44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0);

        J44 = excelFunctions.sum('G44:I44', zbierzZmienne()) - I44 - H44;
//ILOŚĆ KLIPS SRODKOWY KSR

        G40 = excelFunctions.roundup(G44 * (J11 / E24 - 1), 0);

        H40 = excelFunctions.roundup(H44 * (J6 / E24 - 1), 0);

        I40 = excelFunctions.roundup(I44 * (J8 / E24 - 1), 0);

        J40 = excelFunctions.sum('G40:I40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G42 = G44;

        H42 = H44;

        I42 = I44;

        J42 = excelFunctions.sum('G42:I42', zbierzZmienne()) - I42 - H42;
//
//
//ILOŚĆ LISTWA 4m LLS

        J46 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / E26, 0);
//
//WYDAJNOŚC Z DESKI

        J48 = excelFunctions.if(excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0) / 1 > 1, 1, excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0) / 1);
//
//POWIERZCHNIA TARASU

        G50 = excelFunctions.round(J11 * J3, 1);

        H50 = excelFunctions.round(J5 * J6, 1);

        I50 = excelFunctions.round(J8 * J9, 1);

        J50 = excelFunctions.sum('G50:I50', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J32, J34, J36, J38, J40, J42, J44, J46, J48, J50);
        return result;
    };
    this._ukladCiaglyRownolegle4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP C Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY


//zmienne dla obliczen:

//var E22,E24,E26,G32,G34,G36,G38,G40,G42,G44,G50,H32,H34,H36,H38,H40,H42,H44,H50,I32,I34,I36,I38,I40,I42,I44,I50,J10,J11,J3,J32,J34,J36,J38,J40,J42,J44,J46,J48,J5,J50,J6,J8,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G32' : G32,'G34' : G34,'G36' : G36,'G38' : G38,'G40' : G40,'G42' : G42,'G44' : G44,'G50' : G50,'H32' : H32,'H34' : H34,'H36' : H36,'H38' : H38,'H40' : H40,'H42' : H42,'H44' : H44,'H50' : H50,'I32' : I32,'I34' : I34,'I36' : I36,'I38' : I38,'I40' : I40,'I42' : I42,'I44' : I44,'I50' : I50,'J10' : J10,'J11' : J11,'J3' : J3,'J32' : J32,'J34' : J34,'J36' : J36,'J38' : J38,'J40' : J40,'J42' : J42,'J44' : J44,'J46' : J46,'J48' : J48,'J5' : J5,'J50' : J50,'J6' : J6,'J8' : J8,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) * E22 >= 0.5, J3 / E22 - excelFunctions.rounddown(J3 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar A tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) * E22 >= 0.5, J5 / E22 - excelFunctions.rounddown(J5 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar C tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) * E22 >= 0.5, J9 / E22 - excelFunctions.rounddown(J9 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar G tarasu/długość deski");

//ILOŚC DESKI METRY BIEŻACE MBD

        G32 = excelFunctions.roundup((excelFunctions.rounddown(J3 / E22, 0) * excelFunctions.round(J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (excelFunctions.round((J11 / E24), 0) / excelFunctions.rounddown(1 / (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)), 0)) * E22)), 0);

        H32 = excelFunctions.roundup((excelFunctions.rounddown(J5 / E22, 0) * excelFunctions.round(J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (excelFunctions.round((J6 / E24), 0) / excelFunctions.rounddown(1 / (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)), 0)) * E22)), 0);

        I32 = excelFunctions.roundup((excelFunctions.rounddown(J9 / E22, 0) * excelFunctions.round(J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (excelFunctions.round((J8 / E24), 0) / excelFunctions.rounddown(1 / (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)), 0)) * E22)), 0);

        J32 = excelFunctions.sum('G32:I32', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G34 = excelFunctions.roundup(G32 / E22, 0);

        H34 = excelFunctions.roundup(H32 / E22, 0);

        I34 = excelFunctions.roundup(I32 / E22, 0);

        J34 = excelFunctions.sum('G34:I34', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G36 = excelFunctions.roundup(J11 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, J11 * (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0);

        H36 = excelFunctions.roundup(J6 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, J6 * (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0);

        I36 = excelFunctions.roundup(J8 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, J8 * (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0);

        J36 = excelFunctions.sum('G36:I36', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G38 = excelFunctions.roundup(G36 / E26, 0);

        H38 = excelFunctions.roundup(H36 / E26, 0);

        I38 = excelFunctions.roundup(I36 / E26, 0);

        J38 = excelFunctions.sum('G38:I38', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0);

        H44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0);

        I44 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0);

        J44 = excelFunctions.sum('G44:I44', zbierzZmienne()) - I44 - H44;
//ILOŚĆ KLIPS SRODKOWY KSR

        G40 = excelFunctions.roundup(G44 * (J11 / E24 - 1), 0);

        H40 = excelFunctions.roundup(H44 * (J6 / E24 - 1), 0);

        I40 = excelFunctions.roundup(I44 * (J8 / E24 - 1), 0);

        J40 = excelFunctions.sum('G40:I40', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G42 = G44;

        H42 = H44;

        I42 = I44;

        J42 = excelFunctions.sum('G42:I42', zbierzZmienne()) - I42 - H42;
//
//
//ILOŚĆ LISTWA 4m LLS

        J46 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / E26, 0);
//
//WYDAJNOŚC Z DESKI

        J48 = excelFunctions.if(excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0) > 1, 1, excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J34 * E22 * E24, 0));
//
//POWIERZCHNIA TARASU

        G50 = excelFunctions.round(J11 * J3, 1);

        H50 = excelFunctions.round(J5 * J6, 1);

        I50 = excelFunctions.round(J8 * J9, 1);

        J50 = excelFunctions.sum('G50:I50', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J32, J34, J36, J38, J40, J42, J44, J46, J48, J50);
        return result;
    };
    this._ukladZamekRownolegle3metry = function () {
        var result = new PodsumowanieElementowTarasu();
// [algorytm 30.01.2022.deska 6m jako 3m.xlsx]TYP C Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY ZAMEK POŁÓWKOWY


//zmienne dla obliczen:

//var E22,E24,E26,G68,G70,G72,G74,G76,G78,G80,G84,G86,H68,H70,H72,H74,H76,H78,H80,H84,H86,I68,I70,I72,I74,I76,I78,I80,I84,I86,J10,J11,J3,J5,J6,J68,J70,J72,J74,J76,J78,J8,J80,J82,J84,J86,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G84' : G84,'G86' : G86,'H68' : H68,'H70' : H70,'H72' : H72,'H74' : H74,'H76' : H76,'H78' : H78,'H80' : H80,'H84' : H84,'H86' : H86,'I68' : I68,'I70' : I70,'I72' : I72,'I74' : I74,'I76' : I76,'I78' : I78,'I80' : I80,'I84' : I84,'I86' : I86,'J10' : J10,'J11' : J11,'J3' : J3,'J5' : J5,'J6' : J6,'J68' : J68,'J70' : J70,'J72' : J72,'J74' : J74,'J76' : J76,'J78' : J78,'J8' : J8,'J80' : J80,'J82' : J82,'J84' : J84,'J86' : J86,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) * E22 >= 0.5, J3 / E22 - excelFunctions.rounddown(J3 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar A tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) * E22 >= 0.5, J5 / E22 - excelFunctions.rounddown(J5 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar C tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) * E22 >= 0.5, J9 / E22 - excelFunctions.rounddown(J9 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar G tarasu/długość deski");
//ILOŚC DESKI METRY BIEŻACE MBD

        G68 = excelFunctions.if(J3 < E22, excelFunctions.roundup((excelFunctions.rounddown(J3 / E22, 0) * excelFunctions.round(J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (excelFunctions.round((J11 / E24), 0) / excelFunctions.rounddown(1 / (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J3 / E22, 0) * excelFunctions.round(J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (excelFunctions.round((J11 / E24), 0) / excelFunctions.rounddown(1 / (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)), 0)) * E22)) + J11 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J3 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J3 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J11 / E24), 0) / excelFunctions.rounddown(1 / ((J3 - 0.5 * E22) / E22 - excelFunctions.rounddown((J3 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        H68 = excelFunctions.if(J5 < E22, excelFunctions.roundup((excelFunctions.rounddown(J5 / E22, 0) * excelFunctions.round(J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (excelFunctions.round((J6 / E24), 0) / excelFunctions.rounddown(1 / (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J5 / E22, 0) * excelFunctions.round(J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (excelFunctions.round((J6 / E24), 0) / excelFunctions.rounddown(1 / (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)), 0)) * E22)) + J6 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J5 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J5 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J6 / E24), 0) / excelFunctions.rounddown(1 / ((J5 - 0.5 * E22) / E22 - excelFunctions.rounddown((J5 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        I68 = excelFunctions.if(J9 < E22, excelFunctions.roundup((excelFunctions.rounddown(J9 / E22, 0) * excelFunctions.round(J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (excelFunctions.round((J8 / E24), 0) / excelFunctions.rounddown(1 / (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J9 / E22, 0) * excelFunctions.round(J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (excelFunctions.round((J8 / E24), 0) / excelFunctions.rounddown(1 / (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)), 0)) * E22)) + J8 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J9 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J9 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J8 / E24), 0) / excelFunctions.rounddown(1 / ((J9 - 0.5 * E22) / E22 - excelFunctions.rounddown((J9 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        J68 = excelFunctions.sum('G68:I68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G70 = excelFunctions.roundup(excelFunctions.roundup(G68 / E22, 0) / 1, 0);

        H70 = excelFunctions.roundup(excelFunctions.roundup(H68 / E22, 0) / 1, 0);

        I70 = excelFunctions.roundup(excelFunctions.roundup(I68 / E22, 0) / 1, 0);

        J70 = excelFunctions.sum('G70:I70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G72 = G74 * E26;

        H72 = H74 * E26;

        I72 = I74 * E26;

        J72 = excelFunctions.sum('G72:I72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G74 = excelFunctions.roundup((excelFunctions.roundup(J11 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, J11 * (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J3 < E22, 1, J3 / E22), 0) * J11) / E26, 0);

        H74 = excelFunctions.roundup((excelFunctions.roundup(J6 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, J6 * (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J5 < E22, 1, J5 / E22), 0) * J6) / E26, 0);

        I74 = excelFunctions.roundup((excelFunctions.roundup(J8 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, J8 * (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J9 < E22, 1, J9 / E22), 0) * J8) / E26, 0);

        J74 = excelFunctions.sum('G74:I74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0);

        H80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0);

        I80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0);

        J80 = excelFunctions.sum('G80:I80', zbierzZmienne()) - I80 - H80;
//ILOŚĆ KLIPS SRODKOWY KSR

        G76 = excelFunctions.roundup(G80 * (J11 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J3 < E22, 1, J3 / E22), 0) * excelFunctions.roundup(J11 / E24 - 1, 0);

        H76 = excelFunctions.roundup(H80 * (J6 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J5 < E22, 1, J5 / E22), 0) * excelFunctions.roundup(J6 / E24 - 1, 0);

        I76 = excelFunctions.roundup(I80 * (J8 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J9 < E22, 1, J9 / E22), 0) * excelFunctions.roundup(J8 / E24 - 1, 0);

        J76 = excelFunctions.sum('G76:I76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G78 = G80;

        H78 = H80;

        I78 = I80;

        J78 = excelFunctions.sum('G78:I78', zbierzZmienne()) - I78 - H78;
//
//
//ILOŚĆ LISTWA 4m LLS

        J82 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI

        G84 = excelFunctions.if(excelFunctions.roundup(J3 * J11, 0) / excelFunctions.roundup(G70 * E22 * E24, 0) / 1 > 1, 1, excelFunctions.roundup(J3 * J11, 0) / excelFunctions.roundup(G70 * E22 * E24, 0) / 1);

        H84 = excelFunctions.if(excelFunctions.roundup(J5 * J6, 0) / excelFunctions.roundup(H70 * E22 * E24, 0) / 1 > 1, 1, excelFunctions.roundup(J5 * J6, 0) / excelFunctions.roundup(H70 * E22 * E24, 0) / 1);

        I84 = excelFunctions.if(excelFunctions.roundup(J9 * J8, 0) / excelFunctions.roundup(I70 * E22 * E24, 0) / 1 > 1, 1, excelFunctions.roundup(J9 * J8, 0) / excelFunctions.roundup(I70 * E22 * E24, 0) / 1);

        J84 = excelFunctions.if(excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0) / 1 > 1, 1, excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0) / 1);
//
//POWIERZCHNIA TARASU

        G86 = excelFunctions.round(J11 * J3, 1);

        H86 = excelFunctions.round(J5 * J6, 1);

        I86 = excelFunctions.round(J8 * J9, 1);

        J86 = excelFunctions.sum('G86:I86', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J68, J70, J72, J74, J76, J78, J80, J82, J84, J86);
        return result;
    };
    this._ukladZamekRownolegle4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
// [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]TYP C Równoległy
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY ZAMEK POŁÓWKOWY


//zmienne dla obliczen:

//var E22,E24,E26,G68,G70,G72,G74,G76,G78,G80,G84,G86,H68,H70,H72,H74,H76,H78,H80,H84,H86,I68,I70,I72,I74,I76,I78,I80,I84,I86,J10,J11,J3,J5,J6,J68,J70,J72,J74,J76,J78,J8,J80,J82,J84,J86,J9;


        //obiekt zwracany przez funkcje zbierzZmienne

        //{'E22' : E22,'E24' : E24,'E26' : E26,'G68' : G68,'G70' : G70,'G72' : G72,'G74' : G74,'G76' : G76,'G78' : G78,'G80' : G80,'G84' : G84,'G86' : G86,'H68' : H68,'H70' : H70,'H72' : H72,'H74' : H74,'H76' : H76,'H78' : H78,'H80' : H80,'H84' : H84,'H86' : H86,'I68' : I68,'I70' : I70,'I72' : I72,'I74' : I74,'I76' : I76,'I78' : I78,'I80' : I80,'I84' : I84,'I86' : I86,'J10' : J10,'J11' : J11,'J3' : J3,'J5' : J5,'J6' : J6,'J68' : J68,'J70' : J70,'J72' : J72,'J74' : J74,'J76' : J76,'J78' : J78,'J8' : J8,'J80' : J80,'J82' : J82,'J84' : J84,'J86' : J86,'J9' : J9,};

//weryfikacja danych

        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) * E22 >= 0.5, J3 / E22 - excelFunctions.rounddown(J3 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar A tarasu/długość deski");
        var Warunek_2 = excelFunctions.ifWithStatus(excelFunctions.or((J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) * E22 >= 0.5, J5 / E22 - excelFunctions.rounddown(J5 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar C tarasu/długość deski");
        var Warunek_3 = excelFunctions.ifWithStatus(excelFunctions.or((J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) * E22 >= 0.5, J9 / E22 - excelFunctions.rounddown(J9 / E22, 0) <= 0), "wymiary poprawne", "zmień wymiar G tarasu/długość deski");
//ILOŚC DESKI METRY BIEŻACE MBD

        G68 = excelFunctions.if(J3 < E22, excelFunctions.roundup((excelFunctions.rounddown(J3 / E22, 0) * excelFunctions.round(J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (excelFunctions.round((J11 / E24), 0) / excelFunctions.rounddown(1 / (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J3 / E22, 0) * excelFunctions.round(J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (excelFunctions.round((J11 / E24), 0) / excelFunctions.rounddown(1 / (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)), 0)) * E22)) + J11 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J3 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J11 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J3 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J11 / E24), 0) / excelFunctions.rounddown(1 / ((J3 - 0.5 * E22) / E22 - excelFunctions.rounddown((J3 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        H68 = excelFunctions.if(J5 < E22, excelFunctions.roundup((excelFunctions.rounddown(J5 / E22, 0) * excelFunctions.round(J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (excelFunctions.round((J6 / E24), 0) / excelFunctions.rounddown(1 / (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J5 / E22, 0) * excelFunctions.round(J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (excelFunctions.round((J6 / E24), 0) / excelFunctions.rounddown(1 / (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)), 0)) * E22)) + J6 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J5 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J6 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J5 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J6 / E24), 0) / excelFunctions.rounddown(1 / ((J5 - 0.5 * E22) / E22 - excelFunctions.rounddown((J5 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        I68 = excelFunctions.if(J9 < E22, excelFunctions.roundup((excelFunctions.rounddown(J9 / E22, 0) * excelFunctions.round(J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (excelFunctions.round((J8 / E24), 0) / excelFunctions.rounddown(1 / (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)), 0)) * E22)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J9 / E22, 0) * excelFunctions.round(J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (excelFunctions.round((J8 / E24), 0) / excelFunctions.rounddown(1 / (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)), 0)) * E22)) + J8 / (2 * E24) * 0.5 * E22 + (excelFunctions.rounddown((J9 - 0.5 * E22) / E22, 0) * excelFunctions.round(0.5 * J8 / E24, 0) * E22 + excelFunctions.if(excelFunctions.mod((J9 - 0.5 * E22), E22) == 0, 0, (excelFunctions.round((0.5 * J8 / E24), 0) / excelFunctions.rounddown(1 / ((J9 - 0.5 * E22) / E22 - excelFunctions.rounddown((J9 - 0.5 * E22) / E22, 0)), 0)) * E22))), 0));

        J68 = excelFunctions.sum('G68:I68', zbierzZmienne());
//
//ILOŚĆ DESKI  SZTUKI DST

        G70 = excelFunctions.roundup(G68 / E22, 0);

        H70 = excelFunctions.roundup(H68 / E22, 0);

        I70 = excelFunctions.roundup(I68 / E22, 0);

        J70 = excelFunctions.sum('G70:I70', zbierzZmienne());
//
//ILOŚC LEGAR METRY BIEŻACE MBL

        G72 = G74 * E26;

        H72 = H74 * E26;

        I72 = I74 * E26;

        J72 = excelFunctions.sum('G72:I72', zbierzZmienne());
//
//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        G74 = excelFunctions.roundup((excelFunctions.roundup(J11 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, J11 * (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J3 < E22, 1, J3 / E22), 0) * J11) / E26, 0);

        H74 = excelFunctions.roundup((excelFunctions.roundup(J6 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, J6 * (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J5 < E22, 1, J5 / E22), 0) * J6) / E26, 0);

        I74 = excelFunctions.roundup((excelFunctions.roundup(J8 * ((E22 / 0.5) + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, J8 * (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0) / E26), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J9 < E22, 1, J9 / E22), 0) * J8) / E26, 0);

        J74 = excelFunctions.sum('G74:I74', zbierzZmienne());
//
//ILOŚĆ KLIPS POCZĄTKOWY KST

        G80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J3 / E22, 0) + excelFunctions.if(excelFunctions.mod(J3, E22) == 0, 0, (2 * E22 * (J3 / E22 - excelFunctions.rounddown(J3 / E22, 0)) + 1)), 0);

        H80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J5 / E22, 0) + excelFunctions.if(excelFunctions.mod(J5, E22) == 0, 0, (2 * E22 * (J5 / E22 - excelFunctions.rounddown(J5 / E22, 0)) + 1)), 0);

        I80 = excelFunctions.roundup((2 * E22 + 1) * excelFunctions.rounddown(J9 / E22, 0) + excelFunctions.if(excelFunctions.mod(J9, E22) == 0, 0, (2 * E22 * (J9 / E22 - excelFunctions.rounddown(J9 / E22, 0)) + 1)), 0);

        J80 = excelFunctions.sum('G80:I80', zbierzZmienne()) - I80 - H80;
//ILOŚĆ KLIPS SRODKOWY KSR

        G76 = excelFunctions.roundup(G80 * (J11 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J3 < E22, 1, J3 / E22), 0) * excelFunctions.roundup(J11 / E24 - 1, 0);

        H76 = excelFunctions.roundup(H80 * (J6 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J5 < E22, 1, J5 / E22), 0) * excelFunctions.roundup(J6 / E24 - 1, 0);

        I76 = excelFunctions.roundup(I80 * (J8 / E24 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J9 < E22, 1, J9 / E22), 0) * excelFunctions.roundup(J8 / E24 - 1, 0);

        J76 = excelFunctions.sum('G76:I76', zbierzZmienne());
//
//ILOŚC KLIPS KOŃCOWY KK

        G78 = G80;

        H78 = H80;

        I78 = I80;

        J78 = excelFunctions.sum('G78:I78', zbierzZmienne()) - I78 - H78;
//
//
//ILOŚĆ LISTWA 4m LLS

        J82 = excelFunctions.roundup(excelFunctions.sum('J3:J10', zbierzZmienne()) / 4, 0);
//
//WYDAJNOŚC Z DESKI

        G84 = excelFunctions.if(excelFunctions.roundup(J3 * J11, 0) / excelFunctions.roundup(G70 * E22 * E24, 0) > 1, 1, excelFunctions.roundup(J3 * J11, 0) / excelFunctions.roundup(G70 * E22 * E24, 0));

        H84 = excelFunctions.if(excelFunctions.roundup(J5 * J6, 0) / excelFunctions.roundup(H70 * E22 * E24, 0) > 1, 1, excelFunctions.roundup(J5 * J6, 0) / excelFunctions.roundup(H70 * E22 * E24, 0));

        I84 = excelFunctions.if(excelFunctions.roundup(J9 * J8, 0) / excelFunctions.roundup(I70 * E22 * E24, 0) > 1, 1, excelFunctions.roundup(J9 * J8, 0) / excelFunctions.roundup(I70 * E22 * E24, 0));

        J84 = excelFunctions.if(excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0) > 1, 1, excelFunctions.round(J3 * J11 + J6 * J5 + J8 * J9, 0) / excelFunctions.roundup(J70 * E22 * E24, 0));
//
//POWIERZCHNIA TARASU

        G86 = excelFunctions.round(J11 * J3, 1);

        H86 = excelFunctions.round(J5 * J6, 1);

        I86 = excelFunctions.round(J8 * J9, 1);

        J86 = excelFunctions.sum('G86:I86', zbierzZmienne());

        result.dodajWynikWarunku(Warunek_1);
        result.dodajWynikWarunku(Warunek_2);
        result.dodajWynikWarunku(Warunek_3);
        result.setup(J68, J70, J72, J74, J76, J78, J80, J82, J84, J86);
        return result;
    };

}