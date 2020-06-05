const h = document.documentElement.clientHeight;
const w = document.documentElement.clientWidth;

const [body] = document.getElementsByTagName("body");
const [main] = document.getElementsByTagName("main");
const [header] = document.getElementsByTagName("header");
const [footer] = document.getElementsByTagName("footer");
const [main_nav] = document.getElementsByClassName('main-nav');
const [secondary_nav] = document.getElementsByClassName('secondary-nav');
const [container] = document.getElementsByClassName("container");

var rollSecondaryNavLocked = false;
var wave_id;
var database, categories, marques;

function init(){
    if (w >= h){
        main.style.height = h + "px";
    }
    else {
        body.style.height = h + "px";
    }

    let mainTitle = document.createElement("span");
    mainTitle.innerHTML = "Toys Story";
    mainTitle.className = "mainTitle";
    mainTitle.style.fontSize = 0.6 * parseInt(getComputedStyle(header).height) + "px";
    header.appendChild(mainTitle);

    let footerContent = document.createElement("p");
    footerContent.innerHTML = "%footer%footer%footer%footer%footer%footer%footer%footer%footer%";
    footer.appendChild(footerContent);

    loadDatabase();
}

function loadDatabase(){
    d3.tsv("data/database.tsv")
        .row( (d, i) => {
            d.longueur = (d.longueur === "None")? 0 : +d.longueur;
            d.largeur = (d.largeur === "None")? 0 : +d.largeur;
            d.hauteur = (d.hauteur === "None")? 0 : +d.hauteur;
            return {
                id: d.id,
                nom: d.nom,
                genre: d.genre,
                prix: (d.prix === "None")? 0 : +d.prix,
                description: (d.description === "None")? "" : d.description,
                securite: (d.securite === "None")? "" : d.securite,
                codeInterne: +d.codeInterne,
                referenceFabricant: d.referenceFabricant,
                ageMin: (d.ageMin === "None")? 0 : +d.ageMin,
                categorie_id: +d.categorie_id,
                longueur: d.longueur,
                largeur: d.largeur,
                hauteur: d.hauteur,
                volume: d.longueur*d.largeur*d.hauteur,
                poids: (d.poids === "None")? 0 : d.poids,
                marque_id: +d.marque_id,
            }
        })
        .get( (error, rows) => {
            if (error){
                console.log(error);
            }
            else {
                console.log("Database loaded :" + rows.length + " rows");
                database = rows;
                generate_mainNav();
                showProject();
                wave_id = setInterval(() => waveContent(secondary_nav, "tab"), 3000);
            }
        });
    d3.tsv("data/categories.tsv")
        .get( (error, rows) => {
            console.log("Categories loaded :" + rows.length + " rows");
            categories = rows;
        });
    d3.tsv("data/marques.tsv")
        .get( (error, rows) => {
            console.log("Marques loaded :" + rows.length + " rows");
            marques = rows;
        });
}

function generate_mainNav() {
    let request = new XMLHttpRequest();
    request.open('GET', "values/mainNav.json");
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        main_nav_tabs = this.response;
        if (main_nav_tabs) {
            main_nav.innerHTML = "";
            let main_nav_width = parseInt(getComputedStyle(main_nav).width);
            for (let tab of main_nav_tabs){
                let btn = document.createElement("span");
                let icon = document.createElement("img");
                icon.alt = tab.name;
                icon.src = tab.img;
                btn.appendChild(icon);
                btn.setAttribute("tooltip", tab.name);
                btn.setAttribute("onclick", tab.show);
                btn.style.width = main_nav_width*0.6 + "px";
                btn.style.height = main_nav_width*0.6 + "px";
                btn.className = "button round-btn";
                main_nav.appendChild(btn);
            }
        }
        else {
            console.log("Fail to load main nav");
        }
    }
}

function generate_secondaryNav(path) {
    let request = new XMLHttpRequest();
    request.open('GET', path);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        if (this.response){
            let tabSizeFactor = 0.7;
            let btnSizeFactor = 0.5;
            let tabMarginFactor = 0.1;
            secondary_nav.height = parseInt(getComputedStyle(secondary_nav).height);
            secondary_nav.width = parseInt(getComputedStyle(secondary_nav).width);
            secondary_nav_tabs = this.response.tabs;
            secondary_nav.current = 0;
            secondary_nav.max_tabs = this.response.max_tabs;
            secondary_nav.innerHTML = "";
            secondary_nav.tabSize = secondary_nav.height*tabSizeFactor + "px";
            secondary_nav.btnSize = secondary_nav.height*btnSizeFactor + "px";
            secondary_nav.tabMargin = "0 " + secondary_nav.height * tabMarginFactor + "px";

            secondary_nav.max_tabs = Math.min(
                    Math.floor((secondary_nav.width - 2 * btnSizeFactor * secondary_nav.height)/
                                ((2 * tabMarginFactor + tabSizeFactor)*
                                    secondary_nav.height)),
                    secondary_nav.max_tabs);

            if (secondary_nav_tabs.length > secondary_nav.max_tabs){
                let rollRightBtn = document.createElement("button");
                rollRightBtn.style.backgroundImage = "url('medias/rollRight.svg')";
                rollRightBtn.alt = "roll right";
                rollRightBtn.style.width = secondary_nav.btnSize;
                rollRightBtn.style.height = secondary_nav.btnSize;
                rollRightBtn.onclick = rollSecondaryNavRight;
                rollRightBtn.className = "rollBtn";
                secondary_nav.appendChild(rollRightBtn)
            }

            for (let tab_id in secondary_nav_tabs){
                let tab = secondary_nav_tabs[tab_id]
                let btn = document.createElement("span");
                let icon = document.createElement("img");
                icon.alt = tab.name;
                icon.src = tab.img;
                btn.appendChild(icon);
                btn.setAttribute("tooltip", tab.name);
                btn.setAttribute("onclick", tab.show);

                if (tab_id < secondary_nav.max_tabs) {
                    btn.style.width = secondary_nav.tabSize;
                    btn.style.height = secondary_nav.tabSize;
                    btn.style.margin = secondary_nav.tabMargin;
                }
                else {
                    btn.style.height = "0";
                    btn.style.width = "0";
                    btn.style.margin = "0";
                    btn.firstChild.style.borderWidth = "0";
                }

                btn.className = "button round-btn tab";
                secondary_nav.appendChild(btn);
            }

            if (secondary_nav_tabs.length > secondary_nav.max_tabs){
                let rollLeftBtn = document.createElement("button");
                rollLeftBtn.style.backgroundImage = "url('medias/rollLeft.svg')";
                rollLeftBtn.alt = "roll left";
                rollLeftBtn.style.width = secondary_nav.btnSize;
                rollLeftBtn.style.height = secondary_nav.btnSize;
                rollLeftBtn.onclick = rollSecondaryNavLeft;
                rollLeftBtn.className = "rollBtn";
                secondary_nav.appendChild(rollLeftBtn)
            }
        }
        else {
            console.log("Fail to load secondary nav : " + path);
        }
    }
}

function rollSecondaryNavLeft() {
    if (!rollSecondaryNavLocked) {
        rollSecondaryNavLocked = true;
        let tabs = secondary_nav.getElementsByClassName("tab");

        let toBeHidden = tabs[0];
        let toBeShown = tabs[secondary_nav.max_tabs];

        setTimeout(() => {
            toBeHidden.style.width = "0";
            toBeHidden.style.height = "0";
            toBeHidden.style.margin = "0";
            toBeHidden.firstChild.style.borderWidth = "0";
            toBeShown.style.width = secondary_nav.tabSize;
            toBeShown.style.height = secondary_nav.tabSize;
            toBeShown.style.margin = secondary_nav.tabMargin;
            toBeShown.firstChild.style.borderWidth = "3px";
        }, 200);

        setTimeout(() =>
        {
            secondary_nav.insertBefore(toBeHidden, secondary_nav.lastChild);
            rollSecondaryNavLocked = false;
        }, 2000);
    }
}

function rollSecondaryNavRight() {
    console.log(secondary_nav.height);
    if (!rollSecondaryNavLocked) {
        rollSecondaryNavLocked = true;
        let tabs = secondary_nav.getElementsByClassName("tab");

        let toBeShown = tabs[tabs.length-1];
        let toBeHidden = tabs[secondary_nav.max_tabs-1];

        secondary_nav.insertBefore(toBeShown, secondary_nav.firstChild.nextSibling);
        setTimeout(() => {
            toBeHidden.style.width = "0";
            toBeHidden.style.height = "0";
            toBeHidden.style.margin = "0";
            toBeHidden.firstChild.style.borderWidth = "0";
            toBeShown.style.width = secondary_nav.tabSize;
            toBeShown.style.height = secondary_nav.tabSize;
            toBeShown.style.margin = secondary_nav.tabMargin;
            toBeShown.firstChild.style.borderWidth = "3px";
        }, 200);

        setTimeout(() =>
        {
            rollSecondaryNavLocked = false;
        }, 2000);
    }
}

function waveContent(items, itemClass) {
    let elts = items.getElementsByClassName(itemClass);
    for (let elt_id = 0; elt_id < elts.length; elt_id++){
        setTimeout(() => {
            elts[elt_id].classList.add("flying");
        }, elt_id * 50);
        setTimeout(() => {
            elts[elt_id].classList.remove("flying");
        }, elt_id * 50 + 100);
    }
}

function showProject(){
    generate_secondaryNav("values/projectNav.json");
    var projectDescription = document.createElement("div");
    projectDescription.classList.add("textDescription");
    container.innerHTML = "";
    container.appendChild(projectDescription);
    projectDescription.innerHTML = "What color were your toys when you were a child? Let us guess... you're a woman? We bet they were <span class='pink'>pink</span>! A man? Rather <span class='blue'>blue</span> then. We wanted to see if those clichés were still relevant in the gendered toy catalogues in 2020. Take a stroll through our website to discover our findings and establish your own by playing with our interactive visualizations. <br><br> For this study we have retrieved the toys from the catalogue of La Grande Récré : <a href='https://www.lagranderecre.fr/'>https://www.lagranderecre.fr/</a>. This catalogue is indeed still gendered in spite of the new French legislation in force. The conclusions drawn are therefore characteristic of this catalogue, in spring 2020. <br><br> We have retrieved information about 75269 toys, including image, brand, price, description, dimensions, weight... in order to study them as well as possible.";
}

function showVisualization(){
    generate_secondaryNav("values/visualizationNav.json");
    container.innerHTML = "Visualizations";
}

function showClassifier(){
    // generate_secondaryNav("values/classifierNav.json");
    container.innerHTML = "";
    var sendButton = document.createElement("button");
    sendButton.innerHTML = "SEND";
    sendButton.id = 'send';

    var input = document.createElement('input');
    input.type = "text";
    input.name = "filetoupload";
    container.appendChild(input);
    container.appendChild(sendButton);
    sendButton.onclick = send;
    function send() {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '../../classifier?' + input.name + '=' + input.value);
      xhr.send();
      xhr.onload = function(){container.innerHTML = xhr.response;}
    }

    }



init();
