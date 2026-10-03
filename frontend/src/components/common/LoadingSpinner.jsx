/**
 * A simple loading spinner component.
 * 
 * Shows a spinning animation with a message while the backend
 * processes the transcript.
 */
export default function LoadingSpinner({ message = "Processing your transcript..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* The spinner animation */}
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4">
      </div>
      
      {/* The loading message */}
      <p className="text-gray-600 text-lg font-medium">{message}</p>
      <p className="text-gray-400 text-sm mt-2">
        This may take a few moments for longer transcripts.
      </p>
    </div>
  );
}