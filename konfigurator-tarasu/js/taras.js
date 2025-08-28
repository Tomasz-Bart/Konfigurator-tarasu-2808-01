var pathJsFiles = '/wp-content/themes/polestar-child/konfigurator-tarasu/js/';
jQuery.getScript( pathJsFiles + 'ksztalt.js', function() {
    jQuery.getScript( pathJsFiles + 'ksztalty.js', function() {
        });
});

function Taras () {
    this.globalne = window.zmienneGlobalne;
    this.nazwa = "";
    this.ksztalt = "";
    /**
     *
     * @type {Ksztalt}
     */
    this.ksztaltObiekt = null;

    this.kierunek_ulozenia = this.globalne.KIERUNEK_ULOZENIA.ROWNOLEGLE;
    this.sposob_ulozenia = this.globalne.SPOSOB_ULOZENIA.CIAGLY;
    /**
     *
     * @type {string} {Legar_duzy, Legar_maly}
     */
    this.rodzaj_legara = "";
    this.kolor_legara = "CZARNY";
    this.legar = {rodzaj_legara: 'brak', kolor_legara: "CZARNY", kodTechniczny: 'brak', dlugosc: 4000};
    /**
     * wymiary dlugosc, szerokosc, w mm
     * @type {{szerokosc: number, kolor: string, nazwa: string, dlugosc: number}}
     */
    this.deska = {nazwa: "HARTIKA_TARASE_BASE", szerokosc: 145, kolor: this.globalne.kolor_deski_domyslny, dlugosc: 3000, kodTechniczny: this.globalne.hartikaKodyTechniczne.deski["145"][this.globalne.kolor_deski_domyslny]["HARTIKA_TARASE_BASE"]};
    this.deska_kolor = this.globalne.kolor_deski_domyslny;
    /**
     * wartość  w mm
     * @type {number}
     */
    this.deski_odstep = 5;
    /**
     * wartość w mm
     * @type {number}
     */
    this.deski_dlugosc = 3000;
    this.ulozenie_legara_duzy = "";
    this.listwa_maskujaca = {typ : "listwa_maskujaca_wpc", kolor: this.globalne.kolor_deski_domyslny, kodTechniczny: this.globalne.hartikaKodyTechniczne.listwy_maskujace.listwa_maskujaca_wpc[this.globalne.kolor_deski_domyslny]}
    this.listwa_maskujaca_kolor = this.globalne.kolor_deski_domyslny;
    this.powierzchnia = 0;
    this.kodTechniczny = "";
    /**
     *
     * @type {Linia}
     */
    this.liniaStykuDom = null;
    this.obliczPowierzchnie = function () {
        this.powierzchnia = this.ksztaltObiekt.obliczPowierzchnie();
        return this.powierzchnia;
    };
    /**
     * ustawia wartosci w polach obiektu Taras
     * @param {string} _pole
     * @param {string} _wartosc
     * @param {string} _kodTechniczny - kod wew. Hartiki np. dla deski szer. 210 mm koloru orzech szlachetny: HD-03-4-5
     */
    this.ustawWartosc = function(_pole, _wartosc, _kodTechniczny){
        /* console.log("pole: ",_pole, " wartość: ",_wartosc, " kod techniczny: ", _kodTechniczny); */
        this.globalne.log({_pole:_pole, _wartosc: _wartosc, _kodTechniczny: _kodTechniczny})
        if('undefined' === typeof(this[_pole])){
            alert('BŁĄD - obiekt Taras nie posiada pola = ' + _pole + ' wartosc = ' + _wartosc);
        }else if(_pole === 'ksztalt') {
            this.poleKsztaltUstaw(_wartosc);
        } else if(_pole === 'kierunek_ulozenia'){
            this.kierunek_ulozenia = _wartosc;
        } else if(_pole === 'sposob_ulozenia'){
            this.sposob_ulozenia = _wartosc;
        } else if(_pole === 'deska'){
            this.poleDeskaUstaw( _wartosc );
        } else if(_pole === 'rodzaj_legara'){
            this.rodzaj_legara = _wartosc;
            this.legar.rodzaj_legara = _wartosc;
            this.legar.kodTechniczny = _kodTechniczny;
        } else if(_pole === 'ulozenie_legara_duzy'){
            this.ulozenie_legara_duzy = _wartosc;
        } else if(_pole === 'deski_dlugosc'){
            this.deska.dlugosc = parseInt(_wartosc);
            this.deski_dlugosc = parseInt(_wartosc);
        } else if(_pole === 'listwa_maskujaca_kolor'){
            this.listwa_maskujaca.kolor= _wartosc;
            this.listwa_maskujaca.kodTechniczny = _kodTechniczny;
        } else if(_pole === 'listwa_maskujaca'){
            this.listwa_maskujaca.typ = _wartosc;
        } else if(_pole === 'deska_kolor'){
            this.deska.kolor = _wartosc;
            this.deska_kolor = _wartosc;
            this.deska.kodTechniczny = _kodTechniczny;
            // added
/*                 this.listwa_maskujaca.kolor= _wartosc;
                this.listwa_maskujaca.kodTechniczny = _kodTechniczny; */
        } else if(_pole === 'deski_odstep'){
            this.deski_odstep = parseInt(_wartosc);
        } else {
            this[_pole] = _wartosc;
        }
    };
    this.poleDeskaUstaw = function (_wartosc) {
        if(_wartosc === 'HARTIKA_TARASE_HOME_145_mm') {
            // this.deska.nazwa = "HARTIKA TARASE HOME 145 mm";
            this.deska.szerokosc = 145;
        }else if(_wartosc === 'HARTIKA_TARASE_KLASS_160_mm') {
            // this.deska.nazwa = "HARTIKA TARASE KLASS 160 mm";
            this.deska.szerokosc = 160;
        }else if(_wartosc === 'HARTIKA_TARASE_PRO_210_mm') {
            // this.deska.nazwa = "HARTIKA TARASE PRO 210 mm";
            this.deska.szerokosc = 210;
        } else {
            this.deska.szerokosc = 145;
        }
        this.deska.nazwa = _wartosc;
    };

        this.poleKsztaltUstaw = function(_wartosc){
        this.liniaStykuDom = null;
        if(_wartosc === 'ksztalt_P'){
            var wierzcholki = {
                A: new Wierzcholek(this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'A'),
                B: new Wierzcholek(400+this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'B'),
                C: new Wierzcholek(400+this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'C'),
                D: new Wierzcholek(this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'D'),
            };
            var linie = {
                AB: new Linia(wierzcholki.A, wierzcholki.B, 0, this.globalne.POLOZENIE.GORA),
                BC: new Linia(wierzcholki.B, wierzcholki.C, 0, this.globalne.POLOZENIE.PRAWA),
                CD: new Linia(wierzcholki.C, wierzcholki.D, 0, this.globalne.POLOZENIE.DOL),
                DA: new Linia(wierzcholki.D, wierzcholki.A, 0, this.globalne.POLOZENIE.LEWA)
            };
            this.ksztaltObiekt = new KsztaltProstokat(wierzcholki, linie);

        }else if(_wartosc == 'ksztalt_L'){
            var wierzcholki = {
                A: new Wierzcholek(this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'A'),
                B: new Wierzcholek(200+this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'B'),
                C: new Wierzcholek(200+this.globalne.marginesWewnetrzynyCanvasu, 200+this.globalne.marginesWewnetrzynyCanvasu, 'C'),
                D: new Wierzcholek(400+this.globalne.marginesWewnetrzynyCanvasu, 200+this.globalne.marginesWewnetrzynyCanvasu, 'D'),
                E: new Wierzcholek(400+this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'E'),
                F: new Wierzcholek(this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'F')
            };

            var linie = {
                AB: new Linia(wierzcholki.A, wierzcholki.B, 0, this.globalne.POLOZENIE.GORA),
                BC: new Linia(wierzcholki.B, wierzcholki.C, 0, this.globalne.POLOZENIE.PRAWA),
                CD: new Linia(wierzcholki.C, wierzcholki.D, 0, this.globalne.POLOZENIE.GORA),
                DE: new Linia(wierzcholki.D, wierzcholki.E, 0, this.globalne.POLOZENIE.PRAWA),
                EF: new Linia(wierzcholki.E, wierzcholki.F, 0, this.globalne.POLOZENIE.DOL),
                FA: new Linia(wierzcholki.F, wierzcholki.A, 0, this.globalne.POLOZENIE.LEWA)
            };
            this.ksztaltObiekt = new KsztaltElka(wierzcholki, linie);

        }else if(_wartosc == 'ksztalt_T') {
            var wierzcholki = {
                A: new Wierzcholek(this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'A'),
                B: new Wierzcholek(400 + this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'B'),
                C: new Wierzcholek(400 + this.globalne.marginesWewnetrzynyCanvasu, 100 + this.globalne.marginesWewnetrzynyCanvasu, 'C'),
                D: new Wierzcholek(300 + this.globalne.marginesWewnetrzynyCanvasu, 100 + this.globalne.marginesWewnetrzynyCanvasu, 'D'),
                E: new Wierzcholek(300 + this.globalne.marginesWewnetrzynyCanvasu, 400 + this.globalne.marginesWewnetrzynyCanvasu, 'E'),
                F: new Wierzcholek(100 + this.globalne.marginesWewnetrzynyCanvasu, 400 + this.globalne.marginesWewnetrzynyCanvasu, 'F'),
                G: new Wierzcholek(100 + this.globalne.marginesWewnetrzynyCanvasu, 100 + this.globalne.marginesWewnetrzynyCanvasu, 'G'),
                H: new Wierzcholek(this.globalne.marginesWewnetrzynyCanvasu, 100 + this.globalne.marginesWewnetrzynyCanvasu, 'H')
            };

            var linie = {
                AB: new Linia(wierzcholki.A, wierzcholki.B, 0, this.globalne.POLOZENIE.GORA),
                BC: new Linia(wierzcholki.B, wierzcholki.C, 0, this.globalne.POLOZENIE.PRAWA),
                CD: new Linia(wierzcholki.C, wierzcholki.D, 0, this.globalne.POLOZENIE.DOL),
                DE: new Linia(wierzcholki.D, wierzcholki.E, 0, this.globalne.POLOZENIE.PRAWA),
                EF: new Linia(wierzcholki.E, wierzcholki.F, 0, this.globalne.POLOZENIE.DOL),
                FG: new Linia(wierzcholki.F, wierzcholki.G, 0, this.globalne.POLOZENIE.LEWA),
                GH: new Linia(wierzcholki.G, wierzcholki.H, 0, this.globalne.POLOZENIE.DOL),
                HA: new Linia(wierzcholki.H, wierzcholki.A, 0, this.globalne.POLOZENIE.LEWA)
            };
            this.ksztaltObiekt = new KsztaltTetka(wierzcholki, linie);

        } else if(_wartosc == 'ksztalt_U'){
            var wierzcholki = {
                A: new Wierzcholek(this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'A'),
                B: new Wierzcholek(400+this.globalne.marginesWewnetrzynyCanvasu, this.globalne.marginesWewnetrzynyCanvasu, 'B'),
                C: new Wierzcholek(400+this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'C'),
                D: new Wierzcholek(300+this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'D'),
                E: new Wierzcholek(300+this.globalne.marginesWewnetrzynyCanvasu, 100+this.globalne.marginesWewnetrzynyCanvasu, 'E'),
                F: new Wierzcholek(100 + this.globalne.marginesWewnetrzynyCanvasu, 100+this.globalne.marginesWewnetrzynyCanvasu, 'F'),
                G: new Wierzcholek(100 + this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'G'),
                H: new Wierzcholek( this.globalne.marginesWewnetrzynyCanvasu, 400+this.globalne.marginesWewnetrzynyCanvasu, 'H')
            };

            var linie = {
                AB: new Linia(wierzcholki.A, wierzcholki.B, 0, this.globalne.POLOZENIE.GORA),
                BC: new Linia(wierzcholki.B, wierzcholki.C, 0, this.globalne.POLOZENIE.PRAWA),
                CD: new Linia(wierzcholki.C, wierzcholki.D, 0, this.globalne.POLOZENIE.DOL),
                DE: new Linia(wierzcholki.D, wierzcholki.E, 0, this.globalne.POLOZENIE.LEWA),
                EF: new Linia(wierzcholki.E, wierzcholki.F, 0, this.globalne.POLOZENIE.DOL),
                FG: new Linia(wierzcholki.F, wierzcholki.G, 0, this.globalne.POLOZENIE.PRAWA),
                GH: new Linia(wierzcholki.G, wierzcholki.H, 0, this.globalne.POLOZENIE.DOL),
                HA: new Linia(wierzcholki.H, wierzcholki.A, 0, this.globalne.POLOZENIE.LEWA)
            };
            this.ksztaltObiekt = new KsztaltUtka(wierzcholki, linie);

        }
        this.ksztaltObiekt.ustawDlugosciLiniiWedlugWierzcholkow();
        this.obliczPowierzchnie();

    };
    this.przesunDoPoczatkuUklad = function () {
        var przesuniecieX = this.ksztaltObiekt.wierzcholki.A.x - this.globalne.marginesWewnetrzynyCanvasu;
        var przesuniecieY = this.ksztaltObiekt.wierzcholki.A.y - this.globalne.marginesWewnetrzynyCanvasu;
        for(var prop in this.ksztaltObiekt.wierzcholki){
            this.ksztaltObiekt.wierzcholki[prop].x -= przesuniecieX;
            this.ksztaltObiekt.wierzcholki[prop].y -= przesuniecieY;
        }
    };

    /**
     *
     * @returns {ReturnObj}
     */
    this.pobierzPodsumowanie = function () {
        var podsumowanie = new PodsumowanieTarasu(this, this.globalne);
        return podsumowanie.generujPodsumowanie();
    };

}

/**
 * @param {Globalne} _globalne
 * @param {Taras} _taras
 * @constructor
 */
function PodsumowanieTarasu(_taras, _globalne) {

    this.globalne = _globalne;
    if(this.globalne.debug){
        console.log('TARAS: ', _taras);
    }
    this.podsumowanie = {
        konfiguracja : {
            Nazwa: {label:"", value: null},
            Powierzchnia: {label:"", value: null},
            Deska: {label:"", value: null, id:null, dlugosc: null},
            Deska_wydajnosc: {label:"", value: null},
            Legar: {label:"", value: null, id:null},
            Listwa_maskujaca : {label:"", value: null, id:null},
            Ulozenie: {label:"", value: null},
            Klips_startowy: {label:"", value: null, id:null},
            Klips_srodkowy : {label:"", value: null, id:null},
            Klips_koncowy : {label:"", value: null, id:null},
        },
    };
    this.waluta = function (countryFlag) {
        if(countryFlag == "pl-PL"){
            return "zł"
        } else{
            return "EUR"
        }
    }
    this.zaokraglenie = function (liczba) {
        return Math.round(liczba * 100) / 100
    }
    this.podsumowanieElementy = {

    };
    /**
     *
     * @returns {ReturnObj}
     */
    this.generujPodsumowanie = function () {
        var ret = new ReturnObj();
        var rs = this.generujPodsumowanieElementy();
        const jezykStrony = document.getElementsByTagName('html')[0].getAttribute('lang');
        if(rs.status == false){
            return rs;
        }
        /** @type {PodsumowanieElementowTarasu}          */
        var podsumowanieElementy = rs.value;
        if(_taras.nazwa){
            this.podsumowanie.konfiguracja.Nazwa.label = this.globalne.pobierzTlumaczenie('Nazwa');
            this.podsumowanie.konfiguracja.Nazwa.label += ': '  + _taras.nazwa;
        }
        if(podsumowanieElementy.powierzchnia_tarasu){
            this.podsumowanie.konfiguracja.Powierzchnia.label = this.globalne.pobierzTlumaczenie('powierzchnia_tarasu') + ': ';
            this.podsumowanie.konfiguracja.Powierzchnia.label += podsumowanieElementy.powierzchnia_tarasu + 'm<sup>2</sup>';
            var powierzchnia = this.podsumowanie.konfiguracja.Powierzchnia.value;
            this.podsumowanie.konfiguracja.Powierzchnia.value = typeof powierzchnia == Number ? powierzchnia.toFixed(2) : parseFloat(powierzchnia).toFixed(2);
        }

        if(podsumowanieElementy.wydajnosc_z_deski){
            this.podsumowanie.konfiguracja.Deska_wydajnosc.label = this.globalne.pobierzTlumaczenie('wydajnosc_z_deski') + ': ';
            this.podsumowanie.konfiguracja.Deska_wydajnosc.label += podsumowanieElementy.wydajnosc_z_deski ;
            this.podsumowanie.konfiguracja.Deska_wydajnosc.value = podsumowanieElementy.wydajnosc_z_deski;
        }
        let sumaCalkowita = 0
        if(_taras.deska){
            const cenaDeski = zmienneGlobalne.ceny[_taras.deska.kodTechniczny] && zmienneGlobalne.ceny[_taras.deska.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"]
                ? 
                `${this.zaokraglenie((zmienneGlobalne.ceny[_taras.deska.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"] * podsumowanieElementy.ilosc_deski_sztuki_dst) * this.globalne.konwertujMilimetrynaMetry(_taras.deska.dlugosc))} ${this.waluta(jezykStrony)}`
                : 
                "";
            if(zmienneGlobalne.ceny[_taras.deska.kodTechniczny] && zmienneGlobalne.ceny[_taras.deska.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"]){
                sumaCalkowita += parseFloat(cenaDeski)
            }
            this.podsumowanie.konfiguracja.Deska.label = this.globalne.pobierzTlumaczenie(_taras.deska.nazwa);
            this.podsumowanie.konfiguracja.Deska.label += ', ' + this.globalne.pobierzTlumaczenie(_taras.deska.kolor);
            this.podsumowanie.konfiguracja.Deska.label += ', ' + this.globalne.konwertujMilimetrynaMetry(_taras.deska.dlugosc) + " m";
            this.podsumowanie.konfiguracja.Deska.label += ' / ' +  _taras.deska.kodTechniczny ;
            this.podsumowanie.konfiguracja.Deska.price = cenaDeski;
            this.podsumowanie.konfiguracja.Deska.value = podsumowanieElementy.ilosc_deski_sztuki_dst;
        }
        if(_taras.legar){
            const cenaLegara = zmienneGlobalne.ceny[_taras.legar.kodTechniczny] && zmienneGlobalne.ceny[_taras.legar.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"]
                ? 
                `${this.zaokraglenie(zmienneGlobalne.ceny[_taras.legar.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"] * podsumowanieElementy.ilosc_legar_sztuki_po_4m_lst)} ${this.waluta(jezykStrony)}`
                : 
                "";
            if(zmienneGlobalne.ceny[_taras.legar.kodTechniczny] && zmienneGlobalne.ceny[_taras.legar.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"]){
                sumaCalkowita += parseFloat(cenaLegara)
            }
            this.podsumowanie.konfiguracja.Legar.label = this.globalne.pobierzTlumaczenie(_taras.legar.rodzaj_legara);
            this.podsumowanie.konfiguracja.Legar.label += ' 4m / ' + _taras.legar.kodTechniczny;
            this.podsumowanie.konfiguracja.Legar.value = podsumowanieElementy.ilosc_legar_sztuki_po_4m_lst;
            this.podsumowanie.konfiguracja.Legar.id = _taras.legar.kodTechniczny;
            this.podsumowanie.konfiguracja.Legar.price = cenaLegara;
            // if(_taras.ulozenie_legara_duzy){
            //     this.podsumowanie.konfiguracja.Ulozenie_legara = this.globalne.pobierzTlumaczenie(_taras.ulozenie_legara_duzy);
            // } else if(_taras.legar.rodzaj_legara == 'Legar_maly') {
            //     this.podsumowanie.konfiguracja.Ulozenie_legara = this.globalne.pobierzTlumaczenie('poziome');
            // }
        }
        if(_taras.listwa_maskujaca){
            /* console.log(_taras.listwa_maskujaca.kodTechniczny); */
            const cenaListwy = zmienneGlobalne.ceny[_taras.listwa_maskujaca.kodTechniczny] && zmienneGlobalne.ceny[_taras.listwa_maskujaca.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"]
                ? 
                `${this.zaokraglenie(zmienneGlobalne.ceny[_taras.listwa_maskujaca.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"] * podsumowanieElementy.ilosc_listwa_4m_lls)} ${this.waluta(jezykStrony)}`
                : 
                "";
            if(zmienneGlobalne.ceny[_taras.listwa_maskujaca.kodTechniczny] && zmienneGlobalne.ceny[_taras.listwa_maskujaca.kodTechniczny][jezykStrony == "pl-PL" ? "pln" : "eur"]){
                sumaCalkowita += parseFloat(cenaListwy)
            }
            this.podsumowanie.konfiguracja.Listwa_maskujaca.label = this.globalne.pobierzTlumaczenie(_taras.listwa_maskujaca.typ);
            this.podsumowanie.konfiguracja.Listwa_maskujaca.label += ' 4m, ' + this.globalne.pobierzTlumaczenie(_taras.listwa_maskujaca.kolor);
            this.podsumowanie.konfiguracja.Listwa_maskujaca.label += ' / ' +  _taras.listwa_maskujaca.kodTechniczny;
            this.podsumowanie.konfiguracja.Listwa_maskujaca.id = _taras.listwa_maskujaca.kodTechniczny;
            this.podsumowanie.konfiguracja.Listwa_maskujaca.value = podsumowanieElementy.ilosc_listwa_4m_lls;
            this.podsumowanie.konfiguracja.Listwa_maskujaca.price = cenaListwy;
        }

        if(_taras.kierunek_ulozenia && _taras.sposob_ulozenia){
            this.podsumowanie.konfiguracja.Ulozenie.label = this.globalne.pobierzTlumaczenie('Ulozenie') + ': ' ;
            this.podsumowanie.konfiguracja.Ulozenie.label += this.globalne.pobierzTlumaczenie(_taras.kierunek_ulozenia) + ' / ' + this.globalne.pobierzTlumaczenie(_taras.sposob_ulozenia);
        }
        //konfiguracja klipsów
        if(_taras.deski_odstep){
            const cenaKlipsuSrodkowego = zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_srodkowy_ksr] && zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_srodkowy_ksr][jezykStrony == "pl-PL" ? "pln" : "eur"]
                ? 
                `${this.zaokraglenie(zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_srodkowy_ksr][jezykStrony == "pl-PL" ? "pln" : "eur"] * podsumowanieElementy.ilosc_klips_srodkowy_ksr)} ${this.waluta(jezykStrony)}`
                : 
                "";
            if(zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_srodkowy_ksr] && zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_srodkowy_ksr][jezykStrony == "pl-PL" ? "pln" : "eur"]){
                sumaCalkowita += parseFloat(cenaKlipsuSrodkowego)
            }
            const cenaKlipsuKoncowego = zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_koncowy_kk] && zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_koncowy_kk][jezykStrony == "pl-PL" ? "pln" : "eur"]
                ? 
                `${this.zaokraglenie(zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_koncowy_kk][jezykStrony == "pl-PL" ? "pln" : "eur"] * podsumowanieElementy.ilosc_klips_koncowy_kk)} ${this.waluta(jezykStrony)}`
                : 
                "";
            if(zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_koncowy_kk] && zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_koncowy_kk][jezykStrony == "pl-PL" ? "pln" : "eur"]){
                sumaCalkowita += parseFloat(cenaKlipsuKoncowego)
            }
            const cenaKlipsuStartowego = zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_startowy_kst] && zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_startowy_kst][jezykStrony == "pl-PL" ? "pln" : "eur"]
                ? 
                `${this.zaokraglenie(zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_startowy_kst][jezykStrony == "pl-PL" ? "pln" : "eur"] * podsumowanieElementy.ilosc_klips_poczatkowy_kst)} ${this.waluta(jezykStrony)}`
                : 
                "";
            if(zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_startowy_kst] && zmienneGlobalne.ceny[this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_startowy_kst][jezykStrony == "pl-PL" ? "pln" : "eur"]){
                sumaCalkowita += parseFloat(cenaKlipsuStartowego)
            }
            // Klips startowy
            this.podsumowanie.konfiguracja.Klips_startowy.label = this.globalne.pobierzTlumaczenie('klips_startowy')
            this.podsumowanie.konfiguracja.Klips_startowy.label += ' ' + this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_startowy_kst;
            this.podsumowanie.konfiguracja.Klips_startowy.value = podsumowanieElementy.ilosc_klips_poczatkowy_kst;
            this.podsumowanie.konfiguracja.Klips_startowy.price = cenaKlipsuStartowego
            // Klips środkowy
            this.podsumowanie.konfiguracja.Klips_srodkowy.label = this.globalne.pobierzTlumaczenie('klips_srodkowy')
            this.podsumowanie.konfiguracja.Klips_srodkowy.label += ' ' + _taras.deski_odstep + ' mm / ' + this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_srodkowy_ksr;
            this.podsumowanie.konfiguracja.Klips_srodkowy.value = podsumowanieElementy.ilosc_klips_srodkowy_ksr;
            this.podsumowanie.konfiguracja.Klips_srodkowy.price = cenaKlipsuSrodkowego
            // Klips końcowy
            this.podsumowanie.konfiguracja.Klips_koncowy.label = this.globalne.pobierzTlumaczenie('klips_koncowy')
            this.podsumowanie.konfiguracja.Klips_koncowy.label += ' ' + this.globalne.hartikaKodyTechniczne.klipsy[_taras.deski_odstep ].klips_koncowy_kk;
            this.podsumowanie.konfiguracja.Klips_koncowy.value = podsumowanieElementy.ilosc_klips_koncowy_kk;
            this.podsumowanie.konfiguracja.Klips_koncowy.price = cenaKlipsuKoncowego
        }
        if(document.body.classList.contains('page-template-page-konfigurator-tarasu-z-cena')){
            this.podsumowanie.konfiguracja.szablon = 'z cena'
        } else {
            this.podsumowanie.konfiguracja.szablon = 'bez cena'
        }
        this.podsumowanie.konfiguracja.cenaCalkowita = `${this.zaokraglenie(sumaCalkowita)} ${this.waluta(jezykStrony)}`
        this.podsumowanie.konfiguracja.cenaAdnotacja = this.globalne.pobierzTlumaczenie('podsumowanie_uwaga_cena')
        ret.value = this.podsumowanie;
        return ret;
    };
    /**
     *
     * @returns {ReturnObj}
     */
    this.generujPodsumowanieElementy = function () {
        var rs = obliczZapotrzebowanieDlaTarasu(_taras);
        if(rs.status){
            rs.value.wydajnosc_z_deski = this.globalne.formatTextProcent(rs.value.wydajnosc_z_deski);
            rs.value.powierzchnia_tarasu = typeof rs.value.powierzchnia_tarasu == Number ? rs.value.powierzchnia_tarasu.toFixed(2) : parseFloat(rs.value.powierzchnia_tarasu ).toFixed(2);
        }
        return rs;
    }

}