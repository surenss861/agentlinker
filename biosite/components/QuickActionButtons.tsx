'use client'

import { useRouter } from 'next/navigation'

interface QuickActionButtonsProps {
  agentSlug: string
}

export default function QuickActionButtons({ agentSlug }: QuickActionButtonsProps) {
  const router = useRouter()

  const handleAddListing = () => {
    router.push('/dashboard/listings/new')
  }

  const handleViewPage = () => {
    window.open(`/${agentSlug}`, '_blank')
  }

  const handleEditProfile = () => {
    router.push('/dashboard/settings')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {/* Primary Button - Add New Listing */}
      <button
        onClick={handleAddListing}
        style={{
          background: 'linear-gradient(to right, #912F40, #702632)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 24px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <span style={{ color: 'white', fontSize: '20px' }}>+</span>
        <span style={{ color: 'white' }}>Add New Listing</span>
      </button>

      {/* Secondary Button - View Your Page */}
      <button
        onClick={handleViewPage}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '16px 24px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <span style={{ color: 'white', fontSize: '20px' }}>👁️</span>
        <span style={{ color: 'white' }}>View Your Page</span>
      </button>

      {/* Secondary Button - Edit Profile */}
      <button
        onClick={handleEditProfile}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '16px 24px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <span style={{ color: 'white', fontSize: '20px' }}>👤</span>
        <span style={{ color: 'white' }}>Edit Profile</span>
      </button>
    </div>
  )
}
