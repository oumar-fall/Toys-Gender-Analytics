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
    projectDescription.innerHTML = "Are certain types of toys more associated with one gender or the other? For example, dolls for girls and trucks for boys.  That's often what people think. Well, this thinking is encouraged by toy catalogues, indeed, that's what the picture shows. The words most often found in the names of toys for girls are words like doll or princess, while for boys we find the famous trucks! ";
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
    projectDescription.innerHTML = "The difference between the brands of girls' and boys' toys is also impressive.  Some brands make toys that are attributed to only one sex, such as Corolle (the doll brand) or Playmobil.  ";
    var img = document.createElement('img');
    img.src = "data/marques_words.png";
    img.algin ="left";
    container.appendChild(img);
}