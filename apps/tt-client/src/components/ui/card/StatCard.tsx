type Props = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

export default function StatCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div
      className="
      glass-card
      rounded-[32px]
      p-6
    "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value}
          </h3>
        </div>

        {icon && (
          <div
            className="
            rounded-2xl
            bg-white/10
            p-3
          "
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}