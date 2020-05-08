/** Importing modules **/
const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");
const readline = require("readline");

/** Defining constants **/
const path = "./LaGrandeRecreBis/";
const genres = ["Boy", "Girl", "Mixte"];

var date = new Date();
const _date = // Date in the following format "dd/mm/yyyy"
  ("0" + date.getDate()).slice(-2) +
  "/" +
  ("0" + date.getMonth()).slice(-2) +
  "/" +
  date.getFullYear();
const _time = // Time in the following format "hh:mm:ss"
  ("0" + date.getHours()).slice(-2) +
  ":" +
  ("0" + date.getMinutes()).slice(-2) +
  ":" +
  ("0" + date.getSeconds()).slice(-2);
const logFile = // logFile path in the following format "logs/log_[date:ddmmyyyy]_[time:hhmmss].txt"
  path +
  "logs/log_" +
  _date.split("/").join("") +
  "_" +
  _time.split(":").join("") +
  ".txt";

var partialIDs = { // Useful to build toys ids
  Boy: 0,
  Girl: 0,
  Mixte: 0,
};

const DB = { // Initialising the database with an empty object
  0: {
    id: 0,
    nom: "None",
    genre: "None",
    categorie: "None",
    marque: "None",
    prix: "None",
    description: "None",
    securite: "None",
    codeInterne: "None",
    codeEAN: "None",
    referenceFabricant: "None",
    ageMin: "None",
    dimension: "None",
    poids: "None",
  },
};

const advencementStatus = { // Keeping the current state to log the progression in the console
  "categorie" : "",
  "genre" : "",
  "page" : "",
  "total_page" : "",
  "pourcentage" : ""
}

/**Download an image from [uri] and saves it as [filename].jpg**/
var download = function (uri, filename, callback) {
  
};

/**Main function**/
async function scrap() {
  await createLog();

  await saveCSV();
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: "/usr/bin/chromium-browser",
    headless: true,
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.lagranderecre.fr/age/");

  const agesHandlers = await page.$x(
    '//div[@class="items-container"]//div[@class="item"]//a'
  );

  const agesPromises = await agesHandlers.map(async (a) => {
    var title = await a.getProperty("title");
    var titleTxt = await title.jsonValue();
    var hrefHandler = await a.getProperty("href");
    var href = await hrefHandler.jsonValue();

    return { title: titleTxt, href: href };
  });

  const ages = await Promise.all(agesPromises);

  for (let age of ages) {
    // await console.log(age.title);
    advencementStatus.categorie = age.title;

    await page.goto(age.href);

    for (let id_genre in genres) {
      var genre = genres[id_genre];
      await page.goto(
        age.href +
          "?facetFilters%5Bf_973192%5D%5B" +
          genre.toLowerCase() +
          "%5D=1&storeStockFilter=0&webStoreStockFilter=1"
      );

      // await console.log("> > " + genre);
      advencementStatus.genre = genre;

      var totalPageCount = 1;

      var [pagination] = await page.$x("//li[@class = 'page-count']");

      if (pagination) {
        var paginationHandler = await pagination.getProperty("innerText");
        var paginationTxt = await paginationHandler.jsonValue();
        totalPageCount = await paginationTxt.match(/\d+/g)[1];
      }
      // console.log("> > > Page Count : " + totalPageCount);
      advencementStatus.total_page = totalPageCount;

      for (let id_page = 1; id_page <= totalPageCount; id_page++) {
        await page.goto(
          age.href +
            "?facetFilters%5Bf_973192%5D%5B" +
            genre.toLowerCase() +
            "%5D=1&storeStockFilter=0&webStoreStockFilter=1" +
            "&pageNumber-23=" +
            id_page +
            "#top-23"
        );
        // await console.log("> > > Page " + id_page);
        advencementStatus.page = id_page;
        // await page.screenshot({path: (path + age.title + "__" + genre + '_' + id_page + ".png").replace(/\s/g, '_')});

        /*****/

        var product_name_a = await page.$x(
          '//div[contains(@class, "thumbnail-product")]//a[@class = "product-name"]'
        );

        var price_span = await page.$x(
          '//div[contains(@class, "thumbnail-product")]//li[contains(@class, "price-with-taxes")]//span[@class = "price-value"]'
        );

        for (let toy in product_name_a) {
          // console.log("> > > > " + toy + " sur " + (toysList.length - 1));
          advencementStatus.pourcentage = Math.round(100*toy/(product_name_a.length - 1));
          let newDBItem = new Object();

          try {
            newDBItem.id = genre + partialIDs[genre];
          } catch (err) {
            appendLog("None", "id", err);
            newDBItem.id = "Err" + partialIDs[genre];
          }

          try {
            let product_name_handler = await product_name_a[toy].getProperty(
              "innerText"
            );
            newDBItem.nom = await product_name_handler.jsonValue();
          } catch (err) {
            appendLog(newDBItem.id, "nom", err);
            newDBItem.nom = "%Error%";
          }

          newDBItem.genre = genre;
          newDBItem.categorie = age.title;

          newDBItem.marque = "None";

          try {
            let price_handler = await price_span[toy].getProperty("innerText");
            let price_txt = await price_handler.jsonValue();
            newDBItem.prix = parseFloat(price_txt.replace(",", "."));
          } catch (err) {
            appendLog(newDBItem.id, "prix", err);
            newDBItem.prix = "%Error%";
          }

          let product_page_handler = await product_name_a[toy].getProperty(
            "href"
          );
          let product_page_link = await product_page_handler.jsonValue();

          const page2 = await browser.newPage();
          await page2.setDefaultNavigationTimeout(0);
          await page2.goto(product_page_link);
          await page2.bringToFront();

          try {
            let [product_brand_a] = await page2.$x(
              '//div[@class = "product-brand"]//a'
            );
            if (product_brand_a) {
              let product_brand_handler = await product_brand_a.getProperty(
                "innerText"
              );
              newDBItem.marque = await product_brand_handler.jsonValue();
            }
          } catch (err) {
            appendLog(newDBItem.id, "marque", err);
            newDBItem.marque = "%Error%";
          }

          try {
            let [product_description_p] = await page2.$x(
              "//div[@class = 'description-container']//h4[contains(text(), 'RACONTE MOI UNE HISTOIRE')]/following-sibling::*"
            );
            let product_description_handler = await product_description_p.getProperty(
              "innerText"
            );
            newDBItem.description = await product_description_handler.jsonValue();
          } catch (err) {
            appendLog(newDBItem.id, "description", err);
            newDBItem.description = "%Error%";
          }

          try {
            let [product_securite_p] = await page2.$x(
              '//div[@class = "description-container"]//h4[contains(text(), "SÉCURITÉ")]/following-sibling::*'
            );

            let product_securite_handler = await product_securite_p.getProperty(
              "innerText"
            );
            newDBItem.securite = await product_securite_handler.jsonValue();
            if (newDBItem.securite === "") {
              newDBItem.securite = "None";
            }
          } catch (err) {
            appendLog(newDBItem.id, "securite", err);
            newDBItem.securite = "%Error%";
          }

          try {
            let [code_interne] = await page2.$x(
              '//*[*[contains(text(), "CODE INTERNE")]]'
            );
            let code_interne_handler = await code_interne.getProperty(
              "innerText"
            );
            let code_interne_txt = await code_interne_handler.jsonValue();
            let code_interne_list = await code_interne_txt.split(" ");
            let code_interne_value = await code_interne_list[
              code_interne_list.length - 1
            ];
            newDBItem.codeInterne = code_interne_value;
          } catch (err) {
            appendLog(newDBItem.id, "code interne", err);
            newDBItem.codeInterne = "%Error%";
          }

          try {
            let [code_EAN] = await page2.$x(
              '//*[*[contains(text(), "CODE EAN")]]'
            );
            let code_EAN_handler = await code_EAN.getProperty("innerText");
            let code_EAN_txt = await code_EAN_handler.jsonValue();
            let code_EAN_list = await code_EAN_txt.split(" ");
            let code_EAN_value = await code_EAN_list[code_EAN_list.length - 1];
            newDBItem.codeEAN = code_EAN_value;
          } catch (err) {
            appendLog(newDBItem.id, "code EAN", err);
            newDBItem.codeEAN = "%Error%";
          }

          try {
            let [reference_fabricant] = await page2.$x(
              '//*[*[contains(text(), "RÉFÉRENCE FABRICANT")]]'
            );
            let reference_fabricant_handler = await reference_fabricant.getProperty(
              "innerText"
            );
            let reference_fabricant_txt = await reference_fabricant_handler.jsonValue();
            let reference_fabricant_list = await reference_fabricant_txt.split(
              " "
            );
            let reference_fabricant_value = await reference_fabricant_list[
              reference_fabricant_list.length - 1
            ];
            newDBItem.referenceFabricant = reference_fabricant_value;
          } catch (err) {
            appendLog(newDBItem.id, "reference fabricant", err);
            newDBItem.referenceFabricant = "%Error%";
          }

          try {
            let [age_min] = await page2.$x(
              '//i[contains(@class, "icon-cake")]/following-sibling::p'
            );
            if (age_min) {
              let age_min_handler = await age_min.getProperty("innerText");
              let age_min_txt = await age_min_handler.jsonValue();
              newDBItem.ageMin = await age_min_txt;
            } else {
              newDBItem.ageMin = "None";
            }
          } catch (err) {
            appendLog(newDBItem.id, "age min", err);
            newDBItem.ageMin = "%Error%";
          }

          try {
            let [dimension] = await page2.$x(
              '//i[contains(@class, "icon-size")]/following-sibling::p'
            );
            if (dimension) {
              let dimension_handler = await dimension.getProperty("innerText");
              let dimension_txt = await dimension_handler.jsonValue();
              newDBItem.dimension = await dimension_txt;
            } else {
              newDBItem.dimension = "None";
            }
          } catch (err) {
            appendLog(newDBItem.id, "dimension", err);
            newDBItem.dimension = "%Error%";
          }

          try {
            let [weight] = await page2.$x(
              '//i[contains(@class, "icon-weight")]/following-sibling::p'
            );
            if (weight) {
              let weight_handler = await weight.getProperty("innerText");
              let weight_txt = await weight_handler.jsonValue();
              newDBItem.poids = await weight_txt;
            } else {
              newDBItem.poids = "None";
            }
          } catch (err) {
            appendLog(newDBItem.id, "poids", err);
            newDBItem.poids = "%Error%";
          }

          let product_images = await page2.$x(
            '//img[@class = "media-visuals-main-img"]'
          );
          for (let id_image in product_images) {
            let image_link_handler = await product_images[id_image].getProperty(
              "src"
            );
            let image_link = await image_link_handler.jsonValue();
            download(
              image_link,
              path + genre + "/" + newDBItem.id + "_" + id_image + ".jpg",
              () => {}
            ); //console.log('Done')});
          }

          await page2.close();
          await page.bringToFront();

          DB[newDBItem.id] = newDBItem;
          // await saveCSV();
          appendCSV(path + "DB.csv", newDBItem);
          partialIDs[genre]++;
          //console.log(newDBItem);
          showAdvencement();
        }

        /*****/
      }
      await page.goto(
        age.href +
          "?facetFilters%5Bf_973192%5D%5B" +
          genres[id_genre].toLowerCase() +
          "%5D=1&storeStockFilter=0&webStoreStockFilter=1"
      );
    }
  }

  // console.log(DB);
  await saveTxt();
  await endLog(false);
  await browser.close();
}

/**Converts an object in .csv file**/
var objectToCSV = function (obj) {
  var csv = Object.keys(DB[0]).join(";");
  for (let id in DB) {
    csv += '\n"' + Object.values(DB[id]).join('";"') + '"';
  }
  return csv;
};

/**Save DB in a .json file for easy reload**/
var saveTxt = function () {
  fs.writeFileSync(path + "DB.json", JSON.stringify(DB), (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
};

/**Save DB in a .csv file**/
var saveCSV = function () {
  fs.writeFile(path + "DB.csv", objectToCSV(DB), (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
};

/**Append a new line in DB.csv corresponding to [newObj]**/
var appendCSV = function (filePath, newObj) {
  let newLine = '';

  for (key in newObj) {
    if (key !== "prix"){
      newLine += ';"' + newObj[key] + '"';
    }
    else {
      newLine += ';' + newObj[key];
    }
  }

  newLine = '\n' + newLine.substr(1);
  // let newLine = '\n"' + Object.values(newObj).join('";"') + '"';
  fs.appendFileSync(filePath, newLine, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
};

/**Initialize log file and log starting time**/
var createLog = function () {
  fs.appendFile(
    logFile,
    "Scraping started on " +
      _date +
      " at " +
      _time +
      "\n************************\n",
    (err) => {
      if (err) throw err;
    }
  );
};

/**Log an issue with [id] on [value] with [msg] error in the log file**/
var appendLog = function (id, value, msg) {
  fs.appendFile(logFile, id + ">" + value + " --> " + msg + "\n\n", (err) => {
    if (err) throw err;
  });
};

/**Log end time in log file and mentionned if we stoped it Intentionally**/
var endLog = async function (keyBoardInterrupt) {
  date = new Date();
  var keyBoardInterruptionTxt = keyBoardInterrupt ? " INTENTIONALLY " : " ";
  fs.appendFileSync(
    logFile,
    "\n************************\nScraping ended" +
      keyBoardInterruptionTxt +
      "on " +
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + date.getMonth()).slice(-2) +
      "/" +
      date.getFullYear() +
      " at " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ":" +
      ("0" + date.getSeconds()).slice(-2) +
      "\n",
    (err) => {
      if (err) throw err;
    }
  );
  process.exit();
};

/**Log the current state in the console**/
var showAdvencement = function(){
  console.log('\033[2J');
  console.log(
    advencementStatus.categorie + " > " +
    advencementStatus.genre + " > " +
    "Page " + advencementStatus.page + " sur " + advencementStatus.total_page + " > " +
    advencementStatus.pourcentage + "%"
    );
}

/**Detect a keyboard interruption if needed to do some actions before stopping**/
readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    console.log("Interrupting...");
    endLog(true);
  }
});

scrap();
