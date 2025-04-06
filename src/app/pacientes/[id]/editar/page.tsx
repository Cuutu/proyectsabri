'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const pacienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha inválida'
  }),
  dni: z.string().min(7, 'DNI inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  antecedentes: z.string().optional(),
  alergias: z.string().optional()
});

type PacienteFormData = z.infer<typeof pacienteSchema>;

export default function EditarPacientePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema)
  });

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await fetch(`/api/pacientes/${params.id}`);
        if (!response.ok) throw new Error('Error al cargar el paciente');
        const data = await response.json();
        
        // Formatear la fecha para el input date
        const fechaNacimiento = new Date(data.fechaNacimiento)
          .toISOString()
          .split('T')[0];

        reset({
          ...data,
          fechaNacimiento,
          antecedentes: data.historiaClinica?.antecedentes || '',
          alergias: data.historiaClinica?.alergias?.join(', ') || ''
        });
      } catch (err) {
        setError('Error al cargar los datos del paciente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [params.id, reset]);

  const onSubmit = async (data: PacienteFormData) => {
    try {
      const response = await fetch(`/api/pacientes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          historiaClinica: {
            antecedentes: data.antecedentes,
            alergias: data.alergias ? data.alergias.split(',').map(a => a.trim()) : []
          }
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar el paciente');
      router.push(`/pacientes/${params.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el paciente');
    }
  };

  if (loading) return <div className="text-white p-4">Cargando...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          Editar Paciente
        </h1>
        <div className="bg-gray-800 shadow-xl rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register('nombre')}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-400">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  {...register('apellido')}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-400">{errors.apellido.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  {...register('fechaNacimiento')}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.fechaNacimiento && (
                  <p className="mt-1 text-sm text-red-400">{errors.fechaNacimiento.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  DNI
                </label>
                <input
                  type="text"
                  {...register('dni')}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.dni && (
                  <p className="mt-1 text-sm text-red-400">{errors.dni.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  {...register('telefono')}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-400">{errors.telefono.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Antecedentes Médicos
              </label>
              <textarea
                {...register('antecedentes')}
                rows={4}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Alergias
              </label>
              <textarea
                {...register('alergias')}
                rows={4}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ingrese las alergias separadas por comas"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 