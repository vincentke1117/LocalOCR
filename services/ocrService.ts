// A mock function to simulate the API call for demonstration without a running Python backend.
// It returns sample markdown after a 2-second delay.
const mockConvertFile = (file: File): Promise<string> => {
    console.log(`Mock converting file: ${file.name}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (file.name.includes("error")) {
                reject(new Error("Mock API Error: Could not process the file."));
            } else {
                const sampleMarkdown = `# Converted Content from ${file.name}

This is a sample markdown output generated for the uploaded file.

## File Details
- **Name:** ${file.name}
- **Size:** ${(file.size / 1024).toFixed(2)} KB
- **Type:** ${file.type}

## Sample Content
Here is some placeholder content that would be extracted by PaddleOCR.

### A List of Items
- First item from the document.
- Second item, potentially from a different column.
- A third, very important point.

### A Code Block
\`\`\`python
def hello_world():
    print("Hello from PaddleOCR!")
\`\`\`

> A blockquote representing some highlighted text from the source document.
`;
                resolve(sampleMarkdown);
            }
        }, 2000);
    });
};

const realConvertFile = async (file: File, apiEndpoint: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            body: formData,
            // Note: Do not set 'Content-Type' header manually, 
            // the browser will do it correctly for multipart/form-data.
        });

        if (!response.ok) {
            let errorMsg = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.detail || errorMsg;
            } catch (e) {
                // Could not parse JSON, stick with the status text.
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        return data.markdown;
    } catch (error) {
        if (error instanceof TypeError) { // This often indicates a network error or CORS issue
             throw new Error("Network Error: Could not connect to the local server. Please ensure it's running and the API endpoint is correct in Settings.");
        }
        throw error; // Re-throw other errors
    }
};

// --- EXPORT ---
// Change this to 'false' to use the mock for testing.
const USE_REAL_API = true;

export const convertFile = USE_REAL_API ? realConvertFile : mockConvertFile;