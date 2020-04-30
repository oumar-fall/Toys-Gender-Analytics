var fs = require('fs');

let obj = JSON.parse(fs.readFileSync("./LaGrandeRecre/DB.json"));


var appendCSV = function (filePath, newObj) { 
    let newLine = '';
    if (newObj.id !== 0) {    
        for (key in newObj) {
            /**Write here specific treatment **/
            if (key !== "prix"){
                newLine += ';"' + newObj[key].replace(/[\n]+/g, " ") + '"';
            }
            else {
                newLine += ';' + newObj[key];
            }
        }
    
        newLine = '\n' + newLine.substr(1);
    }
    else {
        newLine = '"' + Object.keys(newObj).join('";"') + '"';
    }

    // let newLine = '\n"' + Object.values(newObj).join('";"') + '"';
    fs.appendFileSync(filePath, newLine, (err) => {
      // In case of a error throw err.
      if (err) throw err;
    });
};

for (let id_jouet in obj){
    appendCSV("./LaGrandeRecre/DB.csv", obj[id_jouet]);
}
