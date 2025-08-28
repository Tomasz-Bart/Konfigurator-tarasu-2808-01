const alg3mFileName = './formulasToConvert/algorytmy_3m.xlsx.js';
const alg4_6mFileName = './formulasToConvert/algorytmy_4i6m.xlsx.js';

const filesToConvert = [    alg3mFileName, alg4_6mFileName ];


const fs = require('fs');

const saveToFile = (fileName, text) => {
    fs.writeFile(fileName, text, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`The file ${fileName} was saved!`);
    });
}
filesToConvert.forEach( formulasFileName =>{
    const algs = require (`${formulasFileName}`);
    const fileName = `${formulasFileName}_converted.txt`;
    let text = '';
    algs.formulaArr.forEach( (alg) => {text += convert(alg)});
    saveToFile(fileName,  text);
    // console.log( convert(algs.formulaArr))
    console.log(`Liczba algorytmow do konwersji w pliku ${formulasFileName} : ${algs.formulaArr.length}`);
    }

);


/**
 * generuje zmienne wykorzystywane do obliczen:
 var C13,C15,C17,E23,E25,E27,E29,E31,E33,E35,E37,E39,E41,J4,J5;
 * @param _formula
 * @returns {string}
 */
function zmienneWynikiObliczenUtworz(_formula){
    var zmienneWynikiObliczen = [];
// var zmienneSearchArr = [...formula.matchAll(/\w\d+(?=@)/gm)];
    var zmienneSearchArr = [..._formula.matchAll(/[A-Z]\d+/gm)];
    zmienneSearchArr.forEach( x=> zmienneWynikiObliczen.push(x[0]));
    zmienneWynikiObliczen = zmienneWynikiObliczen.reduce(
        (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
        [],
    ).sort();
    var ret =  '//zmienne dla obliczen: \n\r' +'//var ' + zmienneWynikiObliczen.join(',') + ';\n\r';
    ret += '\n\r //obiekt zwracany przez funkcje zbierzZmienne \n\r //' + createZbierzZmienneZwarcanyObiekt(zmienneWynikiObliczen)
    return ret;
}

/**
 *
 * @param Array _variablesArr
 * @returns {string}
 */
function createZbierzZmienneZwarcanyObiekt(_variablesArr){
    //module.exports = {
    //     formulaArr : formulaArrLocal
    // }
    var ret = '{';
    _variablesArr.forEach(
        x => ret += `'${x}' : ${x},`
    )
    ret += '};'
    return ret;
}
/**
 * obejmuje zakres excelowski (F8:F14) apostrofami i dodaje nazwe funkcji ktora zbiera zmienne (H8, H9, C22 itp) )potrzebne do wyliczenia np. sumy
 * @param _val
 * @returns {string}
 */
function sumParamsReplacement(_val){
    return "'" + _val + "', zbierzZmienne()";
}
function convert(_formula) {

    const zmienneWynikiObliczenText = zmienneWynikiObliczenUtworz(_formula);


    const result = _formula.replace(/^[=]/i, '')
        .replace(/(=)/gm, '==')
        .replace(/(@==)/gm, ' = ')
        .replace(/(<==)/gm, ' <= ')
        .replace(/(>==)/gm, ' >= ')
        .replace(/(ROUNDUP)/gm, 'excelFunctions.roundup')
        .replace(/(ROUNDDOWN)/gm, 'excelFunctions.rounddown')
        .replace(/(ROUND)/gm, 'excelFunctions.round')
        .replace(/(IF)/gm, 'excelFunctions.if')
        .replace(/(OR)/gm, 'excelFunctions.or')
        .replace(/(MOD)/gm, 'excelFunctions.mod')
        .replace(/(SUM)/gm, 'excelFunctions.sum')
        .replace(/(%%EOL%%)/gm, ';')
        .replace(/(%%LN%%)/gm, '\n\r')
        .replace(/\w\d+[:]\w\d+/gm, sumParamsReplacement)
        .replace('//weryfikacja danych', zmienneWynikiObliczenText + '\n\r//weryfikacja danych')
    const resultFinal = result.replace(/(Warunek_(\d+) = )(excelFunctions.if)/g,'$1excelFunctions.ifWithStatus')
    return resultFinal;
}
