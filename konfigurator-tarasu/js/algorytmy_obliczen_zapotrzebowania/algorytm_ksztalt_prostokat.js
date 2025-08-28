/**
 * algorytmy obliczen zapotrzebowania dla kształtu Prostokat
 * @param {Taras} _taras
 */
function obliczZapotrzebowanieDlaProstokat(_taras) {
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
//zmienne dla obliczen:
    var C13, C14, C15, C16, C17, C22, C24, C26, E22, E23, E24, E25, E26, E27, E29, E31, E32, E33, E34, E35, E36, E37,
        E38, E39,
        E40, E41, E42, E44, E50, E68, E70, E72, E74, E76, E78, E80, E84, E86, F32, F34, F36, F38, F40, F42, F44, F50,
        F68, F70, F72, F74, F76, F78, F80, F84, F86, G32, G34, G36, G38, G40, G42, G44, G46, G48, G50, G68, G70, G72,
        G74, G76, G78, G80, G82, G84, G86, H3, H32, H34, H36, H38, H4, H40, H42, H44, H5, H50, H6, H68, H7, H70, H72,
        H74, H76, H78, H8, H80, H84, H86, I32, I34, I36, I38, I40, I42, I44, I50, I68, I70, I72, I74, I76, I78, I80,
        I84, I86, J10, J11, J3, J32, J34, J36, J38, J4, J40, J42, J44, J46, J48, J5, J50, J6, J68, J7, J70, J72, J74,
        J76, J78, J8, J80, J82, J84, J86, J9;


    /**
     *
     * @returns {ReturnObj}
     */
    this.oblicz = function () {
        var ret = new ReturnObj();
        var rs = this._konfiguruj();
        if (!rs.status) {
            return rs;
        }
        // dostosowanie kierunku ulozenia desek wzgledem boku A (AB)
        var kierunekUlozeniaWzgledemA = taras.kierunek_ulozenia;
        if (taras.liniaStykuDom.symbol == 'DA' || taras.liniaStykuDom.symbol == 'BC') {
            if(taras.kierunek_ulozenia == this.globalne.KIERUNEK_ULOZENIA.PROSTOPADLE){
                kierunekUlozeniaWzgledemA = this.globalne.KIERUNEK_ULOZENIA.ROWNOLEGLE;
            } else {
                kierunekUlozeniaWzgledemA = this.globalne.KIERUNEK_ULOZENIA.PROSTOPADLE;
            }
        }

        var obliczenia = new PodsumowanieElementowTarasu();
        if (kierunekUlozeniaWzgledemA == this.globalne.KIERUNEK_ULOZENIA.PROSTOPADLE) {
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
        } else if (kierunekUlozeniaWzgledemA == this.globalne.KIERUNEK_ULOZENIA.ROWNOLEGLE) {
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
            ret.value = obliczenia;
            ret.status = false;
            ret.message = obliczenia.wynikWalidacjiWarunkow().message;
        }
        return ret;
    };
    /**
     *
     * @returns {ReturnObj}
     * @private
     */
    this._konfiguruj = function () {
        var ret = new ReturnObj();

        //dlugosc boku A
        J4 = taras.ksztaltObiekt.bokAdlugosc();
        //dlugosc boku B
        J5 = taras.ksztaltObiekt.bokBdlugosc();
        //dlugosc deski
        C13 = this.globalne.konwertujMilimetrynaMetry(taras.deska.dlugosc);
        //szerokosc deski
        C14 = this.globalne.konwertujMilimetrynaMetry(taras.deska.szerokosc);
        //szerokosc klipsa
        C16 = this.globalne.konwertujMilimetrynaMetry(taras.deski_odstep);
        //szerokośc deski z klipsem wybranym 0,003m  lub 0,005m  , czyli odpowiednio 3 mm lub 5 mm
        C15 = C14 + C16;
        //legar długość
        C17 = this.globalne.konwertujMilimetrynaMetry(taras.legar.dlugosc);
        var tab = [J4, J5, C13, C14, C15, C16, C17];
        for (var i = 0; i < tab.length; i++) {
            if (tab[i] <= 0 || tab[i] == undefined) {
                ret.status = false;
                ret.message = this.constructor.name + ' _konfiguruj - Jeden z parametrów jest <= 0 albo undefined. Parametry: ' + tab.toString();
                break;
            }
        }
        if (this.globalne.debug) {
            console.log('obliczZapotrzebowanieDlaProstokat - konfiguruj parametry [J4,J5,C13,C14,C15,C16,C17]: ', tab);
        }
        return ret;
    };

    function zbierzZmienne() {
        return {
            'C13': C13,
            'C14': C14,
            'C15': C15,
            'C16': C16,
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

    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladCiaglyProstopadly3metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm 30.01.2022.deska 6m jako 3m.xlsx]PROSTOKĄT UKŁAD PROSTOPADŁY
// DESKA TARASOWA UKŁAD PROSTOPADŁY

//zmienne dla obliczen:
//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' : E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) * C13 >= 0.5, J5 / C13 - excelFunctions.rounddown(J5 / C13, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_B_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.roundup((excelFunctions.rounddown(J5 / C13, 0) * excelFunctions.round(J4 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (excelFunctions.round((J4 / C15), 0) / excelFunctions.rounddown(1 / (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)), 0)) * C13)), 0);

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(excelFunctions.roundup(E23 / C13, 0) / 1, 0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = excelFunctions.roundup(J4 * ((C13 / 0.5) + 1) * excelFunctions.rounddown(J5 / C13, 0) + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, J4 * (2 * C13 * (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) + 1)), 0);


//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E29 = excelFunctions.roundup(E27 / C17, 0);

//ILOŚĆ KLIPS POCZĄTKOWY KST
        E35 = excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J5 / C13, 0) + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (2 * C13 * (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) + 1)), 0);

//ILOŚĆ KLIPS SRODKOWY KSR
        E31 = excelFunctions.roundup((J4 / C15 - 1) * excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J5 / C13, 0) + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, excelFunctions.roundup((2 * C13 * (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) + 1), 0)), 0), 0);

//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;


//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4 + J4 + J5 + J5) / C17, 0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1 > 1, 1, excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1);


//POWIERZCHNIA TARASU
        E41 = excelFunctions.round(J4 * J5, 1);

        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };
    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladCiaglyProstopadly4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
// [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]PROSTOKĄT UKŁAD PROSTOPADŁY
// DESKA TARASOWA UKŁAD PROSTOPADŁY

//zmienne dla obliczen:

//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne

        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' : E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};

//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J5/C13-excelFunctions.rounddown(J5/C13,0))*C13 >= 0.5,J5/C13-excelFunctions.rounddown(J5/C13,0) <= 0),"wymiary poprawne","warunek_komunikat_zmien_wymiar_B_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.roundup((excelFunctions.rounddown(J5/C13,0)*excelFunctions.round(J4/C15,0)*C13+excelFunctions.if(excelFunctions.mod(J5,C13)==0,0,(excelFunctions.round((J4/C15),0)/excelFunctions.rounddown(1/(J5/C13-excelFunctions.rounddown(J5/C13,0)),0))*C13)),0);

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(E23/C13,0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = excelFunctions.roundup(J4*((C13/0.5)+1)*excelFunctions.rounddown(J5/C13,0)+excelFunctions.if(excelFunctions.mod(J5,C13)==0,0,J4*(2*C13*(J5/C13-excelFunctions.rounddown(J5/C13,0))+1)),0);

//ILOŚĆ LEGAR SZTUKI PO 4 m LST

        E29 = excelFunctions.roundup(E27/C17,0);

//ILOŚĆ KLIPS POCZĄTKOWY KST

        E35 = excelFunctions.roundup((2*C13+1)*excelFunctions.rounddown(J5/C13,0)+excelFunctions.if(excelFunctions.mod(J5,C13)==0,0,(2*C13*(J5/C13-excelFunctions.rounddown(J5/C13,0))+1)),0);
//ILOŚĆ KLIPS SRODKOWY KSR

        E31 = excelFunctions.roundup((J4/C15-1)*excelFunctions.roundup((2*C13+1)*excelFunctions.rounddown(J5/C13,0)+excelFunctions.if(excelFunctions.mod(J5,C13)==0,0,excelFunctions.roundup((2*C13*(J5/C13-excelFunctions.rounddown(J5/C13,0))+1),0)),0),0);

//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;

//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4+J4+J5+J5)/C17,0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4*J5,0)/excelFunctions.round(E25*C13*C15,0)>100,100,excelFunctions.round(J4*J5,0)/excelFunctions.round(E25*C13*C15,0));

//POWIERZCHNIA TARASU

        E41 = excelFunctions.round(J4*J5,1);

        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };
    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladZamekProstopadly3metry = function () {
        var result = new PodsumowanieElementowTarasu();
// [algorytm 30.01.2022.deska 6m jako 3m.xlsx]PROSTOKĄT UKŁ. PROSTOP ZAMEK
// DESKA TARASOWA UKŁAD PROSTOPADŁY

//zmienne dla obliczen:
//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' : E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus((C13 * excelFunctions.if((J5 / C13 - excelFunctions.rounddown((J5 / C13), 0)) > 0, (J5 / C13 - excelFunctions.rounddown((J5 / C13), 0)), 1)) >= 0.5, "wymiary poprawne", "warunek_komunikat_zmien_wymiar_B_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.if(J5 < C13, excelFunctions.roundup((excelFunctions.rounddown(J5 / C13, 0) * excelFunctions.round(J4 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (excelFunctions.round((J4 / C15), 0) / excelFunctions.rounddown(1 / (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)), 0)) * C13)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J5 / C13, 0) * excelFunctions.round(J4 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (excelFunctions.round((J4 / C15), 0) / excelFunctions.rounddown(1 / (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)), 0)) * C13)) + J4 / (2 * C15) * 0.5 * C13 + (excelFunctions.rounddown((J5 - 0.5 * C13) / C13, 0) * excelFunctions.round(0.5 * J4 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod((J5 - 0.5 * C13), C13) == 0, 0, (excelFunctions.round((0.5 * J4 / C15), 0) / excelFunctions.rounddown(1 / ((J5 - 0.5 * C13) / C13 - excelFunctions.rounddown((J5 - 0.5 * C13) / C13, 0)), 0)) * C13))), 0));

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(excelFunctions.roundup(E23 / C13, 0) / 1, 0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = E29 * C17;

//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E29 = excelFunctions.roundup((excelFunctions.roundup(J4 * ((C13 / 0.5) + 1) * excelFunctions.rounddown(J5 / C13, 0) + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, J4 * (2 * C13 * (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) + 1)), 0) / C17), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J5 < C13, 1, J5 / C13), 0) * J4) / C17, 0);

//ILOŚĆ KLIPS POCZĄTKOWY KST
        E35 = excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J5 / C13, 0) + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (2 * C13 * (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) + 1)), 0);

//ILOŚĆ KLIPS SRODKOWY KSR
        E31 = excelFunctions.roundup(E35 * (J4 / C15 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J5 < C13, 1, J5 / C13), 0) * excelFunctions.roundup(J4 / C15 - 1, 0);

//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;

//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4 + J4 + J5 + J5) / C17, 0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1 > 1, 1, excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1);


//POWIERZCHNIA TARASU
        E41 = excelFunctions.round(J4 * J5, 1);
        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };
    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladZamekProstopadly4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();

        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]PROSTOKĄT UKŁ. PROSTOP ZAMEK
// DESKA TARASOWA UKŁAD PROSTOPADŁY

//zmienne dla obliczen:
//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' :E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus((C13 * excelFunctions.if((J5 / C13 - excelFunctions.rounddown((J5 / C13), 0)) > 0, (J5 / C13 - excelFunctions.rounddown((J5 / C13), 0)), 1)) >= 0.5, "wymiary poprawne", "warunek_komunikat_zmien_wymiar_B_tarasu_dlugosc_deski");

//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.if(J5 < C13, excelFunctions.roundup((excelFunctions.rounddown(J5 / C13, 0) * excelFunctions.round(J4 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (excelFunctions.round((J4 / C15), 0) / excelFunctions.rounddown(1 / (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)), 0)) * C13)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J5 / C13, 0) * excelFunctions.round(J4 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (excelFunctions.round((J4 / C15), 0) / excelFunctions.rounddown(1 / (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)), 0)) * C13)) + J4 / (2 * C15) * 0.5 * C13 + (excelFunctions.rounddown((J5 - 0.5 * C13) / C13, 0) * excelFunctions.round(0.5 * J4 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod((J5 - 0.5 * C13), C13) == 0, 0, (excelFunctions.round((0.5 * J4 / C15), 0) / excelFunctions.rounddown(1 / ((J5 - 0.5 * C13) / C13 - excelFunctions.rounddown((J5 - 0.5 * C13) / C13, 0)), 0)) * C13))), 0));

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(E23 / C13, 0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = E29 * C17;

//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E29 = excelFunctions.roundup((excelFunctions.roundup(J4 * ((C13 / 0.5) + 1) * excelFunctions.rounddown(J5 / C13, 0) + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, J4 * (2 * C13 * (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) + 1)), 0) / C17), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J5 < C13, 1, J5 / C13), 0) * J4) / C17, 0);


//ILOŚĆ KLIPS POCZĄTKOWY KST
        E35 = excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J5 / C13, 0) + excelFunctions.if(excelFunctions.mod(J5, C13) == 0, 0, (2 * C13 * (J5 / C13 - excelFunctions.rounddown(J5 / C13, 0)) + 1)), 0);
//ILOŚĆ KLIPS SRODKOWY KSR
        E31 = excelFunctions.roundup(E35 * (J4 / C15 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J5 < C13, 1, J5 / C13), 0) * excelFunctions.roundup(J4 / C15 - 1, 0);

//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;


//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4 + J4 + J5 + J5) / C17, 0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4 * J5, 0) / excelFunctions.round(E25 * C13 * C15, 0) > 1, 1, excelFunctions.round(J4 * J5, 0) / excelFunctions.round(E25 * C13 * C15, 0));

//POWIERZCHNIA TARASU
        E41 = excelFunctions.round(J4 * J5, 1);


        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };

    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladCiaglyRownolegle3metry = function () {
        var result = new PodsumowanieElementowTarasu();

        // [algorytm 30.01.2022.deska 6m jako 3m.xlsx]PROSTOKĄT UKŁAD RÓWNOLEGŁY
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY

//zmienne dla obliczen:
//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' : E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) * C13 >= 0.5, J4 / C13 - excelFunctions.rounddown(J4 / C13, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.roundup((excelFunctions.rounddown(J4 / C13, 0) * excelFunctions.round(J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (excelFunctions.round((J5 / C15), 0) / excelFunctions.rounddown(1 / (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)), 0)) * C13)), 0);

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(excelFunctions.roundup(E23 / C13, 0) / 1, 0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = excelFunctions.roundup(J5 * ((C13 / 0.5) + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, J5 * (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0);


//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E29 = excelFunctions.roundup(E27 / C17, 0);

//ILOŚĆ KLIPS POCZĄTKOWY KST
        E35 = excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0);

//ILOŚĆ KLIPS SRODKOWY KSR
        E31 = excelFunctions.roundup(E35 * (J5 / C15 - 1), 0);

//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;


//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4 + J4 + J5 + J5) / C17, 0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1 > 1, 1, excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1);


//POWIERZCHNIA TARASU
        E41 = excelFunctions.round(J4 * J5, 1);

        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };
    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladCiaglyRownolegle4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();
        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]PROSTOKĄT UKŁAD RÓWNOLEGŁY
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY

//zmienne dla obliczen:
//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' :E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus(excelFunctions.or((J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) * C13 >= 0.5, J4 / C13 - excelFunctions.rounddown(J4 / C13, 0) <= 0), "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");

//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.roundup((excelFunctions.rounddown(J4 / C13, 0) * excelFunctions.round(J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (excelFunctions.round((J5 / C15), 0) / excelFunctions.rounddown(1 / (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)), 0)) * C13)), 0);

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(E23 / C13, 0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = excelFunctions.roundup(J5 * ((C13 / 0.5) + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, J5 * (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0);

//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E29 = excelFunctions.roundup(E27 / C17, 0);

//ILOŚĆ KLIPS POCZĄTKOWY KST
        E35 = excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0);
//ILOŚĆ KLIPS SRODKOWY KSR
        E31 = excelFunctions.roundup(E35 * (J5 / C15 - 1), 0);

//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;


//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4 + J4 + J5 + J5) / C17, 0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4 * J5, 0) / excelFunctions.round(E25 * C13 * C15, 0) > 1, 1, excelFunctions.round(J4 * J5, 0) / excelFunctions.round(E25 * C13 * C15, 0));

//POWIERZCHNIA TARASU
        E41 = excelFunctions.round(J4 * J5, 1);
        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };
    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladZamekRownolegle3metry = function () {
        var result = new PodsumowanieElementowTarasu();

        // [algorytm 30.01.2022.deska 6m jako 3m.xlsx]PROSTOKĄT UKŁ. RÓWN. ZAMEK

// DESKA TARASOWA UKŁAD RÓWNOLEGŁY ZAMEK POŁÓWKOWY

//zmienne dla obliczen:
//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' : E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus((C13 * excelFunctions.if((J4 / C13 - excelFunctions.rounddown((J4 / C13), 0)) > 0, (J4 / C13 - excelFunctions.rounddown((J4 / C13), 0)), 1)) >= 0.5, "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");
//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.if(J4 < C13, excelFunctions.roundup((excelFunctions.rounddown(J4 / C13, 0) * excelFunctions.round(J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (excelFunctions.round((J5 / C15), 0) / excelFunctions.rounddown(1 / (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)), 0)) * C13)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J4 / C13, 0) * excelFunctions.round(J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (excelFunctions.round((J5 / C15), 0) / excelFunctions.rounddown(1 / (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)), 0)) * C13)) + J5 / (2 * C15) * 0.5 * C13 + (excelFunctions.rounddown((J4 - 0.5 * C13) / C13, 0) * excelFunctions.round(0.5 * J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod((J4 - 0.5 * C13), C13) == 0, 0, (excelFunctions.round((0.5 * J5 / C15), 0) / excelFunctions.rounddown(1 / ((J4 - 0.5 * C13) / C13 - excelFunctions.rounddown((J4 - 0.5 * C13) / C13, 0)), 0)) * C13))), 0));

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(excelFunctions.roundup(E23 / C13, 0) / 1, 0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = E29 * C17;

//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E29 = excelFunctions.roundup((excelFunctions.roundup(J5 * ((C13 / 0.5) + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, J5 * (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0) / C17), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J4 < C13, 1, J4 / C13), 0) * J5) / C17, 0);


//ILOŚĆ KLIPS POCZĄTKOWY KST
        E35 = excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0);

//ILOŚĆ KLIPS SRODKOWY KSR
        E31 = excelFunctions.roundup(E35 * (J5 / C15 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J4 < C13, 1, J4 / C13), 0) * excelFunctions.roundup(J5 / C15 - 1, 0);


//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;


//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4 + J4 + J5 + J5) / C17, 0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1 > 1, 1, excelFunctions.round(J4 * J5, 0) / excelFunctions.roundup(E25 * C13 * C15, 0) / 1);


//POWIERZCHNIA TARASU
        E41 = excelFunctions.round(J4 * J5, 1);

        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };
    /**
     *
     * @returns {PodsumowanieElementowTarasu}
     * @private
     */
    this._ukladZamekRownolegle4i6metry = function () {
        var result = new PodsumowanieElementowTarasu();

        // [algorytm taras 30.01.2022 - 4 i 6 m.xlsx]PROSTOKĄT UKŁ. RÓWN. ZAMEK
// DESKA TARASOWA UKŁAD RÓWNOLEGŁY ZAMEK POŁÓWKOWY

//zmienne dla obliczen:
//var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;

        //obiekt zwracany przez funkcje zbierzZmienne
        //{'C13' : C13,'C15' : C15,'C17' : C17,'E23' : E23,'E25' : E25,'E27' : E27,'E29' : E29,'E31' : E31,'E33' : E33,'E35' :E35,'E37' : E37,'E39' : E39,'E41' : E41,'J4' : J4,'J5' : J5,};
//weryfikacja danych
        var Warunek_1 = excelFunctions.ifWithStatus((C13 * excelFunctions.if((J4 / C13 - excelFunctions.rounddown((J4 / C13), 0)) > 0, (J4 / C13 - excelFunctions.rounddown((J4 / C13), 0)), 1)) >= 0.5, "wymiary poprawne", "warunek_komunikat_zmien_wymiar_A_tarasu_dlugosc_deski");

//ILOŚC DESKI METRY BIEŻACE MBD
        E23 = excelFunctions.if(J4 < C13, excelFunctions.roundup((excelFunctions.rounddown(J4 / C13, 0) * excelFunctions.round(J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (excelFunctions.round((J5 / C15), 0) / excelFunctions.rounddown(1 / (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)), 0)) * C13)), 0), excelFunctions.roundup((0.5 * (excelFunctions.rounddown(J4 / C13, 0) * excelFunctions.round(J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (excelFunctions.round((J5 / C15), 0) / excelFunctions.rounddown(1 / (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)), 0)) * C13)) + J5 / (2 * C15) * 0.5 * C13 + (excelFunctions.rounddown((J4 - 0.5 * C13) / C13, 0) * excelFunctions.round(0.5 * J5 / C15, 0) * C13 + excelFunctions.if(excelFunctions.mod((J4 - 0.5 * C13), C13) == 0, 0, (excelFunctions.round((0.5 * J5 / C15), 0) / excelFunctions.rounddown(1 / ((J4 - 0.5 * C13) / C13 - excelFunctions.rounddown((J4 - 0.5 * C13) / C13, 0)), 0)) * C13))), 0));

//ILOŚĆ DESKI  SZTUKI DST
        E25 = excelFunctions.roundup(E23 / C13, 0);

//ILOŚC LEGAR METRY BIEŻACE MBL
        E27 = E29 * C17;

//ILOŚĆ LEGAR SZTUKI PO 4 m LST
        E29 = excelFunctions.roundup((excelFunctions.roundup(J5 * ((C13 / 0.5) + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, J5 * (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0) / C17), 0) + excelFunctions.roundup((excelFunctions.rounddown(excelFunctions.if(J4 < C13, 1, J4 / C13), 0) * J5) / C17, 0);


//ILOŚĆ KLIPS POCZĄTKOWY KST
        E35 = excelFunctions.roundup((2 * C13 + 1) * excelFunctions.rounddown(J4 / C13, 0) + excelFunctions.if(excelFunctions.mod(J4, C13) == 0, 0, (2 * C13 * (J4 / C13 - excelFunctions.rounddown(J4 / C13, 0)) + 1)), 0);
//ILOŚĆ KLIPS SRODKOWY KSR
        E31 = excelFunctions.roundup(E35 * (J5 / C15 - 1), 0) + excelFunctions.rounddown(excelFunctions.if(J4 < C13, 1, J4 / C13), 0) * excelFunctions.roundup(J5 / C15 - 1, 0);

//ILOŚC KLIPS KOŃCOWY KK
        E33 = E35;


//ILOŚĆ LISTWA 4m LLS
        E37 = excelFunctions.roundup((J4 + J4 + J5 + J5) / C17, 0);

//WYDAJNOŚC Z DESKI
        E39 = excelFunctions.if(excelFunctions.round(J4 * J5, 0) / excelFunctions.round(E25 * C13 * C15, 0) > 1, 1, excelFunctions.round(J4 * J5, 0) / excelFunctions.round(E25 * C13 * C15, 0));

//POWIERZCHNIA TARASU
        E41 = excelFunctions.round(J4 * J5, 1);


        result.dodajWynikWarunku(Warunek_1);
        result.setup(E23, E25, E27, E29, E31, E33, E35, E37, E39, E41);
        return result;
    };

}