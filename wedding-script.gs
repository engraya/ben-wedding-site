// =============================================================================
//  Wedding RSVP & Seat Assignment — Google Apps Script Template
//  Open-sourced with love. Fork, fill in your details, and enjoy your day.
//  GitHub: https://github.com/UfiairENE/our-wedding-site-template
// =============================================================================


// =============================================================================
// ✏️  CONFIGURATION — Fill in your details here. Nothing else needs changing.
// =============================================================================

var CONFIG = {
  // --- Couple & Event ---
  // NOTE: This drives the Church Wedding (main ceremony). EVENT_DATE must stay in a
  // format new Date() can parse (no "th"/"st" ordinal) — the reminder countdowns rely on it.
  PARTNER_1_NAME     : "Mfonobong",
  PARTNER_2_NAME     : "Benjamin",
  EVENT_DATE         : "August 29, 2026",        // Human-readable, used in emails (Saturday)
  EVENT_TIME         : "10:30 AM WAT",
  CHECKIN_TIME       : "10:00 AM WAT",           // 30 min before the ceremony
  COLOR_OF_THE_DAY   : "Purple, Lilac & Blush",

  // --- Venue (physical guests) ---
  VENUE_NAME         : "The Apostolic Church, Akparika District — 23 Abasi Edem Street, Calabar, CRS (Reception: Event45, State Housing Estate, Calabar)",
  VENUE_MAP_LINK     : "https://www.google.com/maps/search/?api=1&query=The+Apostolic+Church+Akparika+District+Calabar",

  // --- Livestream (virtual guests) ---
  YOUTUBE_LINK       : "https://www.youtube.com/live/REPLACE_WITH_STREAM_ID",  // TODO: paste your real livestream link before the day

  // --- Website & Gifts ---
  WEBSITE_URL        : "https://mb-wedding-two.vercel.app",
  GIFT_PAGE_URL      : "https://mb-wedding-two.vercel.app/gifts",

  // --- Seating ---
  SEATS_PER_TABLE    : 10,    // How many seats per table
  MAX_TABLES         : 10,   // Upper bound; script stops searching after this

  // --- Gift / Payment Details (shown in emails) ---
  // Add, remove, or edit these lines as needed.
  GIFT_METHODS: [
    { label: "Bank Transfer (Naira)",           value: "Opay MFB · 8161790418 · Benjamin Frank" },
    { label: "Bitcoin (On-chain)",              value: "bc1qjh8k8vzv9na5cmspn4k60ts80y5rxgh2qy004u" },
    { label: "cNGN (Base / BSC · EVM)",         value: "0x406Dd8a99Deda7CC01A1dB738AA80B39565F9635" },
    { label: "USDT / USDC (Base / BSC · EVM)",  value: "0x35309f8499330a430440C59A3C0ABE00cCb86860" },
    { label: "Solana (USDT / USDC)",            value: "FcyBMyuwST1afLDTwHr9EoyQazZjZ5wfzUrRWynBWKe" },
    { label: "Tron (USDT)",                     value: "TPfLZr8kXP71KssJdcAuDSkEcxxUDeAqnF" }
  ]
};

// =============================================================================
// 🎨  EMAIL STYLES — Edit only if you want to change the look of emails.
// =============================================================================

var STYLES = {
  base         : "font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#2c2c2c;line-height:1.8;",
  divider      : "border:none;border-top:1px solid #e8d5cc;margin:28px 0;",
  sectionTitle : "font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#a0735a;margin-bottom:12px;",
  table        : "width:100%;border-collapse:collapse;font-size:15px;",
  tdLabel      : "padding:9px 16px 9px 0;color:#888;font-size:13px;width:36%;vertical-align:top;",
  tdValue      : "padding:9px 0;font-size:15px;font-weight:500;color:#2c2c2c;vertical-align:top;",
  noticeBox    : "background:#fff8f5;border-left:3px solid #c0392b;padding:14px 18px;font-size:14px;line-height:1.7;color:#444;border-radius:0 6px 6px 0;",
  arrivalBox   : "background:#f9f6f2;border-left:3px solid #a0735a;padding:14px 18px;font-size:14px;line-height:1.7;color:#444;border-radius:0 6px 6px 0;",
  footer       : "font-size:13px;color:#aaa;text-align:center;padding-top:8px;",
  accentColor  : "#a0735a"
};


// =============================================================================
// 🔧  HELPERS
// =============================================================================

function coupleNames() {
  return CONFIG.PARTNER_1_NAME + " & " + CONFIG.PARTNER_2_NAME;
}

function getGiftSectionHtml() {
  var rows = CONFIG.GIFT_METHODS.map(function(m) {
    return "<li><strong>" + m.label + ":</strong> " + m.value + "</li>";
  }).join("");
  return (
    "<strong>Gift Registry</strong><br>" +
    "Your presence is the greatest gift. However, if you wish to honour us with a contribution, please visit " +
    "<a href='" + CONFIG.GIFT_PAGE_URL + "'>" + CONFIG.GIFT_PAGE_URL + "</a><br><br>" +
    "<strong>Direct Details:</strong><br><ul>" + rows + "</ul>"
  );
}

function getCancellationNotice() {
  return (
    "<strong>Important — If Your Plans Change</strong><br>" +
    "We deeply appreciate you taking the time to RSVP. As this is an intimate event with limited seats, " +
    "if for any reason you are no longer able to attend, please let us know as soon as possible by replying to this email. " +
    "This allows us to release your seat to another guest."
  );
}

function divider() {
  return "<hr style='" + STYLES.divider + "'>";
}

function footer() {
  return (
    "<p style='" + STYLES.footer + "'>You are receiving this because you RSVP'd to our wedding celebration.</p>"
  );
}

function signOff(opening) {
  opening = opening || "With Love,";
  return "<p style='font-size:15px;'>" + opening + "<br><strong>" + coupleNames() + "</strong></p>";
}

function parseSeatStringToPairs(seatStr) {
  var pairs = [];
  var tableMatch = seatStr.match(/Table (\d+)/);
  if (!tableMatch) return pairs;
  var tableNum    = parseInt(tableMatch[1]);
  var rangeMatch  = seatStr.match(/Seats (\d+)-(\d+)/);
  var singleMatch = seatStr.match(/Seat (\d+)$/);
  if (rangeMatch) {
    for (var s = parseInt(rangeMatch[1]); s <= parseInt(rangeMatch[2]); s++) {
      pairs.push({ tableNum: tableNum, seatNum: s });
    }
  } else if (singleMatch) {
    pairs.push({ tableNum: tableNum, seatNum: parseInt(singleMatch[1]) });
  }
  return pairs;
}

function buildTakenSeatSet(physicalSheet) {
  var taken = {};
  if (!physicalSheet || physicalSheet.getLastRow() <= 1) return taken;
  var data = physicalSheet.getRange(2, 1, physicalSheet.getLastRow() - 1, 14).getValues();
  for (var i = 0; i < data.length; i++) {
    var row     = data[i];
    var status  = row[12].toString().toUpperCase();
    var seatVal = row[11].toString().trim();
    if (status === "APPROVED" && seatVal !== "" && seatVal !== "Pending") {
      var pairs = parseSeatStringToPairs(seatVal);
      for (var j = 0; j < pairs.length; j++) {
        taken[pairs[j].tableNum + "_" + pairs[j].seatNum] = true;
      }
    }
  }
  return taken;
}

function findSeatsForParty(taken, partySize) {
  for (var t = 1; t <= CONFIG.MAX_TABLES; t++) {
    for (var startSeat = 1; startSeat <= CONFIG.SEATS_PER_TABLE - partySize + 1; startSeat++) {
      var fits = true;
      for (var p = 0; p < partySize; p++) {
        if (taken[t + "_" + (startSeat + p)]) { fits = false; break; }
      }
      if (fits) {
        for (var p = 0; p < partySize; p++) {
          taken[t + "_" + (startSeat + p)] = true;
        }
        return partySize === 1
          ? "Table " + t + ", Seat " + startSeat
          : "Table " + t + ", Seats " + startSeat + "-" + (startSeat + partySize - 1);
      }
    }
  }
  return null;
}


// =============================================================================
// 📋  SHEET SETUP
// =============================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Wedding Admin')
    .addItem('Fix Sheet Headers',          'setupSheetHeaders')
    .addItem('Assign Seats & Send Emails', 'autoAssignAndEmail')
    .addItem('Fix Duplicate Seats',        'fixDuplicateSeats')
    .addItem('Send Reminder',              'sendReminder')
    .addItem('Send Final Week Reminder',   'sendFinalWeekReminder')
    .addItem('Send Day-Of Email',          'sendDayOfEmail')
    .addItem('Send Thank You Email',       'sendThankYouEmail')
    .addToUi();
}

function setupSheetHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ["Physical", "Virtual"].forEach(function(tabName) {
    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
    initSheetHeaders(sheet);
  });
}

function initSheetHeaders(sheet) {
  var headers = [
    "Timestamp", "Attendance", "Name", "Email", "Phone",
    "Relationship", "Guests", "Guest Name", "Dietary",
    "Media Consent", "Message", "Seat Number", "Status", "Email Sent"
  ];
  sheet.getRange(1, 1, 1, headers.length)
    .clearDataValidations()
    .setValues([headers])
    .setFontWeight("bold")
    .setBackground("#f3f3f3");
  sheet.setFrozenRows(1);
  sheet.getRange("M2:M").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Pending', 'APPROVED', 'DECLINED'], true).build()
  );
  sheet.getRange("N2:N").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['YES', 'NO'], true).build()
  );
}


// =============================================================================
// 📥  FORM SUBMISSION (doPost)
// =============================================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var data    = JSON.parse(e.postData.contents);
    var email   = data.email.toLowerCase().trim();
    var tabName = data.attendanceType === "virtual" ? "Virtual" : "Physical";
    var ss      = SpreadsheetApp.getActiveSpreadsheet();
    var sheet   = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
    if (sheet.getLastRow() === 0) initSheetHeaders(sheet);

    // Reject duplicate emails across both sheets
    var allSheets = [ss.getSheetByName("Physical"), ss.getSheetByName("Virtual")];
    for (var s = 0; s < allSheets.length; s++) {
      var sh = allSheets[s];
      if (!sh) continue;
      var lastRow = sh.getLastRow();
      if (lastRow > 1) {
        var emails = sh.getRange(2, 4, lastRow - 1, 1).getValues().flat();
        if (emails.indexOf(email) !== -1) {
          return ContentService
            .createTextOutput(JSON.stringify({ result: "error", error: "This email is already registered." }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    sheet.appendRow([
      new Date(), data.attendanceType, data.name, email, data.phone,
      data.relationship, data.guests, data.guestName || "", data.dietary || "N/A",
      data.mediaConsent || "N/A", data.message, 'Pending', 'Pending', 'NO'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}


// =============================================================================
// 💺  SEAT ASSIGNMENT & CONFIRMATION EMAILS
// =============================================================================

function autoAssignAndEmail() {
  var ss            = SpreadsheetApp.getActiveSpreadsheet();
  var physicalSheet = ss.getSheetByName("Physical");
  var virtualSheet  = ss.getSheetByName("Virtual");

  // --- Physical ---
  if (physicalSheet && physicalSheet.getLastRow() > 1) {
    var physData = physicalSheet.getRange(2, 1, physicalSheet.getLastRow() - 1, 14).getValues();
    var taken    = buildTakenSeatSet(physicalSheet);

    for (var i = 0; i < physData.length; i++) {
      var row       = physData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent === "YES") continue;

      var guestCount = parseInt(row[6]) || 1;
      var seatStr    = findSeatsForParty(taken, guestCount);

      if (!seatStr) {
        Logger.log("WARNING: No seats available for " + row[2] + " (party of " + guestCount + ")");
        continue;
      }

      var seatLabel = "Seat" + (guestCount > 1 ? "s" : "");
      var htmlBody  =
        "<div style='" + STYLES.base + "'>" +
        "<p style='font-size:16px;'>Hello <strong>" + row[2] + "</strong>,</p>" +
        "<p>We are truly grateful you will be joining us in person for our celebration of love — your presence means everything to us!</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Your Seat Details</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>" + seatLabel + "</td><td style='" + STYLES.tdValue + "'><strong>" + seatStr + "</strong></td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Ceremony</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Check-in from</td><td style='" + STYLES.tdValue + "'>" + CONFIG.CHECKIN_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Venue</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.VENUE_MAP_LINK + "' style='color:" + STYLES.accentColor + ";'>" + CONFIG.VENUE_NAME + "</a></td></tr>" +
        "</table>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Arrival Note</p>" +
        "<div style='" + STYLES.arrivalBox + "'>" +
        "Please arrive by <strong>" + CONFIG.CHECKIN_TIME + "</strong> — 30 minutes before the ceremony begins at <strong>" + CONFIG.EVENT_TIME + "</strong>. " +
        "Early check-in helps ensure the event starts on time. Guests who arrive after the ceremony starts may not be seated until a suitable break." +
        "</div>" +
        divider() +
        getCancellationNotice() +
        divider() +
        getGiftSectionHtml() +
        divider() +
        signOff("With Love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(
        row[3],
        "Seat Confirmed — " + coupleNames() + "'s Wedding",
        "",
        { htmlBody: htmlBody }
      );
      physicalSheet.getRange(i + 2, 12).setValue(seatStr);
      physicalSheet.getRange(i + 2, 14).setValue("YES");
      Logger.log("Seat assigned & email sent: " + row[2] + " → " + seatStr);
    }
  }

  // --- Virtual ---
  if (virtualSheet && virtualSheet.getLastRow() > 1) {
    var virtData = virtualSheet.getRange(2, 1, virtualSheet.getLastRow() - 1, 14).getValues();
    for (var i = 0; i < virtData.length; i++) {
      var row       = virtData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent === "YES") continue;

      var htmlBody =
        "<div style='" + STYLES.base + "'>" +
        "<p style='font-size:16px;'>Hello <strong>" + row[2] + "</strong>,</p>" +
        "<p>We truly appreciate you being part of our special day, even from a distance — it means the world to us!</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>How to Watch</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Time</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Livestream</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.YOUTUBE_LINK + "' style='color:" + STYLES.accentColor + ";'>Watch Here →</a></td></tr>" +
        "</table>" +
        divider() +
        getGiftSectionHtml() +
        divider() +
        signOff("With Love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(
        row[3],
        "You're Confirmed — " + coupleNames() + "'s Wedding (Virtual)",
        "",
        { htmlBody: htmlBody }
      );
      virtualSheet.getRange(i + 2, 12).setValue("VIRTUAL");
      virtualSheet.getRange(i + 2, 14).setValue("YES");
      Logger.log("Virtual confirmation sent: " + row[2]);
    }
  }
}

function onEditTrigger(e) {
  if (!e) return;
  var range = e.range;
  if (range.getColumn() === 13 && range.getValue().toString().toUpperCase().indexOf("APPROVE") !== -1) {
    Utilities.sleep(1500);
    autoAssignAndEmail();
  }
}


// =============================================================================
// 🔁  FIX DUPLICATE SEATS
// =============================================================================

function fixDuplicateSeats() {
  var ss            = SpreadsheetApp.getActiveSpreadsheet();
  var physicalSheet = ss.getSheetByName("Physical");
  if (!physicalSheet || physicalSheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert("No data found in Physical sheet.");
    return;
  }

  var data        = physicalSheet.getRange(2, 1, physicalSheet.getLastRow() - 1, 14).getValues();
  var seatOwner   = {};
  var duplicates  = [];

  for (var i = 0; i < data.length; i++) {
    var row     = data[i];
    var status  = row[12].toString().toUpperCase();
    var seatVal = row[11].toString().trim();
    if (status !== "APPROVED" || seatVal === "" || seatVal === "Pending" || seatVal === "VIRTUAL") continue;

    var pairs       = parseSeatStringToPairs(seatVal);
    var isDuplicate = pairs.some(function(p) { return seatOwner[p.tableNum + "_" + p.seatNum] !== undefined; });

    if (isDuplicate) {
      duplicates.push({ rowIndex: i, oldSeat: seatVal });
    } else {
      pairs.forEach(function(p) { seatOwner[p.tableNum + "_" + p.seatNum] = i; });
    }
  }

  if (duplicates.length === 0) {
    SpreadsheetApp.getUi().alert("No duplicate seats found. All good!");
    return;
  }

  var taken = {};
  for (var key in seatOwner) { taken[key] = true; }

  var correctedMap = {};
  duplicates.forEach(function(d) {
    var row        = data[d.rowIndex];
    var guestCount = parseInt(row[6]) || 1;
    var newSeatStr = findSeatsForParty(taken, guestCount);
    if (!newSeatStr) {
      Logger.log("ERROR: Could not reassign seat for " + row[2] + ". Manual intervention needed.");
      return;
    }
    physicalSheet.getRange(d.rowIndex + 2, 12).setValue(newSeatStr);
    correctedMap[row[3].toString().trim().toLowerCase()] = d.oldSeat;
    Logger.log("Reassigned: " + row[2] + " | " + d.oldSeat + " → " + newSeatStr);
  });

  PropertiesService.getScriptProperties().setProperty("CORRECTED_EMAILS", JSON.stringify(correctedMap));
  SpreadsheetApp.getUi().alert(
    duplicates.length + " duplicate seat(s) corrected.\n\n" +
    "Affected guests will see their updated seat in the next reminder email.\n\n" +
    "Check Logs for details."
  );
}


// =============================================================================
// 📅  REMINDER
// =============================================================================

function sendReminder() {
  var ss            = SpreadsheetApp.getActiveSpreadsheet();
  var physicalSheet = ss.getSheetByName("Physical");
  var virtualSheet  = ss.getSheetByName("Virtual");

  var correctedMap = {};
  var savedProp = PropertiesService.getScriptProperties().getProperty("CORRECTED_EMAILS");
  if (savedProp) { try { correctedMap = JSON.parse(savedProp); } catch(e) {} }

  var weeksAway    = Math.round((new Date(CONFIG.EVENT_DATE) - new Date()) / (7 * 24 * 60 * 60 * 1000));
  var countdownTxt = weeksAway > 1
    ? "just <strong>" + weeksAway + " weeks away</strong>"
    : "less than a week away — it's almost here!";

  if (physicalSheet && physicalSheet.getLastRow() > 1) {
    var physData = physicalSheet.getRange(2, 1, physicalSheet.getLastRow() - 1, 14).getValues();
    for (var i = 0; i < physData.length; i++) {
      var row       = physData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent !== "YES") continue;

      var name         = row[2];
      var email        = row[3].toString().trim();
      var seatStr      = row[11].toString();
      var guestCount   = parseInt(row[6]) || 1;
      var seatLabel    = "Seat" + (guestCount > 1 ? "s" : "");
      var oldSeat      = correctedMap[email.toLowerCase()];
      var seatDisplay  = oldSeat
        ? "<s style='color:#aaa;'>" + oldSeat + "</s> → <strong>" + seatStr + "</strong>" +
          "<br><span style='font-size:12px;color:#888;font-style:italic;'>(updated seat — please note this replaces your previous one)</span>"
        : seatStr;

      var htmlBody =
        "<div style='" + STYLES.base + "'>" +
        "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>Just a reminder that our wedding is " + countdownTxt + ". We cannot wait to celebrate with you.</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Event Details</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Ceremony</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Check-in from</td><td style='" + STYLES.tdValue + "'>" + CONFIG.CHECKIN_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Venue</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.VENUE_MAP_LINK + "' style='color:" + STYLES.accentColor + ";'>" + CONFIG.VENUE_NAME + "</a></td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Colour of the Day</td><td style='" + STYLES.tdValue + "'>" + CONFIG.COLOR_OF_THE_DAY + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>" + seatLabel + "</td><td style='" + STYLES.tdValue + "'>" + seatDisplay + "</td></tr>" +
        "</table>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Arrival Note</p>" +
        "<div style='" + STYLES.arrivalBox + "'>" +
        "Please arrive by <strong>" + CONFIG.CHECKIN_TIME + "</strong> — 30 minutes before the ceremony at <strong>" + CONFIG.EVENT_TIME + "</strong>. " +
        "Guests who arrive after the ceremony starts may not be seated until a suitable break." +
        "</div>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>If Your Plans Change</p>" +
        "<div style='" + STYLES.noticeBox + "'>" +
        "As this is an intimate celebration, please reply to this email immediately if you can no longer attend so we may release your seat." +
        "</div>" +
        divider() +
        signOff("With Love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(email, "Reminder — " + coupleNames() + "'s Wedding | " + CONFIG.EVENT_DATE, "", { htmlBody: htmlBody });
      Logger.log("Reminder sent: " + name + (oldSeat ? " [SEAT CORRECTION INCLUDED]" : ""));
    }
  }

  if (virtualSheet && virtualSheet.getLastRow() > 1) {
    var virtData = virtualSheet.getRange(2, 1, virtualSheet.getLastRow() - 1, 14).getValues();
    for (var i = 0; i < virtData.length; i++) {
      var row       = virtData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent !== "YES") continue;

      var name  = row[2];
      var email = row[3];

      var htmlBody =
        "<div style='" + STYLES.base + "'>" +
        "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>Just a reminder that our wedding is " + countdownTxt + ". We are so glad you will be joining us virtually — keep the link handy!</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Event Details</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Time</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Colour of the Day</td><td style='" + STYLES.tdValue + "'>" + CONFIG.COLOR_OF_THE_DAY + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Livestream</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.YOUTUBE_LINK + "' style='color:" + STYLES.accentColor + ";'>Watch Here →</a></td></tr>" +
        "</table>" +
        divider() +
        signOff("With Love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(email, "Reminder — " + coupleNames() + "'s Wedding | " + CONFIG.EVENT_DATE, "", { htmlBody: htmlBody });
      Logger.log("Reminder sent (virtual): " + name);
    }
  }

  PropertiesService.getScriptProperties().deleteProperty("CORRECTED_EMAILS");
  SpreadsheetApp.getUi().alert("Reminders sent! Check Logs for details.");
}


// =============================================================================
// 📅  REMINDER: FINAL WEEK
// =============================================================================

function sendFinalWeekReminder() {
  var ss            = SpreadsheetApp.getActiveSpreadsheet();
  var physicalSheet = ss.getSheetByName("Physical");
  var virtualSheet  = ss.getSheetByName("Virtual");

  var daysLeft     = Math.round((new Date(CONFIG.EVENT_DATE) - new Date()) / (24 * 60 * 60 * 1000));
  var countdownTxt = daysLeft <= 1 ? "tomorrow — it is almost here!" : "in just <strong>" + daysLeft + " days</strong>";

  if (physicalSheet && physicalSheet.getLastRow() > 1) {
    var physData = physicalSheet.getRange(2, 1, physicalSheet.getLastRow() - 1, 14).getValues();
    for (var i = 0; i < physData.length; i++) {
      var row       = physData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent !== "YES") continue;

      var name       = row[2];
      var email      = row[3].toString().trim();
      var seatStr    = row[11].toString();
      var guestCount = parseInt(row[6]) || 1;
      var seatLabel  = "Seat" + (guestCount > 1 ? "s" : "");

      var htmlBody =
        "<div style='" + STYLES.base + "'>" +
        "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>The big day is " + countdownTxt + " We are so excited to have you with us.</p>" +
        "<p>This is your final reminder — please read it carefully, especially the arrival time.</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Your Event Details</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Ceremony</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Check-in from</td><td style='" + STYLES.tdValue + "'>" + CONFIG.CHECKIN_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Venue</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.VENUE_MAP_LINK + "' style='color:" + STYLES.accentColor + ";'>" + CONFIG.VENUE_NAME + "</a></td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Colour of the Day</td><td style='" + STYLES.tdValue + "'>" + CONFIG.COLOR_OF_THE_DAY + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>" + seatLabel + "</td><td style='" + STYLES.tdValue + "'><strong>" + seatStr + "</strong></td></tr>" +
        "</table>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Arrival — Please Read</p>" +
        "<div style='" + STYLES.arrivalBox + "'>" +
        "Please arrive by <strong>" + CONFIG.CHECKIN_TIME + "</strong> — before the ceremony at <strong>" + CONFIG.EVENT_TIME + "</strong>. " +
        "We want you comfortably seated before everything begins. Late arrivals may need to wait for a suitable break." +
        "</div>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>If Your Plans Have Changed</p>" +
        "<div style='" + STYLES.noticeBox + "'>" +
        "If you can no longer attend, please reply to this email immediately so we may offer your seat to another guest in time." +
        "</div>" +
        divider() +
        getGiftSectionHtml() +
        divider() +
        "<p style='font-size:15px;'>We cannot wait to see you. Thank you for being part of our story.</p>" +
        signOff("With all our love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(email, "See You Soon — " + coupleNames() + "'s Wedding | " + CONFIG.EVENT_DATE, "", { htmlBody: htmlBody });
      Logger.log("Final week reminder sent (physical): " + name);
    }
  }

  if (virtualSheet && virtualSheet.getLastRow() > 1) {
    var virtData = virtualSheet.getRange(2, 1, virtualSheet.getLastRow() - 1, 14).getValues();
    for (var i = 0; i < virtData.length; i++) {
      var row       = virtData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent !== "YES") continue;

      var name  = row[2];
      var email = row[3];

      var htmlBody =
        "<div style='" + STYLES.base + "'>" +
        "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>The big day is " + countdownTxt + " Please save this email so the link is easy to find.</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>How to Watch</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Time</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Colour of the Day</td><td style='" + STYLES.tdValue + "'>" + CONFIG.COLOR_OF_THE_DAY + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Livestream</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.YOUTUBE_LINK + "' style='color:" + STYLES.accentColor + ";font-weight:600;'>Watch Here →</a></td></tr>" +
        "</table>" +
        divider() +
        getGiftSectionHtml() +
        divider() +
        "<p style='font-size:15px;'>Distance is no barrier to love. We will feel you with us on screen.</p>" +
        signOff("With all our love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(email, "See You Soon — " + coupleNames() + "'s Wedding | " + CONFIG.EVENT_DATE, "", { htmlBody: htmlBody });
      Logger.log("Final week reminder sent (virtual): " + name);
    }
  }

  SpreadsheetApp.getUi().alert("Final week reminders sent! Check Logs for details.");
}


// =============================================================================
// 📅  DAY-OF EMAIL
// =============================================================================

function sendDayOfEmail() {
  var ss            = SpreadsheetApp.getActiveSpreadsheet();
  var physicalSheet = ss.getSheetByName("Physical");
  var virtualSheet  = ss.getSheetByName("Virtual");

  if (physicalSheet && physicalSheet.getLastRow() > 1) {
    var physData = physicalSheet.getRange(2, 1, physicalSheet.getLastRow() - 1, 14).getValues();
    for (var i = 0; i < physData.length; i++) {
      var row       = physData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent !== "YES") continue;

      var name       = row[2];
      var email      = row[3].toString().trim();
      var seatStr    = row[11].toString();
      var guestCount = parseInt(row[6]) || 1;
      var seatLabel  = "Seat" + (guestCount > 1 ? "s" : "");

      var htmlBody =
        "<div style='" + STYLES.base + "'>" +
        "<div style='text-align:center;margin-bottom:24px;'>" +
        "<p style='font-size:12px;letter-spacing:2px;color:" + STYLES.accentColor + ";text-transform:uppercase;margin:0 0 4px;'>Today is the day</p>" +
        "<h1 style='font-size:22px;font-weight:500;margin:0;color:#2c2c2c;'>" + coupleNames() + " are getting married</h1>" +
        "</div>" +
        divider() +
        "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>Today is finally here! We are overjoyed that you will be with us to celebrate this moment.</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Your Details</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Check-in from</td><td style='" + STYLES.tdValue + "'>" + CONFIG.CHECKIN_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Ceremony</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>" + seatLabel + "</td><td style='" + STYLES.tdValue + "'><strong style='color:" + STYLES.accentColor + ";'>" + seatStr + "</strong></td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Venue</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.VENUE_MAP_LINK + "' style='color:" + STYLES.accentColor + ";'>" + CONFIG.VENUE_NAME + "</a></td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Colour of the Day</td><td style='" + STYLES.tdValue + "'>" + CONFIG.COLOR_OF_THE_DAY + "</td></tr>" +
        "</table>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>Arrival — Important</p>" +
        "<div style='" + STYLES.arrivalBox + "'>" +
        "Doors open at <strong>" + CONFIG.CHECKIN_TIME + "</strong>. Please arrive before <strong>" + CONFIG.EVENT_TIME + "</strong>. " +
        "We want you comfortably in your seat when everything begins." +
        "</div>" +
        divider() +
        getGiftSectionHtml() +
        divider() +
        "<p style='font-size:15px;'>We cannot wait to see your face today. Thank you for being part of our story.</p>" +
        signOff("With all our love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(email, "Today is the Day — " + coupleNames() + "'s Wedding", "", { htmlBody: htmlBody });
      Logger.log("Day-of email sent (physical): " + name);
    }
  }

  if (virtualSheet && virtualSheet.getLastRow() > 1) {
    var virtData = virtualSheet.getRange(2, 1, virtualSheet.getLastRow() - 1, 14).getValues();
    for (var i = 0; i < virtData.length; i++) {
      var row       = virtData[i];
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent !== "YES") continue;

      var name  = row[2];
      var email = row[3];

      var htmlBody =
        "<div style='" + STYLES.base + "'>" +
        "<div style='text-align:center;margin-bottom:24px;'>" +
        "<p style='font-size:12px;letter-spacing:2px;color:" + STYLES.accentColor + ";text-transform:uppercase;margin:0 0 4px;'>Today is the day</p>" +
        "<h1 style='font-size:22px;font-weight:500;margin:0;color:#2c2c2c;'>" + coupleNames() + " are getting married</h1>" +
        "</div>" +
        divider() +
        "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>Today is finally here! We are so glad you will be joining us virtually — please keep this email open so the link is right at hand.</p>" +
        divider() +
        "<p style='" + STYLES.sectionTitle + "'>How to Watch</p>" +
        "<table style='" + STYLES.table + "'>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Date</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_DATE + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Time</td><td style='" + STYLES.tdValue + "'>" + CONFIG.EVENT_TIME + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Colour of the Day</td><td style='" + STYLES.tdValue + "'>" + CONFIG.COLOR_OF_THE_DAY + "</td></tr>" +
        "<tr><td style='" + STYLES.tdLabel + "'>Livestream</td><td style='" + STYLES.tdValue + "'><a href='" + CONFIG.YOUTUBE_LINK + "' style='color:" + STYLES.accentColor + ";font-weight:600;'>Watch Here →</a></td></tr>" +
        "</table>" +
        divider() +
        getGiftSectionHtml() +
        divider() +
        "<p style='font-size:15px;'>Distance is no barrier to love. See you on screen!</p>" +
        signOff("With all our love,") +
        divider() +
        footer() +
        "</div>";

      GmailApp.sendEmail(email, "Today is the Day — " + coupleNames() + "'s Wedding", "", { htmlBody: htmlBody });
      Logger.log("Day-of email sent (virtual): " + name);
    }
  }

  SpreadsheetApp.getUi().alert("Day-of emails sent! Check Logs for details.");
}


// =============================================================================
// 💌  THANK YOU EMAIL
// =============================================================================

function sendThankYouEmail() {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = [ss.getSheetByName("Physical"), ss.getSheetByName("Virtual")].filter(Boolean);
  var baseStyle = STYLES.base;

  sheets.forEach(function(sheet) {
    if (sheet.getLastRow() <= 1) return;
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 14).getValues();
    data.forEach(function(row) {
      var status    = row[12].toString().toUpperCase();
      var emailSent = row[13].toString().toUpperCase();
      if (status !== "APPROVED" || emailSent !== "YES") return;

      var name  = row[2];
      var email = row[3].toString().trim();

      var htmlBody =
        "<div style='" + baseStyle + "'>" +
        "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
        "<p>We are married!</p>" +
        "<p>The day was everything we prayed for and more, and a significant part of that is because of you. " +
        "Whether you were in the room with us, watching from your screen, or simply holding us in your heart and prayers — we felt every bit of it.</p>" +
        "<p>Thank you for your love, your well-wishes, your presence, and your generosity. " +
        "You made what could have been an ordinary day into something we will carry for the rest of our lives.</p>" +
        "<p>We are still floating.</p>" +
        signOff("With all our love,") +
        "</div>";

      GmailApp.sendEmail(email, "Thank You — From " + coupleNames(), "", { htmlBody: htmlBody });
      Logger.log("Thank you email sent: " + name);
    });
  });

  SpreadsheetApp.getUi().alert("Thank you emails sent! Check Logs for details.");
}
