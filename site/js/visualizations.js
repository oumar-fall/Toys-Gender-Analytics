var svg;

const canvas_h = getComputedStyle(container).height ;
const canvas_w = getComputedStyle(container).width ;
const divgrosse = document.createElement("div");
const div1 =  document.createElement("div");
const div2 =  document.createElement("div");
const div3  = document.createElement("div");
const div4  = document.createElement("div");
const boutton = document.createElement("button");
boutton.id = "see";
boutton.onclick = showVisu;
var z;
var x;
var y;
var xaxis;
var yaxis;
var divsvg = document.createElement("div");
function initVisualization(){
    //clearInterval(wave_id);
    container.innerHTML = "";
    container.appendChild(divgrosse);
    boutton.innerText = "See"
    //container.appendChild(boutton);
    div1.id = "left";
    div2.id = "center";
    div3.id = "right";
    div4.id ="right_right";
    div4.innerHTML= "<br> </br> <br></br> <br></br> <br></br> <br></br>"
    //container.appendChild(div4);
    div1.innerHTML="Select the abscissa : <div><input type='radio' id='price' name='abs' value='prix'checked><label for='price'> Price</label></div> <div><input type='radio' id='volume' name='abs' value='volume'> <label for='volume'>Volume</label></div><div><input type='radio' id='weight' name='abs' value='poids'><label for='weight'> Weight</label></div><div><input type='radio' id='age' name='abs' value='age'checked><label for='age'> Age</label></div>";
    div2.innerHTML="Select the ordinate : <div><input type='radio' id='price' name='od' value='prix'checked><label for='price'> Price</label></div> <div><input type='radio' id='volume' name='od' value='volume'> <label for='volume'>Volume</label></div><div><input type='radio' id='weight' name='od' value='poids'><label for='weight'> Weight</label></div><div><input type='radio' id='age' name='od' value='age'checked><label for='age'> Age</label></div>";
    div3.innerHTML = "Select your mode : <div><input type='radio' id='gbm' name='mode' value='gbm'checked><label for='gbm'> Girl Boy Mixt </label></div> <div><input type='radio' id='colors' name='mode' value='colors'> <label for='colors'>Main color</label></div>";
 
    // divgrosse.appendChild(div1);
    // divgrosse.appendChild(div2);
    // divgrosse.appendChild(div3);
    // divgrosse.appendChild(div4);
    container.appendChild(divsvg);
    svg = d3.select(divsvg)
            .append('svg')
            .attr("width", canvas_w )
            .attr("height", canvas_h )
            .attr("class", "canvas")
}

//je rajoute ici
function color(c){
    return(d3.hsv(c*360,1,1))
}

function compute_x(d,val){
    // console.log("salut");
    // switch(val){
    //         case "price":
    //             z = d3.scaleLinear()
    //             .domain(d3.extent(databaseL, (d) => d.prix))
    //             .range([20, parseFloat(canvas_w)-20]);
    //             return(z(d.prix))
    //             break;
    //         case "volume":
    //             z = d3.scaleLinear()
    //             .domain(d3.extent(databaseL, (d) => d.longueur * d.largeur * d.hauteur))
    //             .range([20, parseFloat(canvas_w)-20]);
    //             return(z(d.longueur * d.largeur * d.hauteur));
    //             break;
    //         case "weight": 
    //             z = d3.scaleLinear()
    //             .domain(d3.extent(databaseL, (d) => d.poids))
    //             .range([20, parseFloat(canvas_w)-20]);
    //             return(z(d.poids));
    //             break;
    // }
    z = d3.scaleLinear()
                .domain(d3.extent(databaseL, (d) => d.prix))
                .range([20, parseFloat(canvas_w)-20]);
                return(z(d.prix))
}

function compute_y(d,val){
    // switch(val){
    //         case "price":
    //             y = d3.scaleLinear()
    //             .domain(d3.extent(databaseL, (d) => d.prix))
    //             .range([20, parseFloat(canvas_h)-20]);
    //             return(y(d.prix))
    //             break;
    //         case "volume":
    //             y = d3.scaleLinear()
    //             .domain(d3.extent(databaseL, (d) => d.longueur * d.largeur * d.hauteur))
    //             .range([20, parseFloat(canvas_h)-20]);
    //             console.log("coucou");
    //             return(y(d.longueur * d.largeur * d.hauteur));
    //             break;
    //         case "weight": 
    //             y = d3.scaleLinear()
    //             .domain(d3.extent(databaseL, (d) => d.poids))
    //             .range([20, parseFloat(canvas_h)-20]);
    //             return(y(d.poids));
    //             break;
    // }
    y = d3.scaleLinear()
                .domain(d3.extent(databaseL, (d) => d.poids))
                .range([20, parseFloat(canvas_h)-20]);
                return(y(d.poids));
}

function prixA(){
    var scale = d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.prix))
    .range([20, parseFloat(canvas_w)-20]);
    return(scale);
}

function poidsA(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.poids))
    .range([20, parseFloat(canvas_w)-20]) );
}

function volumeA(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.largeur * d.longueur  * d.hauteur))
    .range([20, parseFloat(canvas_w)-20]) );
}

function prixO(){
    var scale = d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.prix))
    .range([20, parseFloat(canvas_h)-20]);
    return(scale);
}

function poidsO(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.poids))
    .range([20, parseFloat(canvas_h)-20]) );
}

function volumeO(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.largeur * d.longueur  * d.hauteur))
    .range([20, parseFloat(canvas_h)-20]) );
}
function showVisu(){
    d3.select("svg").remove();
    svg = d3.select(container)
            .append('svg')
            .attr("width", canvas_w)
            .attr("height", canvas_h)
            .attr("class", "canvas")
    
    console.log("visu visu");
    var radios = document.getElementsByName('mode');
    console.log(radios)
    var valeurmode;

    for(var i = 0; i < radios.length; i++){
        if(radios[i].checked){
            valeurmode = radios[i].value;
        }
    }

    var radiosA = document.getElementsByName('abs');
    console.log(radiosA)
    var valeurmodeA;

    for(var i = 0; i < radiosA.length; i++){
        if(radiosA[i].checked){
            valeurmodeA = radiosA[i].value;
        }
    }

    var radiosB = document.getElementsByName('od');
    console.log(radiosB)
    var valeurmodeB;

    for(var i = 0; i < radiosB.length; i++){
        if(radiosB[i].checked){
            valeurmodeB = radiosB[i].value;
        }
    }

    console.log(valeurmodeA);
    console.log(valeurmodeB);
    switch(valeurmodeB){
        case "prix":
            y = prixO();
            yaxis = d3.axisRight()
            .scale(y);
        case "volume":
            y = volumeO();
            yaxis = d3.axisRight()
            .scale(y);
        case "poids": 
            y = poidsO();
            yaxis = d3.axisRight()
            .scale(y);
}
    switch(valeurmodeA){
        case "prix":
            x = prixA();
            xaxis = d3.axisBottom()
            .scale(x);
        case "volume":
            x = volumeA();
            xaxis = d3.axisBottom()
            .scale(x);
        case "poids": 
            x = poidsA();
            xaxis = d3.axisBottom()
            .scale(x);

    }
    

    // let x = d3.scaleLinear()
    //         .domain(d3.extent(database, (d) => d.longueur * d.largeur * d.hauteur))
    //         .range([20, parseFloat(canvas_w)-20]);
    
    // let y = d3.scaleLinear()
    //         .domain(d3.extent(database, (d) => d.prix))
    //         .range([20, parseFloat(canvas_h)-20]);
    

    if (valeurmode=="gbm"){
        let colorgbm = d3.scaleOrdinal()
            .domain(['Boy', 'Girl', 'Mixte'])
            .range(['blue', 'pink', 'grey'])

        svg.selectAll('circle')
        .data(databaseL)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', (d) => x(d[valeurmodeA]))
        .attr('cy', (d) => y(d[valeurmodeB]))
        .attr('fill', (d) => colorgbm( d.genre))
        .on("mouseover",function(d){div4.innerHTML = "Description du jouet : <br> </br>" + "Nom : " +  (d.nom).toLowerCase() +"<br> </br> Prix : " + (d.prix) });
        //wave_id = setInterval(() => waveContent(secondary_nav, "tab"), 3000);

        svg.append("g")
        .call(xaxis);
        svg.append("g")
        .call(yaxis);
        
    
    }

    if(valeurmode=="colors"){
        svg.selectAll('circle')
        .data(databaseL)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', (d) => compute_x(d,valeurmodeA))
        .attr('cy', (d) => compute_y(d, valeurmodeB))
        .attr('fill', (d) => color( +d.couleur))
        .on("mouseover",function(d){div4.innerHTML = "Description du jouet : <br> </br>" + "Nom : " +  (d.nom).toLowerCase() +"<br> </br> Prix : " + (d.prix) });
        //wave_id = setInterval(() => waveContent(secondary_nav, "tab"), 3000);
        svg.append("g")
        .call(xaxis);
        svg.append("g")
        .call(yaxis);
    }
}


function showVisualisation1(){
    
    d3.select("svg").remove();
    initVisualization();
    

    let x = d3.scaleLinear()
            .domain(d3.extent(databaseL, (d) => d.prix))
            .range([40, parseFloat(canvas_w)-40]);
    
    let y = d3.scaleLinear()
            .domain(d3.extent(databaseL, (d) => d.poids))
            .range([40, parseFloat(canvas_h)-40]);

    yaxis = d3.axisRight()
    .scale(y);

    

    xaxis = d3.axisBottom()
    .scale(x);


    
    // let color = d3.scaleOrdinal()
    //             .domain(['Boy', 'Girl', 'Mixte'])
    //             .range(['blue', 'pink', 'grey'])

    svg.selectAll('circle')
        .data(databaseL)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', (d) => x(d.prix))
        .attr('cy', (d) => y(d.poids))
        .attr('fill', (d) => color(+ d.couleur))
        .on("mouseover",function(d){div4.innerHTML = "Description du jouet : <br> </br>" + "Nom : " +  (d.nom).toLowerCase() +"<br> </br> Prix : " + (d.prix) });
   // wave_id = setInterval(() => waveContent(secondary_nav, "tab"), 3000);

   var axisLabelX = "10px";
   var axisLabelY = "150px";
   
  
   svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(" + 20 + ", 0 )")
   .call(yaxis);
    var w = parseFloat(getComputedStyle(container).width);
    var h = parseFloat(getComputedStyle(container).height);
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + 20 + ")")
    .call(xaxis);
    svg.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "end")
    .attr("y", 10)
    .attr("x",w/2)
    .text("Price (€)");

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "ylabel")
    .attr("text-anchor", "end")
    .attr("y", 10 )
    .attr("x", -h/2 )
    .text("Weight (kg)");

    // svg.append("text")
    // .attr("class", "xlabel")
    // .attr("text-anchor", "end")
    // .attr("x", 500)
    // .attr("y",6)
    // .attr("dx", ".75em")
    // .attr("transform", "rotate(-90)")
    // .text("life expectancy (years) xlabel");
    divgrosse.appendChild(div1);
    divgrosse.appendChild(div2);
    divgrosse.appendChild(div3);
    divgrosse.appendChild(div4);
   

}


function showVisualisation2(){
    initVisualization();
    container.innerHTML = "";
    var img = document.createElement('img');
    img.classList.add("fullSize");
    img.src = "data/img/mosaique_boy.png";
    container.appendChild(img);
}

function showVisualisation3(){
    initVisualization();
    container.innerHTML = "";
    var img = document.createElement('img');
    img.classList.add("fullSize");
    img.src = "data/img/mosaique_girl.png";
    container.appendChild(img);
}

function showVisualisation4(){
    initVisualization();
    container.innerHTML = "Visualization 4";
}

function appendDiv(tab){
    if (!tab.level){
        tab.level = 1;
    }

    var fullTab = document.createElement('div');
    fullTab.classList.add('tab');
    
    var tabName = document.createElement("span");
    tabName.classList.add("tabName", "level-" + tab.level);
    tabName.id = tab.tabname.toLowerCase().replace(/\s/g, "-");
    tabName.innerHTML = tab.tabname;
    fullTab.appendChild(tabName);

    var tabDiv = document.createElement("div");
    tabDiv.classList.add("tabDiv");

    var textContent = document.createElement("div");
    textContent.classList.add("textContent");
    textContent.innerHTML = "<p>" + tab.text + "</p>";

    var imgContent = document.createElement("div");
    imgContent.classList.add("imgContent");

    var n_img = tab.images.length;

    for (let i = 0; i < n_img; i++) {
        var img = document.createElement("img");
        img.classList.add("tabImage", "n_img" + n_img);
        img.src = tab.images[i];
        img.setAttribute("onclick",  "showImg('" + img.src + "');");
        imgContent.appendChild(img);
    }
    

    tabDiv.appendChild(textContent);
    if (n_img > 0){
        tabDiv.appendChild(imgContent);
    }
    fullTab.appendChild(tabDiv);
    container.appendChild(fullTab);
}

function showImg(imgPath) {
    var img = document.createElement('img');
    img.src = imgPath;
    modal.appendChild(img);
    modal.style.display = "flex";
    img.classList.add("modalImage");
}

function closeModal() {
    modal.innerHTML = "";
    modal.style.display = "none";
}