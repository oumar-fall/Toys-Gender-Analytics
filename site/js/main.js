const main_nav_tabs = [
    {
        name : "Project",
        show : showProject,
        img : "medias/project.svg"
    }, 
    {
        name : "Visualization",
        show : showVisualization,
        img : "medias/visualizations.svg"
    }, 
    {
        name : "Toy Classifier",
        show : showClassifier,
        img : "medias/classifier.svg"
    }
];

const visualizations = [
    {
        name : "Visualization 1",
        show : showVisualisation1,
        img : "medias/price.svg"
    },
    {
        name : "Visualization 2",
        show : showVisualisation2,
        img : "medias/color.svg"
    },
    {
        name : "Visualization 3",
        show : showVisualisation3,
        img : "medias/size.svg"
    },
    {
        name : "Visualization 4",
        show : showVisualisation4,
        img : "medias/text.svg"
    }
]

const [body] = document.getElementsByTagName("body");
const [main] = document.getElementsByTagName("main");
const [header] = document.getElementsByTagName("header");
const [footer] = document.getElementsByTagName("footer");
const [main_nav] = document.getElementsByClassName('main-nav');
const [secondary_nav] = document.getElementsByClassName('secondary-nav');
const [container] = document.getElementsByClassName("container");

function init(){
    main.style.height = document.documentElement.clientHeight + "px";

    let mainTitle = document.createElement("h1");
    mainTitle.innerHTML = "Toys Story";
    mainTitle.className = "mainTitle";
    header.appendChild(mainTitle);

    let footerContent = document.createElement("p");
    footerContent.innerHTML = "%footer%footer%footer%footer%footer%footer%footer%footer%footer%";
    footer.appendChild(footerContent);

    generate_mainNav();
    generate_secondaryNav();
}

function generate_mainNav() {
    main_nav.innerHTML = "";
    let main_nav_width = parseInt(getComputedStyle(main_nav).width);
    for (let tab of main_nav_tabs){
        let btn = document.createElement("span");
        let icon = document.createElement("img");
        icon.alt = tab.name;
        icon.src = tab.img;
        btn.appendChild(icon);
        btn.setAttribute("tooltip", tab.name);
        btn.onclick = tab.show;
        btn.style.width = main_nav_width*0.6 + "px";
        btn.style.height = main_nav_width*0.6 + "px";
        btn.className = "button round-btn";
        main_nav.appendChild(btn);
    }
}

function generate_secondaryNav() {
    secondary_nav.innerHTML = "";
    let secondary_nav_height = parseInt(getComputedStyle(secondary_nav).height);
    for (let visualization of visualizations){
        let btn = document.createElement("span");
        let icon = document.createElement("img");
        icon.alt = visualization.name;
        icon.src = visualization.img;
        btn.appendChild(icon);
        btn.setAttribute("tooltip", visualization.name);
        btn.onclick = visualization.show;
        btn.style.width = secondary_nav_height*0.8 + "px";
        btn.style.height = secondary_nav_height*0.8 + "px";
        btn.className = "button round-btn";
        secondary_nav.appendChild(btn);
    }
}

function showProject(){
    console.log("Project");
}

function showVisualization(){
    console.log("Visualization");
}

function showClassifier(){
    console.log("Classifier");
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