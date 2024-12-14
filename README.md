# Frontend Application

This is the frontend application for our project, built with Vite and React.

## Setup

Follow the steps below to get the project up and running on your local machine.

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/harshit2786/Contract-management-fe.git
cd your-repository
```

### 2. Create an Environment File

Create a .env file in the root directory of the project. You can use the .env.example file as a reference. The .env file should include the following variables:

```bash
VITE_BACKEND_IP_ADDRESS=http://your-host:port
VITE_BACKEND_WS_ADDRESS=ws://your-host:port
```
Replace your-host and port with the appropriate values for your backend server.

### 3. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 4. Run the Development Server

Start the development server using the following command:

```bash
npm run dev
```

This will start the application in development mode. You can now open your browser and navigate to http://localhost:5173 to see the application in action.