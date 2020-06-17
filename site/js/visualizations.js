var svg;

const canvas_h = getComputedStyle(container).height;
const canvas_w = getComputedStyle(container).width;
const p = document.createElement("p");
p.className = "text_visu";
const divgrosse = document.createElement("div");
const div1 =  document.createElement("div");
const div2 =  document.createElement("div");
const div3  = document.createElement("div");
const div4  = document.createElement("div");

function initVisualization(){
    clearInterval(wave_id);
    container.innerHTML = "";
    container.appendChild(divgrosse);
    div1.id = "left";
    div2.id = "center";
    div3.id = "right";
    div4.id ="right_right";
    div1.innerHTML="Select the abscissa : <div><input type='radio' id='price' name='drone' value='price'checked><label for='price'> Price</label></div> <div><input type='radio' id='volume' name='drone' value='volume'> <label for='volume'>Volume</label></div><div><input type='radio' id='weight' name='drone' value='weight'><label for='weight'> Weight</label></div><div><input type='radio' id='age' name='drone' value='age'checked><label for='age'> Age</label></div>";
    div2.innerHTML="Select the ordinate : <div><input type='radio' id='price' name='drone' value='price'checked><label for='price'> Price</label></div> <div><input type='radio' id='volume' name='drone' value='volume'> <label for='volume'>Volume</label></div><div><input type='radio' id='weight' name='drone' value='weight'><label for='weight'> Weight</label></div><div><input type='radio' id='age' name='drone' value='age'checked><label for='age'> Age</label></div>";
    div3.innerHTML = "Select your mode : <div><input type='radio' id='gbm' name='drone' value='gbm'checked><label for='gbm'> Girl Boy Mixt </label></div> <div><input type='radio' id='colors' name='drone' value='colors'> <label for='colors'>Main color</label></div>";
    divgrosse.appendChild(div1);
    divgrosse.appendChild(div2);
    divgrosse.appendChild(div3);
    divgrosse.appendChild(div4);
    container.appendChild(p);
    svg = d3.select(container)
            .append('svg')
            .attr("width", canvas_w)
            .attr("height", canvas_h)
            .attr("class", "canvas")
}

//je rajoute ici
function color(c){
    return(d3.hsv(c*360,1,1))
}

function showVisualisation1(){
    initVisualization();
    

    let x = d3.scaleLinear()
            .domain(d3.extent(database, (d) => d.poids))
            .range([20, parseFloat(canvas_w)-20]);
    
    let y = d3.scaleLinear()
            .domain(d3.extent(database, (d) => d.prix))
            .range([20, parseFloat(canvas_h)-20]);
    
    // let color = d3.scaleOrdinal()
    //             .domain(['Boy', 'Girl', 'Mixte'])
    //             .range(['blue', 'pink', 'grey'])

    svg.selectAll('circle')
        .data(database)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', (d) => x(d.poids))
        .attr('cy', (d) => y(d.prix))
        .attr('fill', (d) => color(+ d.couleur))
        .on("mouseover",function(d){div4.innerHTML = "Description du jouet : <br> </br>" + "Nom : " +  (d.nom).toLowerCase() +"<br> </br> Prix : " + (d.prix) });
    wave_id = setInterval(() => waveContent(secondary_nav, "tab"), 3000);

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
    var tabName = document.createElement("span");
    tabName.classList.add("tabName");
    tabName.innerHTML = tab.tabname;
    container.appendChild(tabName);

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
    container.appendChild(tabDiv);
    container.appendChild(document.createElement("hr"));
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