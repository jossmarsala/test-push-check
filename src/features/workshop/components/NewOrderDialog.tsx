import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  User,
  Contact,
  Tag,
  PenLine,
  Camera,
  Upload,
  CheckSquare,
  Square,
  Trash2,
} from 'lucide-react'
import type { RegistrarPedidoFormData, PedidoTrabajo, MetodoPago } from '../types/workshop.types'

interface NewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: RegistrarPedidoFormData) => void
}

const formatDateToDisplay = (isoStr: string): string => {
  if (!isoStr) return ''
  const parts = isoStr.split('-')
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return isoStr
}

export const NewOrderDialog: React.FC<NewOrderDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [clienteNombre, setClienteNombre] = useState('')
  const [orfebreNombre, setOrfebreNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [tiposTrabajo, setTiposTrabajo] = useState<PedidoTrabajo[]>(['Reparación'])
  const [notas, setNotas] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [pagoTotal, setPagoTotal] = useState('')
  const [señaAdelanto, setSeñaAdelanto] = useState('')
  const [metodoSena, setMetodoSena] = useState<MetodoPago>('Transferencia')

  // Images state & dropzone
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTipoTrabajo = (tipo: PedidoTrabajo) => {
    setTiposTrabajo((prev) =>
      prev.includes(tipo)
        ? prev.filter((t) => t !== tipo)
        : [...prev, tipo]
    )
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    )

    setImages((prev) => [...prev, ...validFiles])
    const newPreviews = validFiles.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clienteNombre.trim()) return

    onSubmit({
      clienteNombre: clienteNombre.trim(),
      orfebreNombre: orfebreNombre.trim(),
      contacto: contacto.trim(),
      tiposTrabajo,
      notas: notas.trim(),
      imagenes: images,
      imagePreviews,
      fechaInicio: formatDateToDisplay(fechaInicio.trim()),
      fechaEntrega: formatDateToDisplay(fechaEntrega.trim()),
      pagoTotal: pagoTotal.trim(),
      señaAdelanto: señaAdelanto.trim(),
      metodoSena,
    })

    // Reset Form
    setClienteNombre('')
    setOrfebreNombre('')
    setContacto('')
    setTiposTrabajo(['Reparación'])
    setNotas('')
    setImages([])
    setImagePreviews([])
    setFechaInicio('')
    setFechaEntrega('')
    setPagoTotal('')
    setSeñaAdelanto('')
    setMetodoSena('Transferencia')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] sm:max-w-[620px] max-h-[92vh] overflow-y-auto rounded-[var(--radius-dashboard-card)] border border-[var(--dashboard-card-border)] bg-[var(--dashboard-card-bg)] p-6 sm:p-8 shadow-2xl transition-all">
        {/* Header with Title */}
        <DialogHeader className="pb-2 border-b border-[var(--dashboard-card-border)] pr-8">
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--neutral-emphasis)] select-none">
            Registrar nuevo pedido
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para registrar un nuevo pedido de joyería con cliente, orfebre y pagos.
          </DialogDescription>
        </DialogHeader>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Row 1: Nombre del cliente & Orfebre a cargo (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre y apellido del cliente */}
            <div className="space-y-1.5 text-left group">
              <label
                htmlFor="cliente-nombre-input"
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-body)] select-none"
              >
                <User className="h-3.5 w-3.5 text-[var(--neutral-muted)] transition-transform duration-200 group-focus-within:scale-110 group-focus-within:text-[var(--neutral-brand)]" />
                <span>Nombre y apellido del cliente</span>
              </label>
              <input
                id="cliente-nombre-input"
                type="text"
                required
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder="Ej.: María Pérez"
                className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] shadow-2xs transition-all focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)]"
              />
            </div>

            {/* Nombre y apellido del orfebre a cargo */}
            <div className="space-y-1.5 text-left group">
              <label
                htmlFor="orfebre-nombre-input"
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-body)] select-none"
              >
                <User className="h-3.5 w-3.5 text-[var(--neutral-muted)] transition-transform duration-200 group-focus-within:scale-110 group-focus-within:text-[var(--neutral-brand)]" />
                <span>Nombre y apellido del orfebre a cargo</span>
              </label>
              <input
                id="orfebre-nombre-input"
                type="text"
                value={orfebreNombre}
                onChange={(e) => setOrfebreNombre(e.target.value)}
                placeholder="Ej.: Pablo Pérez"
                className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] shadow-2xs transition-all focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)]"
              />
            </div>
          </div>

          {/* Row 2: Contacto del cliente (Full Width) */}
          <div className="space-y-1.5 text-left group">
            <label
              htmlFor="contacto-input"
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-body)] select-none"
            >
              <Contact className="h-3.5 w-3.5 text-[var(--neutral-muted)] transition-transform duration-200 group-focus-within:scale-110 group-focus-within:text-[var(--neutral-brand)]" />
              <span>Contacto del cliente (teléfono o correo)</span>
            </label>
            <input
              id="contacto-input"
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              placeholder="Ej.: 11 2345 6789 o correo@ejemplo.com"
              className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] shadow-2xs transition-all focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)]"
            />
          </div>

          {/* Row 3: Tipo de trabajo (Checkboxes / Selectable Options) */}
          <div className="space-y-1.5 text-left group">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-body)] select-none">
              <Tag className="h-3.5 w-3.5 text-[var(--neutral-muted)] transition-transform duration-200 group-hover:rotate-12" />
              <span>Tipo de trabajo</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Reparación', 'Confección', 'Otro'] as const).map((tipo) => {
                const isSelected = tiposTrabajo.includes(tipo)

                return (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => toggleTipoTrabajo(tipo)}
                    className={`flex h-11 items-center gap-2.5 rounded-[var(--radius-dashboard-input)] border px-3 text-sm font-medium transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-[var(--neutral-brand)] bg-[var(--dashboard-subtle)] text-[var(--neutral-emphasis)] shadow-2xs'
                        : 'border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] text-[var(--neutral-body)] hover:bg-[var(--dashboard-subtle)]'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4 shrink-0 text-[var(--neutral-brand)] transition-transform duration-200 scale-105" />
                    ) : (
                      <Square className="h-4 w-4 shrink-0 text-[var(--neutral-placeholder)] transition-transform duration-200" />
                    )}
                    <span className="truncate">{tipo}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Row 4: Notas sobre las piezas (Textarea) */}
          <div className="space-y-1.5 text-left group">
            <label
              htmlFor="notas-input"
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-body)] select-none"
            >
              <PenLine className="h-3.5 w-3.5 text-[var(--neutral-muted)] transition-transform duration-200 group-focus-within:rotate-6 group-focus-within:text-[var(--neutral-brand)]" />
              <span>Notas sobre las piezas</span>
            </label>
            <textarea
              id="notas-input"
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej.: descripción, medidas, materiales, observaciones..."
              className="w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] p-3.5 text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] shadow-2xs transition-all resize-none focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)]"
            />
          </div>

          {/* Row 5: Subir imágenes de las piezas (Interactive Dropzone) */}
          <div className="space-y-1.5 text-left group">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-body)] select-none">
              <Camera className="h-3.5 w-3.5 text-[var(--neutral-muted)] transition-transform duration-200 group-hover:scale-110" />
              <span>Subir imágenes de las piezas</span>
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
                multiple
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
                Haz clic para subir o arrastra aquí
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--neutral-placeholder)] text-center">
                PNG, JPG hasta 10MB
              </p>

              {/* Previews Grid if files uploaded */}
              {imagePreviews.length > 0 && (
                <div
                  className="mt-4 flex flex-wrap gap-2 w-full justify-center pt-2 border-t border-[var(--dashboard-card-border)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {imagePreviews.map((preview, idx) => (
                    <div
                      key={preview}
                      className="relative h-14 w-14 rounded-lg overflow-hidden border border-[var(--neutral-border)] shadow-2xs group/thumb"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                        aria-label="Eliminar imagen"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 6: Fechas (Fecha inicio & Fecha entrega) (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fecha inicio */}
            <div className="space-y-1.5 text-left group">
              <label
                htmlFor="fecha-inicio-input"
                className="text-xs font-medium text-[var(--neutral-body)] block select-none"
              >
                Fecha inicio
              </label>
              <div className="relative">
                <input
                  id="fecha-inicio-input"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker?.()
                    } catch {
                      // Fallback
                    }
                  }}
                  className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm text-[var(--neutral-emphasis)] shadow-2xs transition-all focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)] cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Fecha entrega */}
            <div className="space-y-1.5 text-left group">
              <label
                htmlFor="fecha-entrega-input"
                className="text-xs font-medium text-[var(--neutral-body)] block select-none"
              >
                Fecha entrega
              </label>
              <div className="relative">
                <input
                  id="fecha-entrega-input"
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker?.()
                    } catch {
                      // Fallback
                    }
                  }}
                  className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm text-[var(--neutral-emphasis)] shadow-2xs transition-all focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)] cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Row 7: Pagos (Pago Total & Seña / Adelanto) (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pago Total ($) */}
            <div className="space-y-1.5 text-left group">
              <label
                htmlFor="pago-total-input"
                className="text-xs font-medium text-[var(--neutral-body)] block select-none"
              >
                Pago Total ($)
              </label>
              <input
                id="pago-total-input"
                type="text"
                value={pagoTotal}
                onChange={(e) => setPagoTotal(e.target.value)}
                placeholder="Ej.: 10.000"
                className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] shadow-2xs transition-all focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)]"
              />
            </div>

            {/* Seña / Adelanto ($) */}
            <div className="space-y-1.5 text-left group">
              <label
                htmlFor="sena-adelanto-input"
                className="text-xs font-medium text-[var(--neutral-body)] block select-none"
              >
                Seña / Adelanto ($)
              </label>
              <input
                id="sena-adelanto-input"
                type="text"
                value={señaAdelanto}
                onChange={(e) => setSeñaAdelanto(e.target.value)}
                placeholder="Ej.: 3.000"
                className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] shadow-2xs transition-all focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)]"
              />
            </div>
          </div>

          {/* Medio de pago de la seña (si se ingresa una seña) */}
          {parseFloat(señaAdelanto.replace(/[^0-9.]/g, '')) > 0 && (
            <div className="space-y-1.5 text-left animate-fade-in">
              <label className="text-xs font-medium text-[var(--neutral-body)] block select-none">
                Medio de pago de la seña
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Transferencia', 'Efectivo', 'Mercado Pago', 'Tarjeta'] as MetodoPago[]).map((metodo) => (
                  <button
                    key={metodo}
                    type="button"
                    onClick={() => setMetodoSena(metodo)}
                    className={`h-9 px-2 text-xs font-medium rounded-[var(--radius-dashboard-input)] border transition-all cursor-pointer ${
                      metodoSena === metodo
                        ? 'border-[var(--neutral-brand)] bg-[var(--dashboard-subtle)] text-[var(--neutral-emphasis)] font-semibold shadow-2xs ring-1 ring-[var(--neutral-brand)]'
                        : 'border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] text-[var(--neutral-body)] hover:bg-[var(--dashboard-subtle)]'
                    }`}
                  >
                    {metodo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions: Cancelar & Registrar Pedido */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--dashboard-card-border)]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-11 px-5 text-sm font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--dashboard-subtle)] rounded-[var(--radius-dashboard-btn)] transition-colors cursor-pointer select-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 rounded-[var(--radius-dashboard-btn)] bg-[var(--neutral-brand)] px-6 text-sm font-medium text-white shadow-xs hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]"
            >
              Registrar Pedido
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
