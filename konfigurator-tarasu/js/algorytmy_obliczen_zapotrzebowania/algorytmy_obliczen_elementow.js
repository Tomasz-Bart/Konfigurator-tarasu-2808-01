jQuery.getScript( pathJsFiles + 'algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_prostokat.js',
    function() {window.zmienneGlobalne.log('LOADED: ' + '/algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_prostokat.js')});
jQuery.getScript( pathJsFiles + 'algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_elka.js',
    function() {window.zmienneGlobalne.log('LOADED: ' + '/algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_elka.js')});
jQuery.getScript( pathJsFiles + 'algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_tetka.js',
    function() {window.zmienneGlobalne.log('LOADED: ' + '/algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_tetka.js')});
jQuery.getScript( pathJsFiles + 'algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_utka.js',
    function() {window.zmienneGlobalne.log('LOADED: ' + '/algorytmy_obliczen_zapotrzebowania/algorytm_ksztalt_utka.js')});

/**
 * Algorytmy obliczajace zapotrzebowanie na elementy konstrukcyjne tarasu
 */
function PodsumowanieElementowTarasu()  {
    /**
     *
     * @type {Globalne}
     */
    this.globalne = window.zmienneGlobalne;
    this.printableValues = [
        'ilosc_deski_metry_biezace_mbd', 'ilosc_deski_sztuki_dst', 'ilosc_legar_metry_biezace_mbl', 'ilosc_legar_sztuki_po_4m_lst', 'ilosc_klips_srodkowy_ksr', 'ilosc_klips_koncowy_kk', 'ilosc_klips_poczatkowy_kst', 'ilosc_listwa_4m_lls', 'wydajnosc_z_deski', 'powierzchnia_tarasu'
    ];
    this._wynikiWeryfikacjiWarunkow = [];
    this.ilosc_deski_metry_biezace_mbd = 0;
    this.ilosc_deski_sztuki_dst = 0;
    this.ilosc_legar_metry_biezace_mbl = 0;
    this.ilosc_legar_sztuki_po_4m_lst = 0;
    this.ilosc_klips_srodkowy_ksr = 0;
    this.ilosc_klips_koncowy_kk = 0;
    this.ilosc_klips_poczatkowy_kst = 0;
    this.ilosc_listwa_4m_lls = 0;
    this.wydajnosc_z_deski = 0;
    this.powierzchnia_tarasu = 0;
    this.setup = function(
        _ilosc_deski_metry_biezace_mbd,
        _ilosc_deski_sztuki_dst,
        _ilosc_legar_metry_biezace_mbl,
        _ilosc_legar_sztuki_po_4m_lst,
        _ilosc_klips_srodkowy_ksr,
        _ilosc_klips_koncowy_kk,
        _ilosc_klips_poczatkowy_kst,
        _ilosc_listwa_4m_lls,
        _wydajnosc_z_deski,
        _powierzchnia_tarasu,
    ){
        this.ilosc_deski_metry_biezace_mbd = _ilosc_deski_metry_biezace_mbd;
        this.ilosc_deski_sztuki_dst = _ilosc_deski_sztuki_dst;
        this.ilosc_legar_metry_biezace_mbl = _ilosc_legar_metry_biezace_mbl;
        this.ilosc_legar_sztuki_po_4m_lst = _ilosc_legar_sztuki_po_4m_lst;
        this.ilosc_klips_srodkowy_ksr = _ilosc_klips_srodkowy_ksr;
        this.ilosc_klips_koncowy_kk = _ilosc_klips_koncowy_kk;
        this.ilosc_klips_poczatkowy_kst = _ilosc_klips_poczatkowy_kst;
        this.ilosc_listwa_4m_lls = _ilosc_listwa_4m_lls;
        this.wydajnosc_z_deski = _wydajnosc_z_deski > 1 ? 1 : _wydajnosc_z_deski;
        this.powierzchnia_tarasu = _powierzchnia_tarasu;
    }

    /**
     *
     * @returns {ReturnObj}
     */
    this.wynikWalidacjiWarunkow = function (){
        var ret = new ReturnObj();
        for(var i = 0; i <this._wynikiWeryfikacjiWarunkow.length; i++){
            if(!this._wynikiWeryfikacjiWarunkow[i].status){
                ret.status = false;
                ret.message += '- ' + this.globalne.pobierzTlumaczenie(this.globalne.tlumaczeniaZnajdzFrazeDlaTekstuPL(this._wynikiWeryfikacjiWarunkow[i].resultForFALSE));
            }
        }
        return ret;
    }
    this.dodajWynikWarunku = function (_val){
        if(_val == undefined || _val.status == undefined){
            throw Error ('Nie podano wyniku warunku lub nie uzyto poprawnej funkcji excelFunctions.ifWithStatus przy definicji warunku');
        }
        this._wynikiWeryfikacjiWarunkow.push(_val);
    }
}





/**
 *
 * @param {Taras} _taras
 */
function obliczZapotrzebowanieDlaTarasu(_taras) {
    var obl;
    var ret = new ReturnObj();
    var zapotrzebowanie;
    if(_taras.ksztaltObiekt.constructor.name == 'KsztaltProstokat'){
        obl = new obliczZapotrzebowanieDlaProstokat(_taras);
    }else if(_taras.ksztaltObiekt.constructor.name == 'KsztaltElka'){
        obl = new obliczZapotrzebowanieDlaKsztaltElka(_taras);
    }else if(_taras.ksztaltObiekt.constructor.name == 'KsztaltUtka'){
        obl = new obliczZapotrzebowanieDlaKsztaltUtka(_taras);
    } else if(_taras.ksztaltObiekt.constructor.name == 'KsztaltTetka'){
        obl = new obliczZapotrzebowanieDlaKsztaltTetka(_taras);
    } else {
        // dorobic dla innych ksztaltow
        ret.status = false;
        ret.message = 'brak obsługi algorytmu dla ksztaltu: ' + _taras.ksztaltObiekt.constructor.name ;
        return ret;
    }

    ret = obl.oblicz();

    return ret;
}

