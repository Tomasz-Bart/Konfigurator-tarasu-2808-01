<?php
function tlumacz($text, $translationsArr){
    foreach($translationsArr as $key => $val){
        $text = wstawWartosc($key, $val, $text);
    }
    return $text;
}
function wstawWartosc($key, $val, $text){
    $text = str_replace("%".$key."%", $val, $text);
    return $text;
}
?>