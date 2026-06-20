import { useStore } from "@/store/useStore";
import { Copy, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { calculateProductCost } from "@/utils/costEngine";

export default function ProductList() {
  const products = useStore((s) => s.products);
  const nodes = useStore((s) => s.nodes);
  const materials = useStore((s) => s.materials);
  const conversions = useStore((s) => s.conversions);
  const selectedProductId = useStore((s) => s.selectedProductId);
  const selectProduct = useStore((s) => s.selectProduct);
  const addProduct = useStore((s) => s.addProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);
  const copyProduct = useStore((s) => s.copyProduct);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    addProduct(newName.trim());
    setNewName("");
    setShowNew(false);
  };

  return (
    <div className="w-64 h-full flex flex-col bg-charcoal-900 border-r border-gold-900/30">
      <div className="p-4 border-b border-gold-900/20">
        <h1 className="font-serif text-xl font-bold text-gold-500 text-shadow-gold mb-3">
          金算盘
        </h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
          <input
            type="text"
            placeholder="搜索产品..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-charcoal-700 border border-charcoal-600 rounded-lg text-sm text-charcoal-50 placeholder:text-charcoal-400 focus:outline-none focus:border-gold-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map((product) => {
          const costTree = calculateProductCost(
            product.id,
            nodes,
            materials,
            conversions
          );
          const isSelected = selectedProductId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => selectProduct(product.id)}
              className={`group relative p-3 mb-1 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-gold-500/15 border border-gold-500/40 shadow-lg shadow-gold-500/5"
                  : "hover:bg-charcoal-700/60 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-medium text-sm ${
                    isSelected ? "text-gold-300" : "text-charcoal-100"
                  }`}
                >
                  {product.name}
                </span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyProduct(product.id);
                    }}
                    className="p-0.5 hover:text-gold-400 transition-all"
                    title="复制产品"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(product.id);
                    }}
                    className="p-0.5 hover:text-danger transition-all"
                    title="删除产品"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-charcoal-300 mt-1">
                成本:{" "}
                <span className="text-gold-400 font-semibold">
                  ¥{costTree.cost.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gold-900/20">
        {showNew ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="产品名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
              className="flex-1 px-2 py-1.5 bg-charcoal-700 border border-gold-600/50 rounded text-sm text-charcoal-50 placeholder:text-charcoal-400 focus:outline-none focus:border-gold-500"
            />
            <button
              onClick={handleAdd}
              className="px-2 py-1 bg-gold-600 hover:bg-gold-500 text-charcoal-900 rounded text-xs font-semibold transition-colors"
            >
              确定
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNew(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-gold-500 hover:text-gold-400 border border-dashed border-gold-700/50 hover:border-gold-500/50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建产品
          </button>
        )}
      </div>
    </div>
  );
}
