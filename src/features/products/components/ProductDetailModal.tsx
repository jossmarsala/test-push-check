import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";
import type { ProductItem } from "../types/products.types";
import { usePermissions } from "@/hooks/usePermissions";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
  onEditProduct: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  open,
  onOpenChange,
  product,
  onEditProduct,
}) => {
  const { products } = usePermissions();

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-6 shadow-lg">
        {/* Header: Clean typography, no badges */}
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--neutral-muted)]">
            <span className="uppercase tracking-wider font-medium">
              {product.category}
            </span>
            <span className="font-mono">{product.code}</span>
          </div>

          <div className="flex items-baseline justify-between gap-4 pt-1">
            <DialogTitle className="text-xl font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
              {product.name}
            </DialogTitle>
            <span className="text-xl font-bold font-mono tabular-nums text-[var(--neutral-emphasis)] shrink-0">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* Product Media Box - only rendered if image exists */}
          {product.imageUrl && (
            <div className="relative h-52 w-full overflow-hidden rounded-[var(--radius-card-md)] bg-[var(--product-image-bg)] flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Clean Details List / Specifications with ONLY existent data */}
          <div className="divide-y divide-[var(--neutral-border-subtle)]/70 text-xs">
            {product.stock !== undefined && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[var(--neutral-muted)]">Stock</span>
                <span className="font-medium text-[var(--product-stock-green)]">
                  {product.stock} en stock
                </span>
              </div>
            )}

            {product.metalPurity && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[var(--neutral-muted)]">Material</span>
                <span className="font-medium text-[var(--neutral-emphasis)]">
                  {product.metalPurity}
                </span>
              </div>
            )}

            {product.weightGrams ? (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[var(--neutral-muted)]">Peso</span>
                <span className="font-medium text-[var(--neutral-emphasis)]">
                  {product.weightGrams} g
                </span>
              </div>
            ) : null}

            {products.canViewCost && product.costPrice !== undefined && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[var(--neutral-muted)]">Costo de compra</span>
                <span className="font-semibold text-[var(--neutral-emphasis)] font-mono">
                  ${product.costPrice.toFixed(2)}
                </span>
              </div>
            )}

            {product.isRemoteVisible !== undefined && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[var(--neutral-muted)]">Catálogo web</span>
                <span className="font-medium text-[var(--neutral-emphasis)]">
                  {product.isRemoteVisible ? "Visible" : "Oculto"}
                </span>
              </div>
            )}
          </div>

          {/* Optional Description */}
          {product.description && (
            <div className="pt-1">
              <span className="text-[11px] font-medium text-[var(--neutral-muted)] uppercase tracking-wider block mb-1">
                Descripción
              </span>
              <p className="text-xs text-[var(--neutral-body)] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9 items-center justify-center rounded-[var(--radius-btn)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            {products.canEditProduct && (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onEditProduct(product);
                }}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-4 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              >
                <SquarePen className="h-3.5 w-3.5" />
                <span>Editar producto</span>
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
