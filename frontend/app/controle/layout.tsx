export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center gap-6 py-12 md:py-16">
      <div className="inline-block p-6 text-center rounded-lg">{children}</div>
    </section>
  );
}
