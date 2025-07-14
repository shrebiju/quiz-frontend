// src/layout/PublicLayout.jsx
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Keep subtle gray bg */}
      <div className="container mx-auto p-4">
        <Outlet /> {/* Clean layout without debug borders */}
      </div>
    </div>
  )
}