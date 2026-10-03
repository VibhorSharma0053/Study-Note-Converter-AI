import { useState } from 'react';
import InputPage from './pages/InputPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';
import { parseTranscript } from './services/api';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(transcript) {
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const data = await parseTranscript(transcript);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <>
      {result ? (
        <DashboardPage result={result} onReset={handleReset} />
      ) : (
        <>
          <InputPage onSubmit={handleSubmit} isLoading={isLoading} />
          
          {isLoading && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
              <LoadingSpinner message="Analyzing your transcript with AI..." />
            </div>
          )}

          {error && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4">
              <ErrorMessage
                message={error}
                onDismiss={() => setError(null)}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;