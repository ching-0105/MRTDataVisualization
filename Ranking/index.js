const file_day = "../Dataset/ranking_day50.csv";
const file_month = "../Dataset/ranking_month50.csv";
const totalContainerId = "my_dataviz";

// Parse the Data
Promise.all([
  d3.csv(file_day),
  d3.csv(file_month),
]).then( function(dataArray) {
  // dataArray是一個包含三個資料集的陣列，分別對應三個 CSV 檔案的資料
  const csv_day = dataArray[0];
  const csv_month = dataArray[1];

  console.log('csv_day', csv_day)
  console.log('csv_month', csv_month)

  // Used variables
  var mergedData = csv_day.concat(csv_month);
  var select_value = "2023-11-30";
  var ranking_num = 10;

  function process_row(d){
    // 用底線串起enter_station和leave_station
    d.stations = d.enter_station + "_" + d.leave_station;

    // 將sum_counts轉換為數字
    d.sum_counts = +d.sum_counts;
  }
  mergedData.forEach(process_row);
  // data_month.forEach(process_row);
  console.log('mergedData', mergedData)

  // set the dimensions and margins of the graph
  const margin = {top: 20, right: 30, bottom: 40, left: 130},
  chartWidth = 960 - margin.left - margin.right,
  chartHeight = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(`#${totalContainerId}`)
    .append("svg")
    .attr("width", chartWidth + margin.left + margin.right)
    .attr("height", chartHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add X axis
  const x = d3.scaleLinear()
    .range([0, chartWidth]);
    
  const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`);
    
  // Y axis
  const y = d3.scaleBand()
    .range([ 0, chartHeight ])
    .padding(.1);
  const yAxis = svg.append("g");

  function data_filter(originData, selected, num){
    // selected = "2023-11-04"
    // 使用 filter 方法選擇相應的資料行
    let filteredData = originData.filter(function(row) {
      // "2023-11-04"
      return row.date === selected;
    });
    
    filteredData = filteredData.slice(0, num);
    // console.log('selected', selected);
    // console.log('select_value', select_value);
    // console.log('filteredData', filteredData);
    
    update_ranking(filteredData);

    return selected;
  }

  function update_ranking(renderData){
    x.domain([0, d3.max(renderData, 
      function(d) {
        return d.sum_counts;
      })
    ])
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    y.domain(renderData.map(d => d.stations));
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

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

    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(renderData)

    // update bars
    var uRect = u.join("rect")

    uRect.transition()
      .duration(1000)
        .attr("x", x(0))
        .attr("y", d => y(d.stations))
        .attr("width", d => x(d.sum_counts))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
    
    uRect.attr("class", "rankBar")
      .on("mouseover", function(event, d) {
        // console.log(d);
        tooltip.html(`Station ${d.enter_station} to ${d.leave_station}, Sum counts: ${d.sum_counts}`).style("visibility", "visible");

        d3.selectAll(".rankBar").style("opacity", .2);
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1);
      })
      .on("mousemove", function(){
        tooltip
          .style("top", (event.pageY-10)+"px")
          .style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
        d3.selectAll(".rankBar").style("opacity", 1).style("stroke", "none");
      });
    
        
  }

  function createDropdownMenu(containerId, options) {
    // 找到要放置下拉式選單的容器
    const container = document.getElementById(containerId);
  
    // 創建 select 元素
    const dropdown = document.createElement("select");
  
    // 遍歷選項，並創建 option 元素
    options.forEach(function(option) {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.text = option.text;
      dropdown.appendChild(optionElement);
    });
    // 在下拉式選單選項改變時呼叫addDatePicker函數
    dropdown.addEventListener("change", function() {
      const selectedValue = dropdown.value;
      console.log("選擇的值為：" + selectedValue);
      addPicker(totalContainerId, selectedValue);
    });
    // 將下拉式選單添加到容器中
    container.appendChild(dropdown);
  }
  
  // 使用範例
  const dropdownOptions = [
    { value: "date", text: "date" },
    { value: "month", text: "month" },
  ];

  function addPicker(containerId, type) {
    // 先清除已經存在的日期選擇器
    removeExistingPicker();
    const container = document.getElementById(containerId);
    // var PickerContainer = document.createElement("div");
    // PickerContainer.style.position = "absolute";
    // PickerContainer.style.top = "10px";
    // PickerContainer.style.right = "10px";
  
    var datePicker = document.createElement("input");
    datePicker.type = type;
    datePicker.id = "picker";
    
    // datePicker.name = "date";
    datePicker.style.padding = "5px";
    if (type==="date"){
      datePicker.value = "2023-11-30";
      datePicker.min = "2017-01-01";  // 最小月份
      datePicker.max = "2023-11-30";  // 最大月份
    }
    else if (type==="month"){
      datePicker.value = "2023-11";
      datePicker.min = "2017-01";  // 最小月份
      datePicker.max = "2023-11";  // 最大月份
    }
  
    // 當日期改變時，在控制台中輸出選擇的日期
    datePicker.addEventListener("change", function() {
        console.log("選擇的日期是：", this.value);
        select_value = this.value;
        data_filter(mergedData, select_value, ranking_num);
    });
  
    container.appendChild(datePicker);
    // document.body.appendChild(PickerContainer);
    select_value = datePicker.value;
    data_filter(mergedData, select_value, ranking_num);
  }

  // 清除已經存在的日期選擇器
  function removeExistingPicker() {
    var existingPicker = document.getElementById("picker");
    if (existingPicker) {
        existingPicker.parentNode.removeChild(existingPicker);
    }
  }

  // 創建數字輸入的函數
  function createNumberInput(containerId, minValue, maxValue, defaultValue) {
    // 選擇容器元素
    const container = d3.select(`#${containerId}`);

    // 創建輸入框
    const input = container.append("input")
      .attr("type", "number")
      .attr("min", minValue)
      .attr("max", maxValue)
      .attr("value", defaultValue)
      .attr("id", "nUni");

    // 在這裡可以添加額外的邏輯，如事件監聽器等
    input.on("change", function() {
      console.log("數字變更為：", this.value);
      ranking_num = this.value;
      data_filter(mergedData, select_value, ranking_num);
    });
  }

  // 使用範例
  createNumberInput(totalContainerId, 1, 50, 10);
  
  // 在容器 ID 為 "dropdown-container" 的地方創建下拉式選單
  createDropdownMenu(totalContainerId, dropdownOptions);

  data_filter(mergedData, select_value, ranking_num);
  addPicker(totalContainerId, "date");
})




