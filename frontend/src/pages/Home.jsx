import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to RAG-PDF-DoubtSolver</h1>
        <p className="text-lg mb-6">
          Upload your PDFs and ask questions interactively using our RAG-powered chatbot.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Home;
