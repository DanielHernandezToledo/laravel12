import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import { useState, useRef, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import BlueButton from '@/Components/BlueButton';

const Index = () => {

    const { experiences } = usePage().props;

    const nameInput = useRef();
    const enterpriseInput = useRef();
    const descriptionInput = useRef();
    const urlInput = useRef();
    const imageInput = useRef();
    const startDateInput = useRef();
    const endDateInput = useRef();
    const [tech, setTech] = useState([]);
    const [newTech, setNewTech] = useState("");
    const [experienceModal, setExperienceModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        name: '',
        enterprise: '',
        description: '',
        url: '',
        image: '',
        start_date: '',
        end_date: '',
        technologies: [],
    })



    const handleClickModal = (editing = null) => {
        setExperienceModal(!experienceModal);

        if (editing) {
            setIsEditing(true);
            setEditingExperience(editing);
            setData(editing);
            setTech(editing.technologies);
        } else {
            setIsEditing(false);
            setEditingExperience(null);
            setData({});
            setTech([]);
            reset();
            clearErrors();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();



        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("enterprise", data.enterprise);
        formData.append("description", data.description);
        formData.append("url", data.url);
        formData.append("start_date", data.start_date);
        formData.append("end_date", data.end_date);
        formData.append("technologies", JSON.stringify(data.technologies));

        const onSuccess = () => {
            console.log("✅ Success: Datos enviados correctamente");
        };

        const onError = (errors) => {
            console.error("❌ Error en la petición:", errors);
        };

        if (isEditing) {

            formData.append('_method', 'PUT');

            put(route("experiencias.update", editingExperience.id), formData, {
                onSuccess,
                onError,
                preserveScroll: true,
                preserveState: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }
        else {
            post(route("experiencias.store"), formData, {
                onSuccess,
                onError,
                preserveScroll: true,
                preserveState: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }
    };


    const addTech = (e) => {
        e.preventDefault();
        if (newTech.trim() === "") return; // Evita agregar valores vacíos
        setTech([...tech, newTech]); // Agregar la nueva tecnología
        setNewTech(""); // Limpiar el input
    }

    useEffect(() => {
        setData('technologies', tech);
    }, [tech])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Experiencias Laborales
                </h2>
            }
        >
            <Head title="Experiencias" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                                    Experiencias
                                </h2>
                                <BlueButton onClick={() => { handleClickModal(), setEditingExperience(null) }}>Agregar</BlueButton>
                            </div>

                            {experiences.length === 0 ? (
                                <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                                    No Hay Experiencias
                                </h2>
                            ) : (
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 w-1/2 md:w-1/3">Título</th>
                                            <th className="px-4 py-2 w-1/2 md:w-1/3 hidden md:table-cell">Empresa</th>
                                            <th className="px-4 py-2 w-1/2 md:w-1/3">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experiences.map(experience => (
                                            <tr key={experience.id}>
                                                <td className="border px-4 py-2 w-1/2 md:w-1/3 table-cell text-center font-bold">{experience.name}</td>
                                                <td className="border px-4 py-2 w-1/2 md:w-1/3 hidden md:table-cell text-center font-bold">{experience.enterprise}</td>
                                                <td className="border px-4 py-2 w-1/2 table-cell">
                                                    <div className="flex flex-col md:flex-row gap-2 text-center">
                                                        <PrimaryButton
                                                            className='w-full md:w-1/2'
                                                            onClick={() => handleClickModal(experience)}
                                                        >Editar</PrimaryButton>
                                                        <DangerButton className='w-full md:w-1/2'>Eliminar</DangerButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            )}


                        </div>
                    </div>
                </div>
                {/* <img src="/storage/images/U0ySUFBr5BSV6F4mZTnV.PNG" alt="imagen rota" /> */}
            </div>

            <Modal show={experienceModal} onClose={() => { handleClickModal(); setEditingExperience(null); }}>
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-medium text-gray-900">{isEditing ? "Editar Experiencia" : "Agregar Experiencia"}</h2>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="name"
                            value="Name"
                            className="sr-only"
                        />

                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            ref={nameInput}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 p-2 block w-full"
                            isFocused
                            placeholder="Experiencia"
                        />

                        <InputError
                            message={errors.name}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="enterprise"
                            value="Enterprise"
                            className="sr-only"
                        />

                        <TextInput
                            id="enterprise"
                            type="text"
                            name="enterprise"
                            value={data.enterprise}
                            ref={enterpriseInput}
                            onChange={(e) => setData('enterprise', e.target.value)}
                            className="mt-1 p-2 block w-full"
                            isFocused
                            placeholder="Empresa"
                        />

                        <InputError
                            message={errors.enterprise}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="url"
                            value="Url"
                            className="sr-only"
                        />

                        <TextInput
                            id="url"
                            type="text"
                            name="url"
                            value={data.url}
                            ref={urlInput}
                            onChange={(e) => setData('url', e.target.value)}
                            className="mt-1 p-2 block w-full"
                            isFocused
                            placeholder="Url"
                        />

                        <InputError
                            message={errors.url}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="description"
                            value="Description"
                            className="sr-only"
                        />

                        <TextInput
                            id="description"
                            type="text"
                            name="description"
                            value={data.description}
                            ref={descriptionInput}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 p-2 block w-full"
                            isFocused
                            placeholder="Descripción"
                        />

                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 md:flex md:gap-2">
                        <InputLabel
                            htmlFor="start_date"
                            value="Start Date"
                            className="sr-only"
                        />

                        <TextInput
                            id="start_date"
                            type="month"
                            name="start_date"
                            value={data.start_date}
                            ref={startDateInput}
                            onChange={(e) => setData('start_date', e.target.value)}
                            className="mt-1 p-2 block w-full"
                            isFocused
                        />

                        <InputError
                            message={errors.start_date}
                            className="mt-2"
                        />

                        <InputLabel
                            htmlFor="end_date"
                            value="End Date"
                            className="sr-only"
                        />

                        <TextInput
                            id="end_date"
                            type="month"
                            name="end_date"
                            value={data.end_date}
                            ref={endDateInput}
                            onChange={(e) => setData('end_date', e.target.value)}
                            className="mt-1 p-2 block w-full"
                            isFocused
                        />

                        <InputError
                            message={errors.end_date}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="image" value="Imagen" />

                        <input
                            id="image"
                            type="file"
                            name="image"
                            ref={imageInput}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={(e) => setData("image", e.target.files[0])}
                        />

                        <InputError message={errors.image} className="mt-2" />
                    </div>




                    <div className="my-2 flex flex-col gap-2 md:flex-row">
                        <div className="w-full">

                            <InputLabel
                                htmlFor="technologies"
                                value="Technologies"
                                className="sr-only"
                            />
                            <TextInput
                                id="technologies"
                                type="text"
                                name="technologies"
                                value={newTech}
                                onChange={(e) => setNewTech(e.target.value)}
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Añadir tecnología"
                            />

                        </div>
                        <BlueButton
                            onClick={addTech}
                        >+</BlueButton>
                    </div>

                    {tech && (
                        <div className="flex flex-wrap">
                            {tech.map((t, index) => (
                                <div className="bg-gray-100 p-2 m-2 rounded" key={index}>
                                    {t}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton
                            onClick={() => { handleClickModal(); setEditingExperience(null); setTech([]); }}
                        >
                            Cancelar
                        </SecondaryButton>

                        <PrimaryButton
                            className="ms-3"
                            disabled={processing}
                        >
                            {isEditing ? "Guardar Cambios" : "Agregar"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}

export default Index