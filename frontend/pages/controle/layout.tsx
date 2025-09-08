export default function ControleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section 
      data-page="controle"
      className="flex flex-col items-center justify-center w-full min-h-screen bg-white dark:bg-gray-900"
    >
      <div className="w-full px-4 md:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
