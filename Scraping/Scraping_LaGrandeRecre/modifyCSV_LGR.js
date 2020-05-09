var fs = require("fs");

let obj = JSON.parse(fs.readFileSync("./LaGrandeRecre/DB.json"));

var appendCSV = function (filePath, newObj) {
  let newLine = "";
  if (newObj.id !== 0) {
    for (key in newObj) {
      /**Write here specific treatment **/
      if (!["prix", "ageMin", "categorie_id", "longueur", "largeur", "hauteur", "codeInterne", "marque_id", "poids"].includes(key)) {
        newLine += ';"' + newObj[key].replace(/[\n]+/g, " ") + '"';
      } 
      else {
        newLine += ";" + newObj[key];
      }
    }

    newLine = "\n" + newLine.substr(1);
  } else {
    newLine = '"' + Object.keys(newObj).join('";"') + '"';
  }

  // let newLine = '\n"' + Object.values(newObj).join('";"') + '"';
  fs.appendFileSync(filePath, newLine, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
};

const categories_id = {
  "JOUETS BÉBÉ 0 À 12 MOIS": 0,
  "JOUETS ENFANT 1 À 3 ANS": 1,
  "JOUETS ENFANT 3 À 5 ANS": 2,
  "JOUETS ENFANT 6 À 8 ANS": 3,
  "JOUETS ENFANT 9 À 11 ANS": 4,
  "JOUETS 12 ANS ET PLUS": 5,
};

var securityNoneValues = [];
const marques = [];

var correct_categorie = function (jouet) {
    jouet.categorie_id = categories_id[jouet.categorie.toUpperCase()];
    delete jouet.categorie;
};

var correct_ageMin = function (jouet) {
    if (jouet.ageMin && jouet.ageMin != 'None'){
        var ageMin = parseInt((jouet.ageMin).match(/[0-9]+/)[0]);
        if (jouet.ageMin.toLowerCase().includes("mois")){
            ageMin = ageMin/12;
        }
        jouet.ageMin = ageMin;
    }
};

var correct_dimensions = function (jouet) {
    if (jouet.dimension){
        var dimensions = jouet.dimension.match(/[0-9]+(.[0-9]+)?/g);
        jouet.longueur = (dimensions && dimensions.length > 0)?parseFloat(dimensions[0]):'None';
        jouet.largeur = (dimensions && dimensions.length > 1)?parseFloat(dimensions[1]):'None';
        jouet.hauteur = (dimensions && dimensions.length > 2)?parseFloat(dimensions[2]):'None';
        delete jouet.dimension;
    }
};

var correct_poids = function (jouet) {
    if (jouet.weight){
        var poids = parseFloat((jouet.weight).match(/[0-9]+(.[0-9]+)?/)[0]);
        jouet.poids = poids;
        delete jouet.weight;
    }
    else {
        delete jouet.poids;
        jouet.poids = 'None';
    }
};

var correct_securite = function (jouet) {
    if (jouet.securite){
        if (securityNoneValues.includes(jouet.securite)){
            jouet.securite = 'None';
        }
    }
};

var correct_marque = function (jouet) {
    if (jouet.marque){
        jouet.marque_id = marques.indexOf(jouet.marque);
        delete jouet.marque;
    }
};

var analyse_securite = function (database) {
  /*var candidates = {};
  for (let id_jouet in database) {
    let jouet = database[id_jouet];
    if (jouet.securite.length < 50) {
      if (!candidates[jouet.securite]) {
        candidates[jouet.securite] = 0;
      }
      candidates[jouet.securite] += 1;
    }
  }

  fs.writeFileSync("./securityNoneValues.json", JSON.stringify(candidates));*/

  //From there I determined all of the values equivalent to "None" and keeped that in securityNoneValues.json

  securityNoneValues = Object.keys(JSON.parse(fs.readFileSync("./securityNoneValues.json")));
};

var analyse_marques = function (database) {
  marques.length = 0;
  for (let id_jouet in database) {
    let jouet = database[id_jouet];
    if (!marques.includes(jouet.marque)) {
      marques.push(jouet.marque);
    }
  }
  marques.sort();
  fs.writeFileSync("./LaGrandeRecre/marques.csv", "marque_id;marque_name\n");
  for (let id_marque in marques){
      fs.appendFileSync("./LaGrandeRecre/marques.csv", id_marque + ';"' + marques[id_marque] + '"\n');
  }
};

var createNewCSV = function () {
  analyse_securite(obj);
  analyse_marques(obj);
  for (let id_jouet in obj) {
    correct_categorie(obj[id_jouet]);
    correct_ageMin(obj[id_jouet]);
    correct_dimensions(obj[id_jouet]);
    correct_poids(obj[id_jouet]);
    correct_securite(obj[id_jouet]);
    correct_marque(obj[id_jouet])
    appendCSV("./LaGrandeRecre/newDB.csv", obj[id_jouet]);
  }
};

createNewCSV();
