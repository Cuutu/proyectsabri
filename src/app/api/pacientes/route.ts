import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

export async function GET() {
  try {
    await connectDB();
    const pacientes = await Paciente.find();
    return NextResponse.json(pacientes);
  } catch {
    return NextResponse.json({ mensaje: "Error al obtener pacientes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const paciente = await Paciente.create({
      nombre: data.nombre,
      apellido: data.apellido,
      numeroHistoriaClinica: data.numeroHistoriaClinica,
      dni: data.dni,
      telefono: data.telefono,
      email: data.email || '',
      historiaClinica: {
        antecedentes: data.antecedentes || '',
        alergias: data.alergias ? data.alergias.split(',').map((a: string) => a.trim()) : []
      }
    });

    return NextResponse.json(paciente, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      // Error de duplicado
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'dni' ? 
        'Ya existe un paciente con ese DNI' : 
        field === 'numeroHistoriaClinica' ?
        'Ya existe un paciente con ese número de historia clínica' :
        'Error de duplicado en la base de datos';
      
      return NextResponse.json({ error: message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Error al crear el paciente' },
      { status: 500 }
    );
  }
} 