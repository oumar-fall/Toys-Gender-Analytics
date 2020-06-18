const h = document.documentElement.clientHeight;
const w = document.documentElement.clientWidth;

const [body] = document.getElementsByTagName("body");
const [main] = document.getElementsByTagName("main");
const [header] = document.getElementsByTagName("header");
const [footer] = document.getElementsByTagName("footer");
const [main_nav] = document.getElementsByClassName('main-nav');
const [secondary_nav] = document.getElementsByClassName('secondary-nav');
const [container] = document.getElementsByClassName("container");
const [modal] = document.getElementsByClassName("modal");
const [txt] = document.getElementsByClassName("mytext");

const waiting = document.createElement("div");
waiting.classList.add("waiting");

var rollSecondaryNavLocked = false;
var database, categories, marques;

function init(){
    body.appendChild(waiting);
    main.style.height = h + "px";

    let mainTitle = document.createElement("img");
    mainTitle.className = "mainTitle";
    mainTitle.src = "medias/mainTitle.png"
    container.appendChild(mainTitle);

    // let footerContent = document.createElement("p");
    // footerContent.innerHTML = "%footer%footer%footer%footer%footer%footer%footer%footer%footer%";
    // footer.appendChild(footerContent);

    setTimeout(() => {
        container.innerHTML = "";
        loadDatabase();
    }, 2000);
}

function loadDatabase(){

    container.innerHTML = "Loading data...";

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
                couleur : +d.couleur,
            }
        })
        .get( (error, rows) => {
            if (error){
                console.log(error);
            }
            else {
                waiting.classList.add('waiting-of');
                console.log("Database loaded :" + rows.length + " rows");
                database = rows;
                generate_mainNav();
                showProject();
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
                btn.setAttribute("onclick", tab.onclick);
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
                rollRightBtn.style.backgroundImage = "url('medias/svg/rollRight.svg')";
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
                btn.setAttribute("onclick", tab.onclick);

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
                rollLeftBtn.style.backgroundImage = "url('medias/svg/rollLeft.svg')";
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

function showProject(){
    generate_secondaryNav("values/projectNav.json");
    container.innerHTML = ""
    let request = new XMLHttpRequest();
    request.open('GET', "values/projectDivs.json");
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var projectTabs = this.response;
        if (projectTabs){
            for (let tab of projectTabs){
                appendDiv(tab);
            }
        }
        else {
            console.log("Can't load project index");
        }
    }
}

function showVisualization(){
    generate_secondaryNav("values/visualizationNav.json");
    container.innerHTML = "Visualizations";
}

function showClassifier() {
    generate_secondaryNav("values/classifierNav.json");
    container.innerHTML = "";
    var input = document.createElement('input');
    input.classList.add("box__file");
    input.type = "file";
    input.accept = "image/*";
    input.name = "imagepath";
    input.id = "file";

    var form = document.createElement('form');
    form.classList.add("box");
    form.setAttribute("method", "post");
    form.setAttribute("action", "");
    form.setAttribute("enctype", "multipart/form-data");

    var divbox = document.createElement('div');
    divbox.id ="dropper";
    divbox.ondrop = send;

    var label = document.createElement('label');
    label.innerHTML = "<strong>Choose a file </strong>";
    label.setAttribute("for", "file");

    var span = document.createElement('span');
    span.classList.add("box__dragndrop");
    span.innerHTML = "or drag it here<br>";


    var button = document.createElement("button");
    button.innerHTML = "Upload";
    button.classList.add("box__button");
    button.setAttribute("type", "submit");
    button.onclick = send;
    label.appendChild(span);
    divbox.appendChild(input);
    divbox.appendChild(label);
    divbox.appendChild(button);

    setInterval(dragndrop, 100);

    form.appendChild(divbox);

    container.appendChild(form);

    function dragndrop(){
      var box = document.getElementById('dropper');
      if (box){
        /*console.log("haha");*/
        document.querySelector('#dropper').addEventListener('dragover', function(e) {
            e.preventDefault(); // Annule l'interdiction de "drop"
        }, false);

        document.querySelector('#dropper').addEventListener('drop', function(e) {
            e.preventDefault(); // Cette méthode est toujours nécessaire pour éviter une éventuelle redirection inattendue
            /*alert('Vous avez bien déposé votre élément !');*/
        }, false);

      }
    }

    function send() {
        console.log("Drop !");
        var xhr = new XMLHttpRequest();
        const FD = new FormData( form );
        xhr.open('POST', '../../imageupload');
        xhr.send(FD);
        xhr.onload = function(){container.innerHTML = xhr.response;}
    }
}



init();
