const Spinner = ({ className = "" }: { className?: string }) => (
  <div 
    className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 ${className}`}
  />
);

export default Spinner;