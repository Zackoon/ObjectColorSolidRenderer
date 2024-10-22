# Note
We have moved to [this group repository!](https://github.com/Object-Color-Solid-Render). This repository will no longer getting updates for the time being.

# ObjectColorSolidRenderer

An object color solid renderer built with React and TypeScript, using Vite as the build tool.

## How to Run

### Prerequisites
- **Node.js** and **npm** (or **yarn**) installed for the frontend.
- **Python** installed for the backend.

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ZackooObjectColorSolidRenderer
   cd ObjectColorSolidRenderer
   ```

2. **Backend Setup (Flask)**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Create and activate a virtual environment (recommended):
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install Python dependencies:
     ```bash
     pip install Flask Flask-Cors numpy PyWavefront
     ```
   - Run the Flask app:
     ```bash
     python app.py
     ```

3. **Frontend Setup (React with Vite)**
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install Node.js dependencies:
     ```bash
     npm install # or yarn install
     ```
   - Start the development server:
     ```bash
     npm run dev # yarn dev
     ```

### Accessing the Application
- The React frontend will be running on `http://localhost:5173` (default Vite port).
- The Flask backend will be running on `http://localhost:5000`.

### Additional Information
- Ensure both servers are running simultaneously for full functionality.
- The frontend is built with React and TypeScript, using Vite as the build tool.
- The project uses Yarn for package management, but npm can be used as an alternative.
- CORS should be enabled in the Flask app to allow requests from the frontend.

## Development
- Frontend code is located in the `frontend/src` directory.
- The main backend logic is in `backend/app.py`.
- Experimental code is in `thoery/` directory.
