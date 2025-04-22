'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Paciente {
  _id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email?: string;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPacientes = async () => {
    try {
      const response = await fetch('/api/pacientes');
      if (!response.ok) throw new Error('Error al cargar los pacientes');
      const data = await response.json();
      setPacientes(data);
    } catch (err) {
      setError('Error al cargar los pacientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Pacientes</h1>
        <Link 
          href="/pacientes/nuevo" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Nuevo Paciente
        </Link>
      </div>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        {loading ? (
          <p className="text-gray-300 p-6">Cargando pacientes...</p>
        ) : error ? (
          <p className="text-red-400 p-6">{error}</p>
        ) : pacientes.length === 0 ? (
          <p className="text-gray-300 p-6">No hay pacientes registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pacientes.map((paciente) => (
                  <tr key={paciente._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {paciente.nombre} {paciente.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {paciente.dni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {paciente.telefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {paciente.email || '-'}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/pacientes/${paciente._id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/pacientes/${paciente._id}/editar`}
                        className="text-green-400 hover:text-green-300 transition-colors mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm('¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.')) {
                            try {
                              const response = await fetch(`/api/pacientes/${paciente._id}`, {
                                method: 'DELETE',
                              });
                              if (response.ok) {
                                // Recargar la lista de pacientes
                                fetchPacientes();
                              } else {
                                alert('Error al eliminar el paciente');
                              }
                            } catch (error) {
                              console.error('Error:', error);
                              alert('Error al eliminar el paciente');
                            }
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 