import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const paciente = await Paciente.findById(context.params.id);

    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Asegúrate de que el array de imágenes exista
    if (!paciente.imagenes) {
      paciente.imagenes = [];
    }

    // Agregar la nueva imagen
    paciente.imagenes.push(data);
    await paciente.save();

    return NextResponse.json(paciente.imagenes);
  } catch (error) {
    console.error('Error al agregar imagen:', error);
    return NextResponse.json(
      { error: 'Error al agregar la imagen' },
      { status: 500 }
    );
  }
} 