<?php
require_once('functions.php');
$debug = false;
if($_GET['debug'] == 1){
    $debug = true;
}

//pole jest w sub-pages/naglowek.template.html
$lang = $_POST['wybrany_jezyk'];
if($lang == 'en'){
    $translation = require_once('translates/en.php');
    $translation["hartika_adres"] = "Hartika Sp. z o.o.<br>
                ul. Przemysłowa 9 | 19-230 Szczuczyn<br>
                tel. +48 86 444 20 20 | <a href=\"mailto:hartika@hartika.com\">hartika@hartika.com</a> | <a
                        href=\"http://www.hartika.com\">www.hartika.com</a>";
} elseif($lang == 'lt'){
    $translation = require_once('translates/lt.php');
    $translation["hartika_adres"] = "Hartika Sp. z o.o.<br>
                ul. Przemysłowa 9 | PL 19-230 Szczuczyn | Lenkija<br>
                tel. +370 686 48818 | <a href=\"mailto:hartika@hartika.lt\">hartika@hartika.lt</a> | <a
                        href=\"http://www.hartika.lt\">www.hartika.lt</a>";
} elseif($lang == 'de'){
    $translation = require_once('translates/de.php');
    $translation["hartika_adres"] = "Hartika Sp. z o.o.<br>
                ul. Przemysłowa 9 | PL 19-230 Szczuczyn | Polen<br>
                Tel. +48 86 444 20 20 | <a href=\"mailto:hartika@hartika.com\">hartika@hartika.com</a> | <a
                        href=\"http://www.hartika.de\">www.hartika.de</a>";
} else {
    $translation = require_once('translates/pl.php');

    $translation["hartika_adres"] = "Hartika Sp. z o.o.<br>
                ul. Przemysłowa 9 | 19-230 Szczuczyn<br>
                tel. 86 444 20 20 | <a href=\"mailto:hartika@hartika.com\">hartika@hartika.com</a> | <a
                        href=\"http://www.hartika.com\">www.hartika.com</a>";
}
if (isset($_POST["generujPDF"]) && $_POST["generujPDF"]  == 1) {

    $podsumowanieArr = json_decode($_POST["podsumowanie"]);
    $translation['podsumowanie_konfiguracji'] = tlumacz(generujPodsumowanieKonfiguracji($podsumowanieArr->konfiguracja), $translation);
    $translation['podsumowanie_elementow'] = tlumacz(generujPodsumowanieElementow($podsumowanieArr->konfiguracja), $translation);
    $translation['nazwa_tarasu'] = $podsumowanieArr->konfiguracja->Nazwa->label;
    $translation['powierzchnia_tarasu'] = $podsumowanieArr->konfiguracja->Powierzchnia->label;
    $translation['sciezka_do_plikow'] = __DIR__ ;
    //pole jest w sub-pages/naglowek.template.html
    $translation['obraz_tarasu'] = $_POST['obraz_tarasu'];

    require_once __DIR__ . '/vendor/autoload.php';

    try {
        include(__DIR__ . '/vendor/mpdf/mpdf/src/Mpdf.php');
    } catch (Exception $e) {
        var_dump( $e);
        die();
    }
   
    $mpdf = new \Mpdf\Mpdf();
    $tresc = tlumacz(file_get_contents(__DIR__ . '/generowaniePDF/szablony/pdf-podsumowanie.tpl.html'), $translation);
    if($debug) {
        echo $tresc;
        echo '<pre>';
        var_dump($podsumowanieArr);
        die();
    }
    $mpdf->WriteHTML($tresc);
    $today = date('Y-m-d-H-i-s');
    $pdfName = 'hartika-taras-konfiguracja-'.$today.'-id-'.uniqid();
    $pathToSave = '/hartikacom/wp-content/uploads/kreator_tarasow_pdfy/'.$pdfName.'.pdf';

	//$pathToSave = '/home/nwsyjdxc/domains/hartikadev.redsite.pl/public_html/wp-content/uploads/kreator_tarasow_pdfy/'.$pdfName.'.pdf';
	//$pathToSave = $_POST['wp_upload_dir'].'/kreator_tarasow_pdfy/'.$pdfName.'.pdf';
    // if (!file_exists($_POST['wp_upload_dir'].'/kreator_tarasow_pdfy')) {
    //    $rs =  mkdir($_POST['wp_upload_dir'].'/kreator_tarasow_pdfy', 0777, true);
    //    if(!$rs) {
    //        echo 'nie mozna utworzyc katalogu: ' .$_POST['wp_upload_dir'].'/kreator_tarasow_pdfy';
    //    }
    // }
        $mpdf->Output($pathToSave, 'F');
        ob_start();
        $mpdf->Output($pdfName.'.pdf', 'D');


}
/**
 * obiket przekazy przez frontend, ustawiony w taras.js - Taras.generujPodsumowanie()

konfiguracja : {
Nazwa: {label:"", value: null},
Powierzchnia: {label:"", value: null},
Deska: {label:"", value: null},
Deska_wydajnosc: {label:"", value: null},
Legar: {label:"", value: null},
Listwa_maskujaca : {label:"", value: null},
Ulozenie: {label:"", value: null},
Klips_startowy: {label:"", value: null},
Klips_srodkowy : {label:"", value: null},
klips_koncowy : {label:"", value: null},
},
 */
function generujPodsumowanieKonfiguracji($_konfiguracja) {
    $_arr = [
        $_konfiguracja->Deska->label => $_konfiguracja->Deska->value,
        $_konfiguracja->Legar->label => $_konfiguracja->Legar->value,
        $_konfiguracja->Klips_srodkowy->label => $_konfiguracja->Klips_srodkowy->value,
        $_konfiguracja->Listwa_maskujaca->label => $_konfiguracja->Listwa_maskujaca->value,
        $_konfiguracja->Ulozenie->label => $_konfiguracja->Ulozenie->value,
        $_konfiguracja->Deska_wydajnosc->label => $_konfiguracja->Deska_wydajnosc->value,
    ];
    $ret = '<table id="podsumowanie_konfiguracja" class="tabela_podsumowanie" cellpadding="3" >';
    $odd = true;
    foreach($_arr as $key => $val) {
        $nazwaPola =  $key;
        $style = $odd ? 'style= "background-color: lightgrey;"': '';
        $ret .= '<tr '.$style.'>';
        $ret .= '<td>' .$nazwaPola.'</td>' ;
        $ret .= '</tr>';
        $odd = !$odd;

    }

    $ret .= '</table>';
    return $ret;
}
function generujPodsumowanieElementow($_konfiguracja) {
    // $_arr = [
    //     $_konfiguracja->Deska->label => $_konfiguracja->Deska->value,
    //     $_konfiguracja->Legar->label => $_konfiguracja->Legar->value,
    //     $_konfiguracja->Listwa_maskujaca->label => $_konfiguracja->Listwa_maskujaca->value,
    //     $_konfiguracja->Klips_srodkowy->label => $_konfiguracja->Klips_srodkowy->value,
    //     $_konfiguracja->Klips_koncowy->label => $_konfiguracja->Klips_koncowy->value,
    //     $_konfiguracja->Klips_startowy->label => $_konfiguracja->Klips_startowy->value,
    // ];
     $_arr = [
        $_konfiguracja->Deska->label => array('value' => $_konfiguracja->Deska->value, 'price' => $_konfiguracja->Deska->price),
        $_konfiguracja->Legar->label => array('value' => $_konfiguracja->Legar->value, 'price' => $_konfiguracja->Legar->price),
        $_konfiguracja->Listwa_maskujaca->label => array('value' => $_konfiguracja->Listwa_maskujaca->value, 'price' => $_konfiguracja->Listwa_maskujaca->price),
        $_konfiguracja->Klips_srodkowy->label => array('value' => $_konfiguracja->Klips_srodkowy->value, 'price' => $_konfiguracja->Klips_srodkowy->price),
        $_konfiguracja->Klips_koncowy->label => array('value' => $_konfiguracja->Klips_koncowy->value, 'price' => $_konfiguracja->Klips_koncowy->price),
        $_konfiguracja->Klips_startowy->label => array('value' => $_konfiguracja->Klips_startowy->value, 'price' => $_konfiguracja->Klips_startowy->price),
    ];
    $ret = '<table id="podsumowanie_elementy" class="tabela_podsumowanie" cellpadding="3" >
<tr ><td style="border-right: 1px solid black; border-bottom: 1px solid black;">%SYSTEM_HARTIKA_TARASE%</td>
<td align="center" style="border-bottom: 1px solid black;">%Ilosc%</td>';
if($_konfiguracja->szablon == 'z cena'){
    $ret .= '<td align="center" style="border-bottom: 1px solid black;">%Cena%</td></tr>';
}

    foreach($_arr as $key => $val) {
        $nazwaPola = $key;
        $ret .= '<tr>';
        $ret .= '<td style="border-right: 1px solid black;">' .$nazwaPola.'</td>' ;
        $ret .= '<td align="center">' .$val['value'].'</td>' ;
        if($_konfiguracja->szablon == 'z cena'){
            $ret .= '<td align="center">' .$val['price'].'</td>' ;
        }
        $ret .= '</tr>';
    }
    if($_konfiguracja->szablon == 'z cena'){
        $ret .= '<tr style="border-top: 1px solid black;"><td></td><td></td><td align="center">Total:' .$_konfiguracja->cenaCalkowita.'</td></tr>' ;
    }
    $ret .= '</table>';
    if($_konfiguracja->szablon == 'z cena'){
        $ret .= '<table style="width: 100%;"><tr><td align="center" style="display: block; width: 100%; font-size: 9px; text-align: center; margin-bottom: 10px;">' .$_konfiguracja->cenaAdnotacja.'</td></tr></table>' ;
    }
    return $ret;
}