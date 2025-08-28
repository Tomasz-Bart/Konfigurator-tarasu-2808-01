var pathJsFiles = '/wp-content/themes/polestar-child/konfigurator-tarasu/js/';
jQuery.getScript( pathJsFiles + 'ksztalt.js', function() {

});

/**
 * taras w kształcie prostokąta
 * @param {Array.<Wierzcholek>} _wierzcholki
 * @param {Array.<Linia>} _linie
 * @constructor
 */
function KsztaltProstokat(_wierzcholki, _linie) {
    this.symboleLinii = {
        AB: 'AB',
        BC: 'BC',
        CD: 'CD',
        DA: 'DA'
    };

    Ksztalt.call(this, _wierzcholki, _linie);
    //zwraca dlugosc boku w metrach
    this.bokAdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.AB.dlugosc);
    }
    this.bokBdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.BC.dlugosc);
    }
    this.bokCdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.CD.dlugosc);
    }
    this.bokDdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.DA.dlugosc);
    }
    /**
     *
     * @param {Linia} _linia
     * @param {number} _nowaDlugosc
     * @param {boolean} _recznieWprowadzona
     */
    this.ustawDlugoscLinii = function (_linia, _nowaDlugosc, _recznieWprowadzona) {
        _nowaDlugosc = parseFloat(_nowaDlugosc.toFixed(2));
        if(_linia.symbol === this.symboleLinii.AB || _linia.symbol === this.symboleLinii.CD) {
            if(_recznieWprowadzona){
                this.wierzcholki.B.x = this.wierzcholki.A.x + _nowaDlugosc;
                this.wierzcholki.C.x = this.wierzcholki.D.x + _nowaDlugosc;
            }
            this.linie[this.symboleLinii.AB ].ustawDlugoscWedlugWierzcholkow();
            this.linie[this.symboleLinii.CD ].ustawDlugoscWedlugWierzcholkow();
        }
        if(_linia.symbol === this.symboleLinii.BC || _linia.symbol === this.symboleLinii.DA) {
            if(_recznieWprowadzona){
                this.wierzcholki.D.y = this.wierzcholki.A.y + _nowaDlugosc;
                this.wierzcholki.C.y = this.wierzcholki.B.y + _nowaDlugosc;
            }
            this.linie[this.symboleLinii.BC ].ustawDlugoscWedlugWierzcholkow();
            this.linie[this.symboleLinii.DA ].ustawDlugoscWedlugWierzcholkow();
        }
        this.obliczPowierzchnie();
    };
    /**
     *
     * @param {Linia} _linia
     * @param {number} _wartoscPrzesuniecia
     */
    this.liniaJestPrzesuwana = function (_linia, _wartoscPrzesuniecia) {
            // console.log(_linia.symbol, _wartoscPrzesuniecia);
        this.ustawDlugosciLiniiWedlugWierzcholkow();

    };
}
/**
 * taras w kształcie litery L
 * @param {Array.<Wierzcholek>} _wierzcholki
 * @param {Array.<Linia>} _linie
 * @constructor
 */
function KsztaltElka(_wierzcholki, _linie) {
    this.symboleLinii = {
        AB: 'AB',
        BC: 'BC',
        CD: 'CD',
        DE: 'DE',
        EF: 'EF',
        FA: 'FA'
    };
    Ksztalt.call(this, _wierzcholki, _linie);
    //zwraca dlugosc boku w metrach
    this.bokAdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.AB.dlugosc);
    }
    this.bokBdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.BC.dlugosc);
    }
    this.bokCdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.CD.dlugosc);
    }
    this.bokDdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.DE.dlugosc);
    }
    this.bokEdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.EF.dlugosc);
    }
    this.bokFdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.FA.dlugosc);
    }
    /**
     *
     * @param {Linia} _linia
     * @param {number} _nowaDlugosc
     * @param {boolean} _recznieWprowadzona
     */
    this.ustawDlugoscLinii = function (_linia, _nowaDlugosc, _recznieWprowadzona) {
        var staraDlugosc = _linia.dlugosc;
        var wektor = {x: 0,y: 0};
        _nowaDlugosc = parseFloat(_nowaDlugosc.toFixed(2));
        if(_linia.orientacja == 'pozioma'){
           wektor.x = _nowaDlugosc - staraDlugosc ;
        }else if(_linia.orientacja == 'pionowa'){
            wektor.y = _nowaDlugosc - staraDlugosc ;
        }
        if(_linia.symbol === this.symboleLinii.AB ){
            this.przesunWierzcholki([this.wierzcholki.B, this.wierzcholki.C, this.wierzcholki.D, this.wierzcholki.E], wektor);
        }
        if(_linia.symbol === this.symboleLinii.BC ){
            this.przesunWierzcholki([this.wierzcholki.C, this.wierzcholki.D], wektor);
        }
        if(_linia.symbol === this.symboleLinii.CD ){
            this.przesunWierzcholki([this.wierzcholki.D, this.wierzcholki.E], wektor);
        }
        if(_linia.symbol === this.symboleLinii.DE ){
            this.przesunWierzcholki([this.wierzcholki.E, this.wierzcholki.F], wektor);
        }
        if(_linia.symbol === this.symboleLinii.EF ){
            this.przesunWierzcholki([this.wierzcholki.B, this.wierzcholki.C, this.wierzcholki.D, this.wierzcholki.E], wektor);
        }
        if(_linia.symbol === this.symboleLinii.FA ){
            if(_nowaDlugosc < this.linie.BC.dlugosc){
                wektor.y = staraDlugosc - this.linie.BC.dlugosc - this.globalne.odstepKrawedzi;
            }
            this.przesunWierzcholki([this.wierzcholki.F, this.wierzcholki.E], wektor);
        }

        this.ustawDlugosciLiniiWedlugWierzcholkow();
        this.obliczPowierzchnie();
    };
    /**
     *
     * @param {Array.<Wierzcholki>}_wierzcholkiArr
     * @param {{x, y}} _wektor
     */
    this.przesunWierzcholki = function (_wierzcholkiArr, _wektor) {
        for (var prop in _wierzcholkiArr) {
            _wierzcholkiArr[prop].x +=_wektor.x;
            _wierzcholkiArr[prop].y +=_wektor.y;

        }
    }

}
/**
 * taras w kształcie litery T
 * @param {Array.<Wierzcholek>} _wierzcholki
 * @param {Array.<Linia>} _linie
 * @constructor
 */
function KsztaltTetka(_wierzcholki, _linie) {
    this.symboleLinii = {
        AB: 'AB',
        BC: 'BC',
        CD: 'CD',
        DE: 'DE',
        EF: 'EF',
        FG: 'FG',
        GH: 'GH',
        HA: 'HA'
    };
    Ksztalt.call(this, _wierzcholki, _linie);
    //zwraca dlugosc boku w metrach
    this.bokAdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.AB.dlugosc);
    }
    this.bokBdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.BC.dlugosc);
    }
    this.bokCdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.CD.dlugosc);
    }
    this.bokDdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.DE.dlugosc);
    }
    this.bokEdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.EF.dlugosc);
    }
    this.bokFdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.FG.dlugosc);
    }
    this.bokGdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.GH.dlugosc);
    }
    this.bokHdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.HA.dlugosc);
    }
    /**
     *
     * @param {Linia} _linia
     * @param {number} _nowaDlugosc
     * @param {boolean} _recznieWprowadzona
     */
    this.ustawDlugoscLinii = function (_linia, _nowaDlugosc, _recznieWprowadzona) {
        var staraDlugosc = _linia.dlugosc;
        var wektor = {x: 0,y: 0};
        _nowaDlugosc = parseFloat(_nowaDlugosc.toFixed(2));
        if(_linia.orientacja == 'pozioma'){
           wektor.x = _nowaDlugosc - staraDlugosc ;
        }else if(_linia.orientacja == 'pionowa'){
            wektor.y = _nowaDlugosc - staraDlugosc ;
        }
        if(_linia.symbol === this.symboleLinii.AB ){
            if(_nowaDlugosc < this.linie.GH.dlugosc + this.linie.CD.dlugosc + 10){
                wektor.x =  (this.linie.GH.dlugosc + this.linie.CD.dlugosc + 10) - staraDlugosc;
            }
            this.przesunWierzcholki([this.wierzcholki.B, this.wierzcholki.C, this.wierzcholki.D, this.wierzcholki.E], wektor);
        }
        if(_linia.symbol === this.symboleLinii.BC || _linia.symbol === this.symboleLinii.HA ){
            this.przesunWierzcholki([this.wierzcholki.C,this.wierzcholki.D, this.wierzcholki.E, this.wierzcholki.F, this.wierzcholki.G, this.wierzcholki.H], wektor);
        }
        if(_linia.symbol === this.symboleLinii.CD ){
            this.przesunWierzcholki([this.wierzcholki.B, this.wierzcholki.C], wektor);
        }
        if(_linia.symbol === this.symboleLinii.DE || _linia.symbol === this.symboleLinii.FG ){
            this.przesunWierzcholki([this.wierzcholki.E, this.wierzcholki.F], wektor);
        }
        if(_linia.symbol === this.symboleLinii.EF ){
            this.przesunWierzcholki([this.wierzcholki.B, this.wierzcholki.C, this.wierzcholki.D, this.wierzcholki.E], wektor);
        }
        if(_linia.symbol === this.symboleLinii.GH ){
            this.przesunWierzcholki([this.wierzcholki.B,this.wierzcholki.C,this.wierzcholki.D, this.wierzcholki.E, this.wierzcholki.F, this.wierzcholki.G], wektor);
        }

        this.ustawDlugosciLiniiWedlugWierzcholkow();
        this.obliczPowierzchnie();
    };
    /**
     *
     * @param {Array.<Wierzcholki>}_wierzcholkiArr
     * @param {{x, y}} _wektor
     */
    this.przesunWierzcholki = function (_wierzcholkiArr, _wektor) {
        for (var prop in _wierzcholkiArr) {
            // console.log('_wektor = ' + _wektor);
            // console.log(_wierzcholkiArr[prop]);
            _wierzcholkiArr[prop].x +=_wektor.x;
            _wierzcholkiArr[prop].y +=_wektor.y;
            // console.log(_wierzcholkiArr[prop]);

        }
    }

}
/**
 * taras w kształcie litery U
 * @param {Array.<Wierzcholek>} _wierzcholki
 * @param {Array.<Linia>} _linie
 * @constructor
 */
function KsztaltUtka(_wierzcholki, _linie) {
    this.symboleLinii = {
        AB: 'AB',
        BC: 'BC',
        CD: 'CD',
        DE: 'DE',
        EF: 'EF',
        FG: 'FG',
        GH: 'GH',
        HA: 'HA'
    };
    Ksztalt.call(this, _wierzcholki, _linie);
    //zwraca dlugosc boku w metrach
    this.bokAdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.AB.dlugosc);
    }
    this.bokBdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.BC.dlugosc);
    }
    this.bokCdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.CD.dlugosc);
    }
    this.bokDdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.DE.dlugosc);
    }
    this.bokEdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.EF.dlugosc);
    }
    this.bokFdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.FG.dlugosc);
    }
    this.bokGdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.GH.dlugosc);
    }
    this.bokHdlugosc = function(){
        return this.globalne.konwertujCentymetryNaMetry(this.linie.HA.dlugosc);
    }
    /**
     *
     * @param {Linia} _linia
     * @param {number} _nowaDlugosc
     * @param {boolean} _recznieWprowadzona
     */
    this.ustawDlugoscLinii = function (_linia, _nowaDlugosc, _recznieWprowadzona) {
        _recznieWprowadzona ? this.globalne.log(_linia, _nowaDlugosc ) : null;
        var staraDlugosc = _linia.dlugosc;
        var wektor = {x: 0,y: 0};

        if(_linia.orientacja == 'pozioma'){
           wektor.x = _nowaDlugosc - staraDlugosc ;
        }else if(_linia.orientacja == 'pionowa'){
            wektor.y = _nowaDlugosc - staraDlugosc ;
        }
        if(_linia.symbol === this.symboleLinii.AB ){
            this.przesunWierzcholki([this.wierzcholki.B, this.wierzcholki.C, this.wierzcholki.D, this.wierzcholki.E], wektor);
        }
        if(_linia.symbol === this.symboleLinii.BC ){
            this.przesunWierzcholki([this.wierzcholki.C, this.wierzcholki.D], wektor);
        }
        if(_linia.symbol === this.symboleLinii.CD ){
            this.przesunWierzcholki([this.wierzcholki.C, this.wierzcholki.B], wektor);
        }
        if(_linia.symbol === this.symboleLinii.DE ||  _linia.symbol === this.symboleLinii.FG){
            this.przesunWierzcholki([this.wierzcholki.E, this.wierzcholki.F], wektor, true);
        }
        if(_linia.symbol === this.symboleLinii.EF ){
            this.przesunWierzcholki([this.wierzcholki.B, this.wierzcholki.C, this.wierzcholki.D, this.wierzcholki.E], wektor);
        }
        if(_linia.symbol === this.symboleLinii.HA ){
            this.przesunWierzcholki([this.wierzcholki.H, this.wierzcholki.G], wektor);
        }

        if(_linia.symbol === this.symboleLinii.GH ){
            if(_nowaDlugosc < staraDlugosc + 1) {
                this.przesunWierzcholki([this.wierzcholki.F, this.wierzcholki.G], wektor);
            } else {
                this.przesunWierzcholki([this.wierzcholki.F, this.wierzcholki.G, this.wierzcholki.B, this.wierzcholki.C, this.wierzcholki.D, this.wierzcholki.E], wektor);
            }
        }
        //     console.log(_linia);
        this.ustawDlugosciLiniiWedlugWierzcholkow();
        this.obliczPowierzchnie();
    };
    /**
     *
     * @param {Array.<Wierzcholki>}_wierzcholkiArr
     * @param {{x, y}} _wektor
     * @param bool _odwroc
     */
    this.przesunWierzcholki = function (_wierzcholkiArr, _wektor, _odwroc) {
        if(_odwroc){
            _wektor.x = _wektor.x == 0 ? _wektor.x : -_wektor.x;
            _wektor.y = _wektor.y == 0 ? _wektor.y : -_wektor.y;
        }
        for (var prop in _wierzcholkiArr) {

                _wierzcholkiArr[prop].x += _wektor.x;
                _wierzcholkiArr[prop].y += _wektor.y;

        }
    }

}