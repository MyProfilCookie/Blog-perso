import React from "react";

export default function MaevaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <section className="flex items-center justify-center gap-6 py-12 md:py-16">
    //   {/* <div className="inline-block p-6 text-center rounded-lg shadow-lg">
    //     {children}
    //   </div> */}
    // </section>
    <section className="w-full">{children}</section>
  );
}
