/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-400/20"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-300 absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        <div className="animate-spin rounded-full h-16 w-16 border-r-4 border-blue-400 absolute top-0 left-0" style={{ animationDuration: '1.2s' }}></div>
      </div>
      <p className="text-sky-100/90 text-lg font-medium animate-pulse">Loading weather data...</p>
    </div>
  )
}

export default LoadingSpinner

