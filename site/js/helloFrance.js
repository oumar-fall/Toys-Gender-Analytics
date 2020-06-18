function showFrance() {
    container.innerHTML = '<div class="visualization-container"><div class="panel left-panel"><div class="infos"><h1 class="info infoTitle">Place</h1><div class="infoDetails"><p class="info">Code Postal :<span class="infoValue codePostal"></span></p><p class="info">Population :<span class="infoValue population"></span></p><p class="info">Densite :<span class="infoValue densite"></span></p><p class="info">Longitude :<span class="infoValue longitude"></span></p><p class="info">Latitude :<span class="infoValue latitude"></span></p><p class="info">Code Insee :<span class="infoValue inseeCode"></span></p></div></div></div><div class="panel center-panel"></div><div class="panel right-panel"></div></div>';

    const w = parseFloat(canvas_w);
    const h = w;
    let x, y, zoomState;
    let dataset = [];

    let densityColorLegend = {
        title : "Densité de population",
        unit : "(en hab/km²)",
        colors : ["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],
        domain : [15, 80, 250, 2000, 15000],
        labels : ["0 - 15", "15 - 80", "80 - 250", "250 - 2000", "2000 - 15,000", "15,000 +"],
        color : function(d) {
            let densColor = d3.scaleThreshold()
                                .domain(this.domain)
                                .range(this.colors);
            return densColor(d.densite);
        }
    }

    let populationColorLegend = {
        title : "Population",
        unit : "(en nombre d'habitants)",
        colors : ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
        domain : [500, 2000, 5000, 10000, 20000, 50000],
        labels : ["< 500", "500 - 2,000", "2,000 - 5,000", "5,000 - 10,000", "10,000 - 20,000", "20,000 - 50,000", "> 50,000"],
        color : function(d) {
            let popColor = d3.scaleThreshold()
                                .domain(this.domain)
                                .range(this.colors);
            return popColor(d.population);
        }
    }



    let svg = d3.select(".center-panel")
                .append("svg")
                    .attr("width", w+50) //adding space for the axis (20px)
                    .attr("height", h+50) //adding space for the axis (20px)
                    .attr("viewBox", [0, 0, w+50,  h+50])
                    .attr("class", "visualizationSvg")

    let colorScaleContainer = d3.select(".right-panel")
                                    .append("svg")
                                    .attr("class", "colorScaleContainer")
                                    .attr("height", "100%")

    let buttonPanel = d3.select(".right-panel")
                            .append("div")
                            .attr("class", "buttonPanel")

    let showDensityBtn = buttonPanel.append("button")
                                    .html("Density")
                                    .attr("onclick", "showDensity()")

    let showPopulationBtn = buttonPanel.append("button")
                                    .html("Population")
                                    .attr("onclick", "showPopulation()")


    var xAxis, yAxis, gX, gY;


    d3.tsv("data/france.tsv")
        .row( (d, i) => {
            return {
                codePostal: +d["Postal Code"],
                inseeCode: +d.inseecode,
                place: d.place,
                longitude: +d.x,
                latitude: +d.y,
                population: +d.population,
                densite: +d.density
            };
        })
        .get( (err, rows) => {
            console.log("Loaded " + rows.length + " rows");
            if (rows.length > 0) {
                console.log("First row: ");
                console.log(rows[0]);
                console.log("Last row: ");
                console.log(rows[rows.length-1]);
            }
            dataset = rows;
            x = d3.scaleLinear()
                .domain(d3.extent(rows, (row) => row.longitude))
                .range([0, w]);
            y = d3.scaleLinear()
                .domain(d3.extent(rows, (row) => row.latitude))
                .range([h, 0]);

            draw(densityColorLegend);
        });

        

    function draw(colorLegend) {
        svg.selectAll("*").remove();
        colorScaleContainer.selectAll("*").remove();
        var g_france = svg.append('g');
        g_france.selectAll("circle")
                    .data(dataset)
                .enter().append("circle")
                    .attr("r", 1)
                    .attr("height", 1)
                    .attr("cx", (d) => x(d.longitude))
                    .attr("cy", (d) => y(d.latitude))
                    .attr("fill", (d) => colorLegend.color(d))
                    .on("mouseover", onMouseOver);

        zoomed(g_france)
        zoom = d3.zoom()
                    .scaleExtent([1, 10])
                    .on("zoom", () => zoomed(g_france));

        svg.call(zoom)

        xAxis = d3.axisBottom(x)
                .ticks(10)
                .tickSize(10)
                .tickPadding(5);
        yAxis = d3.axisRight(y)
                .ticks(10, ".3f")
                .tickSize(10)
                .tickPadding(5);

        gX = svg.append('g')
        .style("font-size", "30px")
        .attr("class", "x axis")
        .attr("transform" , "translate(0, " + (h+10) + ")")
        gX.call(xAxis)
            .insert("rect", ":first-child")
                .attr("class", "bg")
                .attr("height", "100%")
                .attr("width", "100%")
        gY = svg.append('g')
        .style("font-size", "30px")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (w+10) + ", 0)")
        gY.call(yAxis)
            .insert("rect", ":first-child")
                .attr("class", "bg")
                .attr("height", "100%")
                .attr("width", "100%")
        
        drawColorLegend(colorLegend);
    }

    function drawColorLegend(colorLegend){
        colorScaleContainer.selectAll('rect')
                            .data(colorLegend.colors)
                            .enter()
                            .append('rect')
                                .attr('fill', (d, i) => colorLegend.colors[i])
                                .attr('y', (d, i) => 120+i*60)
                                .attr("height", "60")
                                .attr("width", "60")
        colorScaleContainer.selectAll('text')
                            .data(colorLegend.colors)
                            .enter()
                                .append('text')
                                .text((d, i) => colorLegend.labels[i])
                                .attr('y', (d, i) => 155+i*60)
                                .attr('font-size', "10px")
                                .attr('x', "65")
        colorScaleContainer.append('text')
                            .text(colorLegend.title)
                            .attr('font-size', "18px")
                            .attr('y', "50")
                            .attr('x', '100')
                            .attr('text-anchor', "middle")
        colorScaleContainer.append('text')
                            .text(colorLegend.unit)
                            .attr('font-size', "16px")
                            .attr('font-style', "italic")
                            .attr('y', "80")
                            .attr('x', '100')
                            .attr('text-anchor', "middle")
    }

    function showDensity() {
        densColor = d3.scaleThreshold()
                .domain(densityColorLegend.domain)
                .range(densityColorLegend.colors);
        draw(densityColorLegend);
    }

    function showPopulation() {
        densColor = d3.scaleThreshold()
                .domain(populationColorLegend.domain)
                .range(populationColorLegend.colors);
        draw(populationColorLegend);
    }

    function zoomed(g){
        if (d3.event){
            zoomState = d3.event.transform;
        }
        if (zoomState){
            g.attr("transform", zoomState);

            // const vb = svg.attr("viewBox").split(',').map((d) => +d);
        
            gX.call(xAxis.scale(zoomState.rescaleX(x)));
            gY.call(yAxis.scale(zoomState.rescaleY(y)));
        }
    }


    function onMouseOver(d, i){
        d3.select('.infoTitle')
            .html(d.place);
        d3.select('.codePostal')
        .html(d.codePostal);
        d3.select('.population')
            .html(d.population);
        d3.select('.densite')
        .html(d.densite);
        d3.select('.longitude')
            .html(d.longitude);
        d3.select('.latitude')
        .html(d.latitude);
        d3.select('.inseeCode')
            .html(d.inseeCode);
    }
}