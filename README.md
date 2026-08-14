# 🚀 DevBook

**DevBook** is a full-stack developer community platform built using the **MERN stack**. It allows developers to create profiles, share posts, follow other developers, interact with content, and build a developer-focused community.

The project is designed to provide a social platform specifically for developers, with features focused on networking, collaboration, and knowledge sharing.

---

## 📌 Table of Contents

* [✨ Features](#-features)
* [🧩 Microservices](#-microservices)
* [🛠️ Technology Stack](#️-technology-stack)
* [📁 Project Structure](#-project-structure)
* [🔐 Authentication & Authorization](#-authentication--authorization)
* [🗄️ Database](#️-database)
* [🔄 Application Flow](#-application-flow)
* [🚀 Getting Started](#-getting-started)
* [⚙️ Environment Variables](#️-environment-variables)
* [📡 API Overview](#-api-overview)
* [🧪 Testing](#-testing)
* [📸 Screenshots](#-screenshots)
* [🔮 Future Enhancements](#-future-enhancements)
* [👨‍💻 Author](#-author)
* [📄 License](#-license)

---

# ✨ Features

### 👤 User & Developer Profile

* User registration and login
* Developer profile creation
* Profile information management
* Developer skills and information
* Follow / Unfollow developers
* View other developers' profiles

### 📝 Posts

* Create posts
* View posts in the feed
* Like posts
* Comment on posts
* Save posts
* Delete/update posts where applicable

### 🤝 Developer Networking

* Follow other developers
* Personalized developer feed
* Discover developers
* Developer-focused community interactions

### 🔐 Security

* JWT-based authentication
* Protected routes
* Authentication middleware
* Password encryption
* Authorization for protected operations

### 🖥️ Frontend

* Responsive user interface
* React-based component architecture
* React Router for navigation
* Tailwind CSS for styling
* API integration with backend services

### ⚙️ Backend

* RESTful APIs
* Express.js server
* MongoDB database integration
* Mongoose ODM
* JWT authentication
* Middleware-based request handling

---

# 🧩 Microservices

> **Current Architecture:** DevBook is currently implemented as a **MERN-based full-stack application**.

The application follows a modular client-server architecture:

```text
                ┌─────────────────────┐
                │      Developer      │
                │        / User       │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │    React Frontend   │
                │       (Vite)        │
                └──────────┬──────────┘
                           │
                     REST API Calls
                           │
                           ▼
                ┌─────────────────────┐
                │   Node.js + Express │
                │       Backend       │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │      MongoDB        │
                │       Atlas         │
                └─────────────────────┘
```

The project can be further evolved into a microservices architecture by separating major domains such as authentication, user profiles, posts, notifications, and collaboration.

---

# 🛠️ Technology Stack

## Frontend

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| React.js          | Frontend UI               |
| Vite              | Development & build tool  |
| React Router      | Client-side routing       |
| Tailwind CSS      | Styling                   |
| JavaScript        | Application logic         |
| Axios / Fetch API | Backend API communication |

## Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| Node.js    | Backend runtime     |
| Express.js | REST API framework  |
| JavaScript | Backend development |
| JWT        | Authentication      |
| Mongoose   | MongoDB ODM         |
| bcrypt     | Password hashing    |

## Database

| Technology    | Purpose                |
| ------------- | ---------------------- |
| MongoDB       | NoSQL database         |
| MongoDB Atlas | Cloud database hosting |

## Development Tools

| Tool    | Purpose                 |
| ------- | ----------------------- |
| Git     | Version control         |
| GitHub  | Source code repository  |
| VS Code | Development environment |
| Postman | API testing             |
| npm     | Package management      |

---

# 📁 Project Structure

```text
DevBook/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

# 🔐 Authentication & Authorization

DevBook uses **JWT (JSON Web Token)** based authentication.

### Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Backend Authentication
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Send Token to Client
 │
 ▼
Client Stores Authentication State
 │
 ▼
Token Sent With Protected Requests
 │
 ▼
Authentication Middleware
 │
 ▼
Authorized API Access
```

### Security Features

* Password hashing using bcrypt
* JWT-based authentication
* Protected API endpoints
* Authentication middleware
* User authorization
* Environment variables for sensitive configuration

---

# 🗄️ Database

DevBook uses **MongoDB** as its primary database.

### Main Data Models

Depending on the current implementation, the application contains models such as:

```text
User
 │
 ├── Profile Information
 ├── Skills
 ├── Followers
 ├── Following
 └── Posts

Post
 │
 ├── Author
 ├── Content
 ├── Likes
 ├── Comments
 └── CreatedAt
```

Mongoose is used to define schemas and interact with MongoDB.

---

# 🔄 Application Flow

### Registration

```text
User
 ↓
React Registration Form
 ↓
POST /api/auth/register
 ↓
Express Server
 ↓
Validate User
 ↓
Hash Password
 ↓
Save User in MongoDB
 ↓
Registration Successful
```

### Login

```text
User
 ↓
React Login Form
 ↓
POST /api/auth/login
 ↓
Validate Credentials
 ↓
Generate JWT
 ↓
Return Authentication Response
 ↓
User Logged In
```

### Creating a Post

```text
User
 ↓
Create Post
 ↓
React Frontend
 ↓
POST /api/posts
 ↓
JWT Authentication
 ↓
Express Controller
 ↓
MongoDB
 ↓
Post Created
 ↓
Updated Feed
```

### Viewing Feed

```text
User
 ↓
Open Feed
 ↓
GET /api/posts
 ↓
Backend
 ↓
MongoDB
 ↓
Posts Retrieved
 ↓
React Feed
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git
* MongoDB / MongoDB Atlas account
* VS Code or another preferred IDE

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/KrushnaChoudhary/Devbook.git
```

Navigate into the project:

```bash
cd Devbook
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3️⃣ Install Backend Dependencies

Open another terminal or navigate back:

```bash
cd ../server
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If your frontend requires environment variables, create the appropriate `.env` file inside the frontend directory.

Example:

```env
VITE_API_URL=http://localhost:5000
```

> **Important:** Never commit `.env` files or database credentials to GitHub.

Add them to `.gitignore`.

---

# ▶️ Running the Application

## Start Backend

Navigate to:

```bash
cd server
```

Run:

```bash
npm run dev
```

The backend will start on the configured port.

Example:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
cd client
```

Run:

```bash
npm run dev
```

The Vite development server will provide a local URL, usually:

```text
http://localhost:5173
```

---

# 🧪 Testing

API endpoints can be tested using **Postman**.

Recommended testing flow:

```text
1. Register User
       ↓
2. Login
       ↓
3. Receive JWT
       ↓
4. Add JWT to Authorization Header
       ↓
5. Test Protected APIs
       ↓
6. Create / Update / Delete Data
       ↓
7. Verify Database
```


---

# 🔮 Future Enhancements

Possible future improvements:

* 💬 Real-time chat
* 🔔 Real-time notifications
* 🤝 Developer collaboration system
* 💻 GitHub integration
* 📊 Developer activity dashboard
* 🔎 Advanced developer search
* 🏷️ Post categories and tags
* 📱 Improved mobile responsiveness
* 🌐 Deployment using cloud platforms
* 🧪 Automated testing
* 🔄 CI/CD pipeline
* 🐳 Docker support
* 🧩 Microservices architecture

---

# 🤝 Contributing

Contributions are welcome.

### Steps

```bash
# Fork the repository

# Clone your fork
git clone <your-fork-url>

# Create a new branch
git checkout -b feature/new-feature

# Make your changes

# Commit your changes
git add .
git commit -m "Add new feature"

# Push the branch
git push origin feature/new-feature
```

Then create a Pull Request.

---

# 👨‍💻 Author

**Krushna Choudhary**

* GitHub: [KrushnaChoudhary](https://github.com/KrushnaChoudhary)

---

# 📄 License

This project is developed for educational and portfolio purposes.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
