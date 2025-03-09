import { Suspense } from "react";

import ArticlesClient from "./articles-client";

import Loading from "@/components/loading";

// Page component sans props personnalisées
export default function ShopPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ArticlesClient />
    </Suspense>
  );
}
