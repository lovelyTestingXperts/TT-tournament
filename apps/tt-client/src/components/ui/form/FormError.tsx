type Props = {
  message?: string;
};

export default function FormError({
  message,
}: Props) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-300">
      {message}
    </p>
  );
}