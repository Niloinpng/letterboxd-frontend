import "@fontsource/poppins"; // Importa a fonte Poppins
import "@fontsource/ibm-plex-sans"; // Importa a fonte IBM Plex Sans
import "./globals.css"; // Mantém os estilos globais

export const metadata = {
  title: "Letterbox",
  description: "Sistema de avaliação de filmes criado pelos estudantes da UnB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-ibm bg-gray-100">{children}</body>
    </html>
  );
}
