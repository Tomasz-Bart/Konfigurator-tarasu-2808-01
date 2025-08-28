Kreator / Konfigurator tarasu - miniaplikacja dla klienta pozwalająca określić i obliczyć elmenty potrzebne do zbudowania tarasu.

w skład  aplikacji wchodzą:
 - pliki z folderu "konfigurator-tarasu" 
 - plik z szablonem strony "page-konfigurator-tarasu.php"
 - dodatkowy pomoczniczy plik generujPDF.php - umieszczany w główny katalogu serwisu, plik zawiera przekierowanie do właściwego pliku 'require_once __DIR__.'/wp-content/themes/polestar/konfigurator-tarasu/generujPDF.php'' - konfiguracja serwerza hartika nie zezwala na bezposrdnie uruchamianie skryptu z aktalogu szablonu
 
 Instalacja:
 folder z plikami i plik szablonu należy wgrać do folderu  aktywnego szablonu:
 - np: wp-content/themes/polestar
 - w panelu admina utworzyć stronę i ustawić szablon "konfigurator-tarasu"
 - wyłączyc dla strony boczne menu itp
 - stronę dodać do menu lub umieścić link w innej stronie - według potrzeb
 - ustawic prawo zapisu 777 dla ../konfigurator-tarasu/generowaniePDF/mpdf/ttfontdata
  sudo chmod 777 ttfontdata
- kreator zapisuje pliki do folderu wp-content/uploads/kreator_tarasow_pdfy
nalezy sie upewnic czy skrypt wp-content/themes/polestar/konfigurator-tarasu/generujPDF.php może utworzyc folder i biblioteka mpdf.php moze zapisac do niego pliki. (uprawnienia uzytkownika np: www-data)
 
 
  
 