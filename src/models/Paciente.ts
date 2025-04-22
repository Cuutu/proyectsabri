import mongoose from 'mongoose';

const PacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  dni: {
    type: String,
    required: [true, 'El DNI es requerido'],
    unique: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es requerido']
  },
  email: String,
  historiaClinica: {
    fechaCreacion: {
      type: Date,
      default: Date.now
    },
    antecedentes: String,
    alergias: [String],
    tratamientos: [{
      fecha: Date,
      procedimiento: String,
      notas: String,
      diente: Number,
      estado: {
        type: String,
        enum: ['pendiente', 'en-proceso', 'completado'],
        default: 'pendiente'
      }
    }]
  },
  imagenes: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    tipo: {
      type: String,
      enum: ['radiografia', 'fotografia', 'otro']
    },
    url: String,
    descripcion: String
  }]
}, {
  timestamps: true
});

export default mongoose.models.Paciente || mongoose.model('Paciente', PacienteSchema); 