# Project Name: Chatify ( A real time Chat Application)


**Live Website:** [Chatify](https://chatify-application.vercel.app/) 

**Chatify OverView**  
Chatify is a real time chat application. I took a decesion to learn socket.io and to know how implement this. So after this I made this app. Chatify enables users to send and receive messages instantly. Built with modern web technologies, Chatify offers seamless private messaging, user authentication, online/offline indicators, and a smooth, responsive user interface.

Whether you want to connect with friends, colleagues, or clients, Chatify provides a fast and reliable communication platform. It’s designed for simplicity, speed, and user-friendliness, making online conversations easy and engaging.

 ## 🖼 Screenshot  
![Chatify](https://i.ibb.co/k2XmF0fm/Screenshot-12-4-2025-152438-chatify-application-vercel-app.jpg)

## 📖 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Challenges](#Challenges)
- [Dependencies used](#dependencies-used)
- [Installation](#installation)


## Features  

- **Real-Time Messaging**: Instantly Send & Receive Messages  
- **Online/Offline Status**: User Can Set their Online status   
- **One to One Chat**: User can message other privately 
- **Settings** : User can set their settings manualy (for private)
- **Recent  Conversation**: User also able to find last conversation users  
- **Authentication**: Used NextAuth for authentication 
- **Authorization** : Used JWT for Authorization

---

##  Tech Used 

- **Frontend**:Next.js, React.js, Tailwind CSS ,DaisyUI 
- **Backend**: Node.js, Express 
- **Real Time Communication**: Socket.io
- **Database**: MongoDB  
- **Build Tool**: VS Code

##   Challenges

- **Real-Time Messaging:**: Implement Socket.io with efficient performance and low latency was a key challenge. 
- **Database Query Optimization**: Fetching only the most recent conversations (excluding self-messages) 
- **Authentication & Token Management**: Securing user sessions and handling token expiration with NextAuth.js 

  ---
## 📦 Dependencies  
The project uses the following npm packages:  
```
@eslint
@types/react-dom
@types/react
@vitejs/plugin-react
axios
daisyui
eslint-plugin-react-hooks
eslint-plugin-react-refresh
eslint-plugin-react
eslint
react-dom
react-icons
react-router-dom
react
sort-by
next
next-auth
socket-io-client
jsonwebtoken
bcrypt
multer
multer-storage-cloudinary
dotenv
nodemailer
socket.io
cors
express
tailwindcss
vite
```

##  Installation & Setup  
Follow these steps to run the project locally:  
 ## Client
### 1 Clone the Client Repository  
```
git clone https://github.com/Mulanisafa/Chatify-Client.git
cd Chatify-Client
```

### 2 Install Dependencies
```
npm install
```
### 3 Start the Development Server
```
npm run dev
```
 ## Server
### 1 Clone the Server Repository  
```
git clone https://github.com/Mulanisafa/Chatify-Server.git
cd Chatify-Server
```

### 2 Install Dependencies
```
npm install
```
### 3 Start the Development Server
```
node index.js
```
## Environment Variables
```
DB_USER=
DB_PASS=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ACCESS_TOKEN_SECRET=

```
 ## Resources & Links
- React Documentation: https://react.dev
- Tailwind CSS Documentation: https://tailwindcss.com
- Next.js Documentation: https://nextjs.org/docs
- Socket.IO Documentation: https://socket.io/docs
- MongoDB Documentation: https://www.mongodb.com/docs
- JWT (JSON Web Token): https://jwt.io/introduction
- Express.js Documentation: https://expressjs.com
- DaisyUI (Tailwind Components): https://daisyui.com
- VS Code: https://code.visualstudio.com

📌 Feel free to contribute, report issues, or share your feedback! 🚀
