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
var personnesress = [];
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
    container.appendChild(boutton);
    div1.id = "left";
    div2.id = "center";
    div3.id = "right";
    div4.id ="right_right";
    div4.innerHTML= "<br> </br> <br></br> <br></br> <br></br> <br></br>"
    //container.appendChild(div4);
    div1.innerHTML="Select the abscissa : <div><input type='radio' id='price' name='abs' value='prix'checked><label for='price'> Price</label></div> <div><input type='radio' id='volume' name='abs' value='volume'> <label for='volume'>Volume</label></div><div><input type='radio' id='weight' name='abs' value='poids'><label for='weight'> Weight</label></div>";
    div2.innerHTML="Select the ordinate : <div><input type='radio' id='price' name='od' value='prix'checked><label for='price'> Price</label></div> <div><input type='radio' id='volume' name='od' value='volume'> <label for='volume'>Volume</label></div><div><input type='radio' id='weight' name='od' value='poids'><label for='weight'> Weight</label></div>";
    div3.innerHTML = "Select your mode : <div><input type='radio' id='gbm' name='mode' value='gbm'checked><label for='gbm'>Girls (pink dots) / Boys (blue dots) </label></div> <div><input type='radio' id='colors' name='mode' value='colors'> <label for='colors'>Toys represented by their main color</label></div>";
 
    divgrosse.appendChild(div1);
    divgrosse.appendChild(div2);
    divgrosse.appendChild(div3);
    
    container.appendChild(divsvg);
    container.appendChild(div4);
    d3.select("svg").remove();
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

function prixA(){
    var scale = d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.prix))
    .range([40, parseFloat(canvas_w)-40]);
    return(scale);
}

function poidsA(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.poids))
    .range([40, parseFloat(canvas_w)-40]) );
}

function volumeA(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.largeur * d.longueur  * d.hauteur))
    .range([40, parseFloat(canvas_w)-40]) );
}

function prixO(){
    var scale = d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.prix))
    .range([40, parseFloat(canvas_h)-40]);
    return(scale);
}

function poidsO(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.poids))
    .range([40, parseFloat(canvas_h)-40]) );
}

function volumeO(){
    return(d3.scaleLinear()
    .domain(d3.extent(databaseL, (d) => d.largeur * d.longueur  * d.hauteur))
    .range([40, parseFloat(canvas_h)-40]) );
}
function showVisu(){
    d3.select("svg").remove();

    svg = d3.select(divsvg)
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
    var xnom;
    var ynom;
    console.log(valeurmodeA);
    console.log(valeurmodeB);
    switch(valeurmodeB){
        case "prix":
            y = prixO();
            yaxis = d3.axisRight()
            .scale(y);
            ynom = "Price (€)";
            break;

        case "volume":
            y = volumeO();
            yaxis = d3.axisRight()
            .scale(y);
            ynom = "Volume (cm3)";
            break;
        case "poids": 
            y = poidsO();
            yaxis = d3.axisRight()
            .scale(y);
            ynom = "Weight (g)";
            break;
}
    switch(valeurmodeA){
        case "prix":
            x = prixA();
            xaxis = d3.axisBottom()
            .scale(x);
            xnom = "Price (€)";
            break;
        case "volume":
            x = volumeA();
            xaxis = d3.axisBottom()
            .scale(x);
            xnom = "Volume (m3)";
            break;
        case "poids": 
            x = poidsA();
            xaxis = d3.axisBottom()
            .scale(x);
            xnom = "Weight (g)";
            break;

    }
    
    console.log(xnom);
    console.log(ynom);
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
        .text(xnom);

        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        .attr("y", 10 )
        .attr("x", -h/2 )
        .text(ynom);
        
    
    }

    if(valeurmode=="colors"){
        svg.selectAll('circle')
        .data(databaseL)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', (d) => x(d[valeurmodeA]))
        .attr('cy', (d) => y(d[valeurmodeB]))
        .attr('fill', (d) => color( +d.couleur))
        .on("mouseover",function(d){div4.innerHTML = "Description du jouet : <br> </br>" + "Nom : " +  (d.nom).toLowerCase() +"<br> </br> Prix : " + (d.prix) });

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
        .text(xnom);

        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        .attr("y", 10 )
        .attr("x", -h/2 )
        .text(ynom);
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

    svg.selectAll('circle')
        .data(databaseL)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', (d) => x(d.prix))
        .attr('cy', (d) => y(d.poids))
        .attr('fill', (d) => color(+ d.couleur))
        .on("mouseover",function(d){div4.innerHTML = "Description du jouet : <br> </br>" + "Nom : " +  (d.nom).toLowerCase() +"<br> </br> Prix : " + (d.prix) });
   
  
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