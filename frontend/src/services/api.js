/**
 * API Service Layer
 * 
 * Why a separate file for API calls?
 * 1. Single place to change the API URL if the backend moves
 * 2. Consistent error handling for all requests
 * 3. Easy to add authentication headers later
 * 4. Components don't need to know about fetch() details
 * 
 * This is called "separation of concerns" — each file has one job.
 */

const API_BASE_URL = '/api';  // Uses Vite proxy in development

/**
 * Parse a transcript into structured study notes.
 * 
 * @param {string} transcript - The raw AI chat transcript
 * @returns {Promise<Object>} - The structured study notes
 * @throws {Error} - If the request fails or returns an error status
 */
export async function parseTranscript(transcript) {
  // Step 1: Make the request
  const response = await fetch(`${API_BASE_URL}/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript }),
  });

  // Step 2: Check if the response is OK (status 200-299)
  // Remember: fetch does NOT throw on 4xx/5xx!
  if (!response.ok) {
    // Try to get the error details from the backend
    let errorMessage = `Server error: ${response.status}`;
    
    try {
      const errorData = await response.json();
      // FastAPI returns errors in a 'detail' field
      if (errorData.detail) {
        // detail can be a string or an array of validation errors
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Pydantic validation errors — extract the first one
          errorMessage = errorData.detail[0]?.msg || errorMessage;
        }
      }
    } catch {
      // If we can't parse the error JSON, use the generic message
    }
    
    throw new Error(errorMessage);
  }

  // Step 3: Parse and return the successful response
  const data = await response.json();
  return data;
}