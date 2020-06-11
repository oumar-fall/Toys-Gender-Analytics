var svg;

const canvas_h = getComputedStyle(container).height;
const canvas_w = getComputedStyle(container).width;

function initVisualization(){
    clearInterval(wave_id);
    container.innerHTML = "";
    svg = d3.select(container)
            .append('svg')
            .attr("width", canvas_w)
            .attr("height", canvas_h)
            .attr("class", "canvas")
}

function showVisualisation1(){
    initVisualization();

    let x = d3.scaleLinear()
            .domain(d3.extent(database, (d) => d.poids))
            .range([20, parseFloat(canvas_w)-20]);
    
    let y = d3.scaleLinear()
            .domain(d3.extent(database, (d) => d.prix))
            .range([20, parseFloat(canvas_h)-20]);
    
    let color = d3.scaleOrdinal()
                .domain(['Boy', 'Girl', 'Mixte'])
                .range(['blue', 'pink', 'grey'])

    svg.selectAll('circle')
        .data(database)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', (d) => x(d.poids))
        .attr('cy', (d) => y(d.prix))
        .attr('fill', (d) => color(d.genre));
    wave_id = setInterval(() => waveContent(secondary_nav, "tab"), 3000);
}

function showVisualisation2(){
    initVisualization();
    container.innerHTML = "";
    var img = document.createElement('img');
    img.src = "data/img/mosaique_boy.png";
    container.appendChild(img);
}

function showVisualisation3(){
    initVisualization();
    container.innerHTML = "";
    var img = document.createElement('img');
    img.src = "data/img/mosaique_girl.png";
    container.appendChild(img);
}

function showVisualisation4(){
    initVisualization();
    container.innerHTML = "Visualization 4";
}

//change ici 
function projectColor(){
    initVisualization();
    var projectDescription = document.createElement("div");
    projectDescription.classList.add("textDescription");
    container.innerHTML = "";
    container.appendChild(projectDescription);
    projectDescription.innerHTML = "One of the first clichés we wanted to check is the following: the toys for girls are <span class='pink'>pink</span> while the toys for boys are rather <span class='blue'>blue</span>. As you can see on the attached diagrams this cliché is confirmed. Pink is indeed very present on girls' toys, while boys' toys are more varied in colour. <br> <br> We obtained these diagrams from the toys in the catalogue la grande récrée by looking at the majority tint of each picture. White and black are not considered.  ";
    var imgContainer = document.createElement('div');
    imgContainer.classList.add("imgContainer", "sideContent", "n_img2");
    container.appendChild(imgContainer);
    var img1 = document.createElement('img');
    img1.classList.add("imgDescription");
    img1.src = "data/img/color_repartition_1.png";
    imgContainer.appendChild(img1);
    var img2 = document.createElement('img');
    img2.classList.add("imgDescription");
    img2.src = "data/img/color_repartition_2.png";
    imgContainer.appendChild(img2);

}

function projectWords(){
    initVisualization();
    var projectDescription = document.createElement("div");
    projectDescription.classList.add("textDescription");
    container.innerHTML = "";
    container.appendChild(projectDescription);
    projectDescription.innerHTML = "Are certain types of toys more associated with one gender or the other? For example, dolls for girls and trucks for boys.  That's often what people think. Well, this thinking is encouraged by toy catalogues, indeed, that's what the picture shows. The words most often found in the names of toys for girls are words like doll or princess, while for boys we find the famous trucks! <br> <br> Here are the most common words used in descriptions of girls' toys : <ol> <li> POUPÉE </li> <li> REINE </li> <li> NEIGES </li> <li> PRINCESSE </li> <li> DISNEY </li> <li> COROLLE </li> <li> COFFRET </li> <li> PELUCHE </li> <li> PRINCESSES </li> <li> DÉGUISEMENT </li> </ol> <br> <br> And here are the most common words used in descriptions of boys' toys : <ol> <li> PLAYMOBIL </li> <li> FIGURINE </li> <li>  VOITURE </li> <li> LEGO® </li> <li> VÉHICULE </li> <li> CAMION </li> <li> COFFRET </li> <li> SUPER </li> <li> DÉGUISEMENT </li> <li>MODÈLE </li> </ol> <br> <br> To obtain these word lists we have selected the most frequent words of more than 5 letters in the names of the toys.  ";
    var img = document.createElement('img');
    img.classList.add("imgDescription", "sideContent");
    img.src = "data/img/description_words.png";
    container.appendChild(img);
}

function ProjectBrands() {
    initVisualization();
    var projectDescription = document.createElement("div");
    projectDescription.classList.add("textDescription");
    container.innerHTML = "";
    container.appendChild(projectDescription);
    projectDescription.innerHTML = "The difference between the brands of girls' and boys' toys is also impressive.  Some brands make toys that are attributed to only one sex, such as Corolle (the doll brand) or Playmobil. <br> <br>  Here are the brands most present in girls' toys : <ol> <li> COROLLE </li> <li> MATTEL </li> <li> LEGO </li> <li> HASBRO </li> <li> GIOCHI PREZIOSI </li> <li> TY </li> <li> EPOCH </li> <li> PLAYMOBIL </li> <li> SMOBY </li> <li> DOUDOU ET COMPAGNIE </li> </ol> <br> <br> And here are the brands more present in boys' toys : <ol> <li> LEGO </li> <li> PLAYMOBIL </li> <li> HASBRO </li> <li> MATTEL </li> <li> SMOBY </li> <li> BRUDER </li> <li> RUBIE'S </li> <li> JOHN WORLD </li> <li> GIOCHI PREZIOSI </li> <li> LE COIN DES ENFANTS </li> </ol>";
    var img = document.createElement('img');
    img.src = "data/marques_words.png";
    img.algin ="left";
    img.classList.add("imgDescription", "sideContent");
    container.appendChild(img);
}
function projectPinkTaxe(){
    initVisualization();
    var projectDescription = document.createElement("div");
    projectDescription.classList.add("textDescription");
    container.innerHTML = "";
    container.appendChild(projectDescription);
    projectDescription.innerHTML = "Pink tax refers to a price difference between products labelled for women and those labelled for men, to the detriment of women. <br> <br> Does the pink tax apply to toys in the La grande récré catalogue? <br> <br> At first glance, the pink tax does not seem to concern this catalogue, in fact the average price of toys for girls is 25 euros against 33 euros for toys for boys (the distribution of toys according to their price and the gender they are associated with is visible on the second figure). <br> <br>  We have tried to highlight the pink tax by comparing the prices of toys with the same volume. But here again, as shown in the figure opposite, girls' toys are cheaper than boys' toys at the same volume.";
    var img = document.createElement('img');
    img.classList.add("imgDescription", "sideContent");
    img.src = "data/pink_tax.png";
    img.algin ="left";
    container.appendChild(img);
    
}

function ProjectPrices(){
    initVisualization();
    var projectDescription = document.createElement("div");
    projectDescription.classList.add("textDescription");
    container.innerHTML = "";
    container.appendChild(projectDescription);
    projectDescription.innerHTML = "Are the most gendered toys the cheapest ones? <br> <br> Well! Not in the catalog of La Grande Récré! Among the girls' toys that cost less than 10 euros, 24% are pink while among the toys that cost more than 50 euros 31%. ";
    var img = document.createElement('img');
    img.classList.add("imgDescription", "sideContent");
    img.src = "data/prices_girls.png";
    img.algin ="left";
    container.appendChild(img);
}