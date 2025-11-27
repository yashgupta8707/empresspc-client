import { useEffect, useState } from "react";

const COMPONENT_TYPES = [
  "Processor", "Motherboard", "RAM", "GPU", "SSD", "HDD", 
  "Case", "Cooler", "PSU", "Fan", "Cabinet"
];

export default function AdminComponentsPage() {
  const [components, setComponents] = useState({});
  const [type, setType] = useState("Processor");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    specs: "" 
  });

  // Note: Since there's no components API in your backend, 
  // we'll keep using localStorage for now
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("components")) || {};
    setComponents(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("components", JSON.stringify(components));
  }, [components]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Please fill all required fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      ...form,
      price: parseFloat(form.price),
      createdAt: new Date().toISOString()
    };

    setComponents(prev => ({
      ...prev,
      [type]: [newItem, ...(prev[type] || [])]
    }));

    setForm({ name: "", price: "", specs: "" });
    alert("Component added successfully!");
  };

  const handleDelete = (componentType, id) => {
    if (!confirm("Are you sure you want to delete this component?")) return;
    
    const updatedList = (components[componentType] || []).filter(item => item.id !== id);
    setComponents(prev => ({ ...prev, [componentType]: updatedList }));
    alert("Component deleted successfully!");
  };

  const getTotalComponents = () => {
    return Object.values(components).reduce((total, items) => total + items.length, 0);
  };

  const getComponentsByType = (componentType) => {
    return components[componentType] || [];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage PC Components</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <h3 className="text-sm font-semibold text-gray-600">Total Components</h3>
          <p className="text-2xl font-bold text-red-500">{getTotalComponents()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <h3 className="text-sm font-semibold text-gray-600">Categories</h3>
          <p className="text-2xl font-bold text-blue-500">{COMPONENT_TYPES.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <h3 className="text-sm font-semibold text-gray-600">Current Type</h3>
          <p className="text-lg font-bold text-green-500">{type}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <h3 className="text-sm font-semibold text-gray-600">In {type}</h3>
          <p className="text-2xl font-bold text-purple-500">{getComponentsByType(type).length}</p>
        </div>
      </div>

      {/* Add Component Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Component</h2>
        
        {/* Component Type Selector */}
        <div className="mb-4">
          <label className="block text-sm mb-2 font-semibold text-gray-700">
            Select Component Type:
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border px-4 py-2 rounded w-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={loading}
          >
            {COMPONENT_TYPES.map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Component Name"
              className="border w-full px-4 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price (in ₹)"
              className="border w-full px-4 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              disabled={loading}
            />
          </div>
          
          <textarea
            placeholder="Specs / Description (optional)"
            className="border w-full px-4 py-2 rounded h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
            value={form.specs}
            onChange={e => setForm({ ...form, specs: e.target.value })}
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : `Add ${type}`}
          </button>
        </form>
      </div>

      {/* Component Categories */}
      <div className="space-y-8">
        {COMPONENT_TYPES.map(compType => {
          const items = components[compType] || [];
          return (
            <div key={compType} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">{compType}</h2>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    {items.length} items
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No {compType.toLowerCase()} components added yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <span className="text-lg font-bold text-red-600">₹{item.price?.toLocaleString()}</span>
                          </div>
                          
                          {item.specs && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.specs}</p>
                          )}
                          
                          <p className="text-xs text-gray-400 mt-1">
                            Added: {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(compType, item.id)}
                          disabled={loading}
                          className="self-start sm:self-center px-4 py-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}