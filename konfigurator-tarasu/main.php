<?php
require_once('functions.php');
//kod języka ustawiony przez WPML
$lang = strtolower(ICL_LANGUAGE_CODE);
if($lang == 'en'){
    $translation = require_once('translates/en.php');
} elseif($lang == 'lt'){
    $translation = require_once('translates/lt.php');
} elseif($lang == 'de'){
    $translation = require_once('translates/de.php');	
} else {
    $translation = require_once('translates/pl.php');
}

//zmienna wykorzystana w generujPDF.php
$translation['wp_upload_dir'] = "//wp-content/uploads";//;wp_upload_dir()['basedir'] ;


?>

<link rel="stylesheet" type="text/css" href="<?php echo $translation['sciezka_do_plikow'] ?>/konfigurator-tarasu.css?20211118.1950" >
<script src="<?php echo $translation['sciezka_do_plikow'] ?>/js/konfigurator-tarasu.js?20211166" ></script>
<script type="application/javascript">

        <?php
            $jsTranslationsObject = "{";
        foreach($translation as $key => $val){
            $jsTranslationsObject .= $key . ": '" . $val . "', ";
        }
		$jsTranslationsObject = substr_replace($jsTranslationsObject ,"",-1);
        $jsTranslationsObject .= "};";
        echo "window.tlumaczenia = ".$jsTranslationsObject;
         ?>

</script>
<div id="konfigurator-tarasu" class="konfigurator-glowny">


    <?php

        $elementy_strony = [
        'naglowek.template.html',
        'krok_1.template.html',
        'krok_2.template.html',
        'krok_3.template.html',
        'krok_4.template.html',
        'krok_5.template.html',
        'krok_6.template.html',
        'krok_7.template.html',
        'stopka.template.html',
        'oknoPodajDlugoscLinii.template.html',

        ];
        $szablony = ['walidacja_komunikat_szablon' => file_get_contents(__DIR__ . '/sub-pages/walidacja_komunikat.template.html')];
        foreach($elementy_strony as $plikNazwa){
            $fragment = file_get_contents(__DIR__ . '/sub-pages/'. $plikNazwa);
            foreach($szablony as $key => $value){
                $fragment = wstawWartosc( $key, $value, $fragment);
            }
            echo tlumacz($fragment, $translation);
        }
        echo '<!-- wykryty jezyk WP (ICL_LANGUAGE_CODE) = '.$lang.'-->';
    ?>
</div>
