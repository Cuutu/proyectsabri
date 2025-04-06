import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const paciente = await Paciente.findById(id);
    
    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(paciente);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener el paciente' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar los campos básicos
    paciente.nombre = data.nombre;
    paciente.apellido = data.apellido;
    paciente.fechaNacimiento = data.fechaNacimiento;
    paciente.dni = data.dni;
    paciente.telefono = data.telefono;
    paciente.email = data.email;

    // Actualizar historia clínica
    if (!paciente.historiaClinica) {
      paciente.historiaClinica = {
        antecedentes: '',
        alergias: [],
        tratamientos: []
      };
    }

    paciente.historiaClinica.antecedentes = data.historiaClinica.antecedentes;
    paciente.historiaClinica.alergias = data.historiaClinica.alergias;

    await paciente.save();

    return NextResponse.json(paciente);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el paciente' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const paciente = await Paciente.findById(id);

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