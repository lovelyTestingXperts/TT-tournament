type Props = {
  children: React.ReactNode;
};

export default function Stack({
  children,
}: Props) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}