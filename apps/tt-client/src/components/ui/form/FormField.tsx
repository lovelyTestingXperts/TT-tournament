type Props = {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  htmlFor,
  error,
  children,
}: Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={htmlFor}
          className="
          text-sm
          font-medium
          text-white/80
        "
        >
          {label}
        </label>
      )}

      {children}

      {error && (
        <p data-testid="form-field-error" className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}