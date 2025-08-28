function Globalne() {
    this.debug = false;
    this.pathJsFiles = '';
    //tlumaczenia są definiowane w trakcie inicjalizacji main.php
    this.tlumaczenia = {};
    this.aktywnyKrok = 1;
    this.maksKrok = 7;
    this.kolor_deski_domyslny = 'KLON_LODOWY';
    this.KIERUNEK_ULOZENIA = {
        PROSTOPADLE: "PROSTOPADLE",
        ROWNOLEGLE: "ROWNOLEGLE"
    };
    this.orientacja = {
        pozioma: "pozioma",
        pionowa: "pionowa"
    }
    this.SPOSOB_ULOZENIA = {
        ZAMEK: "ZAMEK",
        CIAGLY: "CIAGLY"
    };
    this.POLOZENIE = {
        PRAWA: "PRAWA",
        LEWA: "LEWA",
        GORA: "GORA",
        DOL: "DOL"
    };
    /**
     * zmienna definiuje proporcje, potrzebne do obliczania dlugosci
     * domyślnie 1 piksel = 0.1 m = 10 cm
     * @type {number}
     */
    this.skala = 1;

    //wartosci w pikselach
    this.szerokoscZnaku = 6;
    this.wysokoscZnaku = 10;
    this.marginesWewnetrzynyCanvasu = 50;
    this.odstepKrawedzi = 5;

    this.ustawSkale = function (_wartosc) {
        var staraSkala = this.skala;
        this.skala = _wartosc > 1 ? 1 : parseFloat(_wartosc.toFixed(2));
        //zwracam informacje czy skala została zmieniona
        // console.log('ustawSkale podana wartosc = ' + _wartosc + ', ustawiono = ' + this.skala );
        return this.skala == staraSkala ? false : true;
    };
    this.skalujDlaCanvasWartosc = function (_wartosc) {
        return (( _wartosc - this.marginesWewnetrzynyCanvasu) * this.skala) + this.marginesWewnetrzynyCanvasu;
    };
    /**
     *
     * @param {Wierzcholek} _wierzcholek
     * @returns {Wierzcholek}
     */
    this.skalujDlaCanvasWierzcholek = function (_wierzcholek) {
        var wierzcholek = new Wierzcholek(
            this.skalujDlaCanvasWartosc(_wierzcholek.x),
            this.skalujDlaCanvasWartosc(_wierzcholek.y),
            _wierzcholek.symbol
        );
        return wierzcholek;
    };
    this.pobierzTlumaczenie = function (_fraza) {
        if(this.tlumaczenia.hasOwnProperty(_fraza)) {
            return this.tlumaczenia[_fraza];
        } else {
            alert('ERROR - Brak tłumaczenia dla frazy = ' + _fraza);
        }
    }
    /**
     * wyszukuje fraze w tlumaczeniach dla podanego tekstu, jezeli nie znajdzie to zwraca podany tekst;
     * wykorzystywane głównie dla znalezienia tlumaczen dla tekstów warunków zawartych w algorytmacyh
     * @param _val
     * @returns {string|*}
     */
    this.tlumaczeniaZnajdzFrazeDlaTekstuPL = function (_val){
        for(var prop in this.tlumaczenia){
            if(this.tlumaczenia[prop] == _val){
                return prop;
            }
        }
        return _val;
    }
    /**
     * konwersja milimetrów na metry
     * @param _val
     * @returns {number}
     */
    this.konwertujMilimetrynaMetry = function(_val){
        return _val/1000;
    }
    /**
     * konwersja centymetry na metry
     * @param _val
     * @returns {number}
     */
    this.konwertujCentymetryNaMetry = function(_val){
        return parseFloat((_val/100).toFixed(2));
    }

    this.formatTextProcent = function(_val){
        var num = _val * 100;
        return num.toFixed(0) + '%';
    }
    this.log = function (_val, _val2){
        if(this.debug){
            _val2 != undefined ? console.log(_val, _val2) : console.log(_val);;
        }
    }
    this.hartikaKodyTechniczne = {

        deski: {
            145 : {
                KLON_LODOWY : {HARTIKA_TARASE_HOME_145_mm: 'HD-01-4-1',HARTIKA_TARASE_LIGNO: 'HD-04-4-1', HARTIKA_TARASE_BASE: 'HD-05-4-1'},
                SWIERK_DYMNY : {HARTIKA_TARASE_HOME_145_mm: 'HD-01-4-2',HARTIKA_TARASE_LIGNO: 'HD-04-4-2',HARTIKA_TARASE_BASE: 'HD-05-4-2'},
                MAHON_NATURALNY : {HARTIKA_TARASE_HOME_145_mm: 'HD-01-4-3',HARTIKA_TARASE_LIGNO: 'HD-04-4-3',HARTIKA_TARASE_BASE: 'HD-05-4-3'},
                DAB_LINDBERG : {HARTIKA_TARASE_HOME_145_mm: 'HD-01-4-4',HARTIKA_TARASE_LIGNO: 'HD-04-4-4',HARTIKA_TARASE_BASE: 'HD-05-4-4'},
                ORZECH_SZLACHETNY : {HARTIKA_TARASE_HOME_145_mm: 'HD-01-4-5',HARTIKA_TARASE_LIGNO: 'HD-04-4-5',HARTIKA_TARASE_BASE: 'HD-05-4-5'},
                KLON_MARINA : {HARTIKA_TARASE_HOME_145_mm: 'HD-01-4-6',HARTIKA_TARASE_LIGNO: 'HD-04-4-6',HARTIKA_TARASE_BASE: 'HD-05-4-6'},
                DAB_ZLOTY : {HARTIKA_TARASE_HOME_145_mm: 'HD-01-4-7',HARTIKA_TARASE_LIGNO: 'HD-04-4-7',HARTIKA_TARASE_BASE: 'HD-05-4-7'}
            },
            160 :{
                KLON_LODOWY : 'HD-02-4-1',
                SWIERK_DYMNY : 'HD-02-4-2',
                MAHON_NATURALNY : 'HD-02-4-3',
                DAB_LINDBERG : 'HD-02-4-4',
                ORZECH_SZLACHETNY : 'HD-02-4-5',
                KLON_MARINA : 'HD-02-4-6',
                DAB_ZLOTY : 'HD-02-4-7'
            },
            210 :{
                KLON_LODOWY : 'HD-03-4-1',
                SWIERK_DYMNY : 'HD-03-4-2',
                MAHON_NATURALNY : 'HD-03-4-3',
                DAB_LINDBERG : 'HD-03-4-4',
                ORZECH_SZLACHETNY : 'HD-03-4-5',
                KLON_MARINA : 'HD-03-4-6',
                DAB_ZLOTY : 'HD-03-4-7'
            },
            140 :{
                JESION_WENGE : {HARTIKA_TARASE_NATURA_3D_140_mm: 'HZ-BPS03-4-1/2'},
                IPE_TEAK : {HARTIKA_TARASE_NATURA_3D_140_mm: 'HZ-BPS03-4-3/4'}
            }
        },
        legary: {
            Legar_maly : 'HLM-04-4-6',
            Legar_duzy : 'HLD-04-4-6'
        },
        listwy_maskujace : {
            listwa_maskujaca_wpc : {
                KLON_LODOWY : 'HL-03-4-1',
                SWIERK_DYMNY : 'HL-03-4-2',
                MAHON_NATURALNY : 'HL-03-4-3',
                DAB_LINDBERG : 'HL-03-4-4',
                ORZECH_SZLACHETNY : 'HL-03-4-5',
				KLON_MARINA : 'HL-03-4-6',
                DAB_ZLOTY : 'HL-03-4-7'
            },
            listwa_maskujaca_katowa : {
                KLON_LODOWY : 'HLW-04-4-1',
                SWIERK_DYMNY : 'HLW-04-4-2',
                MAHON_NATURALNY : 'HLW-04-4-3',
                DAB_LINDBERG : 'HLW-04-4-4',
                ORZECH_SZLACHETNY : 'HLW-04-4-5',
				KLON_MARINA : 'HLW-04-4-6',
                DAB_ZLOTY : 'HLW-04-4-7'
            },
            listwa_maskujaca_alu : {
                SREBRNY: 'HLa-01-4-CO',
                BRAZOWY: 'HLa-02-4-CO',
                CZARNY: 'HLa-03-4-CO'
            }
        },
        klipsy: {
            3: {
                klips_startowy_kst: 'HKS-01-0-6',
                klips_srodkowy_ksr: 'HKS-03-0-6',
                klips_koncowy_kk: 'HKS-04-0-6',
            },
            5: {
                klips_startowy_kst: 'HKS-01-0-6',
                klips_srodkowy_ksr: 'HKS-02-0-6',
                klips_koncowy_kk: 'HKS-04-0-6',
            },
        }

    }
}

/**
 * obiekt zwracany jako odpowiedz z metod i funkcji
 * @constructor
 */
function ReturnObj() {
    this.status = true;
    this.message = '';
    this.value = null;
}
/**
 * System powinien przechowywać kody techniczne produktów, które później będą drukowane w zestawieniu materiałowym.
 * Kody nie powinny być widoczne użytkownikowi podczas pracy z kreatorem.

 Zestawienie kodów:

 Deska 145 mm
     Klon lodowy - HD-01-4-1
     Świerk dymny - HD-01-4-2
     Mahoń naturalny - HD-01-4-3
     Dąb lindberg - HD-01-4-4
     Orzech szlachetny - HD-01-4-5
 Deska 160 mm
     Klon lodowy - HD-02-4-1
     Świerk dymny - HD-02-4-2
     Mahoń naturalny - HD-02-4-3
     Dąb lindberg - HD-02-4-4
     Orzech szlachetny - HD-02-4-5
 Deska 210 mm
     Klon lodowy - HD-03-4-1
     Świerk dymny - HD-03-4-2
     Mahoń naturalny - HD-03-4-3
     Dąb lindberg - HD-03-4-4
     Orzech szlachetny - HD-03-4-5

 Legar duży - HLD-04-4-6
 Legar mały - HLM-04-4-6

 Listwa maskująca WPC
     Klon lodowy - HL-03-4-1
     Świerk dymny - HL-03-4-2
     Mahoń naturalny - HL-03-4-3
     Dąb lindberg - HL-03-4-4
     Orzech szlachetny - HL-03-4-5

 Listwa maskująca kątowa
     Klon lodowy - HLW-04-4-1
     Świerk dymny - HLW-04-4-2
     Mahoń naturalny - HLW-04-4-3
     Dąb lindberg - HLW-04-4-4
     Orzech szlachetny - HLW-04-4-5

 Listwa maskująca ALU
     Srebrny - HLa-01-4-CO
     Brązowy - HLa-02-4-CO
     Czarny - HLa-03-4-CO
 */
