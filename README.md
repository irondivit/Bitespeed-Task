# 🛠️ BiteSpeed Backend Task — Identity Reconciliation

This task solves the **identity reconciliation problem** for FluxKart.com using a REST API that intelligently links users by `email` and/or `phoneNumber`. Built with Node.js, Express, TypeScript, and Prisma ORM with SQLite for fast prototyping.

---

## Live URL

🔗 [https://bitespeed-task-4627.onrender.com](https://bitespeed-task-4627.onrender.com)

Use this as the base for all API calls (e.g., `/identify`, `/contacts`)

---

## Tech Stack

- **Node.js + Express** – Server and API
- **TypeScript** – Strongly typed JS
- **Prisma ORM** – DB modeling and queries
- **SQLite** – Lightweight SQL DB
- **Render.com** – Hosting (free tier)

---

##  API Endpoints

### `POST /identify`

Reconciles a user identity by checking and linking email/phone.

#### Request Body:
json
{
  "email": "doc@flux.com",
  "phoneNumber": "123456"
}

####Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@flux.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
