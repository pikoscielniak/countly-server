var dayHourHeatmap = (function () {
    var margin = {top: 20, right: 0, bottom: 100, left: 30};
    var width = 960 - margin.left - margin.right;
    var height = 430 - margin.top - margin.bottom;
    var gridSize = Math.floor(width / 24)
    var legendElementWidth = gridSize * 2;
    var colors = ["#FFFFFF", "#d4ffff", "#c4f8ff", "#b5e8ff", "#a4d6f5", "#93c6e6",
        "#84b8d9", "#76aacc", "#396B94"];
    var buckets = colors.length;

    var times = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00"];

    function getSelector(id) {
        return id[0] === "#" ? id : "#" + id;
    }

    function initDays() {
        var days = ["mo", "tu", "we", "th", "fr", "sa", "su"];
        return _.map(days, function (day) {
            return jQuery.i18n.map["common.days." + day];
        });
    }

    function initSvg(id) {
        var selector = getSelector(id);

        return d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    function quantileColors(data) {
        return d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (d) {
                return d.value;
            })])
            .range(colors);
    }

    function drawDayLabels(svg) {
        var days = initDays();
        svg.selectAll(".dayLabel")
            .data(days)
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) {
                return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
            });
    }

    function drawHourLabels(svg) {
        return svg.selectAll(".timeLabel")
            .data(times)
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return i * gridSize;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function (d, i) {
                return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
            });
    }

    function drawHeatMap(svg, data, colorScale) {
        var heatMap = svg.selectAll(".hour")
            .data(data);
        heatMap.enter()
            .append("rect")
            .attr("x", function (d) {
                return (d.hour) * gridSize;
            })
            .attr("y", function (d) {
                return (d.day - 1) * gridSize;
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])
            .append("title")
            .text(function (d) {
                return d.value;
            });

        heatMap.transition().duration(1000)
            .style("fill", function (d) {
                return colorScale(d.value);
            });

        heatMap.select("title")
            .text(function (d) {
                return d.value;
            });
    }

    function drawLegend(svg, colorScale) {
        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function (d) {
                return d;
            })
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function (d, i) {
                return colors[i];
            });

        legend.append("text")
            .attr("class", "mono")
            .text(function (d) {
                return "≥ " + Math.round(d);
            })
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height + gridSize);
    }


    function getSvg(id) {
        var selector = getSelector(id);
        return d3.select(selector);
    }

    function refreshLegend(svg, colorScale) {
        var data = [0].concat(colorScale.quantiles());
        svg.selectAll(".legend")
            .select('text')
            .text(function (d, i) {
                return "≥ " + Math.round(data[i]);
            })
    }

    function refresh(options) {
        var data = options.data;
        var colorScale = quantileColors(data);
        var svg = getSvg(options.domElemId);
        drawHeatMap(svg, data, colorScale);
        refreshLegend(svg, colorScale);
    }


    function draw(options) {
        var data = options.data;
        var colorScale = quantileColors(data);
        var svg = initSvg(options.domElemId);
        drawDayLabels(svg);
        drawHourLabels(svg);
        drawHeatMap(svg, data, colorScale);
        drawLegend(svg, colorScale);
    }

    return {
        /**
         * @param {object} options
         * {
         *  domElemId:"dom element id", //
         *  data: [{day:1,hour:3,value:7},{day:2,hour:0,value:23}],
         * }
         * @returns undefined
         */
        draw: draw,
        refresh: refresh
    }
}());
