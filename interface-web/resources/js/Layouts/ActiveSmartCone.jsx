import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import axios from 'axios';

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import Select from '@/Components/Select';
import SectorList from '@/Pages/SectorList';

export default function ActiveSmartCone({ mustVerifyEmail, status, className = '' }) {
  const [successPopup, setSuccessPopup] = useState(false);
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    coneId: '',
    sector: '',
  });

  const [sectors, setSectors] = useState([]);
  const [cones, setCones] = useState([]);

  useEffect(() => {
    fetchSectors();
    fetchCones();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await axios.get('/api/sectorslist');
      setSectors(response.data);
    } catch (error) {
      console.error('Failed to fetch sectors:', error);
    }
  };

  const fetchCones = async () => {
    try {
      const response = await axios.get('/cones');
      setCones(response.data);
    } catch (error) {
      console.error('Failed to fetch cones:', error);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/smart-cones', {
        coneId: data.coneId,
        sector: data.sector,
      });

      setSuccessPopup(true); // Mostra o popup de sucesso

      setTimeout(() => {
        setSuccessPopup(false); // Oculta o popup após 2 segundos
      }, 2000);

      fetchCones(); // Atualiza a lista de cones após a criação de um novo cone

    } catch (error) {
      console.error('Failed to activate smart cone:', error);
    }
  };

  const updateCone = async (id, sectorId) => {
    try {
      await axios.put(`/cones/update/${id}`, {
        sector: sectorId,
      });

      setSuccessPopup(true); // Mostra o popup de sucesso

      setTimeout(() => {
        setSuccessPopup(false); // Oculta o popup após 2 segundos
      }, 2000);

      fetchCones(); // Atualiza a lista de cones após a atualização de um cone

    } catch (error) {
      console.error('Failed to update smart cone:', error);
    }
  };

  const deleteCone = async (id) => {
    try {
      await axios.delete(`/cones/destroy/${id}`);

      setSuccessPopup(true); // Mostra o popup de sucesso

      setTimeout(() => {
        setSuccessPopup(false); // Oculta o popup após 2 segundos
      }, 2000);

      fetchCones(); // Atualiza a lista de cones após a exclusão de um cone

    } catch (error) {
      console.error('Failed to delete smart cone:', error);
    }
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Activate Smart Cone</h2>

        <p className="mt-1 text-sm text-gray-600">
          Inform the necessary data to control the area with the cones that is your responsibility.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="coneId" value="Cone ID" />

          <TextInput
            id="coneId"
            className="mt-1 block w-full"
            value={data.coneId}
            onChange={(e) => setData('coneId', e.target.value)}
            required
            isFocused
            autoComplete="coneId"
          />

          <InputError className="mt-2" message={errors.coneId} />
        </div>

        <div>
          <InputLabel htmlFor="sector" value="Sector" />

          <Select
            id="sector"
            className="w-full"
            value={data.sector}
            onChange={(e) => setData('sector', e.target.value)}
          >
            <option>Unlisted</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </Select>

          <InputError message={errors.sector} className="mt-2" />
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div>
            <p className="text-sm mt-2 text-gray-800">
              Your email address is unverified.
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Click here to re-send the verification email.
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <div className="mt-2 font-medium text-sm text-green-600">
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Active</PrimaryButton>

          <Transition
            show={successPopup}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="inline-block"
          >
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
              The smart cone has been successfully activated.
            </div>
          </Transition>
        </div>
      </form>

      <div className="mt-20 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold text-yellow-600 ">My Cones</h2>

        {cones.length === 0 ? (
          <p className="text-gray-600">You don't have any smart cones yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {cones.map((cone) => (
              <li key={cone.id} className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900">Mac: {cone.mac}</p>
                  <p className="mt-1 text-sm text-gray-600">Sector: {cone.setor}</p>
                  <p className="mt-1 text-sm text-gray-600">Responsible: {cone.responsavel}</p>
                </div>

                <div>
                  <Select
                    value={cone.setor}
                    onChange={(e) => updateCone(cone.mac, e.target.value)}
                    className="w-48"
                  >
                    <option>Select the sector</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </Select>

                  <button
                    onClick={() => deleteCone(cone.mac)}
                    className="mx-3 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
