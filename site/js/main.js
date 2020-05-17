const h = document.documentElement.clientHeight;
const w = document.documentElement.clientWidth;

const [body] = document.getElementsByTagName("body");
const [main] = document.getElementsByTagName("main");
const [header] = document.getElementsByTagName("header");
const [footer] = document.getElementsByTagName("footer");
const [main_nav] = document.getElementsByClassName('main-nav');
const [secondary_nav] = document.getElementsByClassName('secondary-nav');
const [container] = document.getElementsByClassName("container");

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

    generate_mainNav();
    showProject();
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
        secondary_nav_tabs = this.response;
        if (secondary_nav_tabs){
            secondary_nav.innerHTML = "";
            let secondary_nav_height = parseInt(getComputedStyle(secondary_nav).height);
            for (let tab of secondary_nav_tabs){
                let btn = document.createElement("span");
                let icon = document.createElement("img");
                icon.alt = tab.name;
                icon.src = tab.img;
                btn.appendChild(icon);
                btn.setAttribute("tooltip", tab.name);
                btn.setAttribute("onclick", tab.show);
                btn.style.width = secondary_nav_height*0.8 + "px";
                btn.style.height = secondary_nav_height*0.8 + "px";
                btn.className = "button round-btn";
                secondary_nav.appendChild(btn);
            }
        }
        else {
            console.log("Fail to load secondary nav : " + path);
        }
    }
}

function showProject(){
    console.log("Project");
    generate_secondaryNav("values/projectNav.json");
    container.innerHTML = "Project Description";
}

function showVisualization(){
    console.log("Visualization");
    generate_secondaryNav("values/visualizationNav.json");
    container.innerHTML = "Visualizations";
}

function showClassifier(){
    console.log("Classifier");
    generate_secondaryNav("values/classifierNav.json");
    container.innerHTML = "Toy Classifier";
}

function showVisualisation1(){
    console.log(1);
    container.innerHTML = "Visualization 1";
}

function showVisualisation2(){
    console.log(2);
    container.innerHTML = "Visualization 2";
}

function showVisualisation3(){
    console.log(3);
    container.innerHTML = "Visualization 3";
}

function showVisualisation4(){
    console.log(4);
    container.innerHTML = "Visualization 4";
}

init();