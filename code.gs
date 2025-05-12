const MAIN_SHEET_ID = '1rJgZN8mTGuy8Zp8nJsgf5JMAUJ1h-5xZKQGKfmrJMjk';
const EXTERNAL_PP02_ID = '1PobmcZ1Vztpxz9s2_G3qWq91H2qFTpeqNUNt9moyMrw';

// Folder IDs
const USER_PHOTO_FOLDER = '11HUeo8G_5zMTS60phdxdY3-UF4T-0ICW';
const REG_PHOTO_FOLDER = '19o2FL84zpDhUcX9ke0X8PF6GdJEmak-D';
const MOD_PHOTO_FOLDER = '1rMe-eZbY9N1lsqx8kZFAp4G5yzebq1OH';

// ========== Utilities ==========
function getSheet(name) {
  return SpreadsheetApp.openById(MAIN_SHEET_ID).getSheetByName(name);
}
function getExternalSheet(name) {
  return SpreadsheetApp.openById(EXTERNAL_PP02_ID).getSheetByName(name);
}
function saveFileToDrive(base64, type, name, folderId) {
  const blob = Utilities.newBlob(Utilities.base64Decode(base64), type, name);
  return DriveApp.getFolderById(folderId).createFile(blob).getUrl();
}

// ========== doGet ==========
function doGet(e) {
  const page = e && e.parameter && e.parameter.page ? e.parameter.page : 'index';
  try {
    return HtmlService.createHtmlOutputFromFile(page).setTitle("WBSYCA Portal");
  } catch {
    return HtmlService.createHtmlOutput("<h3>404 - Page Not Found</h3>");
  }
}

// ========== Signup ==========
function saveSignupWithAdminNotification(data) {
  const sheet = getSheet('USERS LOGIN');
  const url = saveFileToDrive(data.photoBase64, data.photoType, data.photoName, USER_PHOTO_FOLDER);
  sheet.appendRow([
    data.name, data.gender, data.email, data.contactNo, data.centreName,
    data.centreCode, data.address, data.role, url, '', '', data.password, new Date()
  ]);
  MailApp.sendEmail('wbsyca.exam@gmail.com', 'New Signup - WBSYCA', 
    `New user:\nName: ${data.name}\nEmail: ${data.email}\nRole: ${data.role}`);
  return 'Signup successful! Await admin verification.';
}

// ========== Login ==========
function checkLogin(email, password) {
  const sheet = getSheet('USERS LOGIN').getDataRange().getValues();
  for (let i = 1; i < sheet.length; i++) {
    if (sheet[i][2] === email && sheet[i][11] === password) {
      return { success: true, role: sheet[i][7] };
    }
  }
  return { success: false, message: 'Invalid email or password.' };
}

// ========== Student Registration PP-01 ==========
function searchStudentPP01(formNo) {
  const data = getSheet('StudentData_PP-01').getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === formNo) {
      return {
        email: data[i][0], formNo: data[i][1], name: data[i][2], dob: data[i][3],
        guardian: data[i][4], relation: data[i][5], contact: data[i][6], subject: data[i][7],
        centreName: data[i][8], centreCode: data[i][9], centreAddress: data[i][10]
      };
    }
  }
  return null;
}

function saveStudentPP01(data) {
  const sheet = getSheet('StudentData_PP-01');
  const values = sheet.getDataRange().getValues();
  if (values.some(row => row[1] === data.formNo)) return 'Duplicate Form No!';
  const photoURL = saveFileToDrive(data.photoBase64, data.photoType, data.photoName, REG_PHOTO_FOLDER);
  const birthURL = saveFileToDrive(data.birthBase64, data.birthType, data.birthName, REG_PHOTO_FOLDER);
  sheet.appendRow([
    data.email, data.formNo, data.name, data.dob, data.guardian,
    data.relation, data.contact, data.subject, data.centreName, data.centreCode,
    data.centreAddress, photoURL, birthURL
  ]);
  return 'Student registered successfully.';
}

// ========== Modify PP-02 ==========
function searchStudentPP02(rollOrName) {
  const data = getExternalSheet('CANDIDATE DATA SHEET_PP-2').getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === rollOrName || data[i][2] === rollOrName) {
      return {
        registrationNo: data[i][0], rollNo: data[i][1], name: data[i][2],
        dob: data[i][3], guardianName: data[i][4], relation: data[i][5],
        contactNo: data[i][6], subject: data[i][7], centreName: data[i][8],
        centreCode: data[i][9], centreAddress: data[i][10]
      };
    }
  }
  return null;
}

function modifyStudentPP02(data) {
  const sheet = getExternalSheet('CANDIDATE DATA SHEET_PP-2');
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.registrationNo && rows[i][1] === data.rollNo) {
      const photoURL = data.photoBase64 ? saveFileToDrive(data.photoBase64, data.photoType, data.photoName, MOD_PHOTO_FOLDER) : rows[i][11];
      const birthURL = data.birthBase64 ? saveFileToDrive(data.birthBase64, data.birthType, data.birthName, MOD_PHOTO_FOLDER) : rows[i][12];
      sheet.getRange(i + 1, 3, 1, 10).setValues([[
        data.name, data.dob, data.guardianName, data.relation, data.contactNo,
        data.subject, data.centreName, data.centreCode, data.centreAddress, new Date()
      ]]);
      sheet.getRange(i + 1, 12, 1, 2).setValues([[photoURL, birthURL]]);
      return 'Student data updated.';
    }
  }
  return 'Record not found.';
}

// ========== Exam Data PP-01 ==========
function searchStudentPP01ByRoll(roll) {
  const data = getSheet('StudentData_PP-01').getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === roll) {
      return { registrationNo: data[i][1], name: data[i][2] };
    }
  }
  return null;
}

function saveExamDataPP01(data) {
  const sheet = getSheet('StudentExamData_PP01');
  const rows = sheet.getDataRange().getValues();
  if (rows.some(r => r[1] === data.rollNo)) return 'Already submitted!';
  const total = +data.pt + +data.asana + +data.oral;
  const grade = getGrade(total);
  sheet.appendRow([
    data.registrationNo, data.rollNo, data.name,
    data.pt, data.asana, data.oral,
    total, grade, new Date(), data.userEmail
  ]);
  return 'Exam Data Saved (PP-01).';
}

// ========== Exam Data PP-02 ==========
function searchStudentPP02ByRoll(roll) {
  const data = getSheet('StudentData_PP-02').getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === roll) {
      return { registrationNo: data[i][1], name: data[i][2] };
    }
  }
  return null;
}

function saveExamDataPP02(data) {
  const sheet = getSheet('StudentExamData_PP02');
  const rows = sheet.getDataRange().getValues();
  if (rows.some(r => r[1] === data.rollNo)) return 'Already submitted!';
  const total = +data.pt + +data.asana + +data.oral;
  const grade = getGrade(total);
  sheet.appendRow([
    data.registrationNo, data.rollNo, data.name,
    data.pt, data.asana, data.oral,
    total, grade, new Date(), data.userEmail
  ]);
  return 'Exam Data Saved (PP-02).';
}

// Grade Logic
function getGrade(total) {
  if (total >= 61) return '1ST DIV.';
  if (total >= 41) return '2ND DIV.';
  if (total >= 31) return '3RD DIV.';
  if (total >= 21) return 'PASS';
  return 'FAIL';
}
