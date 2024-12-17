## Code With Tom

**A collaborative coding platform that fosters real-time problem-solving and interactive learning.**

This side project highlights clean architecture, robust full-stack engineering practices, and practical coding solutions.

 **Live Demo:** [Code With Tom on Vercel](https://code-with-tom-deans-projects-729ccfbf.vercel.app/)

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Usage](#usage)
* [Task Automation](#task-automation)
* [Deployment](#deployment)
* [Credits](#credits)

---

## Features

* **Real-Time Collaboration:** Concurrent editing and interaction through **Socket.io**, ensuring everyone stays in sync.
* **Interactive Challenges:** Engage in dynamic coding exercises that encourage learning by doing.
* **Role-Based Modes:** Seamlessly switch between **Mentor** and **Student** roles to simulate authentic training and guidance.
* **Robust Backend:** PostgreSQL and a clean architectural approach ensure scalability and maintainability.
* **Containerized Setup:** Fully Dockerized environment for streamlined local development and deployment.
* **Fun Celebrations:** Confetti animations  appear upon task completions, adding a playful touch.

---

## Tech Stack

### Frontend

* Framework: Vite + React
* Styling: CSS Modules

### Backend

* Server: Node.js with Express
* Database: PostgreSQL
* Environment Management: Dotenv

### Tools

* Real-Time Communication: Socket.io
* Containerization: Docker
* Task Automation: Taskfile

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/code-with-tom.git
cd code-with-tom
```

2. **Set Up Environment Variables**

Create a `.env` file in both the client and server directories. Add the following variables:

**Client (client/.env):**

```
VITE_API_URL=http://localhost:8080
```

**Server (server/.env):**

```
DATABASE_URL=postgresql://admin:password@db:5432/codewithtom
PORT=8080
```

3. **Start the Project with Docker**

Ensure Docker and Taskfile are installed, then run:

```bash
task start
```

This command will:

* Spin up the PostgreSQL database
* Build and start the backend and frontend services
* Seed the database with sample data

---

## Usage

1. **Access the App:**

Open http://localhost:3000 in your browser.

2. **Try Mentor or Student Modes:**

Switch between roles to experience real-time collaboration and interactive coding tasks.

3. **Real-Time Updates:**

Any changes in code or solutions appear instantly across all connected clients.

---

## Task Automation

Use the following Taskfile commands to streamline development:

| Command | Description |
|---|---|
| `task start` | Start all services (DB, backend, frontend) |
| `task docker-up` | Start Docker services only |
| `task seed-db` | Seed the database with initial data |
| `task docker-down` | Stop all Docker containers |
| `task rebuild` | Rebuild all Docker containers |
| `task db-reset` | Reset the local PostgreSQL database |

---

## Deployment

This project's frontend is deployed on Vercel, while backend services run in containers for future scalability.

1. **Deploy the Repository:**

Deploy the frontend (located in the client directory) using Vercel.

2. **Configure Environment Variables:**

Set `VITE_API_URL` to point to the hosted backend service.

---



