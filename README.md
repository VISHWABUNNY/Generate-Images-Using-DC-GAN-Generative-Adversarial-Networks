# Generate Images Using DC-GAN

This repository now has a clean frontend/backend separation.

## Project structure

- `backend/` - Flask backend and trained generator model
- `frontend/` - Static web frontend for requesting generated images

## Setup

1. Activate the backend Python environment:
   ```bash
   cd /home/vishwa/Music/projects/Generate-Images-Using-DC-GAN-Generative-Adversarial-Networks/backend
   . .venv/bin/activate
   ```

2. Install backend dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

3. Install frontend dependencies (optional for static usage):
   ```bash
   cd ../frontend
   npm install
   ```

## Run

1. Start the backend server:
   ```bash
   python backend/app.py
   ```

2. Open the frontend from a local web server. For example, from the `frontend` folder:
   ```bash
   cd frontend
   python3 -m http.server 8000
   ```

3. In your browser, open:
   ```text
   http://127.0.0.1:8000
   ```

4. Click `Generate Image` to request a generated image from the backend.

## Notes

- The backend exposes `GET /generate_image`.
- The frontend uses `fetch` and draws pixel data onto the canvas.
- Keep `backend/generator.h5` in place; it is required by the backend.
