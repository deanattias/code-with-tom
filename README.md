# **Code With Tom**  
A collaborative coding platform that facilitates real-time problem-solving and educational experiences.  

🚀 **Live Demo:** [Code With Tom on Vercel](https://code-with-tom-deans-projects-729ccfbf.vercel.app/)  

## **Table of Contents**  
- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Deployment](#deployment)  
- [Task Automation](#task-automation)  
- [Credits](#credits)  

## **Features**  
✅ Real-time collaborative coding with **Socket.io**  
✅ Interactive coding challenges and real-time problem-solving tasks  
✅ Mentor and student roles for guided learning  
✅ Fun **Confetti animations** for completing tasks  
✅ Docker-powered environment for streamlined development  

## **Installation**  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/code-with-tom.git

	2.	Navigate to the Project Folder

cd code-with-tom


	3.	Create Environment Variables
	•	Create a .env file in both the client and server directories.
	•	Add the following variables as needed:
Client (client/.env):

VITE_API_URL=http://localhost:8080

Server (server/.env):

DATABASE_URL=postgresql://admin:password@localhost:5432/codewithtom
PORT=8080


	4.	Use Docker and Task Automation
	•	Ensure Docker and Taskfile are installed.
	•	Start the entire application using the Taskfile:

task start

This will:
	•	Set up the PostgreSQL database
	•	Build and start the backend and frontend services
	•	Automatically seed the database

Usage
	•	Access the App: Open http://localhost:3000 in your browser.
	•	Interactive Roles: Use different roles (mentor or student) to experience guided learning.
	•	Start Coding: Enjoy real-time collaboration and confetti animations!

Deployment
	1.	Connect the Repository:
	•	Deploy the project to Vercel using its dashboard.
	2.	Environment Variables:
	•	Add all required environment variables in the Vercel Dashboard.
	3.	Deployment Success:
	•	Access the deployed app through Vercel’s provided URL.

Task Automation

The following Taskfile commands are available for development and maintenance:

Command	Description
task start	Start all services (DB, backend, frontend)
task docker-up	Start Docker services only
task seed-db	Seed the database with initial data
task docker-down	Stop all Docker containers
task rebuild	Rebuild all Docker containers
task db-reset	Reset the local PostgreSQL database

Credits

👨‍💻 Prepared by Dean Attias for learning purposes.

Find Me Online:
	•	LinkedIn: Dean Attias
	•	GitHub: deanattias

