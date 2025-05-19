# 🧠 BiteSpeed Backend Task — Identity Reconciliation

This project solves the **identity reconciliation problem** for FluxKart.com using a REST API that intelligently links users based on `email` and/or `phoneNumber`.  

Built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** over a **SQLite** database for fast prototyping and deployment.

---

## 🌐 Live URL

🔗 [https://bitespeed-task-4627.onrender.com](https://bitespeed-task-4627.onrender.com)  
_Use this as the base URL for all API requests (e.g., `/identify`, `/contacts`)._

---

## ⚙️ Tech Stack

- ⚡ **Node.js + Express** — RESTful API server
- 🔐 **TypeScript** — Static typing
- 🧩 **Prisma ORM** — Declarative DB access
- 🧱 **SQLite** — Lightweight relational DB
- ☁️ **Render.com** — Free cloud hosting

---

## 📬 API Endpoints

### 🔸 `POST /identify`

Reconciles and links a contact based on provided email and/or phone number.

#### 📝 Request Body:
```json
{
  "email": "doc@flux.com",
  "phoneNumber": "123456"
}
```

#### ✅ Response:
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@flux.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

---

## 🧪 Running Locally

```bash
git clone https://github.com/irondivit/Bitespeed-Task.git
cd Bitespeed-Task
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

To inspect the database visually, run:

```bash
npx prisma studio
```
