function headcountQuery() {
    // fetch the form response spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var values = sheet.getDataRange().getValues();
    var secondSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
    var secondSheetValues = secondSheet.getDataRange().getValues();
    var noEntriesRBS = true;
    var noEntriesDana = true;
    var noEntriesHill = true;
    var noEntriesCyber = true;
    var noEntriesENG = true;
    var noEntriesHD = true;
    //lab schedules inputed in an array of string
    var RBSSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    var danaSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'];
    var hillSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    var cyberSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
    var ENGSchedule = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

    //find the first row of current day
    var firstRow = 1;
    for (var row in values) {
        if (Utilities.formatDate(new Date(values[row][0]), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "MM/dd/yyyy") == Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "MM/dd/yyyy")) {
            firstRow += parseInt(row);
            break;
        }
    }

    //check if no entries was provided for the day
    var noEntries = false;
    if (firstRow == 1) { noEntries = true; }

    //check today's submissions
    if (!noEntries) {
        //find missing headcounts and calculate total headcounts for labs and HD
        var labLocation = sheet.getRange(firstRow, 3, sheet.getLastRow()).getValues(); //(row, column, NumRows) 
        var timeStamps = sheet.getRange(firstRow, 4, sheet.getLastRow()).getValues();
        var headCounts = sheet.getRange(firstRow, 5, sheet.getLastRow()).getValues();
        var totalHeadCountsForLabs = Number('0');
        var totalHeadCountsForHD = Number('0');
        for (var row in labLocation) {
            for (var col in labLocation[row]) {
                if (labLocation[row][col] == "RBS Lab") {
                    totalHeadCountsForLabs += Number(headCounts[row][col]);
                    noEntriesRBS = false;
                    for (i in RBSSchedule) {
                        if (timeStamps[row][col] == RBSSchedule[i]) {
                            RBSSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Dana Lab") {
                    totalHeadCountsForLabs += Number(headCounts[row][col]);
                    noEntriesDana = false;
                    for (i in danaSchedule) {
                        if (timeStamps[row][col] == danaSchedule[i]) {
                            danaSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Hill Hall Lab") {
                    totalHeadCountsForLabs += Number(headCounts[row][col]);
                    noEntriesHill = false;
                    for (i in hillSchedule) {
                        if (timeStamps[row][col] == hillSchedule[i]) {
                            hillSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Cyber Lounge") {
                    totalHeadCountsForLabs += Number(headCounts[row][col]);
                    noEntriesCyber = false;
                    for (i in cyberSchedule) {
                        if (timeStamps[row][col] == cyberSchedule[i]) {
                            cyberSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Engelhard Lab") {
                    totalHeadCountsForLabs += Number(headCounts[row][col]);
                    noEntriesENG = false;
                    for (i in ENGSchedule) {
                        if (timeStamps[row][col] == ENGSchedule[i]) {
                            ENGSchedule.splice(i, 1);
                            break;
                        }
                    }
                } else if (labLocation[row][col] == "Help Desk") {
                    totalHeadCountsForHD += Number(headCounts[row][col]);
                    noEntriesHD = false;
                }
            }
        }

        //check second sheet for previous entries
        var previousHeadcountHD;
        var previousHeadcountLabs;
        var dateMatched = false;
        for (var i = 0; i < secondSheetValues.length; i++) {
            if (Utilities.formatDate(new Date(secondSheetValues[i][2]), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "MM-yyyy") == Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "MM-yyyy")) {
                previousHeadcountHD = Number(secondSheet.getDataRange().getValues()[i][0]);
                previousHeadcountLabs = Number(secondSheet.getDataRange().getValues()[i][1]);
                rangeForHD = secondSheet.getRange(i + 1, 1);
                rangeForLabs = secondSheet.getRange(i + 1, 2);
                dateMatched = true;
            }
        }
        //append new data to second spreadsheet 
        if (dateMatched) {
            var newTotalHeadcountHD = Number(previousHeadcountHD) + Number(totalHeadCountsForHD);
            var newTotalHeadcountLabs = Number(previousHeadcountLabs) + Number(totalHeadCountsForLabs);
            rangeForHD.setValue(newTotalHeadcountHD);
            rangeForLabs.setValue(newTotalHeadcountLabs);
        } else { secondSheet.appendRow([totalHeadCountsForHD, totalHeadCountsForLabs, Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "MM/yyyy")]); }
    }

    //email content 
    var emailAddress = "kmc342@rutgers.edu"; // this could be any email you want it to be 
    var subject = ("Head Counts Report for " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "MM/dd/yyyy"));
    var message = "";
    if (!noEntries) {
        message = "---------------Missing Head Counts---------------";
    }
    if (!noEntriesRBS) {
        if (!RBSSchedule) { message = message + ("\n\nRBS Lab: All entries provided"); } else { message = message + ("\n\nRBS Lab: " + RBSSchedule); }
    } else {
        message = message + ("\n\nRBS Lab : Missing all entries");
    }

    if (!noEntriesDana) {
        if (!danaSchedule) { message = message + ("\n\nDana Library Lab: All entries provided"); } else { message = message + ("\n\nDana Library Lab: " + danaSchedule); }
    } else {
        message = message + ("\n\nDana Library Lab :  Missing all entries");
    }

    if (!noEntriesHill) {
        if (!hillSchedule) { message = message + ("\n\nHill Hall Lab: All entries provided"); } else { message = message + ("\n\nHill Hall Lab: " + hillSchedule); }
    } else {
        message = message + ("\n\nHill Hall Lab: Missing all entries");
    }

    if (!noEntriesCyber) {
        if (!cyberSchedule) { message = message + ("\n\nCyber Lounge: All entries provided"); } else { message = message + ("\n\nCyber Lounge: " + cyberSchedule); }
    } else {
        message = message + ("\n\nCyber Lounge: Missing all entries");
    }

    if (!noEntriesENG) {
        if (!ENGSchedule) { message = message + ("\n\nEngelhard Lab: All entries provided"); } else { message = message + ("\n\nEngelhard Lab: " + ENGSchedule); }
    } else {
        message = message + ("\n\nEngelhard Lab: Missing all entries");
    }

    if (!noEntriesHD) {
        message = message + ("\n\nHelp Desk: Headcount provided");
    } else {
        message = message + ("\n\nHelp Desk: Missing headcount");
    }
    if (noEntries) {
        message = ("No headcount entries were provided for all locations on " + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "MM/dd/yyyy"));
    }
    Logger.log(message);
    MailApp.sendEmail(emailAddress, subject, message);
}
