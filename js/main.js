
let data, scatterplot, barchart;

const dispatcher = d3.dispatch('filterCategories');


d3.csv("heart_2020_cleaned.csv")
    .then(_data => {
        console.log('Data loading complete. Work with dataset.');

            data = _data;
            data.forEach(d=> {
                    d.BMI = +d.BMI
                    d.MentalHealth = +d.MentalHealth
                    d.PhysicalHealth = +d.PhysicalHealth
                    d.SleepTime = +d.SleepTime
            })
            console.log(data)
            const colorScale = d3.scaleOrdinal()
                .range(['#2800DB', '#E06CC3', '#5599E0', '#E0A53F', '#64E04A']) // Different color for each region
                .domain(['NorthernAfrica', 'MiddleAfrica', 'WesternAfrica', 'SouthernAfrica', 'CentralAsia']);



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
                    scatterplot.updateVis();})


            })

