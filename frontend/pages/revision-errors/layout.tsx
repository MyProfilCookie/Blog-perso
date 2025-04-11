import Page from "./page";
import { RevisionProvider } from "../RevisionContext";

const Layout: React.FC = () => {
  return (
    <RevisionProvider>
      <Page />
    </RevisionProvider>
  );
};

export default Layout;