const LoadingSpinner = () => {
  return (
    <svg className="mr-3 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="31.4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LoadingSpinner;
