/**
 *
 * @param _canvasId
 * @param {Globalne} _globalne
 * @constructor
 */
function Rysownik (_canvasId, _globalne) {
    this.globalne = _globalne;
    this.marginesWewnetrzynyCanvasu = this.globalne.marginesWewnetrzynyCanvasu;
    this.inputFields = {};
    this.oznaczeniaKrawedzi = {};
    /**
     *
     * @param _canvasId
     * @returns {CanvasRenderingContext2D}
     */
    this.ustawContext = function (_canvasId){
        this.canvas = document.getElementById(_canvasId);
        this.canvas.width = jQuery('#'+_canvasId).width();
        this.canvas.height = jQuery('#'+_canvasId).height();
        return this.canvas.getContext("2d");
    };
    /**odstęp między deskami dla canvasu, nie podlega skalowaniu
     * wartosc w px
     * @type {number}
     */
    this.odstepMiedzyDeskamiDefault = 2;
    this.kolorDeskiDoRysunkuDefault = 'lightGrey';
    this.lineDefaultWidth = 1;
    this.lineDefaultColor = "black";
    this.lineHighlightDefaultColor = "lightblue";
    this.textDefaultFont = "12px Arial";
    this.fillDefault = "black";
    this.canvasId = _canvasId;
    this.canvas = null;
    this.context = this.ustawContext(_canvasId);
    this.ustalObszarNaRysunekTarasu = function () {
        var obszar = {minX: 0, maxX: 0, minY: 0, maxY: 0};
        var obszarCanvasu = this.canvas.getBoundingClientRect();
        obszar.minX = this.marginesWewnetrzynyCanvasu;
        obszar.maxX = obszarCanvasu.width * 1/this.globalne.skala - this.marginesWewnetrzynyCanvasu;
        obszar.minY = this.marginesWewnetrzynyCanvasu;
        obszar.maxY = obszarCanvasu.height * 1/this.globalne.skala - this.marginesWewnetrzynyCanvasu;
        return obszar;
    };
    this.obszarDozowolonyNaRysunekTarasu = this.ustalObszarNaRysunekTarasu();
    this.restetujContexDoUstawienDomyslnych = function () {
        this.context.strokeStyle = this.lineDefaultColor;
        this.context.font = this.textDefaultFont;
        this.context.lineWidth = this.lineDefaultWidth;
        this.context.fillStyle = this.fillDefault;
    };
    /**
     *
     * @param {Taras} _taras
     */
    this.konfigurujInputFields = function(_taras) {
        var ret = {};
        for (var property in _taras.ksztaltObiekt.linie) {
            if (_taras.ksztaltObiekt.linie.hasOwnProperty(property)) {
                var linia = _taras.ksztaltObiekt.linie[property];
                ret[linia.symbol] = new InputFieldDlugosc(linia);
            }
        }
        return ret;
    };
    /**
     *
     * @param {Taras} _taras
     */
    this.konfigurujOznaczenieKrawedzi = function(_taras) {
        var ret = {};
        for (var property in _taras.ksztaltObiekt.linie) {
            if (_taras.ksztaltObiekt.linie.hasOwnProperty(property)) {
                var linia = _taras.ksztaltObiekt.linie[property];
                ret[linia.symbol] = new OznaczenieKrawedzi(linia);
            }
        }
        return ret;
    };
    /**
     *
     * @param {Taras} _taras
     * @param {boolean} _rysujOznaczenieKrawedzi
     */
    this.rysujTaras = function (_taras, _rysujOznaczenieKrawedzi) {
        /* console.log("Rysuj taras: ",_taras); */
        var rysujOznaczenieKrawedzi = _rysujOznaczenieKrawedzi ? _rysujOznaczenieKrawedzi : true;
        this.resetujCanvas();
        this.inputFields = this.konfigurujInputFields(_taras);
        this.oznaczeniaKrawedzi = this.konfigurujOznaczenieKrawedzi(_taras);
        for (var property in _taras.ksztaltObiekt.linie) {
            if (_taras.ksztaltObiekt.linie.hasOwnProperty(property)) {

                var poczatek = this.globalne.skalujDlaCanvasWierzcholek(_taras.ksztaltObiekt.linie[property].poczatek);
                var koniec = this.globalne.skalujDlaCanvasWierzcholek(_taras.ksztaltObiekt.linie[property].koniec);
                if(_taras.liniaStykuDom && (_taras.liniaStykuDom.symbol == _taras.ksztaltObiekt.linie[property].symbol)){
                    this.podswietlLinie(_taras.ksztaltObiekt.linie[property], "yellow");
                }else {
                    this.context.beginPath();
                    this.context.strokeStyle = this.lineDefaultColor;
                    this.context.lineWidth = this.lineDefaultWidth;
                        this.rysujLinie(poczatek, koniec);
                    this.context.closePath();
                }

            }
        }
        _taras.obliczPowierzchnie();
        //rysuj powierzchnie tarasu
        //this.rysujTekst(this.canvas.width - _taras.powierzchnia.toFixed(2).count() * 14, 12,  _taras.powierzchnia.toFixed(2) + ' m²')
        // this.rysujTekst(this.canvas.width /3, this.canvas.height - 5 , 'SKALA: ' +  this.globalne.skala);
        if(this.globalne.aktywnyKrok == 1 || this.globalne.aktywnyKrok == 7){
            this.rysujInputFields(this.inputFields);

        }
        if(this.globalne.aktywnyKrok == 1 ){
            this.rysujInputFields(this.inputFields);
            if(rysujOznaczenieKrawedzi) {
                this.rysujOznaczeniaKrawedzi(this.oznaczeniaKrawedzi);
            }
        }

        if(this.globalne.aktywnyKrok > 1){
            this.context.save();
            this.rysujDeski(_taras);
            this.context.restore();
        }
        if(this.globalne.debug) {
            this.rysujOznaczeniaWierzcholkow(_taras);
        }
    };

    this.rysujOznaczeniaWierzcholkow = function(_taras){
        // wypisz wierzcholki
        var krok = 1;
        for (var prop in _taras.ksztaltObiekt.wierzcholki) {
            this.rysujTekst(_taras.ksztaltObiekt.wierzcholki[prop].x + 10, _taras.ksztaltObiekt.wierzcholki[prop].y + 10, _taras.ksztaltObiekt.wierzcholki[prop].symbol);
            krok++;
        }
    }
    /**
     *
     * @param {Array.<InputFieldDlugosc>}_pola
     */
    this.rysujInputFields = function (_pola) {
        for (var property in _pola) {
            /**
             * @type {InputFieldDlugosc}
             */
            var pole = _pola[property];
            var linia = new Linia(pole.poczatek, new Wierzcholek(pole.poczatek.x + pole.szerokoscPola, pole.poczatek.y), pole.szerokoscPola);
            this.rysujLinie(linia.poczatek, linia.koniec);
            var poleWartosc = (pole.wartosc / 100).toFixed(2);
            this.rysujTekst(pole.poczatek.x, pole.poczatek.y - 5, poleWartosc.toString());
        }
    };
    /**
     *
     * @param {Array.<OznaczenieKrawedzi>}_pola
     */
    this.rysujOznaczeniaKrawedzi = function (_pola) {
        for (var property in _pola) {
            /**
             * @type {OznaczenieKrawedzi}
             */
            var pole = _pola[property];
            // var linia = new Linia(pole.poczatek, new Wierzcholek(pole.poczatek.x + pole.szerokoscPola, pole.poczatek.y), pole.szerokoscPola);
            // this.rysujLinie(linia.poczatek, linia.koniec);
            // var poleWartosc = (pole.wartosc / 100).toFixed(2);
            var poleWartosc = pole.nazwaKrawedzi;
            this.rysujTekst(pole.poczatek.x, pole.poczatek.y - 5, poleWartosc.toString());
        }
    };
    this.resetujCanvas = function(){
        this.context.fillStyle = "white";
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.restetujContexDoUstawienDomyslnych();
    };
    /**
     *
     * @param {Linia} _linia
     */
    this.sprawdzCzyLiniaMiesciSieWDozwolonymObszarze = function (_linia){
        var ret = false;
        var strefa = this.obszarDozowolonyNaRysunekTarasu;
        if(
            _linia.poczatek.x.between(strefa.minX, strefa.maxX, true)
            && _linia.poczatek.y.between(strefa.minY, strefa.maxY, true)
            && _linia.koniec.x.between(strefa.minX, strefa.maxX, true)
            && _linia.koniec.y.between(strefa.minY, strefa.maxY, true)
        ){
            ret = true;
        }
        return ret;
    };
    /**
     * @param {Wierzcholek} _poczatek
     * @param {Wierzcholek} _koniec
     */
    this.rysujLinie = function(_poczatek, _koniec) {
        this.context.moveTo(_poczatek.x ,_poczatek.y );
            this.context.lineTo(_koniec.x,_koniec.y );
            this.context.stroke();
    };
    this.rysujTekst = function(_x, _y, _tekst) {
        this.context.fillText(_tekst, _x, _y);
    };
    this.podswietlLinie = function(_linia, _kolor) {
        this.context.beginPath();
        if(_kolor){
            this.context.strokeStyle = _kolor;
        } else {
            this.context.strokeStyle =  this.lineHighlightDefaultColor;
        }
        this.context.lineWidth = 10;
        this.rysujLinie(this.globalne.skalujDlaCanvasWierzcholek(_linia.poczatek), this.globalne.skalujDlaCanvasWierzcholek(_linia.koniec));
        this.context.closePath();
        this.context.strokeStyle = this.lineDefaultColor;
        this.context.lineWidth = this.lineDefaultWidth;
        //wyswietl symbol linii
        // this.rysujTekst(150, 12, "linia: " + _linia.symbol);
    };
    /**
     *
     * @param {InputFieldDlugosc} _pole
     */
    this.podswietlPole = function(_pole) {
        this.context.beginPath();
        this.context.fillStyle = 'rgba(227,223,68,0.5)';
        var wysokosc =  _pole.strefaAktywna.maxX - _pole.strefaAktywna.minX;
        var szerokosc = _pole.strefaAktywna.maxY - _pole.strefaAktywna.minY;
        this.context.rect(_pole.strefaAktywna.minX, _pole.strefaAktywna.minY, wysokosc, szerokosc );
        this.context.fill();
        this.context.closePath();

    };
    this.rysujProstokat = function (_x0, _y0, _x1, _y1 ) {
        // console.log("rysuj prostokat ", _x0, _y0, _x1, _y1 );
        this.context.beginPath();
        this.context.rect(_x0, _y0, _x1 -_x0, _y1 - _y0);
        this.context.stroke();
        this.context.closePath();

    };
    this.rysujProstokatWypelniony = function (_x0, _y0, _x1, _y1, _kolorWypelnienia ) {
        // console.log("rysuj prostokat ", _x0, _y0, _x1, _y1 );
        this.context.beginPath();
        this.context.rect(_x0, _y0, _x1 -_x0, _y1 - _y0);
        this.context.fillStyle = _kolorWypelnienia;
        this.context.fill();
        this.context.closePath();

    };
    /**
     *
     * @param {Taras} _taras
     */
    this.rysujDeski = function (_taras) {
        var orientacjaLiniStykuDomu = _taras.liniaStykuDom ? _taras.liniaStykuDom.orientacja : null;
        var kolorDeski = this.kolorDeskiDoRysunkuDefault;
        // Dodanie obsługi Natura 3D (1:1 z oryginałem + tylko dodane kolory)
        if(_taras.deska && _taras.deska.typ === 'NATURA_3D') {
            if(_taras.deska.kolor == 'JESION'){
                kolorDeski = '#D7C6B2';
            }else if(_taras.deska.kolor == 'WENGE'){
                kolorDeski = '#3a2f23';
            }else if(_taras.deska.kolor == 'IPE'){
                kolorDeski = '#745c3b';
            }else if(_taras.deska.kolor == 'TEAK'){
                kolorDeski = '#BC833A';
            }else{
                kolorDeski = this.kolorDeskiDoRysunkuDefault;
            }
        } else if(_taras.deska.kolor){
            if(_taras.deska.kolor == 'KLON_LODOWY'){
                kolorDeski = '#70675a';
            }else if(_taras.deska.kolor == 'SWIERK_DYMNY'){
                kolorDeski = '#4f4841';
            }else if(_taras.deska.kolor == 'MAHON_NATURALNY'){
                kolorDeski = '#a3533e';
            }else if(_taras.deska.kolor == 'DAB_LINDBERG'){
                kolorDeski = '#7f5f45';
            }else if(_taras.deska.kolor == 'ORZECH_SZLACHETNY'){
                kolorDeski = '#5d453a';
            } else {
                kolorDeski = this.kolorDeskiDoRysunkuDefault;
            }
        }
        this.rysujMaske(_taras.ksztaltObiekt.wierzcholki);

        // rysuje uklad desek wzgledem lini styku z domem
        if(_taras.kierunek_ulozenia == this.globalne.KIERUNEK_ULOZENIA.PROSTOPADLE){
           orientacjaLiniStykuDomu == this.globalne.orientacja.pozioma ? this.rysujDeskiPionowo(_taras, kolorDeski) : this.rysujDeskiPoziomo(_taras, kolorDeski);
        } else if(_taras.kierunek_ulozenia == this.globalne.KIERUNEK_ULOZENIA.ROWNOLEGLE){
            orientacjaLiniStykuDomu == this.globalne.orientacja.pozioma ? this.rysujDeskiPoziomo(_taras, kolorDeski) : this.rysujDeskiPionowo(_taras, kolorDeski);
        }

    };
    this.rysujDeskiPoziomo = function(_taras, kolorDeski){
        /**
         * wartośc w pikselach nie skalujemy poniewaz odstepy sa poniżej 1 cm
         * @type {number} odstepMiedzyDeskami
         */
        var odstepMiedzyDeskami = _taras.deski_odstep === 0.5 ? this.odstepMiedzyDeskamiDefault : 1;
        var startWierzcholek = this.globalne.skalujDlaCanvasWierzcholek(_taras.ksztaltObiekt.wymiary().startObszaru);
        var koniecWierzcholek = this.globalne.skalujDlaCanvasWierzcholek(_taras.ksztaltObiekt.wymiary().koniecObszaru);
        var dlugoscDeski = this.globalne.skala * Math.round(_taras.deska.dlugosc / 10);
        var szerokoscDeski = this.globalne.skala * Math.round(_taras.deska.szerokosc / 10);
        var x0 = startWierzcholek.x;
        var y0 = startWierzcholek.y;
        var x1 = 0;
        var y1 = 0;
        var indexX = 1;
        var indexY = 1;
        while(y0 <= koniecWierzcholek.y) {
            while (x0 <= koniecWierzcholek.x) {
                x1 = x0 + dlugoscDeski ;
                y1 = y0 + szerokoscDeski;
                this.rysujProstokatWypelniony(x0, y0, x1, y1, kolorDeski);
                x0 = x1  + odstepMiedzyDeskami;
                indexX++;
            }
            indexY++;
            if(_taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.CIAGLY) {
                x0 = startWierzcholek.x;
                y0 = y1 + odstepMiedzyDeskami;
            }else if(_taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.ZAMEK) {
                var szerokoscTarasu = _taras.ksztaltObiekt.wymiary().szerokosc;
                //przesuwam w lewo co drugi wiersz
                if(szerokoscTarasu < 2 * dlugoscDeski) {
                    x0 = indexY % 2 === 0 ? startWierzcholek.x - (dlugoscDeski - szerokoscTarasu/2) : startWierzcholek.x ;

                } else {
                    x0 = indexY % 2 === 0 ? startWierzcholek.x - dlugoscDeski/2 : startWierzcholek.x ;
                }
                y0 = y1  + odstepMiedzyDeskami;
            }
        }
    }
    this.rysujDeskiPionowo = function (_taras, kolorDeski){
        /**
         * wartośc w pikselach nie skalujemy poniewaz odstepy sa poniżej 1 cm
         * @type {number} odstepMiedzyDeskami
         */
        var odstepMiedzyDeskami = _taras.deski_odstep === 0.5 ? this.odstepMiedzyDeskamiDefault : 1;
        var startWierzcholek = this.globalne.skalujDlaCanvasWierzcholek(_taras.ksztaltObiekt.wymiary().startObszaru);
        var koniecWierzcholek = this.globalne.skalujDlaCanvasWierzcholek(_taras.ksztaltObiekt.wymiary().koniecObszaru);
        var dlugoscDeski = this.globalne.skala * Math.round(_taras.deska.dlugosc / 10);
        var szerokoscDeski = this.globalne.skala * Math.round(_taras.deska.szerokosc / 10);
        var x0 = startWierzcholek.x;
        var y0 = startWierzcholek.y;
        var x1 = 0;
        var y1 = 0;
        var indexX = 1;
        var indexY = 1;
        while(x0 <= koniecWierzcholek.x) {
            while (y0 <= koniecWierzcholek.y) {
                y1 = y0 + dlugoscDeski ;
                x1 = x0 + szerokoscDeski;
                this.rysujProstokatWypelniony(x0, y0, x1, y1, kolorDeski);
                y0 = y1  + odstepMiedzyDeskami;
                indexY++;
            }
            indexX++;
            if(_taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.CIAGLY) {
                y0 = startWierzcholek.y;
                x0 = x1 + odstepMiedzyDeskami;
            }else if(_taras.sposob_ulozenia == this.globalne.SPOSOB_ULOZENIA.ZAMEK) {
                var wysokoscTarasu = _taras.ksztaltObiekt.wymiary().wysokosc;
                //przesuwam do góry co drugi wiersz
                if(wysokoscTarasu < 2 * dlugoscDeski) {
                    y0 = indexX % 2 === 0 ? startWierzcholek.y - (dlugoscDeski - wysokoscTarasu/ 2) : startWierzcholek.y;
                } else {
                    y0 = indexX % 2 === 0 ? startWierzcholek.y - dlugoscDeski / 2 : startWierzcholek.y;
                }
                x0 = x1  + odstepMiedzyDeskami;
            }
        }
    }
    /**
     * maska przycinajaca deski do kształtu tarasu
     * @param {Array.<Wierzcholek>} _wierzcholki
     */
    this.rysujMaske = function (_wierzcholki) {
        var wierzcholki = Array();

        for (var prop in _wierzcholki){
            wierzcholki.push(this.globalne.skalujDlaCanvasWierzcholek(_wierzcholki[prop]));
        };
        this.context.beginPath();
        this.context.moveTo( wierzcholki[0].x, wierzcholki[0].y);
        for(var i = 1; i< wierzcholki.length; i++){
            this.context.lineTo(wierzcholki[i].x, wierzcholki[i].y)
        }
        this.context.closePath();
        this.context.clip();
    }
    this.pobierzCanvasJakoObrazek = function () {

        return this.canvas.toDataURL('image/jpeg', 1.0);
    }
}
