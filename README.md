# Discord Clone — Real-Time Community Platform

A full-stack community and messaging platform built with Next.js, Prisma and Socket.IO. It supports server-based communities, text channels, direct messages, file sharing, member roles, and authenticated voice/video rooms.

## Highlights

- Real-time channel messaging and direct messages with Socket.IO
- Server, channel and member management with role-based permissions
- Authenticated voice and video rooms powered by LiveKit
- Clerk authentication and protected API access
- File and image uploads through UploadThing
- Infinite message pagination with TanStack Query
- Responsive light/dark interface built with Tailwind CSS and Radix UI
- Prisma data model for profiles, servers, channels, members and conversations

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Realtime | Socket.IO, TanStack Query |
| Voice / Video | LiveKit |
| Authentication | Clerk |
| Database | MySQL, Prisma |
| File uploads | UploadThing |
| UI | Radix UI, shadcn/ui, Lucide |
| Forms / validation | React Hook Form, Zod |

## Architecture

The project uses the Next.js App Router for the main application and API routes, while Socket.IO endpoints use the Pages Router so the Socket.IO server can attach to the underlying Node server. Authorization checks are performed server-side before returning messages, joining media rooms, or modifying server resources.

## Local Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in your credentials.
4. Run `npm run db:push`.
5. Start the development server with `npm run dev`.

Useful checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Screenshots

<p align="left">
  <img src="https://github.com/user-attachments/assets/3c2c9027-c0a7-40d3-b72b-23a280ea0800" width="700" alt="Discord Clone server interface" />
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/d3236764-0843-44bd-90c6-a99bc8160326" width="700" alt="Discord Clone channel chat" />
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/0131b5e5-a371-4da2-8859-ec23c67bfc72" width="700" alt="Discord Clone server management" />
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/c20d5c57-cc8f-4a78-9a2b-f828bd48a41c" width="700" alt="Discord Clone member management" />
</p>
<p align="left">
  <img src="https://github.com/user-attachments/assets/bc6e0382-b7b6-4312-9876-815a7440e354" width="700" alt="Discord Clone media room" />
</p>

## Author

Eduardo De La Cruz — [@eduardolluis](https://github.com/eduardolluis)
