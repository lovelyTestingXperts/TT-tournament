type Props = {
  children: React.ReactNode;
};

export default function Section({
  children,
}: Props) {
  return (
    <section className="mb-8">
      {children}
    </section>
  );
}