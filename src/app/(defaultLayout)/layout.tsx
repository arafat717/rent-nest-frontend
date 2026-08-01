
import { Footer } from "@/components/Common/Footer/Footer";
import { Navbar } from "@/components/Common/Navbar/Navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main>
        <Navbar></Navbar>
        {children}
        <Footer></Footer>
      </main>
    </>
  );
};

export default CommonLayout;
