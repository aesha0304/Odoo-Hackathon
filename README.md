# Odoo Hackathon – Skill Swap Platform

## Overview
A full-stack web application for skill swapping, built for the Odoo Hackathon. The platform allows users to offer and request skills, connect with others, and manage skill swap requests. Built with React (frontend) and Node.js/Express (backend).

---

## Features

### User Registration & Authentication
- Register with name, email, password, and location
- Optional profile photo upload
- Secure login/logout
- Password validation and error handling

### Profile Management
- Edit your name, location, skills you can offer, and skills you want to learn
- Add/remove skills from a large predefined list or add custom skills
- Set your availability (weekends, weekdays, mornings, evenings)
- Set profile visibility (public/private)
- Upload/change profile photo

### Browsing & Search
- Browse all users on the platform
- Search users by name or skills (offered or wanted)
- Filter users by availability
- View user profiles, including skills, location, and recent activity

### Skill Swap Requests
- Send a skill swap request to any user
- Select which skill you can teach and which you want to learn from the other user
- Add a personalized message to your request
- View a preview of your request before sending

### Swap Dashboard
- See all your swap requests (incoming and outgoing)
- Tabs for pending, accepted, rejected, incoming, and outgoing requests
- Accept or reject incoming requests
- See details of each swap: skills exchanged, messages, and status

### Responsive UI
- Modern, clean, and mobile-friendly interface
- Loading spinners and helpful error messages throughout

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/aesha0304/Odoo-Hackathon.git
   cd Odoo-Hackathon
   ```
2. Install backend dependencies:
   ```sh
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd ../client
   npm install
   ```

### Running the Application

#### Start the backend server
From the `server` directory:
```sh
npm start
```
The backend will run on [http://localhost:3001](http://localhost:3001).

#### Start the frontend
From the `client` directory:
```sh
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173).

---

## Usage
- Open your browser and go to [http://localhost:5173](http://localhost:5173)
- Register a new account or log in
- Set up your profile, add skills you can offer and want to learn
- Browse users, search/filter by skills or availability
- View user profiles and send skill swap requests
- Manage your requests in the Swap Dashboard

---

## Project Structure
```
Odoo-Hackathon/
  client/      # React frontend (all UI, pages, components)
  server/      # Node.js/Express backend (API, data handling)
```

---

## License
MIT

---

For more, see the code and issues at: https://github.com/aesha0304/Odoo-Hackathon 