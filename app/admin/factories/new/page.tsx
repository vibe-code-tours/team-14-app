import { FactoryForm } from "@/src/components/admin/FactoryForm";

export default function NewFactoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          ➕ Add New Factory
        </h1>
        <p className="text-slate-500 text-sm">
          Create a new factory listing
        </p>
      </div>
      <FactoryForm mode="create" />
    </div>
  );
}
