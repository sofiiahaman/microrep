# MicroRep

> Micro-learning platform based on spaced repetition.

**MicroRep** is a full-stack learning platform designed to help users learn and retain knowledge through short study sessions, flashcards, and spaced repetition.

---

## 🛠️ Tech Stack

### Frontend

- **React**
- **Vite**
- **JavaScript**
- **HTML5** / **CSS3**

### Backend

- **Node.js**
- **Express**
- **JavaScript**

### Database

- **PostgreSQL**
- **Prisma ORM**

### Development & Tools

- **Git** & **GitHub**
- **ESLint** & **Prettier**
- **GitHub Actions**

> _Additional technologies may be introduced as the project evolves._

---

## 🏗️ Architecture

MicroRep is organized as a monorepo with two clearly separated applications:

```
microrep/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `22+`
- **npm**
- **PostgreSQL**

### Installation

1. **Clone the repository and install dependencies:**

   ```bash
   git clone https://github.com/sofiiahaman/microrep.git
   cd microrep
   npm install
   ```

npm --prefix ./client install
npm --prefix ./server install

````

2. **Configure environment variables:**
Create your local environment file based on `.env.example` and set the required variables.

### Running the Application

- **Start the frontend:**

```bash
npm run dev:client
````

- **Start the backend** _(in a separate terminal)_:
  ```bash
  npm run dev:server
  ```

The frontend and backend will run on their respective local development ports.
