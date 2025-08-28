/**
 *
 * @param {Linia} _linia
 * @constructor
 */
function InputFieldDlugosc (_linia) {
    this.globalne = window.zmienneGlobalne;
    this.linia = new Linia(
        this.globalne.skalujDlaCanvasWierzcholek(_linia.poczatek),
        this.globalne.skalujDlaCanvasWierzcholek(_linia.koniec),
        _linia.dlugosc);
    this.strefaAktywna = null;
    /**
     * szerokosc pola w pikselach
     * @type {number}
     */
    this.szerokoscPola = 30;
    /**
     *
     * @type {Wierzcholek}
     */
    this.poczatek = new Wierzcholek();
    this.wartosc = _linia.dlugosc;
    this.ustalPolozenieRozmiar = function () {
        var dlugoscWmetrach = this.linia.dlugosc / 100;
        this.szerokoscPola = dlugoscWmetrach.toFixed(2).count() * this.globalne.szerokoscZnaku;
        if(this.linia.orientacja == 'pozioma') {
            // sprawdzam też który koniec lini jest bliżej poczatku ukladu wsp
            this.poczatek.x = (this.linia.poczatek.x < this.linia.koniec.x ? this.linia.poczatek.x : this.linia.koniec.x) + (Math.abs(this.linia.poczatek.x - this.linia.koniec.x)/2) - this.szerokoscPola/2;
            if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.GORA) {
                this.poczatek.y = this.linia.poczatek.y - 10;
            } else if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.DOL){
                this.poczatek.y = this.linia.poczatek.y + 10 + this.globalne.wysokoscZnaku * 1.5;
            }
        }else if(this.linia.orientacja == 'pionowa') {
            if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.LEWA) {
                this.poczatek.x = this.linia.poczatek.x - this.szerokoscPola - 10;
            } else if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.PRAWA){
                this.poczatek.x = this.linia.poczatek.x + 10;
            }
            this.poczatek.y = (this.linia.poczatek.y < this.linia.koniec.y ? this.linia.poczatek.y : this.linia.koniec.y) + (Math.abs(this.linia.poczatek.y - this.linia.koniec.y)/2) ;
        }
    };
    /**
     *  ustala strefe w której pole jest aktywne
     * @param {number} _tolerancja - dopuszczalne dystans od linii
     */
    this.ustalStrefeAktywna = function () {
        var strefa = {minX: 0, maxX: 0, minY: 0, maxY: 0};
        strefa.minX = this.poczatek.x;
        strefa.maxX = this.poczatek.x + this.szerokoscPola;
        strefa.minY = this.poczatek.y - this.globalne.wysokoscZnaku * 1.5;
        strefa.maxY = this.poczatek.y;
        return strefa;
    };
    this.ustalPolozenieRozmiar();
    this.strefaAktywna = this.ustalStrefeAktywna();
    /**
     *
     * @param {number} _mX pozycja kursora X
     * @param {number} _mY pozycja kursora Y
     * @returns {boolean}
     */
    this.sprawdzCzyKursorJestWStrefieAktywnej = function (_mX, _mY) {
        var ret = false;
        var strefa = this.ustalStrefeAktywna();
        if((_mX > strefa.minX && _mX < strefa.maxX) && (_mY > strefa.minY && _mY < strefa.maxY)) {
            ret = true;
        }

        return ret;
    }
}/**
 *
 * @param {Linia} _linia
 * @constructor
 */
function OznaczenieKrawedzi (_linia) {
    this.globalne = window.zmienneGlobalne;
    /** {string} np. A,B,C ... */
    this.nazwaKrawedzi = _linia.nazwaKrawedzi;
    this.linia = new Linia(
        this.globalne.skalujDlaCanvasWierzcholek(_linia.poczatek),
        this.globalne.skalujDlaCanvasWierzcholek(_linia.koniec),
        _linia.dlugosc);
    this.strefaAktywna = null;
    /**
     * szerokosc pola w pikselach
     * @type {number}
     */
    this.szerokoscPola = 30;
    /**
     *
     * @type {Wierzcholek}
     */
    this.poczatek = new Wierzcholek();
    this.wartosc = _linia.dlugosc;
    this.ustalPolozenieRozmiar = function () {
        var dlugoscWmetrach = this.linia.dlugosc / 100;
        this.szerokoscPola = dlugoscWmetrach.toFixed(2).count() * this.globalne.szerokoscZnaku;
        if(this.linia.orientacja == 'pozioma') {


            // sprawdzam też który koniec lini jest bliżej poczatku ukladu wsp
            this.poczatek.x = (this.linia.poczatek.x < this.linia.koniec.x ? this.linia.poczatek.x : this.linia.koniec.x) + (Math.abs(this.linia.poczatek.x - this.linia.koniec.x)/2) - this.szerokoscPola/2;
            this.poczatek.x = this.poczatek.x - this.globalne.wysokoscZnaku * 2;
            if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.GORA) {
                this.poczatek.y = this.linia.poczatek.y - 10;
            } else if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.DOL){
                this.poczatek.y = this.linia.poczatek.y + 10 + this.globalne.wysokoscZnaku * 1.5;
            }
        }else if(this.linia.orientacja == 'pionowa') {

            if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.LEWA) {
                this.poczatek.x = this.linia.poczatek.x - this.szerokoscPola - 10;
            } else if(_linia.poleDlugoscPolozenie == this.globalne.POLOZENIE.PRAWA){
                this.poczatek.x = this.linia.poczatek.x + 10;
            }
            this.poczatek.y = (this.linia.poczatek.y < this.linia.koniec.y ? this.linia.poczatek.y : this.linia.koniec.y) + (Math.abs(this.linia.poczatek.y - this.linia.koniec.y)/2) ;
            this.poczatek.y = this.poczatek.y + this.globalne.wysokoscZnaku * 2;
        }
    };

    this.ustalPolozenieRozmiar();

}