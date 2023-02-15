
var userData = new Map();
var readCnt = 0;

function readCSVFile() {
    // Get name of the student
    let name = document.getElementById("studentName").value;
    let tmp = document.createElement("html");
    tmp.innerHTML = name;
    name = tmp.innerText;
    if (name == "") return;

    // Add a new hash key if new student
    if (!userData.has(name)) {
        userData.set(name, {});
        let studentList = document.getElementById("studentList");
        studentList.innerHTML += '<option>' + name.toString() + '</option>'
    }
    
    // Get and read files
    let files = document.getElementById("csvFile").files;
    let index = 0;
    let fileCntHTML = document.getElementById("filesRead");
    
    while (index < files.length) {
        // File & file name
        let csvFile = files[index];
        let fileName = csvFile.name;

        // Extract stored info
        let reader = new FileReader();
        reader.readAsText(csvFile);
        
        // Add info to userData when reader loads
        reader.onload = function(event) {
            let csvData = event.target.result;
            if (!(fileName in userData.get(name))) {
                userData.get(name)[fileName] = csvData;
                readCnt++;
                fileCntHTML.innerHTML = readCnt.toString() + " data" + (readCnt > 1 ? "s" : "");
                showSubjectList();
                graphCSVFile();
            }
        }
        
        index++;
    }
}

function graphCSVFile() {
    // Get & reset canvas
    let canvas = document.getElementById("chart");
    let ctx = canvas.getContext("2d");
    ctx.reset();

    // Get student & subject
    let name = document.getElementById("studentList").value;
    let subject = document.getElementById("subjectList").value;

    // Axis
    let originX = 0 + 20, originY = 300 - 20;
    
    // x-axis
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + 400, originY);
    let region = new Path2D();
    region.arc(originX + 400, originY, 3, -90 * Math.PI / 180, 90 * Math.PI / 180);
    region.closePath();
    ctx.arc(originX + 400, originY, 3, -90 * Math.PI / 180, 90 * Math.PI / 180);
    ctx.lineTo(originX + 400, originY);
    ctx.fill(region);
    ctx.font = "15px Arial";
    ctx.fillText("Time", originX + 350, originY - 10);
    
    // y-axis
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY - 250);
    region = new Path2D();
    region.arc(originX, originY - 250, 3, 180 * Math.PI / 180, 0 * Math.PI / 180);
    ctx.arc(originX, originY - 250, 3, 180 * Math.PI / 180, 0 * Math.PI / 180);
    ctx.lineTo(originX, originY - 250);
    ctx.fill(region);
    ctx.font = "15px Arial";
    ctx.fillText("Performance", originX + 10, originY - 240);

    // draw out lines
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    
    // Graph
    let tmpX;
    let xRange = 400, yRange = 220;
    let dataArray = userData.get(name)[subject].split('\n');
    let maxColSize = 0;
    // Get maximum number of columns
    for (let row = 0; row < dataArray.length; row++) {
        let tmpColSize = dataArray[row].split(',').length;
        if (tmpColSize > maxColSize) {
            maxColSize = tmpColSize;
        }
    }
    // Graph in column-major order
    for (let col = 0; col < maxColSize; col++) {
        tmpX = originX;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        for (let row = 0; row < dataArray.length - 1; row++) {
            let dataRowArr = dataArray[row].split(',');
            tmpX += 1.0 * xRange / (dataArray.length - 1);
            if (col < dataRowArr.length) {
                if (!isNaN(Number.parseInt(dataRowArr[col]))) {
                    ctx.lineTo(tmpX, originY - 2 - (1.0 * dataRowArr[col] / 10 * yRange));
                }
            }
        }
        ctx.lineWidth = 2;
        let rgbVal = (1.0 * col / (maxColSize - 1) * 255).toString();
        ctx.strokeStyle = "rgb(" + rgbVal + ", " + rgbVal + ", " + rgbVal + ")";
        ctx.stroke();
        ctx.closePath();
    }
}

function showSubjectList() {
    // Retrieve name
    let name = document.getElementById("studentList").value;
    // Update subjects list
    let subjectHTML = document.getElementById("subjectList");
    subjectHTML.innerHTML = "";
    for (let x of Object.keys(userData.get(name))) {
        subjectHTML.innerHTML += '<option>' + x + '</option>';
    }
}