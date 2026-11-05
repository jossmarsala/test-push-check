import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Camera, Upload, Trash2 } from 'lucide-react'
import type { ProductItem, ProductCategoryKey, NewProductFormData } from '../types/products.types'

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productToEdit?: ProductItem | null
  onSaveProduct: (data: NewProductFormData, id?: string) => void
}

interface InnerFormProps {
  productToEdit?: ProductItem | null
  onSaveProduct: (data: NewProductFormData, id?: string) => void
  onCancel: () => void
}

const CATEGORIES: ProductCategoryKey[] = ['Anillos', 'Aros', 'Cadenas', 'Pulseras']

const InnerAddProductForm: React.FC<InnerFormProps> = ({
  productToEdit,
  onSaveProduct,
  onCancel,
}) => {
  const [name, setName] = useState(productToEdit?.name || '')
  const [code, setCode] = useState(productToEdit?.code || '')
  const [category, setCategory] = useState<ProductCategoryKey>(
    productToEdit?.category || 'Anillos'
  )
  const [price, setPrice] = useState(productToEdit?.price ? productToEdit.price.toString() : '')
  const [stock, setStock] = useState(productToEdit?.stock !== undefined ? productToEdit.stock.toString() : '1')
  const [metalPurity, setMetalPurity] = useState(productToEdit?.metalPurity || 'Plata 925')
  const [description, setDescription] = useState(productToEdit?.description || '')
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || '')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) return

    const reader = new FileReader()
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImageUrl(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemoveImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setImageUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0
    const parsedStock = parseInt(stock.replace(/[^0-9]/g, ''), 10) || 0

    onSaveProduct(
      {
        name: name.trim(),
        code: code.trim() || `PROD-${Date.now().toString().slice(-4)}`,
        category,
        price: parsedPrice,
        stock: parsedStock,
        metalPurity: metalPurity.trim(),
        weightGrams: productToEdit?.weightGrams,
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
      },
      productToEdit?.id
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Nombre de la pieza o joya *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej.: Anillo de plata 925"
            className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)]"
          />
        </div>

        {/* Code / SKU */}
        <div>
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Código / SKU
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej.: AN-925-01"
            className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
          />
        </div>

        {/* Category with shadcn/ui Select */}
        <div>
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Categoría *
          </label>
          <Select
            value={category}
            onValueChange={(val) => setCategory(val as ProductCategoryKey)}
          >
            <SelectTrigger className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] shadow-2xs cursor-pointer">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Material */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Material
          </label>
          <input
            type="text"
            value={metalPurity}
            onChange={(e) => setMetalPurity(e.target.value)}
            placeholder="Ej.: Plata 925, Oro 18k, Acero..."
            className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Precio de venta ($) *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej.: 38.95"
            className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs font-semibold text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Stock inicial *
          </label>
          <input
            type="number"
            required
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Ej.: 20"
            className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs font-semibold text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Descripción y detalles
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles sobre engarces, terminaciones, medidas o procedencia..."
            className="w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] p-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden resize-none"
          />
        </div>

        {/* Product Image Dropzone (Same upload design as in registrar pedido) */}
        <div className="sm:col-span-2 space-y-1.5 text-left group">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-emphasis)] select-none">
            <Camera className="h-3.5 w-3.5 text-[var(--neutral-muted)] transition-transform duration-200 group-hover:scale-110" />
            <span>Imagen del producto</span>
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group/dropzone flex flex-col items-center justify-center rounded-[var(--radius-dashboard-card)] border-2 border-dashed p-6 transition-all cursor-pointer select-none ${
              isDragging
                ? 'border-[var(--neutral-brand)] bg-[var(--dashboard-subtle)]'
                : 'border-[var(--dropzone-border)] bg-[var(--dropzone-bg)] hover:border-[var(--neutral-brand)] hover:bg-[var(--dashboard-subtle)]/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Upload Button */}
            <div className="flex h-10 w-44 items-center justify-center rounded-[var(--radius-dashboard-btn)] bg-[var(--dropzone-btn-bg)] text-[var(--dropzone-btn-fg)] shadow-xs transition-transform duration-200 group-hover/dropzone:scale-105">
              <Upload className="h-4 w-4 stroke-[2.2] transition-transform duration-300 group-hover/dropzone:-translate-y-1" />
            </div>

            {/* Dropzone Instructional Text */}
            <p className="mt-3 text-xs sm:text-sm font-medium text-[var(--neutral-body)] text-center">
              {imageUrl ? 'Haz clic para cambiar o arrastra una nueva imagen' : 'Haz clic para subir o arrastra aquí'}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--neutral-placeholder)] text-center">
              PNG, JPG hasta 10MB
            </p>

            {/* Previews / Thumbnail if image uploaded or present */}
            {imageUrl && (
              <div
                className="mt-4 flex flex-wrap gap-2 w-full justify-center pt-2 border-t border-[var(--dashboard-card-border)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-[var(--neutral-border)] shadow-2xs group/thumb">
                  <img
                    src={imageUrl}
                    alt="Vista previa del producto"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Eliminar imagen"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--neutral-border-subtle)]">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9.5 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex h-9.5 items-center justify-center rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-5 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          {productToEdit ? 'Guardar Cambios' : 'Registrar Producto'}
        </button>
      </div>
    </form>
  )
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onOpenChange,
  productToEdit,
  onSaveProduct,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] sm:max-w-[600px] max-h-[92vh] overflow-y-auto rounded-[var(--radius-dashboard-card)] border border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6 shadow-2xl transition-all">
        <DialogHeader className="pb-2 border-b border-[var(--neutral-border-subtle)]">
          <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)]">
            {productToEdit ? 'Editar Producto' : 'Registrar nuevo producto'}
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--neutral-muted)]">
            {productToEdit
              ? 'Modifica la imagen, precios, stock o especificaciones de la pieza seleccionada.'
              : 'Agrega una nueva pieza o joya al catálogo general del negocio.'}
          </DialogDescription>
        </DialogHeader>

        <InnerAddProductForm
          key={productToEdit?.id || 'new-product'}
          productToEdit={productToEdit}
          onSaveProduct={(data, id) => {
            onSaveProduct(data, id)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
