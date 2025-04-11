import React from "react";
import { RevisionProvider } from "../../contexts/RevisionContext";
import RevisionPage from "./page";

const Layout: React.FC = () => {
  return (
    <RevisionProvider>
      <RevisionPage />
    </RevisionProvider>
  );
};

export default Layout;