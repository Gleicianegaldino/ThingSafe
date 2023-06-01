import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-4 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} ThingSafe. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
