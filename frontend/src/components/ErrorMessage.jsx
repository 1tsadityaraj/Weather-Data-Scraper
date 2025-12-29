/**
 * Error message component
 */
function ErrorMessage({ message }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-red-500/30 via-orange-500/20 to-red-500/30 backdrop-blur-md border-2 border-red-400/50 rounded-xl p-5 shadow-xl animate-fade-in hover:border-red-300/60 transition-all">
        <div className="flex items-start gap-3">
          <span className="text-2xl animate-bounce filter drop-shadow-lg">⚠️</span>
          <div className="flex-1">
            <span className="font-bold text-red-50 text-lg block mb-1">Error</span>
            <span className="text-red-100">{message}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage

