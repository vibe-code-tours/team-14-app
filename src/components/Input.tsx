interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300 dark:border-slate-600"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
