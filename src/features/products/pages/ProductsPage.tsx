import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { ProductsHeader } from "../components/ProductsHeader";
import { ProductsFilterBar } from "../components/ProductsFilterBar";
import { ProductGrid } from "../components/ProductGrid";
import { ProductListTable } from "../components/ProductListTable";
import { AddProductDialog } from "../components/AddProductDialog";
import { UpdatePricesDialog } from "../components/UpdatePricesDialog";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { ProductHistoryModal } from "../components/ProductHistoryModal";
import { DeleteProductDialog } from "../components/DeleteProductDialog";
import { INITIAL_PRODUCTS } from "../data/mockProducts";
import { usePermissions } from "@/hooks/usePermissions";
import type {
  ProductItem,
  ProductCategory,
  ProductViewMode,
  NewProductFormData,
  BulkPriceUpdateFormData,
  PriceMovement,
} from "../types/products.types";

export const ProductsPage: React.FC = () => {
  const { products: permissions } = usePermissions();
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ProductCategory>("Todos");
  const [viewMode, setViewMode] = useState<ProductViewMode>("grid");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [isUpdatePricesOpen, setIsUpdatePricesOpen] = useState(false);
  const [productForDetails, setProductForDetails] =
    useState<ProductItem | null>(null);
  const [productForHistory, setProductForHistory] =
    useState<ProductItem | null>(null);
  const { showToast } = useToast();
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(
    null,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (
      permissions.canCreateProduct &&
      (searchParams.get("action") === "new" ||
        searchParams.get("nuevo") === "true" ||
        location.state?.openAddProduct)
    ) {
      setProductToEdit(null);
      setIsAddOpen(true);
      if (searchParams.has("action") || searchParams.has("nuevo")) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("action");
        newParams.delete("nuevo");
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [searchParams, location.state, setSearchParams, permissions.canCreateProduct]);

  // Keep modal product synced with updated state
  const currentHistoryProduct = useMemo(() => {
    if (!productForHistory) return null;
    return (
      products.find((p) => p.id === productForHistory.id) || productForHistory
    );
  }, [products, productForHistory]);

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      Todos: products.length,
      Anillos: 0,
      Aros: 0,
      Cadenas: 0,
      Pulseras: 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [products]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (activeCategory !== "Todos" && item.category !== activeCategory) {
        return false;
      }

      // Search filter (name or code/SKU)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        return matchesName || matchesCode;
      }

      return true;
    });
  }, [products, activeCategory, searchQuery]);

  // Handlers for CRUD
  const handleSaveProduct = (formData: NewProductFormData, editId?: string) => {
    if (editId) {
      // Edit existing
      setProducts((prev) =>
        prev.map((item) => {
          if (item.id !== editId) return item;

          const priceChanged = item.price !== formData.price;
          const priceRecord: PriceMovement | null = priceChanged
            ? {
                id: `p-${Date.now()}`,
                date: new Date().toLocaleDateString("es-AR"),
                oldPrice: item.price,
                newPrice: formData.price,
                difference:
                  Math.round((formData.price - item.price) * 100) / 100,
                percentageChange:
                  item.price > 0
                    ? Math.round(
                        ((formData.price - item.price) / item.price) * 1000,
                      ) / 10
                    : 0,
                reason: "Edición manual de producto",
              }
            : null;

          return {
            ...item,
            name: formData.name,
            code: formData.code,
            category: formData.category,
            price: formData.price,
            stock: formData.stock,
            metalPurity: formData.metalPurity,
            weightGrams: formData.weightGrams,
            description: formData.description,
            priceHistory: priceRecord
              ? [priceRecord, ...(item.priceHistory || [])]
              : item.priceHistory,
          };
        }),
      );
      showToast(`Producto "${formData.name}" actualizado con éxito.`);
    } else {
      // Create new
      const newProduct: ProductItem = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        category: formData.category,
        price: formData.price,
        stock: formData.stock,
        metalPurity: formData.metalPurity,
        weightGrams: formData.weightGrams,
        description: formData.description,
        isRemoteVisible: true,
        lastMovement: `Alta de producto con ${formData.stock} un.`,
        history: [
          {
            id: `h-${Date.now()}`,
            date: new Date().toLocaleDateString("es-AR"),
            type: "ingreso",
            quantity: formData.stock,
            reason: "Registro inicial de stock",
          },
        ],
        priceHistory: [
          {
            id: `p-${Date.now()}`,
            date: new Date().toLocaleDateString("es-AR"),
            oldPrice: formData.price,
            newPrice: formData.price,
            difference: 0,
            percentageChange: 0,
            reason: "Precio de lanzamiento inicial",
          },
        ],
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Producto "${formData.name}" agregado al catálogo.`);
    }
    setProductToEdit(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast("Producto eliminado del catálogo.");
  };

  const handleApplyPriceUpdate = (data: BulkPriceUpdateFormData) => {
    const factor = data.isIncrease
      ? 1 + data.percentage / 100
      : 1 - data.percentage / 100;

    setProducts((prev) =>
      prev.map((item) => {
        if (data.applyToAll || item.category === data.category) {
          const updatedPrice = Math.round(item.price * factor * 100) / 100;
          const diff = Math.round((updatedPrice - item.price) * 100) / 100;
          const priceRecord: PriceMovement = {
            id: `p-${Date.now()}-${item.id}`,
            date: new Date().toLocaleDateString("es-AR"),
            oldPrice: item.price,
            newPrice: updatedPrice,
            difference: diff,
            percentageChange: (data.isIncrease ? 1 : -1) * data.percentage,
            reason: `Ajuste masivo (${data.isIncrease ? "+" : "-"}${data.percentage}%)`,
          };
          return {
            ...item,
            price: updatedPrice,
            priceHistory: [priceRecord, ...(item.priceHistory || [])],
          };
        }
        return item;
      }),
    );

    showToast(
      `Precios actualizados (${data.isIncrease ? "+" : "-"}${data.percentage}%) en ${
        data.applyToAll ? "todos los productos" : data.category
      }.`,
    );
  };

  const handleAdjustStock = (
    productId: string,
    delta: number,
    reason: string,
  ) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const newStock = Math.max(0, item.stock + delta);
        const newMovement = {
          id: `h-${Date.now()}`,
          date: new Date().toLocaleDateString("es-AR"),
          type: (delta > 0 ? "ingreso" : "egreso") as "ingreso" | "egreso",
          quantity: Math.abs(delta),
          reason,
        };
        return {
          ...item,
          stock: newStock,
          lastMovement: `${reason} (${delta > 0 ? "+" : ""}${delta} un.)`,
          history: [newMovement, ...(item.history || [])],
        };
      }),
    );
    showToast(`Stock actualizado con éxito.`);
  };

  const handleUpdateProductPrice = (
    productId: string,
    newPrice: number,
    reason: string,
  ) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const diff = Math.round((newPrice - item.price) * 100) / 100;
        const pct =
          item.price > 0
            ? Math.round(((newPrice - item.price) / item.price) * 1000) / 10
            : 0;
        const newRecord: PriceMovement = {
          id: `p-${Date.now()}`,
          date: new Date().toLocaleDateString("es-AR"),
          oldPrice: item.price,
          newPrice,
          difference: diff,
          percentageChange: pct,
          reason,
        };
        return {
          ...item,
          price: newPrice,
          priceHistory: [newRecord, ...(item.priceHistory || [])],
        };
      }),
    );
    showToast(`Precio actualizado con éxito a $${newPrice.toFixed(2)}.`);
  };

  const handleToggleRemoteVisibility = (product: ProductItem) => {
    const nextState = product.isRemoteVisible === false ? true : false;
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, isRemoteVisible: nextState } : item,
      ),
    );
    showToast(
      nextState
        ? `"${product.name}" ahora es visible en el catálogo remoto.`
        : `"${product.name}" se ocultó del catálogo remoto.`,
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title & Action Buttons */}
      <ProductsHeader
        onAddProductClick={() => {
          setProductToEdit(null);
          setIsAddOpen(true);
        }}
        onUpdatePricesClick={() => setIsUpdatePricesOpen(true)}
      />

      {/* Filter Bar: Search, Category Pills & Segmented Grid/List toggle */}
      <ProductsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Catalog View: Grid or List */}
      {viewMode === "grid" ? (
        <ProductGrid
          products={filteredProducts}
          onViewDetails={(item) => setProductForDetails(item)}
          onEdit={(item) => {
            setProductToEdit(item);
            setIsAddOpen(true);
          }}
          onDelete={(item) => setProductToDelete(item)}
          onViewHistory={(item) => setProductForHistory(item)}
          onToggleRemoteVisibility={handleToggleRemoteVisibility}
          onResetFilters={() => {
            setSearchQuery("");
            setActiveCategory("Todos");
          }}
        />
      ) : (
        <ProductListTable
          products={filteredProducts}
          onViewDetails={(item) => setProductForDetails(item)}
          onEdit={(item) => {
            setProductToEdit(item);
            setIsAddOpen(true);
          }}
          onDelete={(item) => setProductToDelete(item)}
          onViewHistory={(item) => setProductForHistory(item)}
          onToggleRemoteVisibility={handleToggleRemoteVisibility}
          onResetFilters={() => {
            setSearchQuery("");
            setActiveCategory("Todos");
          }}
        />
      )}

      {/* Modals */}
      <AddProductDialog
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSaveProduct={handleSaveProduct}
      />

      <UpdatePricesDialog
        open={isUpdatePricesOpen}
        onOpenChange={setIsUpdatePricesOpen}
        onApplyPriceUpdate={handleApplyPriceUpdate}
        totalProductsCount={products.length}
      />

      <ProductDetailModal
        open={!!productForDetails}
        onOpenChange={(open) => !open && setProductForDetails(null)}
        product={productForDetails}
        onEditProduct={(item) => {
          setProductToEdit(item);
          setIsAddOpen(true);
        }}
      />

      <ProductHistoryModal
        open={!!currentHistoryProduct}
        onOpenChange={(open) => !open && setProductForHistory(null)}
        product={currentHistoryProduct}
        onAdjustStock={handleAdjustStock}
        onUpdatePrice={handleUpdateProductPrice}
      />

      <DeleteProductDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        product={productToDelete}
        onConfirmDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsPage;
