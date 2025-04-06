import PacienteForm from '@/components/PacienteForm';

export default function NuevoPacientePage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">
          Registrar Nuevo Paciente
        </h1>
        <div className="bg-gray-800 shadow-xl rounded-lg p-6">
          <PacienteForm />
        </div>
      </div>
    </div>
  );
} 