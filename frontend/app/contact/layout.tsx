export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center py-12 md:py-16 w-full">
      <div className="w-full max-w-3xl px-6">{children}</div>
    </section>
  );
}
