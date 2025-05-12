# 🧘‍♀️ WBSYCA Yoga Web System - Google Apps Script Project

This project powers the official portal for the **West Bengal State Yoga Culture Association**, managing:

- User Signups & Role Login
- Student Registrations (PP-01)
- Modifications (PP-02)
- Exam Data Entry (PP-01 & PP-02)
- Role-based Access Control

---

## 📁 Project Structure

| File                    | Description                              |
|-------------------------|------------------------------------------|
| `index.html`            | Welcome cover page with 3 main buttons   |
| `signup.html`           | Signup form with photo upload            |
| `login.html`            | Login form with Captcha                  |
| `dashboard.html`        | Role-based navigation hub                |
| `student_reg_pp01.html` | Student Registration PP-01               |
| `modify_pp02.html`      | Modify Student PP-02                     |
| `exam_data_pp01.html`   | Enter marks for PP-01                    |
| `exam_data_pp02.html`   | Enter marks for PP-02                    |
| `login_required.html`   | Page shown if not logged in              |
| `Code.gs`               | Google Apps Script backend               |
| `README.md`             | This file                                |

---

## ✅ Features

- 🧾 Signup with photo & password
- 🔐 Login with captcha + role routing
- 🗃️ Google Sheets integration
- 📤 File uploads to Drive
- 🚫 Prevent duplicate Form No and Exam entries
- 🧪 Auto grade calculation
- 🕒 Timestamp & user tracking
- 👮 Role-based visibility (EXAMINER / CENTRE IN CHARGE)

---

## 📊 Sheets & Folders

### Google Sheet ID (Main):  
`1rJgZN8mTGuy8Zp8nJsgf5JMAUJ1h-5xZKQGKfmrJMjk`

| Sheet Name              | Purpose                  |
|-------------------------|--------------------------|
| `USERS LOGIN`           | Signup + login storage   |
| `StudentData_PP-01`     | PP-01 form entries       |
| `StudentData_PP-02`     | PP-02 registration       |
| `StudentExamData_PP01`  | PP-01 exam scores        |
| `StudentExamData_PP02`  | PP-02 exam scores        |

### External Sheet for PP-02 Modification:  
`1PobmcZ1Vztpxz9s2_G3qWq91H2qFTpeqNUNt9moyMrw`  
Sheet: `CANDIDATE DATA SHEET_PP-2`

### Drive Folders:
| Purpose                      | Folder ID                                |
|-----------------------------|-------------------------------------------|
| Signup Photos               | `11HUeo8G_5zMTS60phdxdY3-UF4T-0ICW`       |
| PP-01 Docs/Photos           | `19o2FL84zpDhUcX9ke0X8PF6GdJEmak-D`       |
| PP-02 Docs/Photos           | `1rMe-eZbY9N1lsqx8kZFAp4G5yzebq1OH`       |

---

## 🚀 Deployment (Step-by-Step)

1. Open [Google Apps Script](https://script.new)
2. Create files for each HTML page above
3. Paste `Code.gs` in Script editor
4. Deploy > New deployment:
   - Execute as: Me
   - Who can access: Anyone
5. Set Web App URL (use in all `google.script.run` calls)

---

## 🛡️ Access Control

| Page                     | EXAMINER | CENTRE IN CHARGE |
|--------------------------|:--------:|:----------------:|
| `dashboard.html`         | ✅        | ✅                |
| `student_reg_pp01.html`  | ✅        | ✅                |
| `modify_pp02.html`       | ✅        | ✅                |
| `exam_data_pp01.html`    | ✅        | ❌                |
| `exam_data_pp02.html`    | ✅        | ❌                |

---

## 🧪 Testing Checklist

- [ ] Signup a user with each role
- [ ] Login → Dashboard based on role
- [ ] Submit student data with files
- [ ] Attempt duplicate form → blocked
- [ ] Submit exam data → grade + lock
- [ ] Confirm photos uploaded to correct folder
- [ ] Logout + try direct URL access → blocked

---

## ✅ Credits

Developed for **WBSYCA** - West Bengal State Yoga Culture Association  
Designed for usability, clarity & full mobile responsiveness.