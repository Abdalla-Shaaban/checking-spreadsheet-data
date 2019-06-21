function saveHeadCounts() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var values = sheet.getDataRange().getValues();
    var secondSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
    var secondSheetValues = secondSheet.getDataRange().getValues();

    //find the first row of current day
    var firstRow = 0;
    var dateMatched = false;
    var today = Utilities.formatDate(new Date(), "ET", "MM/dd/yyyy");
    var monthYearFormat = Utilities.formatDate(new Date(), "ET", "yyyy-MM");
    var previousHC = 0;
    var newTotalHC = 0;
    var range;
    for (var i = 0; i < values.length; i++) {
        var date = Utilities.formatDate(new Date(values[i][0]), "ET", "MM/dd/yyyy");
        if (date == today) {
            firstRow = i;
            break;
        }
    }
    //cacluate the total head counts for the day
    var totalHeadCounts = 0;
    var headCounts = sheet.getRange(firstRow + 1, 5, sheet.getLastRow()).getValues();
    for (var row in headCounts) {
        for (var col in headCounts[row]) {
            totalHeadCounts = totalHeadCounts + headCounts[row][col];
        }
    }
    for (var i = 0; i < secondSheetValues.length; i++) {
        if (Utilities.formatDate(new Date(secondSheetValues[i][1]), "ET", "yyyy-MM") == monthYearFormat) {
            previousHC = secondSheet.getDataRange().getValues()[i][0];
            range = secondSheet.getRange(i + 1, 1);
            dateMatched = true;
        }
    }
    //append new data to spreadsheet
    if (dateMatched) {
        newTotalHC = parseInt(previousHC) + parseInt(totalHeadCounts);
        range.setValue(newTotalHC);
    } else { secondSheet.appendRow([totalHeadCounts, Utilities.formatDate(new Date(), "ET", "yyyy-MM")]); }
}

function sendMissingLogs() {
    // fetch the form response spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var values = sheet.getDataRange().getValues();
    var firstRow = 0;
    var message = "";
    var noEntries = false;
    var noEntriesRBS = true;
    var noEntriesDana = true;
    var noEntriesHill = true;
    var noEntriesCyber = true;
    var noEntriesENG = true;
    var noEntriesHD = true;
    var RBSSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    var danaSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'];
    var hillSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    var cyberSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
    var ENGSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

    //find the first row of current day
    var today = Utilities.formatDate(new Date(), "ET", "MM/dd/yyyy");
    for (var i = 0; i < values.length; i++) {
        var date = new Date(values[i][0]);
        var formattedDate = Utilities.formatDate(date, "ET", "MM/dd/yyyy");
        if (formattedDate == today) {
            firstRow = i;
            break;
        }
    }

    //check if no entries was provided for the day
    if (firstRow == 0) { noEntries = true; }
    //check today's submissions
    if (!noEntries) {
        var labLocation = sheet.getRange(firstRow + 1, 3, sheet.getLastRow()).getValues(); //(row, column, NumRows) 
        var timeStamps = sheet.getRange(firstRow + 1, 4, sheet.getLastRow()).getValues();
        for (var row in labLocation) {
            for (var col in labLocation[row]) {
                if (labLocation[row][col] == "RBS Lab") {
                    noEntriesRBS = false;
                    for (i in RBSSchedule) {
                        if (timeStamps[row][col] == RBSSchedule[i]) {
                            RBSSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Dana Lab") {
                    noEntriesDana = false;
                    for (i in danaSchedule) {
                        if (timeStamps[row][col] == danaSchedule[i]) {
                            danaSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Hill Hall Lab") {
                    noEntriesHill = false;
                    for (i in hillSchedule) {
                        if (timeStamps[row][col] == hillSchedule[i]) {
                            hillSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Cyber Lounge") {
                    noEntriesCyber = false;
                    for (i in cyberSchedule) {
                        if (timeStamps[row][col] == cyberSchedule[i]) {
                            cyberSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Engelhard Lab") {
                    noEntriesENG = false;
                    for (i in ENGSchedule) {
                        if (timeStamps[row][col] == ENGSchedule[i]) {
                            ENGSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Help Desk") {
                    noEntriesHD = false;
                }
            }
        }
    }

    //email content 
    var emailAddress = "test@email.com"; // this could be any email you want it to be 
    var subject = ("HeadCounts Report for " + today);
    if (!noEntries) {
        message = "---------------Missing Head Counts---------------";
    }
    if (!noEntriesRBS) {
        message = message + ("\n\nRBS Lab : " + RBSSchedule);
    } else {
        message = message + ("\n\nRBS Lab : missing all entries");
    }

    if (!noEntriesDana) {
        message = message + ("\n\nDana Library Lab : " + danaSchedule);
    } else {
        message = message + ("\n\nDana Library Lab :  missing all entries");
    }

    if (!noEntriesHill) {
        message = message + ("\n\nHill Hall Lab : " + hillSchedule);
    } else {
        message = message + ("\n\nHill Hall Lab : missing all entries");
    }

    if (!noEntriesCyber) {
        message = message + ("\n\nCyber Lounge : " + cyberSchedule);
    } else {
        message = message + ("\n\nCyber Lounge : missing all entries");
    }

    if (!noEntriesENG) {
        message = message + ("\n\nEngelhard Lab : " + ENGSchedule);
    } else {
        message = message + ("\n\nEngelhard Lab : missing all entries");
    }

    if (!noEntriesHD) {
        message = message + ("\n\nHelp Desk: today's entries were provided");
    } else {
        message = message + ("\n\nHelp Desk: missing todays head counts");
    }
    if (noEntries) {
        message = ("No head count entries provided for " + today);
    }
    MailApp.sendEmail(emailAddress, subject, message);
}
