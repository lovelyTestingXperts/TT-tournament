type Props = {
  children: React.ReactNode;
};

export default function PageContainer({
  children,
}: Props) {
  return (
    <div
      className="
      mx-auto
      min-h-screen
      max-w-[1440px]
      px-6
      py-8
    "
    >
      {children}
    </div>
  );
}