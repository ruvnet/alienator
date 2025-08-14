import CrossModelComparison from "../components/CrossModelComparison";

export default function CrossModel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cross-Model Analysis</h1>
        <p className="text-muted-foreground">
          Compare and analyze outputs across different AI models
        </p>
      </div>

      <CrossModelComparison />
    </div>
  );
}