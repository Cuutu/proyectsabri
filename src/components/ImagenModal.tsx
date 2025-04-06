'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';

const imagenSchema = z.object({
  tipo: z.enum(['radiografia', 'fotografia', 'otro']),
  descripcion: z.string().optional()
});

type ImagenFormData = {
  tipo: 'radiografia' | 'fotografia' | 'otro';
  descripcion?: string;
};

interface ImagenModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: string;
  onImagenAdded: () => void;
}

export default function ImagenModal({
  isOpen,
  onClose,
  pacienteId,
  onImagenAdded
}: ImagenModalProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<ImagenFormData>({
    resolver: zodResolver(imagenSchema),
    defaultValues: {
      tipo: 'fotografia'
    }
  });

  const onSubmit = async (data: ImagenFormData) => {
    if (!uploadedImageUrl) {
      alert('Por favor, sube una imagen primero');
      return;
    }

    try {
      const response = await fetch(`/api/pacientes/${pacienteId}/imagenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          url: uploadedImageUrl,
          fecha: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Error al guardar la imagen');

      onImagenAdded();
      reset();
      setUploadedImageUrl('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la imagen');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Subir Imagen</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Imagen
              </label>
              <select
                {...register('tipo')}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="fotografia">Fotografía</option>
                <option value="radiografia">Radiografía</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                {...register('descripcion')}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen
              </label>
              <CldUploadWidget
                uploadPreset="dental_images"
                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                  console.log('Resultado completo:', result);
                  if (result.event === "success" && result.info && typeof result.info !== 'string') {
                    const url = result.info.secure_url;
                    console.log('URL de imagen:', url);
                    setUploadedImageUrl(url);
                  }
                }}
                options={{
                  maxFiles: 1,
                  sources: ['local', 'camera'],
                  multiple: false,
                  clientAllowedFormats: ['jpg', 'jpeg', 'png'],
                  showUploadMoreButton: false,
                  showPoweredBy: false,
                }}
              >
                {({ open }) => (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        open();
                      }}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                    >
                      Seleccionar Imagen
                    </button>
                    {uploadedImageUrl && (
                      <div className="relative w-full h-48 mt-4 border border-gray-600 rounded-md overflow-hidden">
                        <Image
                          src={uploadedImageUrl}
                          alt="Vista previa"
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !uploadedImageUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Imagen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 