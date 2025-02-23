export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="">
      <div className="inline-block p-6 text-center rounded-lg">{children}</div>
    </section>
  );
}
