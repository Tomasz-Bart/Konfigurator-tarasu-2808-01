/**
 *
 * @param {Globalne} _globalne
 * @constructor
 */
function App(_globalne) {

    this.globalne = _globalne;
    this.nazwa = "app";
    this.wysokoscOknoPodajDlugoscLinii = 0;
    jQuery('#oknoPodajDlugoscLinii').show();
    this.wysokoscOknoPodajDlugoscLinii = jQuery('#oknoPodajDlugoscLinii').height();
    this.szerokoscOknoPodajDlugoscLinii = jQuery('#oknoPodajDlugoscLinii').width();
    jQuery('#oknoPodajDlugoscLinii').hide();
    /**
     *
     * @type {Linia}
     */
    this.podswietlanaLinia = null;
    /**
     * linia do przesuwania dla urzadzen moblinych
     * przez event touchmove
     * @type {Linia}
     */
    this.liniaDoPrzesuwania = null;
    /**
     *
     * @type {InputFieldDlugosc}
     */
    this.aktywnePoleDlugosc = null;
    /**
     *
     * @type {InputFieldDlugosc}
     */
    this.podswietlanePoleDlugosc = null;
    /**
     *
     * @type {Taras}
     */
    this.taras = null;
    /**
     *
     * @type {Rysownik}
     */
    this.rysownik = null;
    this.zmienKrok = function (_krokNumer) {
        var walidacjaWlaczona = true;
        jQuery('#krok_' + this.globalne.aktywnyKrok + ' .walidacja_komunikat').hide();
        var walidacjWynik = this.waliduj();
        if (!walidacjaWlaczona) {
            walidacjWynik.status = true;
        }
        if (_krokNumer < this.globalne.aktywnyKrok || walidacjWynik.status) {
            jQuery('#krok_' + this.globalne.aktywnyKrok).toggle();
            this.globalne.aktywnyKrok = _krokNumer;
            this.ustawIndykatorKroku(this.globalne.aktywnyKrok);
            jQuery('#krok_' + this.globalne.aktywnyKrok).toggle();
            this.krokAktywnyAkcje();
        } else {
            var html = '';
            for (var prop in walidacjWynik.komunikat) {
                html += walidacjWynik.komunikat[prop] + '</br>';
            }
            jQuery('#krok_' + this.globalne.aktywnyKrok + ' .walidacja_komunikat_tresc').html(html);
            jQuery('#krok_' + this.globalne.aktywnyKrok + ' .walidacja_komunikat').show();
        }
        if (!walidacjaWlaczona) {
            jQuery('#krok_' + this.globalne.aktywnyKrok + ' .walidacja_komunikat_tresc').html("<p>Uwaga walidacja jest wyłączona</p>");
            jQuery('#krok_' + this.globalne.aktywnyKrok + ' .walidacja_komunikat').show();
        }

        jQuery("html, body").animate({scrollTop: 0}, "fast");
    };
    this.krokDalej = function () {
        if (this.globalne.aktywnyKrok < this.globalne.maksKrok) {
            this.zmienKrok(this.globalne.aktywnyKrok + 1)
        }
    };
    this.krokCofnij = function () {
        if (this.globalne.aktywnyKrok > 1) {
            this.zmienKrok(this.globalne.aktywnyKrok - 1)
        }
    };
    this.ustawIndykatorKroku = function (_krok) {
        jQuery('#konfigurator-krok-indykator > ul > li').removeClass('active');
        jQuery('#konfigurator-krok-indykator > ul > li').eq(_krok - 1).addClass('active');

    };
    this.krokAktywnyAkcje = function () {
        jQuery(document).ready(function () {
            if (window.zmienneGlobalne.aktywnyKrok > 1) {
                // skracam wysokość canvasu
                var maxY = 0;
                for (var prop in window.konfigurator.taras.ksztaltObiekt.wierzcholki) {
                    if (window.konfigurator.taras.ksztaltObiekt.wierzcholki[prop].y > maxY) {
                        maxY = window.konfigurator.taras.ksztaltObiekt.wierzcholki[prop].y;
                    }
                }
                //obliczam skrajny punkt na osi Y z uwzglednieniem pola input
                var canvasMaxY = Math.round(window.zmienneGlobalne.skalujDlaCanvasWartosc(maxY) + 10 + (window.zmienneGlobalne.wysokoscZnaku * 1.5));
                jQuery('#canvas_krok_' + window.zmienneGlobalne.aktywnyKrok).height(canvasMaxY)

            }
            if (window.zmienneGlobalne.aktywnyKrok === 1) {
                window.konfigurator.rysownik = new Rysownik('canvas_krok_1', window.zmienneGlobalne);
                if (!window.konfigurator.taras.ksztaltObiekt) {
                    window.konfigurator.taras.poleKsztaltUstaw('ksztalt_P');
                    window.zmienneGlobalne.ustawSkale(window.konfigurator.ustalSkale(window.konfigurator.rysownik.canvas.width, window.konfigurator.rysownik.canvas.height, window.konfigurator.rysownik.marginesWewnetrzynyCanvasu));
                }
                window.konfigurator.rysownik.rysujTaras(window.konfigurator.taras);

                //dzialania
                jQuery("#canvas_krok_1").bind('mousedown', function (e) {
                    window.konfigurator.handleMouseOnClick(e);
                    jQuery("#canvas_krok_1").mousemove(function (e) {
                        window.konfigurator.handleGrabMousemove(e);

                    });
                    jQuery('#canvas_krok_1').bind('mouseup', function () {
                        jQuery('#canvas_krok_1').unbind('mousemove');
                        jQuery("#canvas_krok_1").mousemove(function (e) {
                            window.konfigurator.handleMousemoveHighlight(e);
                        });

                    });
                });
                jQuery("#canvas_krok_1").bind('touchstart', function (e) {
                    window.konfigurator.handleMouseOnClick(e);
                    jQuery("#canvas_krok_1").bind('touchmove', function (e) {
                        window.konfigurator.handleGrabTouchmove(e);

                    });
                    jQuery('#canvas_krok_1').bind('touchend', function () {
                        jQuery('#canvas_krok_1').unbind('touchmove');
                        window.konfigurator.liniaDoPrzesuwania = null;

                    });


                });
                jQuery("#canvas_krok_1").mousemove(function (e) {
                    window.konfigurator.handleMousemoveHighlight(e);
                });

            } else if (window.zmienneGlobalne.aktywnyKrok === 2) {
                window.konfigurator.rysownik = new Rysownik('canvas_krok_2', window.zmienneGlobalne);
                window.konfigurator.rysownik.rysujTaras(window.konfigurator.taras);

                jQuery("#canvas_krok_2").bind('mousedown', function (e) {
                    window.konfigurator.handleMouseOnClick(e);
                });
                jQuery("#canvas_krok_2").mousemove(function (e) {
                    window.konfigurator.handleMousemoveHighlight(e);
                });
                jQuery("#canvas_krok_2").bind('touchstart', function (e) {
                    window.konfigurator.handleMouseOnClick(e);
                });
                // jQuery("#canvas_krok_2").bind('touchstart', function (e) {
                //     window.konfigurator.handleMousemoveHighlight(e);
                // });
            } else if (window.zmienneGlobalne.aktywnyKrok === 3) {
                window.konfigurator.rysownik = new Rysownik('canvas_krok_3', window.zmienneGlobalne);
                window.konfigurator.rysownik.rysujTaras(window.konfigurator.taras);
            } else if (window.zmienneGlobalne.aktywnyKrok === 6) {
                // Handle spacing restrictions for Natura 3D
                if (window.konfigurator.taras.deska.nazwa === 'HARTIKA_TARASE_NATURA_3D_140_mm') {
                    jQuery('input[name="deski_odstep"][value="3"]').parent().hide();
                    jQuery('input[name="deski_odstep"][value="5"]').prop('checked', true).trigger('change');
                } else {
                    jQuery('input[name="deski_odstep"]').parent().show();
                }
                window.konfigurator.rysownik = new Rysownik('canvas_krok_6', window.zmienneGlobalne);
                window.konfigurator.rysownik.rysujTaras(window.konfigurator.taras);
            } if (window.zmienneGlobalne.aktywnyKrok === 7) {
                window.konfigurator.rysownik = new Rysownik('canvas_krok_' + window.zmienneGlobalne.aktywnyKrok, window.zmienneGlobalne);
                window.konfigurator.rysownik.rysujTaras(window.konfigurator.taras);
                window.konfigurator.ustawPodsumowanieTarasu(window.konfigurator.taras);
            } else {
                window.konfigurator.rysownik = new Rysownik('canvas_krok_' + window.zmienneGlobalne.aktywnyKrok, window.zmienneGlobalne);
                window.konfigurator.rysownik.rysujTaras(window.konfigurator.taras);
            }
        });
    };
    /**
     *
     * @param {Taras} _taras
     */
    this.waluta = function (countryFlag) {
        if(countryFlag == "pl-PL"){
            return "zł"
        } else{
            return "eur"
        }
    }
    this.ustawPodsumowanieTarasu = function (_taras) {
        /**
         *
         * @type {ReturnObj}
         */
        var podsumowanieRS = _taras.pobierzPodsumowanie();
        if(podsumowanieRS.status) {

            /** {} */
            var podsumowanie = podsumowanieRS.value;
            jQuery('#nazwa_tarasu').html(podsumowanie.konfiguracja.Nazwa.label );
            jQuery('#powierzchnia_tarasu').html(podsumowanie.konfiguracja.Powierzchnia.label);
            this.globalne.log('Taras podsumowanie', podsumowanie);           
var html = '<table id="podsumowanie_glowne" class="tabela_podsumowanie">' +
    '    <tr> <td>'+podsumowanie.konfiguracja.Deska.label +'</td></tr>' +
    '    <tr> <td>'+podsumowanie.konfiguracja.Legar.label +'</td></tr>' +
    '    <tr> <td>'+podsumowanie.konfiguracja.Klips_srodkowy.label +'</td></tr>' +
    '    <tr> <td>'+podsumowanie.konfiguracja.Listwa_maskujaca.label +'</td></tr>' +
    '    <tr> <td>'+podsumowanie.konfiguracja.Ulozenie.label +'</td></tr>' +
    '    <tr> <td>'+podsumowanie.konfiguracja.Deska_wydajnosc.label +'</td></tr>' +

    '</table>' +
    '<table id="podsumowanie_elementy" class="tabela_podsumowanie">' +
    '    <thead>' +
    '        <tr> <th>'+this.globalne.pobierzTlumaczenie('SYSTEM_HARTIKA_TARASE') +'</th><th><strong>'+this.globalne.pobierzTlumaczenie('Ilosc') +'</strong></th><th><strong>'+this.globalne.pobierzTlumaczenie('Cena') +'</strong></th></tr>' +
    '    </thead>' +
    '    <tbody>' +
    '   <tr> <td>'+podsumowanie.konfiguracja.Deska.label +'</td><td>'+podsumowanie.konfiguracja.Deska.value +'</td><td>'+ podsumowanie.konfiguracja.Deska.price +'</td></tr>' +
    '   <tr> <td>'+podsumowanie.konfiguracja.Legar.label +'</td><td>'+podsumowanie.konfiguracja.Legar.value +'</td><td>'+ podsumowanie.konfiguracja.Legar.price +'</td></tr>' +
    '   <tr> <td>'+podsumowanie.konfiguracja.Listwa_maskujaca.label +'</td><td>'+podsumowanie.konfiguracja.Listwa_maskujaca.value +'</td><td>'+ podsumowanie.konfiguracja.Listwa_maskujaca.price +'</td></tr>' +
    '   <tr> <td>'+podsumowanie.konfiguracja.Klips_srodkowy.label +'</td><td>'+podsumowanie.konfiguracja.Klips_srodkowy.value +'</td><td>'+ podsumowanie.konfiguracja.Klips_srodkowy.price +'</td></tr>' +
    '   <tr> <td>'+podsumowanie.konfiguracja.Klips_koncowy.label +'</td><td>'+podsumowanie.konfiguracja.Klips_koncowy.value +'</td><td>'+ podsumowanie.konfiguracja.Klips_koncowy.price +'</td></tr>' +
    '   <tr> <td>'+podsumowanie.konfiguracja.Klips_startowy.label +'</td><td>'+podsumowanie.konfiguracja.Klips_startowy.value +'</td><td>'+ podsumowanie.konfiguracja.Klips_startowy.price +'</td></tr>' +
    '   <tr style="border-top: 1px solid black;"> <td></td><td></td><td>'+ podsumowanie.konfiguracja.cenaCalkowita +'</td></tr>' +
    '</tbody>' +
    '</table>' +
    '<p class="price_annotation">' + podsumowanie.konfiguracja.cenaAdnotacja + '</p>' +
'<p>' + this.globalne.pobierzTlumaczenie("podsumowanie_uwaga") + '</p>';

            jQuery('#podsumowanie_konfiguracja').html(html);


        } else {
            this.globalne.log('podsumowanieRS', podsumowanieRS);
            //wyswietla komunika bledu dla warunkow
            var sciezka_do_plikow = this.globalne.pobierzTlumaczenie('sciezka_do_plikow');
            html = '<div class="walidacja_komunikat" style="display: block;">' +
                '    <table>' +
                '        <tr><td><img src="'+ sciezka_do_plikow + '/images/wykrzyknik.png" alt="alert"></td><td><p class="walidacja_komunikat_tresc">' + podsumowanieRS.message + '</p></td></tr>' +
                '    </table>' +
                '</div>';
            jQuery('#podsumowanie_konfiguracja').html(html);
        }
    };
    this.wartoscZostalaZmieniona = function (_el) {
        this.taras.ustawWartosc(_el.name, _el.value, _el.kodTechniczny);
        var przerysujTarasDlaPolaArr = ['ksztalt', 'kierunek_ulozenia', 'sposob_ulozenia', 'deska', 'deski_dlugosc', 'deska_kolor', 'deski_odstep'];
        if (_el.name == 'ksztalt') {
            this.rysownik = new Rysownik('canvas_krok_1', this.globalne);
            this.globalne.ustawSkale(this.ustalSkale(this.rysownik.canvas.width, this.rysownik.canvas.height, this.rysownik.marginesWewnetrzynyCanvasu));

            this.rysownik.konfigurujInputFields(this.taras);
            this.rysownik.konfigurujOznaczenieKrawedzi(this.taras);

        } else if (_el.name == 'rodzaj_legara' && _el.value === 'Legar_maly') {
            jQuery('.ulozenie_legara_maly_container').show();
            jQuery('.ulozenie_legara_duzy_container').hide();
        } else if (_el.name == 'rodzaj_legara' && _el.value === 'Legar_duzy') {
            jQuery('.ulozenie_legara_maly_container').hide();
            jQuery('.ulozenie_legara_duzy_container').show();
        } else if (_el.name == 'deska') {
            var deska_kontenerSelector = '#deska_kontener_' + this.taras.deska.nazwa;
            jQuery(".drop").unbind('click');

            jQuery('#krok_5').find('ul.kolorMenu > li').removeClass('drop').addClass('disabled');
            jQuery('#krok_5 ' + deska_kontenerSelector).find('ul.kolorMenu > li').removeClass('disabled').addClass('drop');
            jQuery(".drop")
                .click(function () {
                    jQuery(this).children("ul").toggle();
                });
            this.taras.ustawWartosc('deska_kolor', jQuery(deska_kontenerSelector).data('deska_kolor'), jQuery(deska_kontenerSelector).data('kodTechniczny'));
            /* this.ustawKolorListwyWPC(); */
            
            // Update height messages for Natura 3D (22mm instead of 25mm)
            if(this.taras.deska.nazwa == 'HARTIKA_TARASE_NATURA_3D_140_mm'){
                jQuery('.ulozenie_legara_maly_container span').html('Wysokość deski wraz z legarem, będzie wynosiła <strong>20 mm + 22 mm</strong>');
                jQuery('input[name="ulozenie_legara_duzy"][value="poziome"]').next().text('38 mm + 22 mm');
                jQuery('input[name="ulozenie_legara_duzy"][value="pionowe"]').next().text('48 mm + 22 mm');
            } else {
                // Reset to default 25mm messages
                jQuery('.ulozenie_legara_maly_container span').html(this.globalne.tlumaczenia['Wybierz_rodzaj_legara_maly_komunikat']);
                jQuery('input[name="ulozenie_legara_duzy"][value="poziome"]').next().text(this.globalne.tlumaczenia['ulozenie_legara_duzy_poziome']);
                jQuery('input[name="ulozenie_legara_duzy"][value="pionowe"]').next().text(this.globalne.tlumaczenia['ulozenie_legara_duzy_pionowe']);
            }
            
            if(this.taras.deska.nazwa == 'HARTIKA_TARASE_PRO_210_mm'){
                jQuery("#deski_dlugosc_4000 > input").click();
                jQuery("#deski_dlugosc_3000").hide();
				jQuery("#deski_dlugosc_6000").hide(); }
			else if (this.taras.deska.nazwa == 'HARTIKA_TARASE_LIGNO'){
                jQuery("#deski_dlugosc_4000 > input").click();
                jQuery("#deski_dlugosc_3000").hide();
                jQuery("#deski_dlugosc_6000").hide();
            }
            else if (this.taras.deska.nazwa == 'HARTIKA_TARASE_NATURA_3D_140_mm'){
                jQuery("#deski_dlugosc_3000 > input").click();
                jQuery("#deski_dlugosc_3000").show();
                jQuery("#deski_dlugosc_4000").show();
                jQuery("#deski_dlugosc_6000").hide();
            }
			else {
                jQuery(".deski_dlugosc_input").show();
            }
        } else if (_el.name == 'deska_kolor') {
            var deska_kontenerSelector = '#deska_kontener_' + this.taras.deska.nazwa;
            jQuery(deska_kontenerSelector).data('deska_kolor', _el.value);
            jQuery(deska_kontenerSelector).data('kodTechniczny', _el.kodTechniczny);
            jQuery('#krok_5 ' + deska_kontenerSelector).find('.przyciskWybierzKolor span').text(_el.nazwa);
            jQuery('#krok_5 ' + deska_kontenerSelector).find('.przyciskWybierzKolor img').attr('src', this.globalne.tlumaczenia.sciezka_do_plikow + '/images/' + _el.kolorPlik);
            jQuery('#krok_5 ' + deska_kontenerSelector).find('.deska_zdjecie').removeClass('active');
            jQuery('#krok_5 ' + deska_kontenerSelector).find('.deska_zdjecie' + '.' + this.taras.deska.kolor).addClass('active');
            /* this.ustawKolorListwyWPC(); */
/*             this.taras.ustawWartosc(this.taras.listwa_maskujaca, jQuery(listwa_kontenerSelector).data('listwa_maskujaca_kolor'), jQuery(listwa_kontenerSelector).data('kodTechniczny')); */
        } else if (_el.name == 'listwa_maskujaca') {
            var listwa_kontenerSelector = '#' + this.taras.listwa_maskujaca.typ + '_kontener';
            jQuery(".drop").unbind('click');

            jQuery('#krok_6').find('ul.kolorMenu > li').removeClass('drop').addClass('disabled');
            jQuery('#krok_6 ' + listwa_kontenerSelector).find('ul.kolorMenu > li').removeClass('disabled').addClass('drop');
            jQuery(".drop")
                .click(function () {
                    jQuery(this).children("ul").toggle();
                });
            this.taras.ustawWartosc('listwa_maskujaca_kolor', jQuery(listwa_kontenerSelector).data('listwa_maskujaca_kolor'), jQuery(listwa_kontenerSelector).data('kodTechniczny'));

        } else if (_el.name == 'listwa_maskujaca_kolor') {
           var listwa_kontenerSelector = '#' + this.taras.listwa_maskujaca.typ + '_kontener';
            jQuery(listwa_kontenerSelector).data('listwa_maskujaca_kolor', _el.value);
            jQuery(listwa_kontenerSelector).data('kodTechniczny', _el.kodTechniczny);

             jQuery('#krok_6 ' + listwa_kontenerSelector).find('.przyciskWybierzKolor span').text(_el.nazwa);
            jQuery('#krok_6 ' + listwa_kontenerSelector).find('.przyciskWybierzKolor img').attr('src', this.globalne.tlumaczenia.sciezka_do_plikow + '/images/' + _el.kolorPlik);
            jQuery('#krok_6 ' + listwa_kontenerSelector).find('.deska_zdjecie').removeClass('active');
            jQuery('#krok_6 ' + listwa_kontenerSelector).find('.deska_zdjecie' + '.' + this.taras.listwa_maskujaca.kolor).addClass('active');
        } else if (_el.name == 'deski_odstep') {
            this.taras.ustawWartosc(_el.name, _el.value, _el.kodTechniczny);

        }

        if (przerysujTarasDlaPolaArr.indexOf(_el.name) !== -1) {
            this.rysownik.rysujTaras(this.taras);
        }

    };


    this.ustawKolorListwyWPC = function () {
        var listwa_kontenerSelector = '#listwa_maskujaca_wpc_kontener';
        jQuery(listwa_kontenerSelector).data('listwa_maskujaca_kolor', this.taras.deska.kolor);

        jQuery('#krok_6 ' + listwa_kontenerSelector).find('.przyciskWybierzKolor span').text(this.globalne.tlumaczenia[this.taras.deska.kolor]);
        jQuery('#krok_6 ' + listwa_kontenerSelector).find('.przyciskWybierzKolor img').attr('src', this.globalne.tlumaczenia.sciezka_do_plikow + '/images/kolor-' + this.taras.deska.kolor + '.png');
        jQuery('#krok_6 ' + listwa_kontenerSelector).find('.deska_zdjecie').removeClass('active');
        jQuery('#krok_6 ' + listwa_kontenerSelector).find('.deska_zdjecie' + '.' + this.taras.deska.kolor).addClass('active');
        if (this.taras.listwa_maskujaca.typ == 'listwa_maskujaca_wpc') {
            this.taras.listwa_maskujaca_kolor = this.taras.deska.kolor;
        }
    };
    this.ustalPozycjeKursoraDlaCanvasa = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    };

    /**
     *
     * @param {Linia} _linia
     * @param mX
     * @param mY
     * @param _tolerance
     */
    this.sprawdzCzyJestLinia = function (_linia, mX, mY, _tolerance) {
        _linia.ustalStrefeAktywna(_tolerancja);
        _lini.sprawdzCzyKursorJestWStrefieAktywnej(mX, mY);
    };
    /**
     *
     * @param {Linia} _linia
     * @param _obszarDozowolony
     * @returns {*}
     */
    this.wykryjCzyPrzekraczaDopuszczalnyObszar = function (_linia, _obszarDozowolony) {
        // console.log('_obszarDozowolony', _obszarDozowolony);
        if (
            !(_linia.poczatek.x.between(_obszarDozowolony.minX, _obszarDozowolony.maxX, true)
                && _linia.poczatek.y.between(_obszarDozowolony.minY, _obszarDozowolony.maxY, true)
                && _linia.koniec.x.between(_obszarDozowolony.minX, _obszarDozowolony.maxX, true)
                && _linia.koniec.y.between(_obszarDozowolony.minY, _obszarDozowolony.maxY, true))
        ) {
            if (_linia.orientacja == 'pozioma') {
                //ustalam do której krawędzi dozwolonego obszaru zbliżył się rysunek
                var deltaGornaGranica = Math.abs(_obszarDozowolony.minY - _linia.koniec.y);
                var deltaDolnaGranica = Math.abs(_obszarDozowolony.maxY - _linia.koniec.y);
                // console.log('deltaGornaGranica=' + deltaGornaGranica + ' deltaDolnaGranica = '+deltaDolnaGranica);
                if (deltaGornaGranica < deltaDolnaGranica) {
                    _linia.poczatek.y = _obszarDozowolony.minY;
                    _linia.koniec.y = _obszarDozowolony.minY;
                } else if (deltaDolnaGranica < deltaGornaGranica) {
                    _linia.poczatek.y = _obszarDozowolony.maxY;
                    _linia.koniec.y = _obszarDozowolony.maxY;
                }
            } else if (_linia.orientacja == 'pionowa') {
                var deltaLewaGranica = Math.abs(_obszarDozowolony.minX - _linia.koniec.x);
                var deltaPrawaGranica = Math.abs(_obszarDozowolony.maxX - _linia.koniec.x);
                // console.log('deltaLewaGranica=' + deltaLewaGranica + ' deltaPrawaGranica = '+deltaPrawaGranica);
                if (deltaLewaGranica < deltaPrawaGranica) {
                    _linia.poczatek.x = _obszarDozowolony.minX;
                    _linia.koniec.x = _obszarDozowolony.minX;
                } else if (deltaPrawaGranica < deltaLewaGranica) {
                    _linia.poczatek.x = _obszarDozowolony.maxX;
                    _linia.koniec.x = _obszarDozowolony.maxX;
                }
            }
        }
        return _linia;
    };
    // wykrywanie i przesuwanie lini za pomoca myszki
    this.handleGrabMousemove = function (e) {
        var pozycjaKursora = this.ustalPozycjeKursoraDlaCanvasa(this.rysownik.canvas, e);
        var tolerancja = 15 * 1 / this.globalne.skala;
        e.preventDefault();
        e.stopPropagation();
        mouseX = parseInt(pozycjaKursora.x);
        mouseY = parseInt(pozycjaKursora.y);
        /**
         * @type {Linia}
         */
        var liniaDoPodswietlenia = null;
        for (var property in this.taras.ksztaltObiekt.linie) {
            var linia = this.taras.ksztaltObiekt.linie[property];
            if (linia.sprawdzCzyKursorJestWStrefieAktywnej(mouseX, mouseY, tolerancja)) {
                liniaDoPodswietlenia = linia;
                this.podswietlanaLinia = linia;
                break;
            } else {
                liniaDoPodswietlenia = null;
                this.podswietlanaLinia = null;

            }
        }
        if (liniaDoPodswietlenia) {
            var wartoscPrzesuniecia = 0;
            //inside
            if (liniaDoPodswietlenia.orientacja == 'pozioma') {
                wartoscPrzesuniecia = mouseY - this.globalne.skalujDlaCanvasWartosc(liniaDoPodswietlenia.poczatek.y);
                liniaDoPodswietlenia.poczatek.y += wartoscPrzesuniecia / this.globalne.skala;
                liniaDoPodswietlenia.koniec.y += wartoscPrzesuniecia / this.globalne.skala;
            } else if (liniaDoPodswietlenia.orientacja == 'pionowa') {
                wartoscPrzesuniecia = mouseX - this.globalne.skalujDlaCanvasWartosc(liniaDoPodswietlenia.poczatek.x);
                liniaDoPodswietlenia.poczatek.x += wartoscPrzesuniecia / this.globalne.skala;
                liniaDoPodswietlenia.koniec.x += wartoscPrzesuniecia / this.globalne.skala;
            }
            this.wykryjCzyPrzekraczaDopuszczalnyObszar(liniaDoPodswietlenia, this.rysownik.ustalObszarNaRysunekTarasu());
            this.taras.ksztaltObiekt.liniaJestPrzesuwana(liniaDoPodswietlenia, wartoscPrzesuniecia / this.globalne.skala);
            this.taras.obliczPowierzchnie();
            this.rysownik.rysujTaras(this.taras);
            // this.rysownik.rysujTekst(10, 10, 'mX= ' + mouseX + 'mY= ' + mouseY );
            this.rysownik.podswietlLinie(linia);
        }
    };
    // przesuwanie linii na urzadzeniach mobilnych
    this.handleGrabTouchmove = function (e) {
        var touch = e.originalEvent.touches[0];
        var pozycjaKursora = this.ustalPozycjeKursoraDlaCanvasa(this.rysownik.canvas, touch);
        var tolerancja = 15 * 1 / this.globalne.skala;
        // console.log('pozycjaKursora', pozycjaKursora);

        mouseX = parseInt(pozycjaKursora.x);
        mouseY = parseInt(pozycjaKursora.y);

        if (this.liniaDoPrzesuwania) {
            e.preventDefault();
            e.stopPropagation();
            var wartoscPrzesuniecia = 0;
            //inside
            if (this.liniaDoPrzesuwania.orientacja == 'pozioma') {
                wartoscPrzesuniecia = mouseY - this.globalne.skalujDlaCanvasWartosc(this.liniaDoPrzesuwania.poczatek.y);
                this.liniaDoPrzesuwania.poczatek.y += wartoscPrzesuniecia / this.globalne.skala;
                this.liniaDoPrzesuwania.koniec.y += wartoscPrzesuniecia / this.globalne.skala;
            } else if (this.liniaDoPrzesuwania.orientacja == 'pionowa') {
                wartoscPrzesuniecia = mouseX - this.globalne.skalujDlaCanvasWartosc(this.liniaDoPrzesuwania.poczatek.x);
                this.liniaDoPrzesuwania.poczatek.x += wartoscPrzesuniecia / this.globalne.skala;
                this.liniaDoPrzesuwania.koniec.x += wartoscPrzesuniecia / this.globalne.skala;
            }
            this.wykryjCzyPrzekraczaDopuszczalnyObszar(this.liniaDoPrzesuwania, this.rysownik.ustalObszarNaRysunekTarasu());
            this.taras.ksztaltObiekt.liniaJestPrzesuwana(this.liniaDoPrzesuwania, wartoscPrzesuniecia / this.globalne.skala);
            this.taras.obliczPowierzchnie();
            this.rysownik.rysujTaras(this.taras);
            // this.rysownik.rysujTekst(10, 10, 'mX= ' + mouseX + 'mY= ' + mouseY );
            this.rysownik.podswietlLinie(this.liniaDoPrzesuwania);
        }
    };
    this.handleMousemoveHighlight = function (e) {
        var offset = jQuery('#' + this.rysownik.canvasId).offset();
        var pozycjaKursora = this.ustalPozycjeKursoraDlaCanvasa(this.rysownik.canvas, e);
        var tolerancja = 10 * 1 / this.globalne.skala;
        e.preventDefault();
        e.stopPropagation();
        mouseX = parseInt(pozycjaKursora.x);
        mouseY = parseInt(pozycjaKursora.y);
// console.log('e.clientX = '+e.clientX + 'e.clientY = '+e.clientY + ', mouseX = '+mouseX+' mouseY = '+mouseY)
        var liniaDoPodswietlenia = null;
        for (var property in this.taras.ksztaltObiekt.linie) {
            var linia = this.taras.ksztaltObiekt.linie[property];
// console.log(property + ' = linia.sprawdzCzyKursorJestWStrefieAktywnej(mouseX, mouseY, tolerance)', linia.sprawdzCzyKursorJestWStrefieAktywnej(mouseX, mouseY, tolerance))
            if (linia.sprawdzCzyKursorJestWStrefieAktywnej(mouseX, mouseY, tolerancja)) {
                liniaDoPodswietlenia = linia;
                this.podswietlanaLinia = linia;
                break;
            } else {
                liniaDoPodswietlenia = null;
                this.podswietlanaLinia = null;
            }
        }
        var pola = this.rysownik.konfigurujInputFields(this.taras);
        var poleDoPodswietlenia = null;
        if (this.globalne.aktywnyKrok === 1) {
            for (var property in pola) {
                var pole = pola[property];
                if (pole.sprawdzCzyKursorJestWStrefieAktywnej(mouseX, mouseY)) {
                    poleDoPodswietlenia = pole;
                    this.podswietlanePoleDlugosc = pole;
                    break;
                } else {
                    poleDoPodswietlenia = null;
                    this.podswietlanePoleDlugosc = null;
                }
            }
        }
        // console.log('liniaDoPodswietlenia', liniaDoPodswietlenia);
        if (liniaDoPodswietlenia || poleDoPodswietlenia) {
            //inside
            this.rysownik.rysujTaras(this.taras);
            // this.rysownik.rysujTekst(10, 10, 'mX= ' + mouseX + 'mY= ' + mouseY );
            liniaDoPodswietlenia ? this.rysownik.podswietlLinie(linia) : null;
            poleDoPodswietlenia ? this.rysownik.podswietlPole(pole) : null;
        } else {
            this.rysownik.rysujTaras(this.taras);
            // this.rysownik.rysujTekst(10, 10, 'mX= ' + mouseX + 'mY= ' + mouseY );
        }
    };
    this.ustalSkale = function (_canvasSzerokosc, _canvasWysokosc, _marginesWewnetrzynyCanvasu) {
        // console.log('ustalSkale szer, wys, marg' + _canvasSzerokosc, _canvasWysokosc, _marginesWewnetrzynyCanvasu);
        var skala = 1;
        var wymiary = this.taras.ksztaltObiekt.wymiary();
        if (wymiary.wysokosc >= wymiary.szerokosc) {
            skala = (_canvasWysokosc - _marginesWewnetrzynyCanvasu * 2) / wymiary.wysokosc;
        } else {
            skala = (_canvasSzerokosc - _marginesWewnetrzynyCanvasu * 2) / wymiary.szerokosc;
        }

        return skala;
    };
    this.handleMouseOnClick = function (e) {
        e.stopPropagation();
        if (this.podswietlanePoleDlugosc) {
            this.aktywnePoleDlugosc = this.rysownik.inputFields[this.podswietlanePoleDlugosc.linia.symbol];
            var mX = e.pageX;
            var mY = e.pageY;
            var y = mY - (this.wysokoscOknoPodajDlugoscLinii * 1.4);
            mX = mX - parseInt(jQuery('.polestar-container').css('margin-left'));
            this.pokazOknoPodajDlugoscLinii(mX + 30, y, this.aktywnePoleDlugosc.wartosc);
            this.globalne.log('(mX, mY) = ' + mX + ', ' + mY +' , this.aktywnePoleDlugosc = ', this.aktywnePoleDlugosc);
        } else {
            this.zamknijOknoPodajDlugoscLinii();
        }
        if (this.globalne.aktywnyKrok == 1 && this.podswietlanaLinia) {
            this.liniaDoPrzesuwania = this.taras.ksztaltObiekt.linie[this.podswietlanaLinia.symbol];
        }
        if (this.globalne.aktywnyKrok == 2 && this.podswietlanaLinia) {
            this.taras.liniaStykuDom = this.podswietlanaLinia;
            this.rysownik.rysujTaras(this.taras);
        }
    };
    this.zatwierdzDlugoscLinii = function () {
        //wartosci podawane sa w metrach, aplikacja wewnętrznie korzysta z cm
        var dlugosc = Math.abs(jQuery('#inputDlugoscLinii').val()) * 100;
        this.taras.ksztaltObiekt.ustawDlugoscLinii(
            this.aktywnePoleDlugosc.linia,
            dlugosc,
            true);
        this.zamknijOknoPodajDlugoscLinii();
        var czySkalaZmieniona = this.globalne.ustawSkale(this.ustalSkale(this.rysownik.canvas.width, this.rysownik.canvas.height, this.rysownik.marginesWewnetrzynyCanvasu));
        if (czySkalaZmieniona) {
            this.taras.przesunDoPoczatkuUklad();
        }
        this.rysownik.rysujTaras(this.taras);
    };
    this.zamknijOknoPodajDlugoscLinii = function () {
        jQuery('#oknoPodajDlugoscLinii').hide();
        jQuery('#inputDlugoscLinii').val(0);
        this.aktywnePoleDlugosc = null;
    };
    this.pokazOknoPodajDlugoscLinii = function (_x, _y, _wartosc) {
        var x = _x;
        if (jQuery(window).width() < 780) {
            x = (jQuery(window).width() - this.szerokoscOknoPodajDlugoscLinii) / 2;
            // console.log('width - window: ' + jQuery(window).width() + ', x: ' + x + ', this.szerokoscOknoPodajDlugoscLinii: ' + this.szerokoscOknoPodajDlugoscLinii);
        }

        jQuery('#oknoPodajDlugoscLinii')
            .css({'top': _y, 'left': x, 'position': 'absolute'})
            .show("fast", function () {
                _wartosc = _wartosc /100 ;
                jQuery('#inputDlugoscLinii').val(_wartosc.toFixed(2));
                jQuery('#inputDlugoscLinii').focus().select();
            });

    };
    this.generujPDF = function () {
        this.rysownik.rysujTaras(this.taras, false)
        jQuery('#obraz_tarasu').val(this.rysownik.pobierzCanvasJakoObrazek());
       var rs = this.taras.pobierzPodsumowanie();
        if(rs.status == false){
            console.log('Error - ', rs.message)
        } else {
            jQuery('#podsumowanie').val(JSON.stringify(rs.value));
            jQuery('#konfigurator_form').submit();
        }

    };
    this.waliduj = function () {
        var ret = {status: false, komunikat: [this.globalne.tlumaczenia['walidacja_tekst_podstawowy']]};
        if (this.globalne.aktywnyKrok < this.globalne.maksKrok) {
            for (var i = 1; i <= this.globalne.aktywnyKrok; i++) {
                var wynikWalidacji = this['walidacja_krok_' + i]();
                if (!wynikWalidacji.status) {
                    ret.komunikat = ret.komunikat.concat(wynikWalidacji.komunikat);
                }
            }
        }
        if (ret.komunikat.length === 1) {
            ret.status = true;
        }
        return ret;
    };
    this.walidacja_krok_1 = function () {
        var ret = {status: false, komunikat: []};
        if (this.taras.nazwa) {
            ret.status = true;
        } else {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wprowadz_nazwe_tarasu']);
        }
        return ret;
    };
    this.walidacja_krok_2 = function () {
        var ret = {status: false, komunikat: []};
        if (this.taras.liniaStykuDom) {
            ret.status = true;
        } else {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_linie_styku']);
        }
        return ret;
    };
    this.walidacja_krok_3 = function () {
        var ret = {status: false, komunikat: []};
        if (this.taras.kierunek_ulozenia) {
            ret.status = true;
        } else {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_kierunek_ulozenia_desek']);
        }
        return ret;
    };
    this.walidacja_krok_4 = function () {
        var ret = {status: false, komunikat: []};
        if (this.taras.sposob_ulozenia) {
            ret.status = true;
        } else {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_sposob_ulozenia_desek']);
        }
        return ret;
    };
    this.walidacja_krok_5 = function () {
        var ret = {status: false, komunikat: []};
        if (!this.taras.deska.nazwa) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_rodzaj_deski']);
        }
        if (!this.taras.deska.kolor) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_kolor_deski']);
        }
        if (!this.taras.rodzaj_legara) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_rodzaj_legara']);
        }
        if (this.taras.rodzaj_legara && this.taras.rodzaj_legara == 'Legar_duzy' && !this.taras.ulozenie_legara_duzy) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_ulozenie_legara']);
        }
        if (ret.komunikat.length === 0) {
            ret.status = true;
        }
        return ret;
    };

    this.walidacja_krok_6 = function () {
        var ret = {status: false, komunikat: []};

        if (!this.taras.deska.dlugosc) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_dlugosc_deski']);
        }
        if (!this.taras.deski_odstep) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_odstep_miedzy_deskami']);
        }
        if (!this.taras.listwa_maskujaca) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_listwe_maskujaca']);
        }
        if (!this.taras.listwa_maskujaca_kolor) {
            ret.komunikat.push(this.globalne.tlumaczenia['walidacja_tekst_wybierz_kolor_listwy_maskujacej']);
        }
        if (ret.komunikat.length === 0) {
            ret.status = true;
        }
        return ret;

    }
}