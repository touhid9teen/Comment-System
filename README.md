# 💬 Real-Time Comment System

A modern, professional, and fully interactive comment system built with **React** and **TypeScript**. This project features real-time updates using WebSockets, nested replies, efficient state management, and a clean, responsive UI.

---

## 🚀 Features

- **Real-Time Updates**: Instant reflection of new comments, replies, edits, and deletions via `socket.io`.
- **Nested Replies**: Support for multi-level threaded discussions.
- **Rich Interactions**: Upvote and downvote functionality with live count updates.
- **CRUD Operations**: Full Create, Read, Update, and Delete capabilities for comments.
- **Authentication**: Integrated authentication flow (Google OAuth compatible) with auto-logout on session expiry.
- **Sorting & Pagination**: Sort user comments by newest or popularity; load more comments efficiently.
- **Responsive Design**: Mobile-friendly interface styled with SCSS and Lucide icons.
- **Type Safety**: Built entirely with TypeScript for robust and maintainable code.

---

## 🛠️ Technology Stack

This project is built using the latest modern web technologies:

### **Core**

- **React**: `^19.2.3` - The library for web and native user interfaces.
- **TypeScript**: `~5.9.3` - Strongly typed JavaScript.
- **Vite**: `^7.2.4` - Next generation frontend tooling.

### **Styling & UI**

- **SCSS**: `^1.97.2` - CSS with superpowers.
- **Framer Motion**: `^12.26.2` - Production-ready animation library.
- **Lucide React**: `^0.562.0` - Beautiful & consistent icons.
- **Clsx**: `^2.1.1` - Utility for constructing `className` strings conditionally.

### **State & Data**

- **Socket.io-client**: `^4.8.3` - Real-time bidirectional event-based communication.
- **Axios**: `^1.13.2` - Promise based HTTP client.
- **Context API**: Custom context-based state management (`CommentContext`, `AuthContext`).

### **Forms & Validation**

- **React Hook Form**: `^7.71.1` - Performant, flexible and extensible forms.
- **Zod**: `^4.3.5` - TypeScript-first schema declaration and validation.
- **Resolvers**: `^5.2.2` - Validation resolvers for React Hook Form.

### **Utilities**

- **Date-fns**: `^4.1.0` - Modern JavaScript date utility library.

---

## 📂 Project Structure

A clean and organized folder hierarchy designed for scalability.

```
src/
├── 📂 assets/          # Static assets (images, fonts)
├── 📂 components/      # Reusable UI components
│   ├── 📂 common/      # Logic-heavy components (CommentThread, Inputs)
│   ├── 📂 layout/      # Layout components (Header, Footer)
│   └── 📂 ui/          # Dumb components (Buttons, Avatars, Icons)
├── 📂 config/          # Configuration files (API, Axios setup)
├── 📂 context/         # React Context providers (Auth, Comment, Socket)
├── 📂 data/            # Mock data or constants
├── 📂 pages/           # Page-level components (Home, Profile)
├── 📂 services/        # API service layer (CommentService, AuthService)
├── 📂 styles/          # Global styles and mixins
├── 📂 types/           # TypeScript interfaces and types
├── 📄 App.tsx          # Main application component
├── 📄 main.tsx         # Entry point
└── 📄 index.css        # Global CSS reset
```

---

## 🚦 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository

```bash
git clone <repository-url>
cd comment-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

---

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

**Author**: Touhid
**License**: MIT
