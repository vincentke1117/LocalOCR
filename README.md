# Local Markdown Converter (Powered by PaddleOCR)

 <!-- Placeholder for actual screenshot -->

A cross-platform desktop application designed to convert local images (JPG, PNG) and PDF files into structured, editable Markdown text. It combines a modern React frontend with a powerful local Python API leveraging the PaddleOCR-VL model for high-quality layout analysis and text recognition.

## Core Features

-   **Multi-File & Folder Processing**: Upload multiple files or an entire folder at once via drag-and-drop or file selection.
-   **Privacy-Focused & Offline**: All processing happens 100% locally on your machine. Your files are never uploaded to the cloud.
-   **Advanced OCR Engine**: Utilizes PaddleOCR's PP-Structure model to intelligently recognize layouts, including paragraphs, lists, and tables.
-   **Intuitive UI**: A clean, modern interface displays a file queue with real-time conversion status for each file.
-   **Instant Preview**: Click on any successfully converted file to see its Markdown output in a side-by-side preview panel.
-   **Easy Export**: Copy the generated Markdown to your clipboard or download it as a `.md` file with a single click.
-   **Configurable**: The local API endpoint can be easily configured through the application's settings.

## Technology Stack

-   **Frontend**: React (v18), TypeScript, Tailwind CSS
-   **Backend**: Python (3.9+), FastAPI
-   **OCR Engine**: PaddleOCR (PP-Structure)
-   **Desktop Framework Concept**: Designed to be wrapped with **Tauri** or **Electron** for a native desktop experience.

## Getting Started

Follow these instructions to get the application running on your local machine.

### Prerequisites

-   **Python**: Version 3.9 or newer.
-   **Node.js**: Required if you wish to set up a more robust development environment for the frontend (though not strictly necessary to run the provided `index.html`).
-   An editor like **Visual Studio Code** with the **Live Server** extension is recommended for easily serving the frontend.

### 1. Backend Setup & Launch

The backend is a Python server that performs the actual OCR processing.

1.  **Navigate to Project Directory**:
    Open your terminal and `cd` into the root folder of this project.

2.  **Install Python Dependencies**:
    Install all the required libraries using the `requirements.txt` file. It's highly recommended to do this within a virtual environment.

    ```bash
    # Create and activate a virtual environment (optional but recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install dependencies
    pip install -r requirements.txt
    ```
    *This step will download PaddlePaddle, PaddleOCR, and FastAPI, which may take some time.*

3.  **Run the Backend Server**:
    Start the FastAPI server using Uvicorn.

    ```bash
    uvicorn main:app --reload --port 8000
    ```
    The server will start on `http://127.0.0.1:8000`. You should see a message confirming it's running. Keep this terminal window open.

### 2. Frontend Setup & Launch

The frontend is a single-page React application that communicates with the local Python server.

1.  **Serve the `index.html` file**:
    The easiest way to run the frontend is by using the **Live Server** extension in VS Code.
    -   Open the project folder in VS Code.
    -   Right-click the `index.html` file.
    -   Select "Open with Live Server".

    This will open the application in your default web browser.

2.  **Verify Settings**:
    -   Once the app is open, click the **Settings** gear icon in the top-right corner.
    -   Ensure the "Local API Endpoint" is set to `http://127.0.0.1:8000/api/convert`. This should be the default.

### 3. Usage

1.  **Start the Backend Server** (if it's not already running).
2.  **Launch the Frontend** by opening `index.html`.
3.  Drag and drop your image or PDF files onto the upload area.
4.  Click the **"Convert All"** button.
5.  Watch the status of each file update in the queue.
6.  Click on a successfully converted file to see its Markdown preview.

## How It Works: The "Sidecar" Model

This application uses a "sidecar" architecture. The main user interface (frontend) runs independently from the processing logic (backend).

1.  The **React Frontend** provides the UI for file selection and preview.
2.  When you request a conversion, the frontend sends the file via an HTTP POST request to the **FastAPI Backend**.
3.  The backend receives the file, saves it temporarily, and passes it to the **PaddleOCR** engine.
4.  PaddleOCR analyzes the document's structure and extracts the content.
5.  The backend formats this content into a Markdown string.
6.  The Markdown is sent back to the frontend in a JSON response, which is then displayed to the user.
