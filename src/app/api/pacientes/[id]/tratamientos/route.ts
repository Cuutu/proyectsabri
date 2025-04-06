import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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

    // Asegúrate de que historiaClinica y tratamientos existan
    if (!paciente.historiaClinica) {
      paciente.historiaClinica = { tratamientos: [] };
    }
    if (!paciente.historiaClinica.tratamientos) {
      paciente.historiaClinica.tratamientos = [];
    }

    // Agregar el nuevo tratamiento
    paciente.historiaClinica.tratamientos.push(data);
    await paciente.save();

    return NextResponse.json(paciente.historiaClinica.tratamientos);
  } catch (error) {
    console.error('Error al agregar tratamiento:', error);
    return NextResponse.json(
      { error: 'Error al agregar el tratamiento' },
      { status: 500 }
    );
  }
} 