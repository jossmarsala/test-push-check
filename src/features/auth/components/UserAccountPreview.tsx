import React from 'react'
import type { UserAccountPreviewData } from '../types/auth-form.types'

interface UserAccountPreviewProps {
  user: UserAccountPreviewData
  className?: string
}

export const UserAccountPreview: React.FC<UserAccountPreviewProps> = ({
  user,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex items-center gap-3.5 rounded-2xl border border-neutral-border-subtle bg-neutral-subtle px-4 py-3 shadow-2xs ${className}`}
    >
      {/* Circular Avatar Badge */}
      <div
        className="h-11 w-11 shrink-0 rounded-full bg-neutral-placeholder text-white font-medium text-sm flex items-center justify-center select-none"
        aria-hidden="true"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span>{user.initials || 'Ag'}</span>
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-col text-left overflow-hidden">
        <span className="font-semibold text-neutral-emphasis text-sm sm:text-base leading-tight truncate">
          {user.name}
        </span>
        <span className="text-xs text-neutral-muted font-normal leading-tight mt-0.5 capitalize">
          {user.role}
        </span>
      </div>
    </div>
  )
}

