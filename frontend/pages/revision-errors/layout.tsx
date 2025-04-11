import Page from "./page";
import { RevisionProvider } from "../../contexts/RevisionContext";

const Layout: React.FC = () => {
  return (
    <RevisionProvider>
      <Page />
    </RevisionProvider>
  );
};

export default Layout;