type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div
      className="
      mb-8
      flex
      items-center
      justify-between
    "
    >
      <div>
        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-white/60">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}