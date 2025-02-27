export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center gap-6 py-12 md:py-16">
      <div className="bg-cream">{children}</div>
    </section>
  );
}
