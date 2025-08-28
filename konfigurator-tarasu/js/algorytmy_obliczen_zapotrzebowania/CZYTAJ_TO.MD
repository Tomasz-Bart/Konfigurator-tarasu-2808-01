Algorytmy odwzorowują formuły z Excela, które nalezy odpowiednio wyekstrahowac i przekopiowac do konwertera. (dokumentacja/algorytmyObliczenieZapotrzebowaniaMaterialowego) W arkuszach zostały zawarte metody ekstrkacji.
Do konwersji uzywany jest skrypt:
- dokumentacja/narzedzia/convertExcelFormulaForUse.js
- konwerter jest przystosowany do Excela skonfigurowanego regionalnie dla Polski, czyli np. używamy "," jako sepratora dla miejsc dziesiętnych 
- funkcje Excel-a np. IF, ROUND itp są odwzorowane w tym pliku : js/excel_functions.js

Po konwersji nalezy wykonać kilka zmian aby obliczenia działały poprawnie:
- dla zmienych Warunek_{cyfra} (np. Warunek_1) pierwsze wystąpienie funkcji _excelFunctions.if_ powinno być, podczas konwersji, automatycznie zamienione na: _excelFunctions.ifWithStatus_
- sprawdzić czy jakies obliczenia nie korzystaja ze zmiennych ktore sa obliczane później np. obliczenia dla **Klips końcowy KK** korzystają z obliczeń dla klipsa początkowego KST. nalezy obliczenia KK przesunac ponizej KST, czasem klipsy środkowe KSR rowniez trzeba przesuną ponizej KK
- do body funkcji _zbierzZmienne()_ należy skopiowac odpowiednią treść obiektu (możliwe że trzeba zmienna skomponowac tak żeby uwzględniała wszystkie zmienne/adresy komórek z arkuszy excela, używanego dla zwracanych zmiennych (znajdziesz go po konwersji - oznaczony komentarzem - //obiekt zwracany przez funkcje zbierzZmienne)
