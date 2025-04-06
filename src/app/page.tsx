import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Paciente from '@/models/Paciente';

async function obtenerEstadisticas() {
  await connectDB();
  
  const totalPacientes = await Paciente.countDocuments();
  
  const totalTratamientos = await Paciente.aggregate([
    { $unwind: "$historiaClinica.tratamientos" },
    { $group: { _id: null, total: { $sum: 1 } } }
  ]).then(result => result[0]?.total || 0);
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const tratamientosHoy = await Paciente.aggregate([
    { $unwind: "$historiaClinica.tratamientos" },
    { 
      $match: { 
        "historiaClinica.tratamientos.fecha": { 
          $gte: hoy,
          $lt: new Date(hoy.getTime() + 24 * 60 * 60 * 1000)
        } 
      }
    },
    { $group: { _id: null, total: { $sum: 1 } } }
  ]).then(result => result[0]?.total || 0);
  
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const tratamientosMes = await Paciente.aggregate([
    { $unwind: "$historiaClinica.tratamientos" },
    { 
      $match: { 
        "historiaClinica.tratamientos.fecha": { 
          $gte: inicioMes,
          $lt: new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
        } 
      }
    },
    { $group: { _id: null, total: { $sum: 1 } } }
  ]).then(result => result[0]?.total || 0);

  return {
    totalPacientes,
    totalTratamientos,
    tratamientosMes,
    tratamientosHoy
  };
}

export default async function HomePage() {
  const stats = await obtenerEstadisticas();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-2">
            Bienvenida Sabrina
          </h1>
          <p className="text-2xl text-blue-400">
            a tu Base de Datos de Pacientes
          </p>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{stats.totalPacientes}</div>
              <div className="text-gray-400">Pacientes</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{stats.totalTratamientos}</div>
              <div className="text-gray-400">Tratamientos</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{stats.tratamientosMes}</div>
              <div className="text-gray-400">Este Mes</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{stats.tratamientosHoy}</div>
              <div className="text-gray-400">Hoy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl hover:transform hover:scale-105 transition-all">
              <div className="text-blue-400 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Gestión Simple
              </h3>
              <p className="text-gray-300">
                Administra los datos de tus pacientes de manera fácil y eficiente
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl hover:transform hover:scale-105 transition-all">
              <div className="text-blue-400 text-4xl mb-4">🦷</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Historia Clínica
              </h3>
              <p className="text-gray-300">
                Mantén un registro detallado de tratamientos y evolución
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl hover:transform hover:scale-105 transition-all">
              <div className="text-blue-400 text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Imágenes Dentales
              </h3>
              <p className="text-gray-300">
                Almacena y organiza radiografías y fotografías clínicas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/pacientes/nuevo"
              className="group bg-gray-800 p-6 rounded-lg shadow-xl hover:bg-gray-700 transition-all flex items-center"
            >
              <div className="text-4xl mr-4">👤</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  Nuevo Paciente
                </h3>
                <p className="text-gray-400">
                  Registra un nuevo paciente en el sistema
                </p>
              </div>
            </Link>
            <Link
              href="/pacientes"
              className="group bg-gray-800 p-6 rounded-lg shadow-xl hover:bg-gray-700 transition-all flex items-center"
            >
              <div className="text-4xl mr-4">🔍</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  Ver Pacientes
                </h3>
                <p className="text-gray-400">
                  Accede a la lista completa de pacientes
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-400">
        <p>Sistema de Gestión Dental © 2024</p>
      </footer>
    </div>
  );
}
