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
    const data = await request.json();

    const paciente = await Paciente.findById(params.id);
    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el número de historia clínica ya existe en otro paciente
    if (data.numeroHistoriaClinica !== paciente.numeroHistoriaClinica) {
      const existingPaciente = await Paciente.findOne({
        numeroHistoriaClinica: data.numeroHistoriaClinica,
        _id: { $ne: params.id }
      });
      if (existingPaciente) {
        return NextResponse.json(
          { error: 'Ya existe un paciente con ese número de historia clínica' },
          { status: 400 }
        );
      }
    }

    const updatedPaciente = await Paciente.findByIdAndUpdate(
      params.id,
      {
        $set: {
          nombre: data.nombre,
          apellido: data.apellido,
          numeroHistoriaClinica: data.numeroHistoriaClinica,
          dni: data.dni,
          telefono: data.telefono,
          email: data.email || '',
          'historiaClinica.antecedentes': data.antecedentes || '',
          'historiaClinica.alergias': data.alergias ? data.alergias.split(',').map((a: string) => a.trim()) : []
        }
      },
      { new: true }
    );

    return NextResponse.json(updatedPaciente);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Ya existe un paciente con ese número de historia clínica' },
        { status: 400 }
      );
    }
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const paciente = await Paciente.findByIdAndDelete(id);
    if (!paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Paciente eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el paciente' },
      { status: 500 }
    );
  }
} 