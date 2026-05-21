type Props = {
  label?: string;
  error?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  error,
  children,
}: Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label
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
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}