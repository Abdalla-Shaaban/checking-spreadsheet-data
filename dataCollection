function sendEmails() {
 // fetch this sheet
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getActiveSheet();
 var range = sheet.getRange("A:A");
 var values = range.getValues();
 var noEntries = false;
  
 //find the first row of current day
 var today = Utilities.formatDate(new Date(), "GMT", "MM/dd/yyyy");  
 var firstRow = 0;
 for (var i=0; i<values.length; i++) {
   var date = new Date(values[i][0]);
   var formattedDate = Utilities.formatDate(date, "GMT", "MM/dd/yyyy");
   if(formattedDate == today){
      firstRow = i+1;
        break;
    }  
  }
  //check if no entries was provided for the day
  if(firstRow == 0)
    noEntries = true; 
  
  if(noEntries == false){
    //timestamps of the current day 
    var TimestampsRange = sheet.getRange(firstRow,2,sheet.getLastRow()) //(row, column, NumRows) 
    // Fetch values for each row in the Range.
    var timestamps = TimestampsRange.getValues();
    
    //Find missing head counts  
    //this is the lab schedule, could be changed depending on time in the semester
    var labSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
    for(i in labSchedule)
      for(j in timestamps)
        if(timestamps[j] == labSchedule[i])
          labSchedule.splice(i, 1);
  }
  
  //email content 
  var emailAddress = "test@gmail.com"; // this could be any email you want it to be 
  var subject = ("HeadCounts Report for " + today);
  
  if(noEntries == false){
    var message = ("Missing timestamps: " + labSchedule);
  }
  if(noEntries == true){ 
    var message = ("No head count entries provided for " + today);
  }else {
    var message = "All headcount entries were provided for today";
  }
  MailApp.sendEmail(emailAddress, subject, message);
}
