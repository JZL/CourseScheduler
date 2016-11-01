//manual fix
//replace "f or" with "for"
//23326
//25084
////for title spanning cols
//“S” Saturday
//“U” Sunday
//http://www.pdftoexcel.com/
//magic numbers: 
//there are no exttra times on any col after I(col 9 -> (0 indexed) 8)
//    check 
//extra comments row 14
var labColsAfter = 8
function clean() {
  var spread = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/15ThPVEbvrajM-BeTeM6Xz2Ja8LEc18N-wqPVDTsFp_w/edit#gid=736582009")
  var originalArr = spread.getSheetByName("Original").getDataRange().getValues()
  var cleanArr = []
  var restArr = []
  
  var secondDesc = []
  var secondTimes = []
  for(var i=0; i<originalArr.length;i++){
    //    if(originalArr[i][0] == ""){
    
    if(originalArr[i].join("") == "" ||
       originalArr[i][1] == "Spring 2017"||
       originalArr[i].join("").replace(/\s/g, "") == "CrsRefNoSubjNumSecCourseTitleCredDistEnr.Lim.Instructor(s)CourseTypeDaysTimesBldg&Room"||
      //      originalArr[i].join("") == "Course Schedule prepared by the Registrtar's Officehttp://www.swarthmore.edu/Admin/registrar/page.phtml?sidebar=coursesinfo&content=conclist"||
      originalArr[i].join("") == "For Bookstore Prices go to http://bookstore.swarthmore.edu/"||
        originalArr[i].join("") == "Course Schedule prepared by the Registrtar's Office"
        ){
          restArr.push(originalArr[i])
        }else{
//          Logger.log(originalArr[i].join("|"))
          //          if(originalArr[i][0] == ""){
          if(typeof originalArr[i][0]!=="number"){
            //not include 2nd arg
            if(originalArr[i].slice(0, labColsAfter).join("")!==""){
              //isn't a lab
              secondDesc.push(originalArr[i].slice(0, labColsAfter))
              //TODO if have multiple 2nd lines, will have 2 ()
              cleanArr[cleanArr.length-1][14] += "||"+originalArr[i].slice(0, labColsAfter).join(" ")
              //              cleanArr[cleanArr.length-1][14] += " ("+originalArr[i].slice(0, labColsAfter).join(" ")+")"
              //              cleanArr[cleanArr.length-1][14] = cleanArr[cleanArr.length-1][3].replace(/ \) \( /, "").replace(/\s+/g, " ").replace(/ \./g, ".")
              
            }
            if(originalArr[i].slice(labColsAfter+1).join("")!==""){
              var slicedArr = originalArr[i].slice(labColsAfter)
              if(slicedArr[slicedArr.length-1]==""){
                slicedArr.pop()
              }
              //              cleanArr[cleanArr.length-1].push(originalArr[i].slice(labColsAfter+1).concat("+++"))
              cleanArr[cleanArr.length-1][15] += "+++"+JSON.stringify(slicedArr.slice(-4))
              //              cleanArr.push(padElems(15, ["+++"].concat(originalArr[i].slice(labColsAfter+1))))
              secondTimes.push(slicedArr.slice(-4))
            }
          }else{
            //            if(originalArr[i][1] == ""){
            //              originalArr[i].splice(1, 1)
            //            }
//            Logger.log(originalArr[i][2])
            if(originalArr[i][3]==""){
              originalArr[i].splice(3,1)
            }
            if(originalArr[i][2]==""){
              originalArr[i].splice(2,1)
            }
            if(typeof originalArr[i][1]!=="number" && originalArr[i][1].indexOf(" ")!=-1){
              var subjString = originalArr[i][1]
              if(originalArr[i][2]==""){
                originalArr[i].splice(1, 2)
              }else{
                originalArr[i].splice(1, 1)
              }
              //              originalArr[i][1] = subjString.substring(0, subjString.indexOf(" "))
              //              originalArr[i].splice(2, 0, subjString.substring(subjString.indexOf(" ")).replace(/ /g, ""))
              var args = [1, 0].concat((subjString.replace(/\s+/g, " ")+"??").split(" "));
              originalArr[i].splice.apply(originalArr[i], args)
            }
            if(typeof originalArr[i][2]!=="number" && originalArr[i][2].indexOf(" ")!=-1){
              var subjString = originalArr[i][2]
              if(originalArr[i][1]==""){
                originalArr[i].splice(1, 2)
                var args = [1, 0].concat((subjString.replace(/\s+/g, " ")+"??").split(" "));
                originalArr[i].splice.apply(originalArr[i], args)
              }else{
                originalArr[i].splice(2, 1)
                var args = [2, 0].concat((subjString.replace(/\s+/g, " ")+"??").split(" "));
                originalArr[i].splice.apply(originalArr[i], args)
              }
            }
            if(originalArr[i][5]=="" && /[0-9]$/.test(originalArr[i][4])){
              originalArr[i][5] = originalArr[i][4].substr(-1)
              originalArr[i][4] = originalArr[i][4].slice(0, -2)
            }
            
            cleanArr.push(padElems(16, originalArr[i]))
          }
        }
    
  }
//  Logger.log(cleanArr.length)
  spread.getSheetByName("Clean").clear().getRange(1, 1, (cleanArr.length), 16).setValues(cleanArr)
  spread.getSheetByName("Cruft").clear().getRange(1, 1, (restArr.length), 13).setValues(restArr)
  spread.getSheetByName("2ndAddToDesc").clear().getRange(1, 1, (secondDesc.length), secondDesc[0].length).setValues(secondDesc)
  spread.getSheetByName("2ndMoreTimes").clear().getRange(1, 1, (secondTimes.length), secondTimes[0].length).setValues(secondTimes)
}

function padElems(num, arr){
  for(var q = arr.length; q<num;q++){
    arr.push("")
  }
  return arr
}

function doGet() {
  return HtmlService
  .createTemplateFromFile('index')
  .evaluate();
}

function makeScheduleArr(){
  var spread = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/15ThPVEbvrajM-BeTeM6Xz2Ja8LEc18N-wqPVDTsFp_w/edit#gid=736582009")
  var cleanArr = spread.getSheetByName("Clean").getDataRange().getValues()
  //crsref, className
  var scheduleArr = []
  for(var i=0; i<cleanArr.length;i++){
    var thisClean = cleanArr[i]
    if(thisClean[0]== "+++"){
      
    }else{
      if(thisClean[thisClean.length-3])
        scheduleArr.push(thisClean.slice(0, thisClean.length-4).join(", "), [thisClean[thisClean.length-3], thisClean[thisClean.length-2], thisClean[thisClean.length-1]])
        
        }
  }
}
function returnNeededArr(){
  var prevRef = []
  
  var spread = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/15ThPVEbvrajM-BeTeM6Xz2Ja8LEc18N-wqPVDTsFp_w/edit#gid=736582009")
  var spreadArr = spread.getSheetByName("Clean").getDataRange().getValues()
  //hasTimes, hasNoTimes, multipleTimes
  var outArr = [{},{}, {}]
  for(var i in spreadArr){
    
    if(spreadArr[i][10] != "" && spreadArr[i][11]!=""){
      //has time and dates
      var daysArr = timeStrToTime(spreadArr[i][10])
      //      Logger.log(spreadArr[i][10].length)
      if(spreadArr[i][15]!=""){
        var otherTimeArr = JSON.parse(spreadArr[i][15].replace("+++", ""))
        Logger.log(otherTimeArr)
        Logger.log(otherTimeArr[2])
        outArr[2][spreadArr[i][0]] = {id: spreadArr[i][0], start: toArmy(otherTimeArr[2].substring(0, otherTimeArr[2].indexOf(" - "))), end: toArmy(otherTimeArr[2].substring(otherTimeArr[2].indexOf(" - "))+3), dow: timeStrToTime(otherTimeArr[1]), type: otherTimeArr[0],days: otherTimeArr[1],time: otherTimeArr[2],rm: otherTimeArr[3]}
        //        spreadArr[i][9] = otherTimeArr[0]
        //        spreadArr[i][10] = otherTimeArr[1]
        //        spreadArr[i][11] = otherTimeArr[2]
        //        spreadArr[i][12] = otherTimeArr[3]
        //        outArr[1][]
      }
      
      
      var timeStr = spreadArr[i][11]
      if(prevRef.indexOf(spreadArr[i][0])!=-1){
        throw "Duplicate ref's: "+spreadArr[i][0]
      }
      var comment = ""
      if(spreadArr[i][14]!==""){
        comment = spreadArr[i][14].replace(/\|\|\s*/g, "")
      }
      //      var comment = ""
      //      if(spreadArr[i][14]!==""){
      //        comment = spreadArr[i][14].replace(/\|\|\s*/g, "")
      //      }
      
      //      outArr[0].push({comment: comment, id: spreadArr[i][0], start: toArmy(timeStr.substring(0, timeStr.indexOf(" - "))), end: toArmy(timeStr.substring(timeStr.indexOf(" - "))+3), dow: daysArr, ref: spreadArr[i][0], subj: spreadArr[i][1],num: spreadArr[i][2],sec: spreadArr[i][3], title: spreadArr[i][4],cred: spreadArr[i][5],dist: spreadArr[i][6],lim: spreadArr[i][7],instruct: spreadArr[i][8],type: spreadArr[i][9],days: spreadArr[i][10],time: spreadArr[i][11],rm: spreadArr[i][12]})
      outArr[0][spreadArr[i][0]] = {comment: comment, id: spreadArr[i][0], start: toArmy(timeStr.substring(0, timeStr.indexOf(" - "))), end: toArmy(timeStr.substring(timeStr.indexOf(" - "))+3), dow: daysArr, ref: spreadArr[i][0], subj: spreadArr[i][1],num: spreadArr[i][2],sec: spreadArr[i][3], title: spreadArr[i][4],cred: spreadArr[i][5],dist: spreadArr[i][6],lim: spreadArr[i][7],instruct: spreadArr[i][8],type: spreadArr[i][9],days: spreadArr[i][10],time: spreadArr[i][11],rm: spreadArr[i][12]}
      
      Logger.log(daysArr)
    }else{
      outArr[1][spreadArr[i][0]] = {id: spreadArr[i][0], ref: spreadArr[i][0], subj: spreadArr[i][1],num: spreadArr[i][2],sec: spreadArr[i][3], title: spreadArr[i][4],cred: spreadArr[i][5],dist: spreadArr[i][6],lim: spreadArr[i][7],instruct: spreadArr[i][8],type: spreadArr[i][9],days: spreadArr[i][10],time: spreadArr[i][11],rm: spreadArr[i][12]}
      //      outArr[1].push({ref: spreadArr[i][0], subj: spreadArr[i][1],num: spreadArr[i][2],sec: spreadArr[i][3], title: spreadArr[i][4],cred: spreadArr[i][5],dist: spreadArr[i][6],lim: spreadArr[i][7],instruct: spreadArr[i][8],type: spreadArr[i][9],days: spreadArr[i][10],time: spreadArr[i][11],rm: spreadArr[i][12]})
    }
  }
  Logger.log(outArr)
  return outArr
  
}
function doGet() {
  
  return HtmlService.createHtmlOutput(JSON.stringify(returnNeededArr()))
}

function toArmy(time){
  var armyRe = /([0-9]+):([0-9]+)([ap]m)/
  if(armyRe.test(time)==false){
    throw "Invalid time: "+time
    return
  }
  var match = time.match(armyRe)
  if(match[3] == "pm"){
    if(match[1] == "12"){
      match[1] = 0
    }
    
    
    return (parseInt(match[1])+12)+":"+match[2]
  }else{
    return match[1]+":"+match[2]
  }
}


function timeStrToTime(timeStr){
  var weekConversion= {"M": 1,"T": 2,"W": 3,"R": 4,"F": 5,"S": 6,"U": 0}
  daysArr = []
  for(var z=0; z<timeStr.length;z++){
    //        Logger.log(spreadArr[i][10][z])
    if(!(timeStr[z] in weekConversion)){
      throw "In row "+(i+1)+" there is an invalid weekly days"
    }
    daysArr.push(weekConversion[timeStr[z]])
  }
  return daysArr
}
