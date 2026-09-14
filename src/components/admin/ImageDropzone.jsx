import { CloudArrowUp, ImageSquare, X } from '@phosphor-icons/react'
import { useRef, useState } from 'react'

export default function ImageDropzone({ preview, onSelect, onRemove }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files) {
    const file = files?.[0]
    if (file && file.type.startsWith('image/')) onSelect(file)
  }

  return (
    <div>
      {preview ? (
        <div className="group relative overflow-hidden rounded-[1.25rem] border border-white/10">
          <img src={preview} alt="" className="aspect-4/3 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#181109] hover:bg-white"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/95 text-white hover:bg-red-500"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`flex aspect-4/3 w-full flex-col items-center justify-center gap-2 rounded-[1.25rem] border-2 border-dashed transition-colors ${
            dragging ? 'border-[#cda45e] bg-[#cda45e]/5' : 'border-white/15 hover:border-white/25'
          }`}
        >
          {dragging ? (
            <CloudArrowUp size={28} className="text-[#cda45e]" />
          ) : (
            <ImageSquare size={28} className="text-[#948a79]" />
          )}
          <p className="text-sm text-[#cabfab]">Drag a photo here, or click to browse</p>
          <p className="text-xs text-[#948a79]">4:3 landscape works best</p>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  )
}
