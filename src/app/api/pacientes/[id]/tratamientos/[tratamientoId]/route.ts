import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

// Definir una interfaz para el tratamiento
interface Tratamiento {
  _id: string;
  fecha: Date;
  procedimiento: string;
  notas: string;
  estado: 'pendiente' | 'en-proceso' | 'completado';
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; tratamientoId: string } }
) {
  try {
    await connectDB();
    const data = await request.json();

    const paciente = await Paciente.findById(params.id);
    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Encontrar y actualizar el tratamiento específico
    const tratamientoIndex = paciente.historiaClinica.tratamientos.findIndex(
      (t: Tratamiento) => t._id.toString() === params.tratamientoId
    );

    if (tratamientoIndex === -1) {
      return NextResponse.json(
        { error: 'Tratamiento no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el tratamiento
    paciente.historiaClinica.tratamientos[tratamientoIndex] = {
      ...paciente.historiaClinica.tratamientos[tratamientoIndex],
      ...data
    };

    await paciente.save();

    return NextResponse.json(paciente.historiaClinica.tratamientos[tratamientoIndex]);
  } catch (error) {
    console.error('Error al actualizar tratamiento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el tratamiento' },
      { status: 500 }
    );
  }
} 