function headcountQuery() {
    // fetch the form response spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var values = sheet.getDataRange().getValues();
    var secondSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
    var secondSheetValues = secondSheet.getDataRange().getValues();
    var today = Utilities.formatDate(new Date(), "GMT", "MM/dd/yyyy");
    var monthYearFormat = Utilities.formatDate(new Date(), "GMT", "yyyy-MM");
    var previousHCLabs = "0";
    var previousHCHD = "0";
    var newTotalHCHD = "0";
    var newTotalHCLabs = "0";
    var totalHeadCountsForLabs = "0";
    var totalHeadCountsForHD = "0";
    var firstRow = 0;
    var dateMatched = false;
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
    for (var i = 0; i < values.length; i++) {
        var date = Utilities.formatDate(new Date(values[i][0]), "GMT", "MM/dd/yyyy");
        if (date == today) {
            firstRow = i;
            break;
        }
    }

    //check if no entries was provided for the day
    if (firstRow == 0) { noEntries = true; }

    //check today's submissions
    if (!noEntries) {
        //find missing headcounts
        var labLocation = sheet.getRange(firstRow + 1, 3, sheet.getLastRow()).getValues(); //(row, column, NumRows) 
        var timeStamps = sheet.getRange(firstRow + 1, 4, sheet.getLastRow()).getValues();
        var headCounts = sheet.getRange(firstRow + 1, 5, sheet.getLastRow()).getValues();
        for (var row in labLocation) {
            for (var col in labLocation[row]) {
                if (labLocation[row][col] == "RBS Lab") {
                    totalHeadCountsForLabs = Number(totalHeadCountsForLabs) + Number(headCounts[row][col]);
                    noEntriesRBS = false;
                    for (i in RBSSchedule) {
                        if (timeStamps[row][col] == RBSSchedule[i]) {
                            RBSSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Dana Lab") {
                    totalHeadCountsForLabs = Number(totalHeadCountsForLabs) + Number(headCounts[row][col]);
                    noEntriesDana = false;
                    for (i in danaSchedule) {
                        if (timeStamps[row][col] == danaSchedule[i]) {
                            danaSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Hill Hall Lab") {
                    totalHeadCountsForLabs = Number(totalHeadCountsForLabs) + Number(headCounts[row][col]);
                    noEntriesHill = false;
                    for (i in hillSchedule) {
                        if (timeStamps[row][col] == hillSchedule[i]) {
                            hillSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Cyber Lounge") {
                    totalHeadCountsForLabs = Number(totalHeadCountsForLabs) + Number(headCounts[row][col]);
                    noEntriesCyber = false;
                    for (i in cyberSchedule) {
                        if (timeStamps[row][col] == cyberSchedule[i]) {
                            cyberSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Engelhard Lab") {
                    totalHeadCountsForLabs = Number(totalHeadCountsForLabs) + Number(headCounts[row][col]);
                    noEntriesENG = false;
                    for (i in ENGSchedule) {
                        if (timeStamps[row][col] == ENGSchedule[i]) {
                            ENGSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Help Desk") {
                    totalHeadCountsForHD = Number(totalHeadCountsForHD) + Number(headCounts[row][col]);
                    noEntriesHD = false;
                }
            }
        }
    }
    //check second sheet for previos entries
    for (var i = 0; i < secondSheetValues.length; i++) {
        if (Utilities.formatDate(new Date(secondSheetValues[i][2]), "GMT", "yyyy-MM") == monthYearFormat) {
            previousHCHD = secondSheet.getDataRange().getValues()[i][0];
            previousHCLabs = secondSheet.getDataRange().getValues()[i][1];
            rangeForHD = secondSheet.getRange(i + 1, 1);
            rangeForLabs = secondSheet.getRange(i + 1, 2);
            dateMatched = true;
        }
    }

    Logger.log(totalHeadCountsForHD);
    Logger.log(totalHeadCountsForLabs);
    //append new data to second spreadsheet
    if (dateMatched) {
        newTotalHCHD = Number(previousHCHD) + Number(totalHeadCountsForHD);
        newTotalHCLabs = Number(previousHCLabs) + Number(totalHeadCountsForLabs);
        rangeForHD.setValue(newTotalHCHD);
        rangeForLabs.setValue(newTotalHCLabs);
    } else { secondSheet.appendRow([Number(totalHeadCountsForHD), Number(totalHeadCountsForLabs), Utilities.formatDate(new Date(), "GMT", "yyyy-MM")]); }

    //email content 
    var emailAddress = "kmc342@rutgers.edu"; // this could be any email you want it to be 
    var subject = ("Head Counts Report for " + today);
    if (!noEntries) {
        message = "---------------Missing Head Counts---------------";
    }
    if (!noEntriesRBS) {
        message = message + ("\n\nRBS Lab : " + RBSSchedule);
    } else {
        message = message + ("\n\nRBS Lab : Missing all entries");
    }

    if (!noEntriesDana) {
        message = message + ("\n\nDana Library Lab : " + danaSchedule);
    } else {
        message = message + ("\n\nDana Library Lab :  Missing all entries");
    }

    if (!noEntriesHill) {
        message = message + ("\n\nHill Hall Lab : " + hillSchedule);
    } else {
        message = message + ("\n\nHill Hall Lab : Missing all entries");
    }

    if (!noEntriesCyber) {
        message = message + ("\n\nCyber Lounge : " + cyberSchedule);
    } else {
        message = message + ("\n\nCyber Lounge : Missing all entries");
    }

    if (!noEntriesENG) {
        message = message + ("\n\nEngelhard Lab : " + ENGSchedule);
    } else {
        message = message + ("\n\nEngelhard Lab : Missing all entries");
    }

    if (!noEntriesHD) {
        message = message + ("\n\nHelp Desk: Headcount provided");
    } else {
        message = message + ("\n\nHelp Desk: Missing headcount");
    }
    if (noEntries) {
        message = ("No headcount entries were provided for all locations on" + today);
    }
    //Logger.log(message);
    MailApp.sendEmail(emailAddress, subject, message);
}
