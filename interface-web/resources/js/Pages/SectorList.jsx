import { useEffect, useState } from 'react';
import axios from 'axios';

const SectorList = ({ handleDelete }) => {
  const [sectors, setSectors] = useState([]);

  const fetchSectors = async () => {
    try {
      const response = await axios.get('/sectors/distinct');
      setSectors(response.data.sectors);
    } catch (error) {
      console.error('Failed to fetch sectors:', error);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900 mt-8">Distinct Sectors</h2>
      </header>

      <ul className="mt-4 space-y-2">
        {sectors.map((sector) => (
          <li key={sector} className="flex items-center justify-between bg-gray-100 rounded p-2">
            <span>{sector}</span>
            <button onClick={() => handleDelete(sector)} className="text-red-500 hover:text-red-700">Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SectorList;
