function Wierzcholek(_x, _y, _symbol) {
    this.x = _x;
    this.y = _y;
    this.symbol = _symbol;
    this.pokazOpis = function() {
        return this.symbol + '('+this.x.toFixed(2)+', '+this.y.toFixed(2)+')';
    }
}

/**
 *
 * @param {Wierzcholek} _poczatek
 * @param {Wierzcholek} _koniec
 * @param {number} _dlugosc
 * @constructor
 */
function Linia(_poczatek, _koniec, _dlugosc, _poleDlugoscPolozenie) {
    this.globalne = window.zmienneGlobalne;
    this.poczatek = _poczatek;
    this.koniec = _koniec;
    this.dlugosc = _dlugosc;
    this.symbol = this.poczatek.symbol + this.koniec.symbol;
    // nazwa boku / krawędzi np. A,B,C itp.
    this.nazwaKrawedzi = this.poczatek.symbol;
    this.poleDlugoscPolozenie = _poleDlugoscPolozenie;
    this.ustalOrientacje = function(){
        if(this.poczatek.x === this.koniec.x){
            return this.globalne.orientacja.pionowa;
        }else if(this.poczatek.y === this.koniec.y){
            return this.globalne.orientacja.pozioma;
        }
    };
    this.orientacja = this.ustalOrientacje();
    /**
     *  ustala strefe w której linia jest aktywna
     * @param {number} _tolerancja - dopuszczalne dystans od linii
     */
    this.ustalStrefeAktywna = function (_tolerancja) {
        var strefa = {minX: 0, maxX: 0, minY: 0, maxY: 0};
        if(this.orientacja == 'pionowa'){
            strefa.minX = this.poczatek.x - _tolerancja;
            strefa.maxX = this.poczatek.x + _tolerancja;
            strefa.minY = this.poczatek.y > this.koniec.y ? this.koniec.y : this.poczatek.y;
            strefa.maxY = this.poczatek.y > this.koniec.y ? this.poczatek.y : this.koniec.y;
        }else if(this.orientacja == 'pozioma'){
            strefa.minX = this.poczatek.x > this.koniec.x ? this.koniec.x : this.poczatek.x;
            strefa.maxX = this.poczatek.x > this.koniec.x ? this.poczatek.x : this.koniec.x;
            strefa.minY = this.poczatek.y - _tolerancja;
            strefa.maxY = this.poczatek.y + _tolerancja;
        }
        strefa.minX = this.globalne.skalujDlaCanvasWartosc(strefa.minX );
        strefa.minY = this.globalne.skalujDlaCanvasWartosc(strefa.minY );
        strefa.maxX = this.globalne.skalujDlaCanvasWartosc(strefa.maxX );
        strefa.maxY = this.globalne.skalujDlaCanvasWartosc(strefa.maxY );
        return strefa;
    };
    /**
     *
     * @param {number} _mX pozycja kursora X
     * @param {number} _mY pozycja kursora Y
     * @param {number} _tolerancja dopuszczalne dystans od linii
     * @returns {boolean}
     */
    this.sprawdzCzyKursorJestWStrefieAktywnej = function (_mX, _mY, _tolerancja) {
        var ret = false;
        var strefa= this.ustalStrefeAktywna(_tolerancja);
        if((_mX > strefa.minX && _mX < strefa.maxX) && (_mY > strefa.minY && _mY < strefa.maxY)) {
            ret = true;
        }

        return ret;
    }
    this.ustawDlugoscWedlugWierzcholkow = function () {
        if(this.orientacja == 'pozioma'){
            this.dlugosc = Math.abs(this.koniec.x - this.poczatek.x).toFixed(2);
        } else if(this.orientacja == 'pionowa'){
            this.dlugosc = Math.abs(this.koniec.y - this.poczatek.y).toFixed(2);
        }
    }
}
