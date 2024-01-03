const file_day = "./../ranking_day50.csv";
const file_month = "./../ranking_month50.csv";

// Parse the Data
Promise.all([
  d3.csv(file_day),
  d3.csv(file_month),
]).then( function(dataArray) {
  // dataArray是一個包含三個資料集的陣列，分別對應三個 CSV 檔案的資料
  const csv_day = dataArray[0];
  const csv_month = dataArray[1];
  var mergedData = csv_day.concat(csv_month);
  console.log('mergedData', mergedData)
  console.log('csv_day', csv_day)
  console.log('csv_month', csv_month)
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
  width = 960 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add X axis
  const x = d3.scaleLinear()
    .range([0, width]);
    
  const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`);
    

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, height ])
    .padding(.1);
  const yAxis = svg.append("g");

  
  function data_filter(originData, selected){
    // selected = "2023-11-04"
    // 使用 filter 方法選擇相應的資料行
    let filteredData = originData.filter(function(row) {
      // "2023-11-04"
      return row.date === selected;
    });
    
    filteredData = filteredData.slice(0, 10);
    console.log('selected', selected);
    console.log('filteredData', filteredData);
    update_ranking(filteredData);
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
    
    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(renderData)

    // update bars
    u.join("rect")
      .transition()
      .duration(1000)
        .attr("x", x(0))
        .attr("y", d => y(d.stations))
        .attr("width", d => x(d.sum_counts))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
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
      addPicker(selectedValue);
    });
    // 將下拉式選單添加到容器中
    container.appendChild(dropdown);
  }
  
  // 使用範例
  const dropdownOptions = [
    { value: "date", text: "date" },
    { value: "month", text: "month" },
  ];

  function addPicker(type) {
    // 先清除已經存在的日期選擇器
    removeExistingPicker();
    var PickerContainer = document.createElement("div");
    PickerContainer.style.position = "absolute";
    PickerContainer.style.top = "10px";
    PickerContainer.style.right = "10px";
  
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
        data_filter(mergedData, this.value)
    });
  
    PickerContainer.appendChild(datePicker);
    document.body.appendChild(PickerContainer);
    data_filter(mergedData, datePicker.value);
  }

  // 清除已經存在的日期選擇器
  function removeExistingPicker() {
    var existingPicker = document.getElementById("picker");
    if (existingPicker) {
        existingPicker.parentNode.removeChild(existingPicker);
    }
  }
  
  // 在容器 ID 為 "dropdown-container" 的地方創建下拉式選單
  createDropdownMenu("dropdown-container", dropdownOptions);

  data_filter(mergedData, "2023-11-30");
  addPicker("date");
})




