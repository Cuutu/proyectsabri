import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

export async function GET() {
  try {
    await connectDB();
    const pacientes = await Paciente.find({}).sort({ createdAt: -1 });
    return NextResponse.json(pacientes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener pacientes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const nuevoPaciente = await Paciente.create(data);
    return NextResponse.json(nuevoPaciente, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear paciente' },
      { status: 500 }
    );
  }
} 