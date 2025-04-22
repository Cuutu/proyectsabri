'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TratamientoModal from '@/components/TratamientoModal';
import ImagenModal from '@/components/ImagenModal';
import Image from 'next/image';

interface Tratamiento {
  _id: string;
  fecha: string | Date;
  procedimiento: string;
  notas?: string;
  diente?: number;
  estado: 'pendiente' | 'en-proceso' | 'completado';
}

interface Imagen {
  _id: string;
  url: string;
  tipo: string;
  descripcion?: string;
  fecha: Date;
}

interface Paciente {
  _id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email?: string;
  numeroHistoriaClinica?: string;
  fechaNacimiento?: string;
  historiaClinica?: {
    antecedentes?: string;
    alergias?: string[];
    fechaCreacion?: string;
    tratamientos?: Tratamiento[];
  };
  imagenes?: Imagen[];
  createdAt?: string;
  updatedAt?: string;
}

// Definir un tipo para el tratamiento que espera el modal
interface TratamientoModalData {
  _id: string;
  fecha: string;
  procedimiento: string;
  notas?: string;
  diente?: number;
  estado: 'pendiente' | 'en-proceso' | 'completado';
}

export default function DetallePacientePage() {
  const params = useParams();
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTratamiento, setSelectedTratamiento] = useState<TratamientoModalData | undefined>(undefined);
  const [isImagenModalOpen, setIsImagenModalOpen] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await fetch(`/api/pacientes/${params.id}`);
        if (!response.ok) throw new Error('Error al cargar el paciente');
        const data = await response.json();
        console.log('Datos del paciente cargados:', data);
        setPaciente(data);
      } catch (err) {
        console.error('Error al cargar los datos del paciente:', err);
        setError('Error al cargar los datos del paciente');
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [params.id]);

  const handleTratamientoAdded = async () => {
    try {
      const response = await fetch(`/api/pacientes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPaciente(data);
      }
    } catch (error) {
      console.error('Error al recargar paciente:', error);
    }
  };

  const handleEditTratamiento = (tratamiento: Tratamiento) => {
    // Convertir el tratamiento al formato que espera el modal
    const tratamientoModal: TratamientoModalData = {
      _id: tratamiento._id,
      fecha: new Date(tratamiento.fecha).toISOString().split('T')[0],
      procedimiento: tratamiento.procedimiento,
      notas: tratamiento.notas,
      estado: tratamiento.estado
    };
    setSelectedTratamiento(tratamientoModal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTratamiento(undefined);
  };

  const handleImagenAdded = async () => {
    try {
      const response = await fetch(`/api/pacientes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPaciente(data);
      }
    } catch (error) {
      console.error('Error al recargar paciente:', error);
    }
  };

  if (loading) return <div className="text-white p-4">Cargando...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;
  if (!paciente) return <div className="text-white p-4">Paciente no encontrado</div>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            {paciente.nombre} {paciente.apellido}
          </h1>
          <div className="space-x-4">
            <Link
              href={`/pacientes/${paciente._id}/editar`}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Editar Paciente
            </Link>
            <button
              onClick={async () => {
                if (confirm('¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.')) {
                  try {
                    const response = await fetch(`/api/pacientes/${paciente._id}`, {
                      method: 'DELETE',
                    });
                    if (response.ok) {
                      router.push('/pacientes');
                    } else {
                      alert('Error al eliminar el paciente');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Error al eliminar el paciente');
                  }
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Eliminar Paciente
            </button>
            <Link
              href="/pacientes"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Volver
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Información Personal</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300"><span className="font-medium">Nombre:</span> {paciente.nombre}</p>
              <p className="text-gray-300"><span className="font-medium">Apellido:</span> {paciente.apellido}</p>
              <p className="text-gray-300"><span className="font-medium">DNI:</span> {paciente.dni}</p>
              <p className="text-gray-300"><span className="font-medium">Teléfono:</span> {paciente.telefono}</p>
              {paciente.email && (
                <p className="text-gray-300"><span className="font-medium">Email:</span> {paciente.email}</p>
              )}
            </div>
          </div>

          {/* Historia Clínica */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Historia Clínica</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Antecedentes</h3>
                <p className="text-gray-300">
                  {paciente.historiaClinica?.antecedentes || 'Sin antecedentes registrados'}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Alergias</h3>
                {paciente.historiaClinica?.alergias && paciente.historiaClinica.alergias.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300">
                    {paciente.historiaClinica.alergias.map((alergia, index) => (
                      <li key={index}>{alergia}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">Sin alergias registradas</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tratamientos */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Tratamientos</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              Nuevo Tratamiento
            </button>
          </div>
          {paciente.historiaClinica?.tratamientos && paciente.historiaClinica.tratamientos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-300">Fecha</th>
                    <th className="px-4 py-2 text-left text-gray-300">Procedimiento</th>
                    <th className="px-4 py-2 text-left text-gray-300">Notas</th>
                    <th className="px-4 py-2 text-left text-gray-300">Estado</th>
                    <th className="px-4 py-2 text-left text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paciente.historiaClinica.tratamientos.map((tratamiento) => (
                    <tr key={tratamiento._id} className="hover:bg-gray-700">
                      <td className="px-4 py-2 text-gray-300">
                        {new Date(tratamiento.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {tratamiento.procedimiento}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {tratamiento.notas || '-'}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tratamiento.estado === 'completado' ? 'bg-green-500' :
                          tratamiento.estado === 'en-proceso' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white`}>
                          {tratamiento.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEditTratamiento(tratamiento)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('¿Estás seguro de que deseas eliminar este tratamiento?')) {
                              try {
                                const response = await fetch(`/api/pacientes/${params.id}/tratamientos/${tratamiento._id}`, {
                                  method: 'DELETE',
                                });
                                if (response.ok) {
                                  handleTratamientoAdded();
                                } else {
                                  alert('Error al eliminar el tratamiento');
                                }
                              } catch (error) {
                                console.error('Error:', error);
                                alert('Error al eliminar el tratamiento');
                              }
                            }
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300">No hay tratamientos registrados</p>
          )}
        </div>

        {/* Imágenes */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Imágenes</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => setIsImagenModalOpen(true)}
            >
              Subir Imagen
            </button>
          </div>
          {paciente.imagenes && paciente.imagenes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {paciente.imagenes.map((imagen) => (
                <div key={imagen._id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-300">{imagen.tipo}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(imagen.fecha).toLocaleDateString()}
                      </p>
                      <a href={imagen.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                        {imagen.url}
                      </a>
                      {imagen.descripcion && (
                        <p className="text-sm text-gray-300 mt-2">{imagen.descripcion}</p>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
                          try {
                            const response = await fetch(`/api/pacientes/${params.id}/imagenes/${imagen._id}`, {
                              method: 'DELETE',
                            });
                            if (response.ok) {
                              handleImagenAdded();
                            } else {
                              alert('Error al eliminar la imagen');
                            }
                          } catch (error) {
                            console.error('Error:', error);
                            alert('Error al eliminar la imagen');
                          }
                        }
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No hay imágenes registradas</p>
          )}
        </div>
      </div>

      {/* Modal de Tratamiento */}
      <TratamientoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pacienteId={params.id as string}
        onTratamientoAdded={handleTratamientoAdded}
        tratamientoToEdit={selectedTratamiento}
      />

      {/* Modal de Imagen */}
      <ImagenModal
        isOpen={isImagenModalOpen}
        onClose={() => setIsImagenModalOpen(false)}
        pacienteId={params.id as string}
        onImagenAdded={handleImagenAdded}
      />
    </div>
  );
} 