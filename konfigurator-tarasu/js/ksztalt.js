/**
 *
 * @param {Array.<Wierzcholek>} _wierzcholki
 * @param {Array.<Linia>} _linie
 * @constructor
 */
function Ksztalt(_wierzcholki, _linie) {
    /**
     *
     * @type {Globalne}
     */
    this.globalne = window.zmienneGlobalne;
    /**
     *
     * @type {Array<Wierzcholek>}
     */
    this.wierzcholki = _wierzcholki;

    /**
     *
     * @type {Array<Linia>}
     */
    this.linie = _linie;


    /**
     * powierzchnie zwracamy w m2, uzytkownik wprowadza wymiary w cm
     * @returns {number}
     */
    this.obliczPowierzchnie = function (){
        var polePowierzchni = 0;
        var wierzcholki = Array();
        //liczba wierzchołków
        var N = 0;
            for (var prop in this.wierzcholki){
                wierzcholki.push(this.wierzcholki[prop]);
                N++;
            };
        for(var i=0; i< N; i++){
            if (i==0) {
                polePowierzchni += wierzcholki[i].x*(wierzcholki[N-1].y-wierzcholki[i+1].y);
            } else if (i==(N-1)){
                polePowierzchni += wierzcholki[i].x*(wierzcholki[i-1].y-wierzcholki[0].y);
            } else {
                polePowierzchni += wierzcholki[i].x*(wierzcholki[i-1].y-wierzcholki[i+1].y);
            }
        }
        polePowierzchni = (Math.abs(polePowierzchni)/2)/10000;
        return polePowierzchni;
    };
    /**
     *
     * @param {Linia} _linia
     * @param {number} _nowaDlugosc
     */
    this.ustawDlugoscLinii = function (_linia, _nowaDlugosc) {

    };
    /**
     *
     * @param {Linia} _linia
     * @param {number} _wartoscPrzesuniecia
     */
    this.liniaJestPrzesuwana = function (_linia, _wartoscPrzesuniecia) {
        this.ustawDlugosciLiniiWedlugWierzcholkow();
    };

    this.wymiary = function () {
        /**
         *
         * @type {{wysokosc: number, szerokosc: number, startObszaru: Wierzcholek, koniecObszaru: Wierzcholek}}
         */
        var ret = {wysokosc: 0, szerokosc: 0, startObszaru: new Wierzcholek(), koniecObszaru: new Wierzcholek()};
        var xArr = Array();
        var yArr = Array();
        for(var prop in this.wierzcholki){
            xArr.push(this.wierzcholki[prop].x);
            yArr.push(this.wierzcholki[prop].y);
        }
        ret.szerokosc = Math.max.apply(Math, xArr) - Math.min.apply(Math, xArr);
        ret.wysokosc = Math.max.apply(Math, yArr) - Math.min.apply(Math, yArr);
        ret.startObszaru = new Wierzcholek(Math.min.apply(Math, xArr), Math.min.apply(Math, yArr));
        ret.koniecObszaru = new Wierzcholek(ret.startObszaru.x + ret.szerokosc, ret.startObszaru.y + ret.wysokosc);
        return ret;
    };
    this.ustawDlugosciLiniiWedlugWierzcholkow = function () {
        for(var prop in this.linie){
            this.linie[prop].ustawDlugoscWedlugWierzcholkow();
        }
    }


}