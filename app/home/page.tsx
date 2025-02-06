import Navbar from "../components/NavBar";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar sempre no topo */}
      <Navbar />

      {/* Conteúdo centralizado ocupando toda a tela */}
      <div className="flex-grow flex justify-center items-center bg-preto text-cinza font-ibm">
        <h1 className="text-3xl font-bold">Bem-vindo à Home</h1>
      </div>
    </div>
  );
}
