'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const tratamientoSchema = z.object({
  fecha: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha inválida'
  }),
  procedimiento: z.string().min(1, 'El procedimiento es requerido'),
  notas: z.string().optional(),
  diente: z.string().transform(num => num ? Number(num) : undefined).optional(),
  estado: z.enum(['pendiente', 'en-proceso', 'completado'])
});

type TratamientoFormData = z.infer<typeof tratamientoSchema>;

interface TratamientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: string;
  onTratamientoAdded: () => void;
  tratamientoToEdit?: {
    _id: string;
    fecha: string;
    procedimiento: string;
    notas?: string;
    diente?: number;
    estado: 'pendiente' | 'en-proceso' | 'completado';
  };
}

export default function TratamientoModal({ 
  isOpen, 
  onClose, 
  pacienteId, 
  onTratamientoAdded,
  tratamientoToEdit 
}: TratamientoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TratamientoFormData>({
    resolver: zodResolver(tratamientoSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente'
    }
  });

  useEffect(() => {
    if (tratamientoToEdit) {
      reset({
        fecha: new Date(tratamientoToEdit.fecha).toISOString().split('T')[0],
        procedimiento: tratamientoToEdit.procedimiento,
        notas: tratamientoToEdit.notas || '',
        diente: tratamientoToEdit.diente?.toString() || '',
        estado: tratamientoToEdit.estado
      });
    }
  }, [tratamientoToEdit, reset]);

  const onSubmit = async (data: TratamientoFormData) => {
    setIsSubmitting(true);
    try {
      const url = tratamientoToEdit
        ? `/api/pacientes/${pacienteId}/tratamientos/${tratamientoToEdit._id}`
        : `/api/pacientes/${pacienteId}/tratamientos`;

      const response = await fetch(url, {
        method: tratamientoToEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al guardar el tratamiento');

      onTratamientoAdded();
      reset();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el tratamiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {tratamientoToEdit ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fecha
            </label>
            <input
              type="date"
              {...register('fecha')}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-400">{errors.fecha.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Procedimiento
            </label>
            <input
              type="text"
              {...register('procedimiento')}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Descripción del procedimiento"
            />
            {errors.procedimiento && (
              <p className="mt-1 text-sm text-red-400">{errors.procedimiento.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de Diente (opcional)
            </label>
            <input
              type="number"
              {...register('diente')}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Ej: 11"
              min="1"
              max="32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estado
            </label>
            <select
              {...register('estado')}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en-proceso">En Proceso</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notas (opcional)
            </label>
            <textarea
              {...register('notas')}
              rows={3}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Notas adicionales"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Tratamiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 