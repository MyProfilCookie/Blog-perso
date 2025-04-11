import Page from "../revision-errors";
import { RevisionProvider } from "../../../contexts/RevisionContext";

const Layout: React.FC = () => {
  return (
    <RevisionProvider>
      <Page />
    </RevisionProvider>
  );
};

export default Layout;