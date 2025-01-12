/* eslint-disable prettier/prettier */
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 justify-center items-center py-8 md:py-10">
      <div className="inline-block justify-center text-center">
        {children}
      </div>
    </section>
  );
}