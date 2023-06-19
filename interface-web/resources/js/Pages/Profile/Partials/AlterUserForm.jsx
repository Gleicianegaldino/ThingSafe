import { useState } from 'react';
import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Select from '@/Components/Select';
import axios from 'axios';

export default function AlterUserForm({ className = '' }) {
    const passwordInput = useRef();
    const [isRegistrationValid, setRegistrationValid] = useState(true);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        permission: '',
        registration: '',
    });

    const checkRegistration = async (registration) => {
        try {
            const response = await axios.get(`/api/admins/check-registration?registration=${registration}`);
            return response.data.exists;
        } catch (error) {
            console.error('Failed to check registration:', error);
            return false;
        }
    };

    const alterUser = async (e) => {
        e.preventDefault();

        const registrationExists = await checkRegistration(data.registration);
        setRegistrationValid(registrationExists);

        if (!registrationExists) {
            return;
        }

        put(route('permission.update'), {
            data: {
                permission_id: data.permission,
                registration: data.registration,
            },
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.registration) {
                    reset('permission', 'registration');
                    passwordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Alter User</h2>

                <p className="mt-1 text-sm text-gray-600">
                    From your registration, you can change your permissions if you are an administrator.
                </p>
            </header>

            <form onSubmit={alterUser} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="permission" value="Type Permission" />

                    <Select
                        id="permission"
                        className="w-full"
                        value={data.permission}
                        onChange={(e) => setData('permission', e.target.value)}
                    >
                        <option value="1">Admin</option>
                        <option value="2">Operator</option>
                    </Select>

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

