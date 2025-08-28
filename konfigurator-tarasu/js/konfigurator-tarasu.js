var pathJsFiles = '/wp-content/themes/polestar-child/konfigurator-tarasu/js/';
var url = "https://code.jquery.com/color/jquery.color.js";
jQuery.getScript( pathJsFiles + 'globalne.js', function() {
    window.zmienneGlobalne = new Globalne();
    window.zmienneGlobalne.pathJsFiles = pathJsFiles;
    jQuery.getScript( pathJsFiles + 'ceny.js', function() {
        window.zmienneGlobalne.ceny = new Ceny().ceny;
        jQuery.getScript( pathJsFiles + 'taras.js', function() {
            jQuery.getScript( pathJsFiles + 'linia.js', function() {
                jQuery.getScript( pathJsFiles + 'rysownik.js', function() {
                jQuery.getScript( pathJsFiles + 'inputField.js', function() {
                    jQuery.getScript( pathJsFiles + 'excel_functions.js', function() {
                    jQuery.getScript( pathJsFiles + 'algorytmy_obliczen_zapotrzebowania/algorytmy_obliczen_elementow.js', function() {
                        jQuery.getScript(pathJsFiles + 'app.js', function () {
                            main();
                        });
                    });
                });
                });
                });
                });
        });
    });    
});

/**
 * operations to execute when all js files are loaded
 */
function main(){

    window.zmienneGlobalne.tlumaczenia = window.tlumaczenia;
    window.konfigurator = new App(window.zmienneGlobalne);
    window.konfigurator.taras = new Taras();
    window.konfigurator.rysownik = new Rysownik('canvas_krok_1', window.zmienneGlobalne);

    //konfiguracja domyslna desek i listew
    jQuery('#deska_kontener_HARTIKA_TARASE_HOME_145_mm').data('deska_kolor', window.zmienneGlobalne.kolor_deski_domyslny);
    jQuery('#deska_kontener_HARTIKA_TARASE_HOME_145_mm').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.deski['145'][window.zmienneGlobalne.kolor_deski_domyslny]['HARTIKA_TARASE_HOME_145_mm']);
    jQuery('#deska_kontener_HARTIKA_TARASE_BASE').data('deska_kolor', window.zmienneGlobalne.kolor_deski_domyslny);
    jQuery('#deska_kontener_HARTIKA_TARASE_BASE').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.deski['145'][window.zmienneGlobalne.kolor_deski_domyslny]['HARTIKA_TARASE_BASE']);
    jQuery('#deska_kontener_HARTIKA_TARASE_LIGNO').data('deska_kolor', window.zmienneGlobalne.kolor_deski_domyslny);
    jQuery('#deska_kontener_HARTIKA_TARASE_LIGNO').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.deski['145'][window.zmienneGlobalne.kolor_deski_domyslny]['HARTIKA_TARASE_LIGNO']);
    jQuery('#deska_kontener_HARTIKA_TARASE_KLASS_160_mm').data('deska_kolor', window.zmienneGlobalne.kolor_deski_domyslny);
    jQuery('#deska_kontener_HARTIKA_TARASE_KLASS_160_mm').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.deski['160'][window.zmienneGlobalne.kolor_deski_domyslny]);
    jQuery('#deska_kontener_HARTIKA_TARASE_PRO_210_mm').data('deska_kolor', window.zmienneGlobalne.kolor_deski_domyslny);
    jQuery('#deska_kontener_HARTIKA_TARASE_PRO_210_mm').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.deski['210'][window.zmienneGlobalne.kolor_deski_domyslny]);

    jQuery('#listwa_maskujaca_wpc_kontener').data('listwa_maskujaca_kolor', window.zmienneGlobalne.kolor_deski_domyslny);
    jQuery('#listwa_maskujaca_wpc_kontener').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.listwy_maskujace.listwa_maskujaca_wpc[window.zmienneGlobalne.kolor_deski_domyslny]);
    jQuery('#listwa_maskujaca_alu_kontener').data('listwa_maskujaca_kolor', 'SREBRNY');
    jQuery('#listwa_maskujaca_alu_kontener').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.listwy_maskujace.listwa_maskujaca_alu['SREBRNY']);
    jQuery('#listwa_maskujaca_katowa_kontener').data('listwa_maskujaca_kolor', window.zmienneGlobalne.kolor_deski_domyslny);
    jQuery('#listwa_maskujaca_katowa_kontener').data('kodTechniczny', window.zmienneGlobalne.hartikaKodyTechniczne.listwy_maskujace.listwa_maskujaca_katowa[window.zmienneGlobalne.kolor_deski_domyslny]);

    // NOWE: Natura 3D - konfiguracja startowa
    // Ustawienie domyślnych wartości dla desek Natura 3D (JESION, WENGE, IPE, TEAK)
    jQuery('#deska_kontener_NATURA_3D_JESION').data('deska_kolor', 'JESION');
    jQuery('#deska_kontener_NATURA_3D_JESION').data('kodTechniczny', window.zmienneGlobalne.natura3dKodyTechniczne.deski['JESION']);
    jQuery('#deska_kontener_NATURA_3D_WENGE').data('deska_kolor', 'WENGE');
    jQuery('#deska_kontener_NATURA_3D_WENGE').data('kodTechniczny', window.zmienneGlobalne.natura3dKodyTechniczne.deski['WENGE']);
    jQuery('#deska_kontener_NATURA_3D_IPE').data('deska_kolor', 'IPE');
    jQuery('#deska_kontener_NATURA_3D_IPE').data('kodTechniczny', window.zmienneGlobalne.natura3dKodyTechniczne.deski['IPE']);
    jQuery('#deska_kontener_NATURA_3D_TEAK').data('deska_kolor', 'TEAK');
    jQuery('#deska_kontener_NATURA_3D_TEAK').data('kodTechniczny', window.zmienneGlobalne.natura3dKodyTechniczne.deski['TEAK']);

    // Listwy maskujące Natura 3D
    jQuery('#listwa_maskujaca_natura3d_kontener').data('listwa_maskujaca_kolor', window.zmienneGlobalne.natura3dDomyslnyKolorListwy || 'JESION');
    jQuery('#listwa_maskujaca_natura3d_kontener').data('kodTechniczny', window.zmienneGlobalne.natura3dKodyTechniczne.listwy_maskujace[window.zmienneGlobalne.natura3dDomyslnyKolorListwy || 'JESION']);

    window.konfigurator.krokAktywnyAkcje();
}

jQuery(document).ready(function () {
    //dla kolorMenu
    jQuery(".drop")
        .click(function () {
            jQuery(this).children("ul").toggle();
        });
    jQuery(".dropdown ul li")
        .click(function () {
            jQuery(this).hide();
        })
        .mouseleave(function () {
            jQuery(this).hide();
        });
    jQuery(document).keyup(function(event) {
        if (jQuery("#inputDlugoscLinii").is(":focus") && event.key == "Enter") {
            window.konfigurator.zatwierdzDlugoscLinii();
        }
    });
});

// dodatkowe funkcje
Number.prototype.between = function(a, b, inclusive) {
    var min = Math.min(a, b),
        max = Math.max(a, b);

    return inclusive ? this >= min && this <= max : this > min && this < max;
};
String.prototype.count=function() {
    var result = 0, i = 0;
    for(i;i<this.length;i++)result++;
    return result;
};
