/**
 * Displays an error message to the user.
 * 
 * Props:
 * - message: The error text to display
 * - onDismiss: Optional function to clear the error
 */
export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        {/* Error icon */}
        <div className="text-red-500 text-xl mr-3 mt-0.5">⚠</div>
        
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">
            Something went wrong
          </h3>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        
        {/* Dismiss button (only shown if onDismiss is provided) */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 text-lg ml-2"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}