# Discord Clone — Real-Time Community Platform

A full-stack real-time community platform built with **Next.js** and **Prisma** — supporting servers, text channels, and voice/video calls.

## ✨ Features

- 🖥️ **Servers & channels** — create communities with organized text/voice channels
- 💬 **Real-time text chat** with Socket.io
- 📞 **Voice & video calls** powered by LiveKit
- 🔐 **Authentication** with Clerk
- 📁 **File & image sharing** via UploadThing
- 😊 **Emoji picker** in chat
- 👥 **Member roles & permissions**
- 🌓 **Light/dark theme** support
- 📱 **Responsive UI** built with Radix UI + Tailwind

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Real-time | Socket.io |
| Voice/Video | LiveKit |
| Auth | Clerk |
| Database/ORM | Prisma |
| File uploads | UploadThing |
| UI | Radix UI, Tailwind CSS, shadcn/ui, Lucide icons |
| State/Forms | Zustand, React Hook Form, Zod |
| Data fetching | TanStack Query |

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- A database (Postgres/MySQL, configured via Prisma)
- Clerk account (auth keys)
- LiveKit account (voice/video keys)
- UploadThing account (file storage keys)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/eduardolluis/discord-clone.git
cd discord-clone

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file with your Clerk, LiveKit, UploadThing and database credentials

# 4. Push the Prisma schema to your database
npm run db:push

# 5. Run the dev server
npm run dev
```

---

## 📸 Screenshots

<p align="left">
  <img src="https://github.com/user-attachments/assets/3c2c9027-c0a7-40d3-b72b-23a280ea0800" width="600"/>
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/d3236764-0843-44bd-90c6-a99bc8160326" width="600"/>
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/0131b5e5-a371-4da2-8859-ec23c67bfc72" width="600"/>
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/c20d5c57-cc8f-4a78-9a2b-f828bd48a41c" width="600"/>
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/bc6e0382-b7b6-4312-9876-815a7440e354" width="600"/>
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/36b22014-3ab9-4125-8eac-a76fd87773d9" width="600"/>
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/b4cff841-570b-4a80-8d2e-678349168e6a" width="600"/>
</p>

---

## 👨‍💻 Author

**Eduardo De La Cruz** — [@eduardolluis](https://github.com/eduardolluis)
