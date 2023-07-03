import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import axios from 'axios';

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import Select from '@/Components/Select';

export default function ActiveSmartCone({ mustVerifyEmail, status, className = '' }) {
  const [successPopup, setSuccessPopup] = useState(false);
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    coneId: '',
    sector: '',
  });

  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await axios.get('/api/sectorslist');
      setSectors(response.data);
    } catch (error) {
      console.error('Failed to fetch sectors:', error);
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

    } catch (error) {
      console.error('Failed to activate smart cone:', error);
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
              A adição do cone foi um sucesso
            </div>
          </Transition>
        </div>
      </form>
    </section>
  );
}
