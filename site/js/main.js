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
        if (this.response){
            secondary_nav_tabs = this.response.tabs;
            secondary_nav.current = 0;
            secondary_nav.max_tabs = this.response.max_tabs;
            secondary_nav.innerHTML = "";
            let secondary_nav_height = parseInt(getComputedStyle(secondary_nav).height);

            if (secondary_nav_tabs.length > secondary_nav.max_tabs){
                let rollRightBtn = document.createElement("button");
                rollRightBtn.style.backgroundImage = "url('medias/rollRight.svg')";
                rollRightBtn.alt = "roll right";
                rollRightBtn.style.width = secondary_nav_height*0.5 + "px";
                rollRightBtn.style.height = secondary_nav_height*0.5 + "px";
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
                    btn.style.width = secondary_nav_height*0.8 + "px";
                    btn.style.height = secondary_nav_height*0.8 + "px";
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
                rollLeftBtn.style.width = secondary_nav_height*0.5 + "px";
                rollLeftBtn.style.height = secondary_nav_height*0.5 + "px";
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
            toBeShown.style.width = tabs[1].style.width;
            toBeShown.style.height = tabs[1].style.height;
            toBeShown.style.margin = "20px";
            toBeShown.firstChild.style.borderWidth = "3px";
        }, 200);        

        setTimeout(() => 
        {
            secondary_nav.appendChild(toBeHidden);
            rollSecondaryNavLocked = false;
        }, 2000);
    }
}

function rollSecondaryNavRight() {
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
            toBeShown.style.width = tabs[1].style.width;
            toBeShown.style.height = tabs[1].style.height;
            toBeShown.style.margin = "20px";
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
    container.innerHTML = "Project Description";
}

function showVisualization(){
    generate_secondaryNav("values/visualizationNav.json");
    container.innerHTML = "Visualizations";
}

function showClassifier(){
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