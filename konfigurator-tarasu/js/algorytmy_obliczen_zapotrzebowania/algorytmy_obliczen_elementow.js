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
    // NOWE: Natura 3D - przechowywanie szczegółów
    this.natura3d = {
        ilosc_deski_metry_biezace_mbd: 0,
        ilosc_deski_sztuki_dst: 0,
        ilosc_klips_srodkowy_ksr: 0,
        ilosc_klips_poczatkowy_kst: 0,
        ilosc_listwa_4m_lls: 0,
        kolor: null,
        kod_deski: null,
        kod_listwy: null
    };

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
        _powierzchnia_tarasu
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

    // NOWE: setup dla Natura 3D
    this.setupNatura3D = function(
        _ilosc_deski_metry_biezace_mbd,
        _ilosc_deski_sztuki_dst,
        _ilosc_klips_srodkowy_ksr,
        _ilosc_klips_poczatkowy_kst,
        _ilosc_listwa_4m_lls,
        _kolor,
        _kod_deski,
        _kod_listwy
    ){
        this.natura3d.ilosc_deski_metry_biezace_mbd = _ilosc_deski_metry_biezace_mbd;
        this.natura3d.ilosc_deski_sztuki_dst = _ilosc_deski_sztuki_dst;
        this.natura3d.ilosc_klips_srodkowy_ksr = _ilosc_klips_srodkowy_ksr;
        this.natura3d.ilosc_klips_poczatkowy_kst = _ilosc_klips_poczatkowy_kst;
        this.natura3d.ilosc_listwa_4m_lls = _ilosc_listwa_4m_lls;
        this.natura3d.kolor = _kolor;
        this.natura3d.kod_deski = _kod_deski;
        this.natura3d.kod_listwy = _kod_listwy;
    };

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

    // NOWE: obsługa Natura 3D
    if(_taras.deska && _taras.deska.typ === 'NATURA_3D') {
        // Przykładowe uproszczone obliczenia dla Natura 3D (w praktyce wywołanie dedykowanego algorytmu!)
        var podsumowanie = new PodsumowanieElementowTarasu();
        // Przyjmijmy, że algorytm obliczeń dla Natura 3D jest analogiczny do prostokąta, ale z innymi klipsami/listwami
        var mbd = Math.ceil(_taras.powierzchnia / ((_taras.deska.szerokosc/1000) * (_taras.deska.dlugosc/1000)));
        var dst = Math.ceil(mbd / (_taras.deska.dlugosc/1000));
        var ksr = dst * 10; // przykładowo: 10 klipsów środkowych na deskę
        var kst = 2; // startowe
        var lls = Math.ceil(_taras.ksztaltObiekt.obwod() / 4); // listwa 4m
        var kolor = _taras.deska.kolor;
        var kod_deski = _taras.deska.kodTechniczny;
        var kod_listwy = _taras.listwa_maskujaca ? _taras.listwa_maskujaca.kodTechniczny : '';
        podsumowanie.setupNatura3D(mbd, dst, ksr, kst, lls, kolor, kod_deski, kod_listwy);
        ret.status = true;
        ret.value = podsumowanie;
        return ret;
    }

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
