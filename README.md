# Chess.com

This is a real-time multiplayer chess game built with Node.js, Express, Socket.IO, and Chess.js.

## Features

- Real-time gameplay
- Two-player mode (White and Black)
- Spectator mode
- Valid move validation

## Technologies Used

- Node.js
- Express.js
- Socket.IO
- Chess.js
- EJS (templating engine)

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chess.com.git
   cd chess.com
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the application:
   ```bash
   pnpm start
   ```

The application will be accessible at `http://localhost:3000` (or the port specified in your environment variables).

## Deployment on Render

This project is configured for deployment on Render. Ensure your Render service is set up with:

- **Build Command:** `pnpm install`
- **Start Command:** `pnpm start`
