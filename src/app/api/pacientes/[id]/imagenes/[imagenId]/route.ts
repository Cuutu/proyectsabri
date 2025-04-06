import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imagenId: string } }
) {
  try {
    await connectDB();
    const { id, imagenId } = params;

    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Encontrar y eliminar la imagen específica
    const imagenIndex = paciente.imagenes.findIndex(
      (img: any) => img._id.toString() === imagenId
    );

    if (imagenIndex === -1) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la imagen del array
    paciente.imagenes.splice(imagenIndex, 1);
    await paciente.save();

    return NextResponse.json({ message: 'Imagen eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la imagen' },
      { status: 500 }
    );
  }
} 