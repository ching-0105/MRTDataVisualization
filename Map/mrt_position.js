// 定義站點數據
const red_line_stations = [
    { x: 150, y: 50, name: "淡水", value: 10, ori_value: 0 }, { x: 150, y: 100, name: "紅樹林", value: 10, ori_value: 0 }, { x: 150, y: 150, name: "竹圍", value: 10, ori_value: 0 },
    { x: 150, y: 200, name: "關渡", value: 10, ori_value: 0 }, { x: 200, y: 200, name: "忠義", value: 10, ori_value: 0 }, { x: 250, y: 200, name: "復興崗", value: 10, ori_value: 0 },
    { x: 300, y: 200, name: "北投", value: 10, ori_value: 0 }, { x: 350, y: 200, name: "奇岩", value: 10, ori_value: 0 }, { x: 400, y: 200, name: "唭哩岸" , value: 10, ori_value: 0},
    { x: 400, y: 250, name: "石牌", value: 10, ori_value: 0 }, { x: 400, y: 300, name: "明德", value: 10, ori_value: 0 }, { x: 400, y: 350, name: "芝山", value: 10, ori_value: 0 }, 
    { x: 400, y: 400, name: "士林", value: 10, ori_value: 0 }, { x: 400, y: 450, name: "劍潭", value: 10, ori_value: 0 }, { x: 400, y: 500, name: "圓山", value: 10, ori_value: 0 }, 
    { x: 400, y: 550, name: "民權西路", value: 10, ori_value: 0 }, { x: 400, y: 600, name: "雙連", value: 10, ori_value: 0 },{ x: 400, y: 650, name: "中山", value: 10, ori_value: 0 }, 
    { x: 400, y: 700, name: "台北車站", value: 10, ori_value: 0 }, { x: 400, y: 750, name: "台大醫院" , value: 10, ori_value: 0},{ x: 400, y: 800, name: "中正紀念堂", value: 10, ori_value: 0 }, 
    { x: 450, y: 800, name: "東門", value: 10, ori_value: 0 }, { x: 500, y: 800, name: "大安森林公園" , value: 10, ori_value: 0}, { x: 550, y: 800, name: "大安", value: 10, ori_value: 0 }, 
    { x: 600, y: 800, name: "信義安和", value: 10, ori_value: 0 }, { x: 650, y: 800, name: "台北101/世貿", value: 10, ori_value: 0 }, { x: 700, y: 800, name: "象山", value: 10, ori_value: 0 }, 
];

const blue_line_stations = [
    {x: 300, y: 1150, name: "頂埔", value: 10, ori_value: 0 },{x: 300, y: 1100, name: "永寧", value: 10, ori_value: 0 },{x: 300, y: 1050, name: "土城", value: 10, ori_value: 0 },
    {x: 300, y: 1000, name: "海山", value: 10, ori_value: 0 },{x: 300, y: 950, name: "亞東醫院", value: 10, ori_value: 0 },{x: 300, y: 900, name: "府中", value: 10, ori_value: 0 },
    {x: 300, y: 850, name: "BL板橋", value: 10, ori_value: 0 },{x: 300, y: 800, name: "新埔", value: 10, ori_value: 0 },{x: 300, y: 750, name: "江子翠", value: 10, ori_value: 0 },
    {x: 300, y: 700, name: "龍山寺", value: 10, ori_value: 0 },{x: 350, y: 700, name: "西門", value: 10, ori_value: 0 },
    {x: 400, y: 700, name: "台北車站", value: 10, ori_value: 0 },{x: 450, y: 700, name: "善導寺", value: 10, ori_value: 0 },{x: 500, y: 700, name: "忠孝新生", value: 10, ori_value: 0 },
    {x: 550, y: 700, name: "忠孝復興", value: 10, ori_value: 0 },{x: 600, y: 700, name: "忠孝敦化", value: 10, ori_value: 0 },{x: 650, y: 700, name: "國父紀念館", value: 10, ori_value: 0 },
    {x: 700, y: 700, name: "市政府", value: 10, ori_value: 0 },{x: 750, y: 700, name: "永春", value: 10, ori_value: 0 },{x: 800, y: 700, name: "後山埤", value: 10, ori_value: 0 },
    {x: 800, y: 650, name: "昆陽", value: 10, ori_value: 0 },{x: 800, y: 600, name: "南港", value: 10, ori_value: 0 },{x: 800, y: 550, name: "南港展覽館", value: 10, ori_value: 0 }
]

const orange_line1_stations = [
    { x: 50, y: 1000, name: "迴龍", value: 10, ori_value: 0 },  { x: 50, y: 950, name: "丹鳳", value: 10, ori_value: 0 }, 
    { x: 50, y: 900, name: "輔大", value: 10, ori_value: 0 },  { x: 50, y: 850, name: "新莊", value: 10, ori_value: 0 },  { x: 100, y: 800, name: "頭前庄", value: 10, ori_value: 0 }, 
    { x: 150, y: 750, name: "先嗇宮", value: 10, ori_value: 0 },  { x: 200, y: 700, name: "三重", value: 10, ori_value: 0 },  { x: 250, y: 650, name: "菜寮", value: 10, ori_value: 0 }, 
    { x: 300, y: 600, name: "台北橋", value: 10, ori_value: 0 }, { x: 350, y: 550, name: "大橋頭站", value: 10, ori_value: 0 }, { x: 400, y: 550, name: "民權西路", value: 10, ori_value: 0 },
    { x: 500, y: 550, name: "中山國小", value: 10, ori_value: 0 }, { x: 500, y: 600, name: "行天宮", value: 10, ori_value: 0 }, { x: 500, y: 650, name: "松江南京", value: 10, ori_value: 0 },
    { x: 500, y: 700, name: "忠孝新生", value: 10, ori_value: 0 }, { x: 450, y: 800, name: "東門", value: 10, ori_value: 0 }, { x: 400, y: 850, name: "古亭", value: 10, ori_value: 0 },
    { x: 400, y: 900, name: "頂溪", value: 10, ori_value: 0 }, { x: 400, y: 950, name: "永安市場", value: 10, ori_value: 0 }, { x: 400, y: 1000, name: "景安", value: 10, ori_value: 0 },
    { x: 400, y: 1050, name: "南勢角", value: 10, ori_value: 0 },
]

const orange_line2_stations = [
    { x: 350, y: 550, name: "大橋頭站", value: 10, ori_value: 0 },
    { x: 300, y: 500, name: "三重國小", value: 10, ori_value: 0 }, { x: 250, y: 450, name: "三和國中", value: 10, ori_value: 0 }, { x: 200, y: 400, name: "徐匯中學", value: 10, ori_value: 0 },
    { x: 200, y: 350, name: "三民高中", value: 10, ori_value: 0 }, { x: 200, y: 300, name: "蘆洲", value: 10, ori_value: 0 },
]

const grenn_line_stations = [
    { x: 650, y: 1250, name: "新店", value: 10, ori_value: 0 }, { x: 650, y: 1200, name: "新店區公所", value: 10, ori_value: 0 }, { x: 650, y: 1150, name: "七張", value: 10, ori_value: 0 },
    { x: 650, y: 1100, name: "大坪林", value: 10, ori_value: 0 }, { x: 600, y: 1050, name: "景美", value: 10, ori_value: 0 }, { x: 550, y: 1000, name: "萬隆", value: 10, ori_value: 0 },
    { x: 500, y: 950, name: "公館", value: 10, ori_value: 0 }, { x: 450, y: 900, name: "台電大樓", value: 10, ori_value: 0 },
    { x: 400, y: 850, name: "古亭", value: 10, ori_value: 0 }, { x: 400, y: 800, name: "中正紀念堂", value: 10, ori_value: 0 }, {x: 350, y: 750, name: "小南門", value: 10, ori_value: 0 },
    {x: 350, y: 700, name: "西門", value: 10, ori_value: 0 }, { x: 350, y: 650, name: "北門", value: 10, ori_value: 0 }, { x: 400, y: 650, name: "中山", value: 10, ori_value: 0 }, 
    { x: 500, y: 650, name: "松江南京", value: 10, ori_value: 0 }, { x: 550, y: 650, name: "南京復興", value: 10, ori_value: 0 }, { x: 600, y: 650, name: "台北小巨蛋", value: 10, ori_value: 0 },
    { x: 650, y: 650, name: "南京三民", value: 10, ori_value: 0 }, { x: 700, y: 650, name: "松山", value: 10, ori_value: 0 },
]

const yellow_line_stations = [
    { x: 50, y: 700, name: "新北產業園區", value: 10, ori_value: 0 },  { x: 50, y: 750, name: "幸福", value: 10, ori_value: 0 },  { x: 100, y: 800, name: "頭前庄", value: 10, ori_value: 0 }, 
    {x: 250, y: 800, name: "新埔民生", value: 10, ori_value: 0 }, {x: 250, y: 850, name: "BL板橋", value: 10, ori_value: 0 },{ x: 325, y: 875, name: "板新", value: 10, ori_value: 0 },
    { x: 350, y: 925, name: "中原", value: 10, ori_value: 0 }, { x: 350, y: 960, name: "橋和", value: 10, ori_value: 0 }, { x: 350, y: 1000, name: "中和", value: 10, ori_value: 0 },
    { x: 400, y: 1000, name: "景安", value: 10, ori_value: 0 },{ x: 450, y: 1000, name: "景平", value: 10, ori_value: 0 },{ x: 500, y: 1050, name: "秀朗橋", value: 10, ori_value: 0 },
    { x: 550, y: 1100, name: "十四張", value: 10, ori_value: 0 },{ x: 650, y: 1100, name: "大坪林", value: 10, ori_value: 0 },
]

const brown_line_stations = [
    {x: 800, y: 550, name: "南港展覽館", value: 10, ori_value: 0 }, { x: 850, y: 550, name: "南港軟體園區", value: 10, ori_value: 0 }, { x: 850, y: 500, name: "東湖", value: 10, ori_value: 0 }, 
    { x: 850, y: 450, name: "葫洲", value: 10, ori_value: 0 }, { x: 800, y: 450, name: "大湖公園", value: 10, ori_value: 0 }, { x: 750, y: 450, name: "內湖", value: 10, ori_value: 0 }, 
    { x: 700, y: 450, name: "文德", value: 10, ori_value: 0 }, { x: 650, y: 450, name: "港墘", value: 10, ori_value: 0 }, { x: 600, y: 450, name: "西湖", value: 10, ori_value: 0 }, 
    { x: 550, y: 450, name: "劍南路", value: 10, ori_value: 0 }, { x: 550, y: 500, name: "大直", value: 10, ori_value: 0 }, { x: 550, y: 550, name: "松山機場", value: 10, ori_value: 0 }, 
    { x: 550, y: 600, name: "中山國中", value: 10, ori_value: 0 }, 
    { x: 550, y: 650, name: "南京復興", value: 10, ori_value: 0 }, {x: 550, y: 700, name: "忠孝復興", value: 10, ori_value: 0 }, { x: 550, y: 800, name: "大安", value: 10, ori_value: 0 }, 
    { x: 550, y: 850, name: "科技大樓", value: 10, ori_value: 0 },  { x: 600, y: 850, name: "六張犁", value: 10, ori_value: 0 },  { x: 650, y: 850, name: "麟光", value: 10, ori_value: 0 }, 
    { x: 700, y: 900, name: "辛亥", value: 10, ori_value: 0 },  { x: 700, y: 950, name: "萬芳醫院", value: 10, ori_value: 0 },  { x: 700, y: 1000, name: "萬芳社區", value: 10, ori_value: 0 }, 
    { x: 750, y: 1050, name: "木柵", value: 10, ori_value: 0 },  { x: 800, y: 1050, name: "動物園", value: 10, ori_value: 0 }, 
    
]
export function get_red_line_stations(){
    return red_line_stations
}

export function get_blue_line_stations(){
    return blue_line_stations
}

export function get_orange_line1_stations(){
    return orange_line1_stations
}

export function get_orange_line2_stations(){
    return orange_line2_stations
}

export function get_green_line_stations(){
    return grenn_line_stations
}

export function get_yellow_line_stations(){
    return yellow_line_stations
}

export function get_brown_line_stations(){
    return brown_line_stations
}