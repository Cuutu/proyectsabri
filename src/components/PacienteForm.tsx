'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

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

export default function PacienteForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema)
  });

  const onSubmit = async (data: PacienteFormData) => {
    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al guardar el paciente');
      router.push('/pacientes');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el paciente');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre
          </label>
          <input
            type="text"
            {...register('nombre')}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Ingrese el nombre"
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
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Ingrese el apellido"
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
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
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
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Ingrese el DNI"
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
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Ingrese el teléfono"
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
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Ingrese el email (opcional)"
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
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          placeholder="Ingrese los antecedentes médicos"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Alergias
        </label>
        <textarea
          {...register('alergias')}
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          placeholder="Ingrese las alergias"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Paciente'}
        </button>
      </div>
    </form>
  );
} 