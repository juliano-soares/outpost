export default function InstructionControls() {
  return (
    <div className="absolute top-4 left-4 text-white bg-black/50 p-4 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-2">Sistema Solar 3D</h3>
      <div className="text-sm space-y-1">
        <p>
          <strong>Mouse Esquerdo:</strong> Arrastar para rotacionar
        </p>
        <p>
          <strong>Mouse Direito:</strong> Arrastar para pan (mover)
        </p>
        <p>
          <strong>Scroll:</strong> Zoom in/out
        </p>
        <p>
          <strong>WASD:</strong> Movimento livre
        </p>
        <p>
          <strong>Q/E:</strong> Subir/Descer
        </p>
        <p>
          <strong>Z/X:</strong> Zoom rápido
        </p>
        <p>
          <strong>Clique no planeta:</strong> Focar
        </p>
      </div>
    </div>
  );
}
