import { Head, Link, useForm } from '@inertiajs/react';
import Footer from '@/Layouts/Footer';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SectorList from './SectorList';

export default function RegisterSectors({ auth, className }) {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    name: '',
  });


  const submit = async (e) => {
    e.preventDefault();

    await post(route('registersectors'), data);
    window.location.reload(); // Recarregar a página após o envio do formulário
  };

  const handleDelete = async (name) => {
    try {
      await axios.delete(`/sectors/${name}`);

    } catch (error) {
      console.error('Failed to delete sector:', error);
    }
  };
  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sectors</h2>}>
        <Head title="Sectors" />

        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900">
                <section className={className}>
                  <header>
                    <h2 className="text-lg font-medium text-gray-900">Registration of Sectors</h2>

                    <p className="mt-1 text-sm text-gray-600">Register your organization's sectors.</p>
                  </header>

                  <form onSubmit={submit} className="max-w-xl space-y-6">
                    <div>
                      <InputLabel htmlFor="name" value="Name" />

                      <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />

                      <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-4">
                      <PrimaryButton disabled={processing}>Save</PrimaryButton>

                      <Transition show={recentlySuccessful} enterFrom="opacity-0" leaveTo="opacity-0" className="transition ease-in-out">
                        <p className="text-sm text-gray-600">Saved.</p>
                      </Transition>
                    </div>
                  </form>
                </section>

                <SectorList handleDelete={handleDelete} />
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
      <Footer />
    </>
  );
}
