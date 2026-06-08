type SpinnerProps = {
  classNames?: string;
};

const Spinner = ({ classNames }: SpinnerProps) => (
  <div
    className={`flex items-center justify-center h-[calc(100vh-200px)] ${classNames}`}
  >
    <svg
      className="mr-3 -ml-1 size-5 animate-spin text-[rgb(189,190,191)]"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-33"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />

      <path
        className="opacity-100"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

export default Spinner;
