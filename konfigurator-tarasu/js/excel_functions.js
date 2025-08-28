/**
 * obiekt mapujace funkcje/operacje Excela
 * wykorzystywany w formulach skopiowanych z Excel-a
 * przed uzyciem formuły Excela nalezy ją skonwertować do używania metod obiektu excelFunctions
 *
 */

function excelFunctionsObj(_debug)  {
    this.debug = _debug ? _debug : false ;

    this.if = function (condition, resultTRUE, resultFALSE) {
        return condition ? resultTRUE : resultFALSE;
    };
    this.ifWithStatus = function (condition, resultTRUE, resultFALSE) {
        return {'status' : condition,  'resultForTRUE' : resultTRUE,  'resultForFALSE' : resultFALSE};
    };
    this.or = function (condition1, condition2){
        if(this.debug){
            console.log('excelOR', condition1, condition2);
        }
        return condition1 || condition2 ? true : false;
    };

    this.round = function (value, digits) {
        return  digits > 0 ? value.toFixed(digits) : Math.round(value);
    };
    this.roundup = function (value, digits) {
        return digits > 0 ? value.toFixed(digits) : Math.ceil(value, digits);
    };
    this.rounddown = function (value, digits) {
        return digits > 0 ? value.toFixed(digits) : Math.floor(value, digits);
    };
    this.mod = function (a,b) {
        return a % b;
    };
    /**
     * zwraca sumę wartości podanych jako zakres komórek
     * {_range} - podany jako string, zapisany według reguł excela np: 'E2:E6'
     * działa tylko dla prostych zakresów - adresy komórek nie mogą być wieloliterowe np: AE6, zliczanie nie działa dla zakresów typu obszar, sumuje tylko komórki w wierszu lub kolumnie
     * @param String _range
     */
    this.sum  = function (_range, _namedValues) {

        var namedValues = _namedValues;
        var rangeArr = _range.split(":");
        var cellsToSum = [];
        /**
         * returns array like [column, row]
         * @type {RegExpMatchArray}
         */
        var cellStart = rangeArr[0].match(/[a-zA-Z]+|[0-9]+/g);
        var cellEnd = rangeArr[1].match(/[a-zA-Z]+|[0-9]+/g);
        if (cellStart[0].length > 1 || cellEnd[0].length > 1) {
            throw Error('adresy komórek nie mogą być wieloliterowe np: AE6. Podany zakres nie spełnia wymogów: ' + _range);
        } else if (cellStart[0] !== cellEnd[0] && cellStart[1] !== cellEnd[1]) {
            throw Error('Funkcja nie działa dla zakresów typu obszar, sumuje tylko komórki w wierszu lub kolumnie. Podany zakres nie spełnia wymogów: ' + _range);
        }
        //create new address cells (variables)
        if (cellStart[0] == cellEnd[0]) {
            //iteruje przez wiersze czyli oznaczenie cyfrowe
            for (var i = parseInt(cellStart[1]); i <= parseInt(cellEnd[1]); i++) {
                var newCell = cellStart[0] + i;
                cellsToSum.push(newCell);
            }
        } else if (cellStart[1] == cellEnd[1]) {
            //iteruje przez kolumny czyli oznaczenie literowe
            var letter = cellStart[0];
            var newCell = letter + cellStart[1];
            cellsToSum.push(newCell);

            do {
                letter = this.nextCharacter(letter);
                newCell = letter + cellStart[1];
                cellsToSum.push(newCell)
            } while (letter != cellEnd[0]);

        }
        var sum = 0.0;
        for (var i = 0; i < cellsToSum.length; i++) {
            try {
                if(isNaN(namedValues[cellsToSum[i]]) === false){
                    sum += parseFloat(namedValues[cellsToSum[i]]);
                } else {
                    if(this.debug){
                        console.log(cellsToSum[i] + ' jest NaN');
                    }
                }
            } catch (e) {
                if (e instanceof SyntaxError) {
                    throw e;
                } else {
                    if(this.debug){
                        console.log(e.message);
                    }
                }
            }
        }
        if (this.debug) {
            console.log('excelFunctions.sum - debug - ', {cellsToSum: cellsToSum, sum: sum, range: _range, namedValues : namedValues});
        }
        return sum;
    }
    this.nextCharacter  = function (c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }

}