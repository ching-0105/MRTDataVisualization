// var selctedStation = '三民高中';
export function HistoryWindow(selctedStation,data){
    var containerDiv = d3.select("#History_dataviz");
        containerDiv.style("width", "900px");
        containerDiv.style("height", "500px");

    // console.log("get data")
    // d3.csv("../Dataset/bigdata.csv").then( function(data) {
    //     data.forEach(function (d) {
    //         d.DateTime = new Date(d.DateTime);
    //     });
    //     console.log("get data done")

    // 第一個 div 放年月日下拉選單
    var dropdownDiv = containerDiv.append("div")
        .attr("id", "dropdownDiv");
    var mode = "day"
    
    createDropdown(); // 創建下拉式選單

    // 第二個 div 放動態調整的行事曆
    var calendarDiv = containerDiv.append("div")
        .attr("id", "calendarDiv")
        .style("display", "inline-block");

    // 第三個 div 放繪製的折線圖
    var chartDiv = containerDiv.append("div").attr("id", "chartDiv");
    var margin = { top: 20, right: 100, bottom: 30, left: 80 };
    var svgWidth = 800 - margin.left - margin.right;
    var svgHeight = 500 - margin.top - margin.bottom;

    // Create the SVG container
    var chartSvg = chartDiv.append("svg")
        .attr("width", 800)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    updateSelector(mode) // 預設選擇為 day
    var selectedYear;    

    function createDropdown() {
        // 獲取不同的時間尺度
        var timeScales = ['day', 'month', 'year'];

        // 創建時間尺度的下拉式選單
        var timeScaleDropdown = dropdownDiv
            .append("select")
            .attr("id", "timeScaleDropdown")
            .on("change", function () {
                var selectedValue = d3.select(this).property("value");
                console.log("所選的time scale是:" + selectedValue);
                mode = selectedValue;
                updateSelector(selectedValue);
            })
            .style("margin", "10px");

        

        timeScaleDropdown.selectAll("option")
            .data(timeScales)
            .enter().append("option")
            .text(function (d) { return d; });
    }
    function updateSelector(selectedValue) {
        calendarDiv.selectAll("input").remove();
        if (selectedValue == "day"){
            var updated = false;
            var datepicker = calendarDiv.append("input")
                .attr("id", "datepicker")
                .attr("class","date-picker")
                .style("margin", "10px");

            $( "#datepicker" ).datepicker({
                dateFormat: "yy-mm-dd",
                defaultDate : new Date(2023, 10, 30),
                changeMonth: true, changeYear: true,
                minDate: new Date(2017, 0, 1), maxDate: new Date(2023, 10, 30),
                onSelect: function(selectedDate) {
                    // console.log("選取的date是: ", selectedDate)
                    updated = true
                    updateChart(data, selctedStation);
            }})

            $("#datepicker").val("2023-11-30");
            if(!updated) updateChart(data, selctedStation);
        }
        else if(selectedValue == "month"){
            // 計算現在的日期與2017/1之間的月份差
            const currentDate = new Date();
            const january2017 = new Date(2017, 0, 1);
            const november2023 = new Date(2023, 10, 1);
            // 計算兩個日期之間的月份差
            const startMonthsDiff = (currentDate.getFullYear() - january2017.getFullYear()) * 12 +
                currentDate.getMonth() - january2017.getMonth();
            const endMonthsDiff = (currentDate.getFullYear() - november2023.getFullYear()) * 12 +
                currentDate.getMonth() - november2023.getMonth();
            
            var updated = false;
            var monthpicker = calendarDiv.append("input")
                .attr("id", "monthpicker")
                .attr("class","month-picker")
                .style("margin", "10px");
            $('#monthpicker').MonthPicker({ 
                Button: false,
                SelectedMonth: '2023-11',
                MonthFormat: 'yy-mm', // Short month name, Full year.
                MinMonth: -startMonthsDiff, MaxMonth: -endMonthsDiff,
                OnAfterChooseMonth: function(value) {
                    // console.log("選取的month和year是: ", SelectedMonth);
                    updated = true
                    updateChart(data, selctedStation);}
                })
            if(!updated) updateChart(data, selctedStation);
        }
        else{
            console.log("113")
            var yearpicker = calendarDiv.append("input")
                .attr("id", "yearpicker")
                .style("margin", "10px");
            
            $('#yearpicker').yearpicker({
                year: 2023, // 選擇的初始年份
                startYear: 2017, // 起始年份
                endYear: 2023, // 結束年份
                allowFuture: false, // 允許選擇未來年份
                onChange : function(value){
                    selectedYear = value
                    // console.log("選取的年份是: ", value);
                    updateChart(data, selctedStation);
                }
            });
        }
    }
    function getDailySum(filteredData) {
        var dailySum = [];

        filteredData.forEach(function(d) {
            var day = d.DateTime.getDate();
            if (!dailySum[day-1]) {
                dailySum[day-1] = { Date:day, EnterNum: 0, LeaveNum: 0};
            }

            dailySum[day-1].EnterNum += +d.EnterNum;
            dailySum[day-1].LeaveNum += +d.LeaveNum;
        });
        return dailySum
    }
    function getMonthSum(filteredData) {
        var monthSum = [];

        filteredData.forEach(function(d) {
            var month = d.DateTime.getMonth();
            if (!monthSum[month]) {
                monthSum[month] = { Month:month+1, EnterNum: 0, LeaveNum: 0};
            }

            monthSum[month].EnterNum += +d.EnterNum;
            monthSum[month].LeaveNum += +d.LeaveNum;
        });
        return monthSum
    }
    function updateChart(originalData, selctedStation) {
        chartSvg.selectAll("*").remove();
        var selectedTimeScale = mode;

        if(selectedTimeScale == 'day'){
            var selectedDate = $("#datepicker").datepicker("getDate").toDateString();
            console.log("選取的date是: ", selectedDate)
            var filteredData = originalData.filter(function (d) {
                var dataDate = d.DateTime.toDateString();
                // 使用選擇的日期進行篩選
                return dataDate === selectedDate && d.Station === selctedStation;
            });
            renderLineChartDay(filteredData, selctedStation)
        }
        else if(selectedTimeScale == 'month'){
            var selectedY = $('#monthpicker').MonthPicker('GetSelectedYear');
            var selectedMonth = $('#monthpicker').MonthPicker('GetSelectedMonth');
            console.log("選取的month和year是: ", selectedY, selectedMonth);
            var filteredData = originalData.filter(function(d) {
                // 使用選擇的月份進行篩選
                return d.DateTime.getMonth() === selectedMonth-1
                    && d.DateTime.getFullYear() === selectedY
                    && d.Station === selctedStation;
            });
            renderLineChartMonth(getDailySum(filteredData), selctedStation)
        }
        else{
            // var selectedYear = $("#yearpicker").yearpicker("getValue");
            console.log("選取的year是: ", selectedYear);
            var filteredData = originalData.filter(function(d) {
                // 使用選擇的年份進行篩選
                return d.DateTime.getFullYear() === selectedYear
                    && d.Station === selctedStation;
            });
            renderLineChartYear(getMonthSum(filteredData), selctedStation)
        }
    }


    function createLegend(selctedStation) {
        var legend = chartSvg.append("g")
            .attr("transform", "translate(" + (svgWidth+margin.left+20) + "," + margin.top + ")");
        
        legend.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style("text-anchor", "end")
            .style("font-size", "1.1em")
            .style("fill", "black")
            .style("font-family", "Arial, sans-serif")
            .text(selctedStation);

        legend.append("circle").attr("cx",-70).attr("cy",20).attr("r", 6).style("fill", "#8E6C8A")
        legend.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .text("進站人數")
            .style("font-size", "0.9em")
            .style("text-anchor", "end")
            .style("font-family", "Arial, sans-serif")
            .style("fill", "#8E6C8A")
            .attr("alignment-baseline","middle")
        legend.append("circle").attr("cx",-70).attr("cy",40).attr("r", 6).style("fill", "#69b3a2")
        legend.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .text("出站人數")
            .style("font-size", "0.9em")
            .style("text-anchor", "end")
            .style("font-family", "Arial, sans-serif")
            .style("fill", "#69b3a2")
            .attr("alignment-baseline","middle")
    }
    function renderLineChartYear(data, selctedStation) {
        // create a tooltip
        var Tooltip = d3.select("body")
            .append("div")
            .attr("class","d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "15px")
            .style("background", "rgba(0,0,0,0.6)")
            .style("border-radius", "5px")
            .style("color", "#fff")
            .text("a simple tooltip");
        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseoverE = function(event,d) {
            console.log('mouseoverE')
            Tooltip
                .html("進站人數: " + d.EnterNum).style("visibility", "visible")
                .style("opacity", 1)
        }
        var mouseoverL = function(event,d) {
            Tooltip
                .html("出站人數: " + d.LeaveNum).style("visibility", "visible")
                .style("opacity", 1)
        }
        var mousemove = function(event,d) {
            Tooltip
                .style("left", `${event.pageX+10}px`)
                .style("top", `${event.pageY}px`)
        }
        var mouseleave = function(event,d) {
            Tooltip
                .style("opacity", 0)
                .html(``).style("visibility", "hidden");
        }
        
        // 創建 x 軸和 y 軸的比例尺
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, d=>d.Month))
            .range([0, svgWidth])
            // .padding(0.1);
        var min = d3.min(data, d => Math.min(d.EnterNum, d.LeaveNum)),
            max = d3.max(data, d => Math.max(d.EnterNum, d.LeaveNum));
        min = min - 0.1*(max-min)

        var yScale = d3.scaleLinear()
            // .domain([0, d3.max(data, d => Math.max(d.EnterNum, d.LeaveNum))])
            .domain([min, max])
            .range([svgHeight, 0]);

        // 繪製 x 軸和 y 軸
        chartSvg.append('g')
            .attr('class', 'axis-x')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .call(d3.axisBottom(xScale).ticks(d3.max(data.map(d => d.Month))));

        chartSvg.append('g')
            .call(d3.axisLeft(yScale));

        // Draw EnterNum line
        chartSvg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#8E6C8A")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => xScale(d.Month))
                .y(d => yScale(d.EnterNum)));

        // Draw LeaveNum line
        chartSvg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => xScale(d.Month))
                .y(d => yScale(d.LeaveNum)));

        // Draw EnterNum circles
        chartSvg.selectAll('.enterNumCircle')
            .data(data)
            .join('circle')
            .attr("class", "enterNumCircle")
            .attr("cx", d => xScale(d.Month))
            .attr("cy", d => yScale(d.EnterNum))
            .attr("r", 5)
            .style("fill", "#8E6C8A")
            .attr("stroke", "white")
            .on("mouseover", mouseoverE)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        // Draw LeaveNum circles
        chartSvg.selectAll('.leaveNumCircle')
            .data(data)
            .join('circle')
            .attr("class", "leaveNumCircle")
            .attr("cx", d => xScale(d.Month))
            .attr("cy", d => yScale(d.LeaveNum))
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .attr("stroke", "white")
            .on("mouseover", mouseoverL)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        createLegend(selctedStation)
    }
    function renderLineChartMonth(data, selctedStation) {
        // console.log("render",data)
        var Tooltip = d3.select("body")
            .append("div")
            .attr("class","d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "15px")
            .style("background", "rgba(0,0,0,0.6)")
            .style("border-radius", "5px")
            .style("color", "#fff")
            .text("a simple tooltip");
        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseoverE = function(event,d) {
            console.log('mouseoverE')
            Tooltip
                .html("進站人數: " + d.EnterNum).style("visibility", "visible")
                .style("opacity", 1)
        }
        var mouseoverL = function(event,d) {
            Tooltip
                .html("出站人數: " + d.LeaveNum).style("visibility", "visible")
                .style("opacity", 1)
        }
        var mousemove = function(event,d) {
            Tooltip
                .style("left", `${event.pageX+10}px`)
                .style("top", `${event.pageY}px`)
        }
        var mouseleave = function(event,d) {
            Tooltip
                .style("opacity", 0)
                .html(``).style("visibility", "hidden");
        }

        // 創建 x 軸和 y 軸的比例尺
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, d=>d.Date))
            .range([0, svgWidth])
            // .padding(0.1);

        var min = d3.min(data, d => Math.min(d.EnterNum, d.LeaveNum)),
            max = d3.max(data, d => Math.max(d.EnterNum, d.LeaveNum));
        min = min - 0.1*(max-min)
        var yScale = d3.scaleLinear()
            .domain([min,max])
            // .domain([d3.min(data, d => Math.min(d.EnterNum, d.LeaveNum)), d3.max(data, d => Math.max(d.EnterNum, d.LeaveNum))])
            .range([svgHeight, 0]);

        // 繪製 x 軸和 y 軸
        chartSvg.append('g')
            .attr('class', 'axis-x')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .call(d3.axisBottom(xScale).ticks(d3.max(data.map(d => d.Date))));

        chartSvg.append('g')
            .call(d3.axisLeft(yScale));
        
        // Draw EnterNum line
        chartSvg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#8E6C8A")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => xScale(d.Date))
                .y(d => yScale(d.EnterNum)));

        // Draw LeaveNum line
        chartSvg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => xScale(d.Date))
                .y(d => yScale(d.LeaveNum)));

        // Draw EnterNum circles
        chartSvg.selectAll('.enterNumCircle')
            .data(data)
            .join('circle')
            .attr("class", "enterNumCircle")
            .attr("cx", d => xScale(d.Date))
            .attr("cy", d => yScale(d.EnterNum))
            .attr("r", 5)
            .style("fill", "#8E6C8A")
            .attr("stroke", "white")
            .on("mouseover", mouseoverE)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        // Draw LeaveNum circles
        chartSvg.selectAll('.leaveNumCircle')
            .data(data)
            .join('circle')
            .attr("class", "leaveNumCircle")
            .attr("cx", d => xScale(d.Date))
            .attr("cy", d => yScale(d.LeaveNum))
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .attr("stroke", "white")
            .on("mouseover", mouseoverL)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        createLegend(selctedStation)
    }
    function renderLineChartDay(data, selctedStation) {
        var Tooltip = d3.select("body")
            .append("div")
            .attr("class","d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "15px")
            .style("background", "rgba(0,0,0,0.6)")
            .style("border-radius", "5px")
            .style("color", "#fff")
            .text("a simple tooltip");
        //Three function that change the tooltip when user hover / move / leave a cell
        var mouseoverE = function(event,d) {
            console.log('mouseoverE')
            Tooltip
                .html("進站人數: " + d.EnterNum).style("visibility", "visible")
                .style("opacity", 1)
        }
        var mouseoverL = function(event,d) {
            Tooltip
                .html("出站人數: " + d.LeaveNum).style("visibility", "visible")
                .style("opacity", 1)
        }
        var mousemove = function(event,d) {
            Tooltip
                .style("left", `${event.pageX+10}px`)
                .style("top", `${event.pageY}px`)
        }
        var mouseleave = function(event,d) {
            Tooltip
                .style("opacity", 0)
                .html(``).style("visibility", "hidden");
        }

        data.forEach(function (d) {
            d.hour = d.DateTime.getHours();
            d.EnterNum = +d.EnterNum;
            d.LeaveNum = +d.LeaveNum;
        });
        // console.log("render", data)
        
        // 創建 x 軸和 y 軸的比例尺
        var xScale = d3.scaleLinear()
            .domain([0, 23])
            .range([0, svgWidth]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.EnterNum, d.LeaveNum))])
            .range([svgHeight, 0]);

        // 繪製 x 軸和 y 軸
        chartSvg.append("g")
            .attr('class', 'axis-x')
            .attr("transform", "translate(0," + svgHeight + ")")
            .call(d3.axisBottom(xScale).ticks(24));

        chartSvg.append("g")
            .call(d3.axisLeft(yScale));

        // Draw EnterNum line
        chartSvg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#8E6C8A")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(d => xScale(d.hour))
            .y(d => yScale(d.EnterNum)));

        // Draw LeaveNum line
        chartSvg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(d => xScale(d.hour))
            .y(d => yScale(d.LeaveNum)));

        // Draw EnterNum circles
        chartSvg.selectAll('.enterNumCircle')
            .data(data)
            .join('circle')
            .attr("class", "enterNumCircle")
            .attr("cx", d => xScale(d.hour))
            .attr("cy", d => yScale(d.EnterNum))
            .attr("r", 5)
            .style("fill", "#8E6C8A")
            .attr("stroke", "white")
            .on("mouseover", mouseoverE)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        // Draw LeaveNum circles
        chartSvg.selectAll('.leaveNumCircle')
            .data(data)
            .join('circle')
            .attr("class", "leaveNumCircle")
            .attr("cx", d => xScale(d.hour))
            .attr("cy", d => yScale(d.LeaveNum))
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .attr("stroke", "white")
            .on("mouseover", mouseoverL)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)
        createLegend(selctedStation)
    } 
    
        
        

    
}
// HistoryWindow(selctedStation)