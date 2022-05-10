
let data, scatterplot, barchart, scatterplotphmh;

const dispatcher = d3.dispatch('filterCategories');


d3.csv("heart_2020_cleaned.csv")
    .then(_data => {
        //filters data to a random selection of 10,000 items
        var _data = _data.sort(() => .5 - Math.random()).slice(0, 10000)
        console.log('Data loading complete. Work with dataset.');

        data = _data;
        data.forEach(d => {
            d.BMI = +d.BMI
            d.MentalHealth = +d.MentalHealth
            d.PhysicalHealth = +d.PhysicalHealth
            d.SleepTime = +d.SleepTime
            d.x = +d.MentalHealth
            d.y = +d.MentalHealth
        })
        console.log(data)
        const colorScale = d3.scaleOrdinal()
            .range(d3.schemeCategory10) // Different color for each age group
            .domain(['80 or older', '75-79', '70-74', '65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '18-24']);


        scatterplot = new Scatterplot({
            parentElement: '#scatterplot',
            colorScale: colorScale
        }, data);
        scatterplot.updateVis();


        barchart = new Barchart({
            parentElement: '#barchart',
        }, dispatcher, data);
        barchart.updateVis();


        dispatcher.on('filterCategories', selectedCategories => {
            if (selectedCategories.length == 0) {
                scatterplot.data = data;
            } else {
                scatterplot.data = data.filter(d => selectedCategories.includes(d.AgeCategory));
            }
            scatterplot.updateVis();
        })

        // When the dropdown in changed , the axis changes
        d3.select("#y-value").on("change", function (event, d) {
            var selected = d3.select(this).property('value')
            data.forEach(d => {
                d.y = d[selected]
            })
            scatterplot.data
            scatterplot.updateVis()
        })


        d3.select("#x-value").on("change", function (event, d) {
            var selected = d3.select(this).property('value')
            data.forEach(d => {
                d.x = d[selected]
            })
            scatterplot.data
            scatterplot.updateVis()
        })


console.log(data.filter(d=> d.HeartDisease == 'Yes' && d.Sex =='Male').length)

        function groupedbar(){


            const groupData = [
                { key: 'Male', values:
                        [
                            {grpName:'Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'Yes' && d.Sex == 'Male').length},
                            {grpName:'No Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'No' && d.Sex == 'Male').length},

                        ]
                },
                { key: 'Female', values:
                        [
                            {grpName:'Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'Yes' && d.Sex == 'Female').length},
                            {grpName:'No Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'No' && d.Sex == 'Female').length},

                        ]
                }]



            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 800 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;



            var x0  = d3.scaleBand().rangeRound([0, width], .5);
            var x1  = d3.scaleBand();
            var y   = d3.scaleLinear().rangeRound([height, 0]);

            var xAxis = d3.axisBottom().scale(x0)
                .tickValues(groupData.map(d=>d.key));

            var yAxis = d3.axisLeft().scale(y);

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            var svg = d3.select('body').append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var categoriesNames = groupData.map(function(d) { return d.key; });
            var rateNames       = groupData[0].values.map(function(d) { return d.grpName; });

            x0.domain(categoriesNames);
            x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
            y.domain([0, d3.max(groupData, function(key) { return d3.max(key.values, function(d) { return d.grpValue; }); })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);


            svg.append("g")
                .attr("class", "y axis")
                .style('opacity','0')
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('font-weight','bold')
                .text("Value");

            svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

            var slice = svg.selectAll(".slice")
                .data(groupData)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

            slice.selectAll("rect")
                .data(function(d) { return d.values; })
                .enter().append("rect")
                .attr("width", x1.bandwidth())
                .attr("x", function(d) { return x1(d.grpName); })
                .style("fill", function(d) { return color(d.grpName) })
                .attr("y", function(d) { return y(0); })
                .attr("height", function(d) { return height - y(0); })



            slice.selectAll("rect")
                .transition()
                .delay(function (d) {return Math.random()*1000;})
                .duration(1000)
                .attr("y", function(d) { return y(d.grpValue); })
                .attr("height", function(d) { return height - y(d.grpValue); });

            //Legend
            var legend = svg.selectAll(".legend")
                .data(groupData[0].values.map(function(d) { return d.grpName; }).reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d,i) { return "translate(20," + i * 20 + ")"; })
                .style("opacity","0");

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d) { return color(d); });

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {return d; });

            legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");




        }

groupedbar()

        function parallel() {
            const margin = {top: 30, right: 500, bottom: 10, left: 50},
                width = 1450 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
            const svg = d3.select("body")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    `translate(${margin.left},${margin.top})`);

            const color = d3.scaleOrdinal()
                .domain(["Yes", "No"])
                .range([ "#FA0D00", "#4008FF"])

            dimensions = ["BMI", "MentalHealth", "PhysicalHealth", "SleepTime"]

            const y = {}
            for (i in dimensions) {
                name = dimensions[i]
                y[name] = d3.scaleLinear()
                    .domain( d3.extent(data, function(d) { return +d[name]; }) )
                    // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                    .range([height, 0])
            }

            x = d3.scalePoint()
                .range([0, width])
                .domain(dimensions);


            const highlight = function(event, d){

                selected_val = d.HeartDisease

                // first every group turns grey
                d3.selectAll(".line")
                    .transition().duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", "0.2")
                // Second the hovered specie takes its color
                d3.selectAll("." + selected_val)
                    .transition().duration(200)
                    .style("stroke", color(selected_val))
                    .style("opacity", "1")
            }

            // Unhighlight
            const doNotHighlight = function(event, d){
                d3.selectAll(".line")
                    .transition().duration(200).delay(1000)
                    .style("stroke", function(d){ return( color(d.HeartDisease))} )
                    .style("opacity", "1")
            }

            function path(d) {
                return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            }

            svg
                .selectAll("myPath")
                .data(data)
                .join("path")
                .attr("class", function (d) { return "line " + d.HeartDisease } ) // 2 class for each line: 'line' and the group name
                .attr("d",  path)
                .style("fill", "none" )
                .style("stroke", function(d){ return( color(d.HeartDisease))} )
                .style("opacity", 0.5)
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight )

            // Draw the axis:
            svg.selectAll("myAxis")
                // For each dimension of the dataset I add a 'g' element:
                .data(dimensions).enter()
                .append("g")
                .attr("class", "axis")
                // I translate this element to its right position on the x axis
                .attr("transform", function(d) { return `translate(${x(d)})`})
                // And I build the axis with the call function
                .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
                // Add axis title
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "black")

        }
parallel()

        console.log('Done Loading')
    })






