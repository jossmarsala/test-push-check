export type LoginStep = 1 | 2

export interface UserAccountPreviewData {
  name: string
  role: string
  email: string
  initials: string
  avatarUrl?: string
}

export interface LoginEmailFormValues {
  email: string
}

export interface LoginPasswordFormValues {
  password: string
}

export interface LoginFlowState {
  step: LoginStep
  email: string
  userPreview: UserAccountPreviewData | null
  isLoading: boolean
  errorMessage: string | null
}

