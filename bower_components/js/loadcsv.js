months = [
    ["202303-citibike-tripdata", "021"],
    ["202302-citibike-tripdata", ""],
    ["202301-citibike-tripdata", ""],
    ["202212-citibike-tripdata", ""],
    ["202211-citibike-tripdata", ""],
    ["202210-citibike-tripdata", ""],
    ["202209-citibike-tripdata", ""],
    ["202208-citibike-tripdata", ""],
    ["202207-citibike-tripdata", ""],
    ["202209-citibike-tripdata", ""],
    ["202208-citibike-tripdata", ""],
    ["202207-citibike-tripdata", ""],
    ["202206-citibike-tripdata", ""],
    ["202205-citibike-tripdata", ""],
    ["202204-citibike-tripdata", ""],
    ["202203-citibike-tripdata", ""],
    ["202202-citibike-tripdata", ""],
    ["202201-citibike-tripdata", ""],
]

var yearlist = document.getElementById("yearlist")
months.forEach(element => {
    var option = document.createElement("li");
    var label = document.createElement("label");
    var input = document.createElement("input");
    option.setAttribute("width", "500px");
    input.type = "checkbox";
    label.appendChild(input);
    label.innerHTML = "<input class=\"datacheckbox\" type=\"checkbox\">" + element[0].slice(0, 4) + "/" + element[0].slice(4,6);
    option.appendChild(label);
    option.id = element[0];
    option.className = "checkbox keep-open";
    yearlist.appendChild(option);
});

function reset()
{
    var map = d3.select("#map");
    var svg = map.select("svg");
    svg.selectAll("circle").remove();
}

function submit()
{
    reset();
    var folders = new Array();
    options = document.getElementsByClassName("checkbox");
    Array.from(options).forEach((element) => {
        box = element.getElementsByClassName("datacheckbox")[0];
        if(box.checked){
            folders.push(element.id);
        }
    });
    console.log(folders);
}

var select = document.createElement("li");
var anch = document.createElement("a");
anch.className = "btn";
anch.id = "loadbutton";
anch.innerHTML = "select";
anch.setAttribute("onclick", "submit()");
    
select.appendChild(anch);
yearlist.appendChild(select);

//<li><a class="btn">select</a></li>