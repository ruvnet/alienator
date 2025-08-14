import EmbeddingsVisualization from "../components/EmbeddingsVisualization";

export default function Embeddings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Embeddings Visualization</h1>
        <p className="text-muted-foreground">
          Visualize and analyze semantic embeddings in multi-dimensional space
        </p>
      </div>

      <EmbeddingsVisualization />
    </div>
  );
}