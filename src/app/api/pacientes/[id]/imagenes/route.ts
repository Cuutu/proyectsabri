import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

type Props = {
  params: {
    id: string;
  };
};

export async function POST(
  request: Request,
  props: Props
) {
  try {
    await connectDB();
    const data = await request.json();

    const paciente = await Paciente.findById(props.params.id);
    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Agregar la imagen al paciente
    if (!paciente.imagenes) {
      paciente.imagenes = [];
    }

    paciente.imagenes.push({
      url: data.url,
      tipo: data.tipo,
      descripcion: data.descripcion,
      fecha: new Date()
    });

    await paciente.save();

    return NextResponse.json(paciente.imagenes[paciente.imagenes.length - 1]);
  } catch (error) {
    console.error('Error al agregar imagen:', error);
    return NextResponse.json(
      { error: 'Error al agregar la imagen' },
      { status: 500 }
    );
  }
} 