import { useState } from 'react';
import TranscriptInput from './components/input/TranscriptInput';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';
import ResultsPreview from './components/dashboard/ResultsPreview';
import { parseTranscript } from './services/api';

/**
 * The root component of our application.
 * 
 * This component manages the overall application state and
 * decides which child components to render based on that state.
 * 
 * State machine:
 *   IDLE → (user submits) → LOADING → (success) → RESULTS
 *                              ↓
 *                          (error) → ERROR → (dismiss) → IDLE
 */
function App() {
  // ─── Application State ───
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Event Handlers ───

  /**
   * Called when the user clicks "Generate Study Notes".
   * Sends the transcript to the backend and handles the response.
   */
  async function handleSubmit(transcript) {
    // Step 1: Reset previous state
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      // Step 2: Call the API
      const data = await parseTranscript(transcript);
      
      // Step 3: Store the result
      setResult(data);
    } catch (err) {
      // Step 4: Handle errors
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      // Step 5: Always stop loading (whether success or error)
      setIsLoading(false);
    }
  }

  /**
   * Called when the user wants to start over.
   */
  function handleReset() {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }

  // ─── Render ───

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Show results if we have them */}
        {result ? (
          <ResultsPreview result={result} onReset={handleReset} />
        ) : (
          <>
            {/* Show input form (always visible when no results) */}
            <TranscriptInput 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />

            {/* Show loading spinner when processing */}
            {isLoading && (
              <LoadingSpinner message="Analyzing your transcript with AI..." />
            )}

            {/* Show error message if something went wrong */}
            {error && (
              <div className="max-w-3xl mx-auto mt-4">
                <ErrorMessage 
                  message={error} 
                  onDismiss={() => setError(null)} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;