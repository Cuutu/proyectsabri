import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: Date;
  genero: 'M' | 'F' | 'O';
  telefono: string;
  email: string;
  direccion: string;
  historiaClinica: {
    fecha: Date;
    descripcion: string;
    tratamiento: string;
    observaciones: string;
  }[];
  imagenes: {
    url: string;
    descripcion: string;
    fecha: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true },
  genero: { type: String, enum: ['M', 'F', 'O'], required: true },
  telefono: { type: String, required: true },
  email: { type: String },
  direccion: { type: String, required: true },
  historiaClinica: [{
    fecha: { type: Date, default: Date.now },
    descripcion: { type: String, required: true },
    tratamiento: { type: String, required: true },
    observaciones: { type: String }
  }],
  imagenes: [{
    url: { type: String, required: true },
    descripcion: { type: String },
    fecha: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema); 