import { get_red_line_stations } from './mrt_position.js';
import { get_blue_line_stations } from './mrt_position.js';
import { get_orange_line1_stations } from './mrt_position.js';
import { get_orange_line2_stations } from './mrt_position.js';
import { get_green_line_stations } from './mrt_position.js';
import { get_yellow_line_stations } from './mrt_position.js';
import { get_brown_line_stations } from './mrt_position.js';
import { HistoryWindow } from '../History/History.js';
var filtered_date_data, filtered_hour_data
var red_line, blue_line, orange_line1, orange_line2, green_line, yellow_line, brown_line
var cur_hour, clicked_station
var data_for_history
// var calendarDiv
const svg = d3.select("#map").append("svg")
    .attr("width", 1000)
    .attr("height", 1500);
// calendarDiv = d3.select("#map").append("div")
// .attr("id", "calendarDiv")
// .style("display", "inline-block");
d3.csv("../Dataset/bigdata.csv").then(function(dataset) {
    var data = dataset.map(d => {
        return {
            "DateTime": d['DateTime'],
            "Station": d['Station'],
            "Value": (+d['EnterNum'] + +d['LeaveNum'])
        }
    })

    data_for_history = dataset.map(d => {
        return {
            "DateTime": new Date(d['DateTime']),
            "EnterNum": d['EnterNum'],
            "LeaveNum": d['LeaveNum'],
            "Station": d['Station']
        }
    })
    // var data_for_history = JSON.parse(JSON.stringify(dataset));
    // data_for_history.forEach(function (d) {
    //     d.DateTime = new Date(d.DateTime);
    // });
    // updateSelector();
    red_line = get_red_line_stations()
    blue_line = get_blue_line_stations()
    orange_line1 = get_orange_line1_stations()
    orange_line2 = get_orange_line2_stations()
    green_line = get_green_line_stations()
    yellow_line = get_yellow_line_stations()
    brown_line = get_brown_line_stations()
    draw_mrt_line(red_line, "red", "red",1)
    draw_mrt_line(blue_line, "blue", "blue", 1)
    draw_mrt_line(orange_line1, "orange", "orange", 1)
    draw_mrt_line(orange_line2, "orange2", "orange", 1)
    draw_mrt_line(green_line, "green", "green", 1)
    draw_mrt_line(yellow_line, "yellow","#FFD700", 1)
    draw_mrt_line(brown_line, "brown", "#A67B5B", 1)
    addButtons();
    addDatePicker(data);
    addHourPicker();
    HistoryWindow("台北車站", data_for_history)
});

 // create tooltip element  
 const tooltip = d3.select("body")
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

function draw_mrt_line(stations, lineId, color, opacity){
    var lineGroup = svg.append("g").attr("id", "line-" + lineId);
    // 畫線串連站點
    lineGroup.selectAll("line")
        .data(stations.slice(1))
        .enter()
        .append("line")
        .attr("x1", (d, i) => stations[i].x)
        .attr("y1", (d, i) => stations[i].y)
        .attr("x2", d => d.x)
        .attr("y2", d => d.y)
        .style("stroke", color)
        .style("stroke-width", 2)
        .style("opacity", opacity)  // 設置透明度為0.5

    // 畫站點
    lineGroup.selectAll("circle")
        .data(stations)
        .enter()
        .append("g")  // 為每個站點創建一個群組元素
        .each(function (d, i) {
            const group = d3.select(this);

            // 畫站點
            group.append("circle")
                .attr("cx", d.x)
                .attr("cy", d.y)
                .attr("r", d.value)
                .style("fill", color)
                .style("opacity", opacity)  
                .on("click", handleStationClick)
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut)
                .on("mousemove", function(event, d){
                    tooltip
                      .style("top", (event.pageY-10)+"px")
                      .style("left",(event.pageX+10)+"px");
                })


            // 添加站名
            addMultiLineText(group, d.x, d.y, d.name);
        });

    // 點擊站點時觸發的函數
    function handleStationClick(event, d) {
        // d3.select(this)
        // .transition()
        // .duration(100)
        // .attr("r", d.value)  // 恢復原始大小
        // clicked_station = d.name
        clearHistory();
        HistoryWindow(d.name, data_for_history)
    }
    // 滑鼠懸停時的事件處理函數
    function handleMouseOver(event, d) {
        // d3.select(this)
        // .transition()
        // .duration(100)
        // .attr("r", 50)  // 放大站點

        tooltip.html(`${d.name} 人數:${d.ori_value}`).style("visibility", "visible");
        
    }

    // 滑鼠移開時的事件處理函數
    function handleMouseOut(event, d) {
        // d3.select(this)
        // .transition()
        // .duration(100)
        // .attr("r", d.value)  // 恢復原始大小
        tooltip.html(``).style("visibility", "hidden");
    }
    // 將文字分割成多行的函數
    function addMultiLineText(group, x, y, text) {
        const MAX_LENGTH = 3; // 最大字數限制
        if (text.length > MAX_LENGTH) {
            const part1 = text.substring(0, MAX_LENGTH);
            const part2 = text.substring(MAX_LENGTH);

            group.append("text")
                .attr("x", x + 10)
                .attr("y", y-30)
                .text(part1)
                .style("font-size", "10px")
                .style("opacity", opacity)  

            group.append("text")
                .attr("x", x + 10)
                .attr("y", y - 15) // 第二行文本向下移動一定距離
                .text(part2)
                .style("font-size", "10px")
                .style("opacity", opacity)  

        } else {
            group.append("text")
                .attr("x", x + 10)
                .attr("y", y -15)
                .text(text)
                .style("font-size", "10px")
                .style("opacity", opacity)  
        }
    }
}
function setting_btn_style(btn, color){
    // 設置按鈕樣式
    btn.style.backgroundColor = color;  // 設置背景顏色為紅色
    btn.style.color = "white";          // 設置文字顏色為白色
    btn.style.fontSize = "16px";        // 設置字體大小
    btn.style.padding = "10px 20px";    // 設置內邊距來增大按鈕
    btn.style.margin = "5px";           // 設置外邊距
    btn.style.border = "none";          // 移除邊框
    btn.style.borderRadius = "5px";     // 設置邊框圓角

    // 為按鈕添加滑鼠懸停和移出事件
    btn.onmouseover = function() { this.style.transform = "scale(1.2)"; }; // 變大
    btn.onmouseout = function() { this.style.transform = "scale(1)"; }; // 恢復原大小
}
function setLineOpacity(lineId, opacity) {
    var lineGroup = d3.select("#line-" + lineId);
    lineGroup.selectAll("line").style("opacity", opacity);
    lineGroup.selectAll("circle").style("opacity", opacity);
    lineGroup.selectAll("text").style("opacity", opacity);
}
function addButtons() {
    // 獲取或創建一個容器來放置按鈕
    var buttonsContainer = document.getElementById("buttons-container");
    if (!buttonsContainer) {
        buttonsContainer = document.createElement("div");
        buttonsContainer.id = "buttons-container";
        document.body.insertBefore(buttonsContainer, document.body.firstChild);
    }

    var red_ = document.createElement("button");
    red_.innerHTML = "紅線"
    red_.onclick = function() { 
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",1)
        draw_mrt_line(blue_line, "blue", "blue", 0.2)
        draw_mrt_line(orange_line1, "orange", "orange", 0.2)
        draw_mrt_line(orange_line2, "orange2", "orange", 0.2)
        draw_mrt_line(green_line, "green", "green", 0.2)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 0.2)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 0.2)
     };
    buttonsContainer.appendChild(red_);
    setting_btn_style(red_, "red")
    
    var blue_ = document.createElement("button");
    blue_.innerHTML = "藍線"
    blue_.onclick = function() { 
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",0.2)
        draw_mrt_line(blue_line, "blue", "blue", 1)
        draw_mrt_line(orange_line1, "orange", "orange", 0.2)
        draw_mrt_line(orange_line2, "orange2", "orange", 0.2)
        draw_mrt_line(green_line, "green", "green", 0.2)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 0.2)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 0.2)
     };
    buttonsContainer.appendChild(blue_);
    setting_btn_style(blue_, "blue")

    var orange_ = document.createElement("button");
    orange_.innerHTML = "橘線"
    orange_.onclick = function() { 
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",0.2)
        draw_mrt_line(blue_line, "blue", "blue", 0.2)
        draw_mrt_line(orange_line1, "orange", "orange", 1)
        draw_mrt_line(orange_line2, "orange2", "orange", 1)
        draw_mrt_line(green_line, "green", "green", 0.2)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 0.2)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 0.2)
     };
    buttonsContainer.appendChild(orange_);
    setting_btn_style(orange_, "orange")

    var green_ = document.createElement("button");
    green_.innerHTML = "綠線"
    green_.onclick = function() { 
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",0.2)
        draw_mrt_line(blue_line, "blue", "blue", 0.2)
        draw_mrt_line(orange_line1, "orange", "orange", 0.2)
        draw_mrt_line(orange_line2, "orange2", "orange", 0.2)
        draw_mrt_line(green_line, "green", "green", 1)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 0.2)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 0.2)
     };
    buttonsContainer.appendChild(green_);
    setting_btn_style(green_, "green")

    var yellow_ = document.createElement("button");
    yellow_.innerHTML = "黃線"
    yellow_.onclick = function() { 
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",0.2)
        draw_mrt_line(blue_line, "blue", "blue", 0.2)
        draw_mrt_line(orange_line1, "orange", "orange", 0.2)
        draw_mrt_line(orange_line2, "orange2", "orange", 0.2)
        draw_mrt_line(green_line, "green", "green", 0.2)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 1)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 0.2)
     };
    buttonsContainer.appendChild(yellow_);
    setting_btn_style(yellow_, "#FFD700")

    var brown_ = document.createElement("button");
    brown_.innerHTML = "棕線"
    brown_.onclick = function() { 
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",0.2)
        draw_mrt_line(blue_line, "blue", "blue", 0.2)
        draw_mrt_line(orange_line1, "orange", "orange", 0.2)
        draw_mrt_line(orange_line2, "orange2", "orange", 0.2)
        draw_mrt_line(green_line, "green", "green", 0.2)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 0.2)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 1)
     };
    buttonsContainer.appendChild(brown_);
    setting_btn_style(brown_, "#A67B5B")

    var all_ = document.createElement("button");
    all_.innerHTML = "全線"
    all_.onclick = function() { 
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",1)
        draw_mrt_line(blue_line, "blue", "blue", 1)
        draw_mrt_line(orange_line1, "orange", "orange", 1)
        draw_mrt_line(orange_line2, "orange2", "orange", 1)
        draw_mrt_line(green_line, "green", "green", 1)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 1)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 1)
     };
    buttonsContainer.appendChild(all_);
    setting_btn_style(all_, "black")
}

function addDatePicker(data) {
    var dateContainer = document.createElement("div");
    dateContainer.style.position = "absolute";
    dateContainer.style.top = "8px";
    dateContainer.style.left = "600px";

    // 添加顯示文字
    // var label = document.createElement("p");
    // label.textContent = "選擇日期：";
    // label.style.margin = "0 0 5px 0"; // 添加一些底部邊距
    // dateContainer.appendChild(label);

    var datePicker = document.createElement("input");
    datePicker.type = "date";
    datePicker.id = "date-picker";
    datePicker.name = "date";
    datePicker.style.padding = "5px";

    datePicker.min = "2017-01-01";  // 最小月份
    datePicker.max = "2023-11-30";  // 最大月份

    cur_hour = "all" // defalut
    // 當日期改變時，在控制台中輸出選擇的日期
    datePicker.addEventListener("change", function() {
        console.log("選擇的日期是：", this.value);
        filtered_date_data = filterDataByDate(data, this.value)
        filtered_hour_data = filterDataByTime(filtered_date_data, cur_hour)
        processing_data()
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",1)
        draw_mrt_line(blue_line, "blue", "blue", 1)
        draw_mrt_line(orange_line1, "orange", "orange", 1)
        draw_mrt_line(orange_line2, "orange2", "orange", 1)
        draw_mrt_line(green_line, "green", "green", 1)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 1)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 1)
    });

    dateContainer.appendChild(datePicker);
    document.body.appendChild(dateContainer);
}

function addHourPicker() {
    var hourContainer = document.createElement("div");
    hourContainer.style.position = "absolute";
    hourContainer.style.top = "50px";
    hourContainer.style.left = "600px";

    // // 添加顯示文字
    // var label = document.createElement("p");
    // label.textContent = "選擇時刻: ";
    // label.style.margin = "0 0 5px 0"; // 添加一些底部邊距
    // hourContainer.appendChild(label);

    var hourPicker = document.createElement("select");
    hourPicker.id = "hour-picker";
    hourPicker.name = "hour";
    hourPicker.style.padding = "5px";

    
    var option = document.createElement("option");
        option.value = "all";
        option.text = "all"; // 顯示為 00, 01, 02, ... , 23
        hourPicker.appendChild(option);

    // 創建並添加24個選項到選單中
    for (var i = 0; i < 24; i++) {
        var option = document.createElement("option");
        option.value = convertNumberToTime(i)
        option.text = convertNumberToTime(i) // 顯示為 00, 01, 02, ... , 23
        hourPicker.appendChild(option);
    }

    // 當選擇的小時改變時，在控制台中輸出選擇的小時
    hourPicker.addEventListener("change", function() {
        console.log("選擇的小時是：", this.value);
        cur_hour = this.value
        filtered_hour_data = filterDataByTime(filtered_date_data, this.value)
        processing_data()
        clearSvgElements()
        draw_mrt_line(red_line, "red", "red",1)
        draw_mrt_line(blue_line, "blue", "blue", 1)
        draw_mrt_line(orange_line1, "orange", "orange", 1)
        draw_mrt_line(orange_line2, "orange2", "orange", 1)
        draw_mrt_line(green_line, "green", "green", 1)
        draw_mrt_line(yellow_line, "yellow","#FFD700", 1)
        draw_mrt_line(brown_line, "brown", "#A67B5B", 1)
    });

    hourContainer.appendChild(hourPicker);
    document.body.appendChild(hourContainer);
}

function processing_data(){
    var max_value = findMaxValueAll(filtered_hour_data)
    // for red line
    for(var i=0; i<red_line.length; i++){
        var cur_station = red_line[i].name
        var cur_value = getValueByStationName(cur_station)
        red_line[i]['ori_value'] = cur_value
        cur_value = (cur_value/max_value)*35
        if(cur_value<10){
            cur_value = 10
        }
        red_line[i].value = cur_value
    }

    //var max_value = findMaxValue(blue_line, filtered_hour_data)
    // for blue line
    for(var i=0; i<blue_line.length; i++){
        var cur_station = blue_line[i].name
        var cur_value = getValueByStationName(cur_station)
        blue_line[i]['ori_value'] = cur_value
        console.log(cur_station)
        console.log(cur_value)
        cur_value = (cur_value/max_value)*35
        if(cur_value<10){
            cur_value = 10
        }
        blue_line[i].value = cur_value
    }

    //var max_value = findMaxValue(orange_line1, filtered_hour_data)
    // for orange1 line
    for(var i=0; i<orange_line1.length; i++){
        var cur_station = orange_line1[i].name
        var cur_value = getValueByStationName(cur_station)
        orange_line1[i]['ori_value'] = cur_value
        cur_value = (cur_value/max_value)*35
        if(cur_value<10){
            cur_value = 10
        }
        orange_line1[i].value = cur_value
    }

    //var max_value = findMaxValue(orange_line2, filtered_hour_data)
    // for orange2 line
    for(var i=0; i<orange_line2.length; i++){
        var cur_station = orange_line2[i].name
        var cur_value = getValueByStationName(cur_station)
        orange_line2[i]['ori_value'] = cur_value
        cur_value = (cur_value/max_value)*35
        if(cur_value<10){
            cur_value = 10
        }
        orange_line2[i].value = cur_value
    }

    var max_value = findMaxValue(green_line, filtered_hour_data)
    // for green line
    for(var i=0; i<green_line.length; i++){
        var cur_station = green_line[i].name
        var cur_value = getValueByStationName(cur_station)
        green_line[i]['ori_value'] = cur_value
        cur_value = (cur_value/max_value)*35
        if(cur_value<10){
            cur_value = 10
        }
        green_line[i].value = cur_value
    }

    //var max_value = findMaxValue(yellow_line, filtered_hour_data)
    // for yellow line
    for(var i=0; i<yellow_line.length; i++){
        var cur_station = yellow_line[i].name
        var cur_value = getValueByStationName(cur_station)
        yellow_line[i]['ori_value'] = cur_value
        cur_value = (cur_value/max_value)*35
        if(cur_value<10){
            cur_value = 10
        }
        yellow_line[i].value = cur_value
    }

    //var max_value = findMaxValue(brown_line, filtered_hour_data)
    // for brown line
    for(var i=0; i<brown_line.length; i++){
        var cur_station = brown_line[i].name
        var cur_value = getValueByStationName(cur_station)
        brown_line[i]['ori_value'] = cur_value
        cur_value = (cur_value/max_value)*35
        if(cur_value<10){
            cur_value = 10
        }
        brown_line[i].value = cur_value
    }

}

function filterDataByDate(data, date) {
    // 將輸入的日期轉換為標準格式（YYYY-MM-DD）
    var formattedDate = new Date(date).toISOString().split('T')[0];

    // 篩選出符合條件的資料
    var filteredData = data.filter(function(record) {
        return record.DateTime.startsWith(formattedDate);
    });

    return filteredData;
}

function filterDataByTime(data, time) {
    if(time == "all"){
        return sumValueByStation(data)
    }
    // 確保時刻格式是 "HH:MM"
    var formattedTime = time.length === 5 && time.indexOf(':') === 2 ? time : null;
    if (!formattedTime) {
        console.error('Invalid time format. Please use "HH:MM".');
        return [];
    }

    // 篩選出符合條件的資料
    var filteredData = data.filter(function(record) {
        // 只比較時間部分
        var recordTime = record.DateTime.split(' ')[1];
        return recordTime === formattedTime;
    });

    return sumValueByStation(filteredData);
}
function convertNumberToTime(number) {
    if (number < 0 || number > 23) {
        console.error('Invalid number. Please enter a number between 0 and 23.');
        return null;
    }

    var hours = number.toString().padStart(2, '0');
    var time = hours + ":00";
    return time;
}

function sumValueByStation(data) {
    var stationSums = {};

    data.forEach(function(record) {
        // 如果此車站尚未在對象中，則初始化
        if (!stationSums[record.Station]) {
            stationSums[record.Station] = { Value: 0};
        }

        // 將當前記錄的進出站人數加到總數上
        stationSums[record.Station].Value += parseInt(record.Value, 10);
    });

    return stationSums;
}
function findMaxValue(line, data) {
    let maxValue = 0;

    for (let key in data) {
        if (data[key].Value > maxValue && isStationInLine(line, key)) {
            maxValue = data[key].Value;
        }
    }

    return maxValue;
}
function findMaxValueAll(data) {
    let maxValue = 0;

    for (let key in data) {
        if (data[key].Value > maxValue) {
            maxValue = data[key].Value;
        }
    }

    return maxValue;
}
function isStationInLine(line, station){
    for(var i=0;i < line.length;i++){
        if(line[i].name == station){
            return true
        }
    }
    return false
}

function getValueByStationName(stationName) {
    if (filtered_hour_data.hasOwnProperty(stationName)) {
        return filtered_hour_data[stationName].Value;
    } else {
        return 10
    }
}

function updateSelector() {
    calendarDiv.selectAll("input").remove();
    var updated = false;
    var datepicker = calendarDiv.append("input")
        .attr("id", "datepicker")
        .attr("class","date-picker")

    $( "#datepicker" ).datepicker({
        dateFormat: "yy-mm-dd",
        defaultDate : new Date(2023, 10, 30),
        changeMonth: true, changeYear: true,
        minDate: new Date(2017, 0, 1), maxDate: new Date(2023, 10, 30),
        onSelect: function(selectedDate) {
            console.log("選取的date是: ", selectedDate)
            updated = true
            
    }})

    $("#datepicker").val("2023-11-30");
    // if(!updated) updateChart(data, selctedStation);
}
function clearSvgElements() {
    var svg = document.getElementById("map");
    
    var elementsToRemove = svg.querySelectorAll("circle, line, text");

    elementsToRemove.forEach(function(element) {
        element.remove();
    });
}

function clearHistory() {
    var svgHistory = document.getElementById("History_dataviz");
    if(svgHistory){
        svgHistory.innerHTML = ''
    }

}

export function get_station_name(){
    return clicked_station
}