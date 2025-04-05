import RevisionPage from "./RevisionPage";
import { RevisionProvider } from "../contexts/RevisionContext";

const Page: React.FC = () => {
  return (
    <RevisionProvider>
      <RevisionPage />
    </RevisionProvider>
  );
};

export default Page;