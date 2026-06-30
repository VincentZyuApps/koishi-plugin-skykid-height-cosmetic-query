export interface HeightData {
  uuid?: string
  body_size?: unknown
  height_value?: unknown
  current_height?: unknown
  max_height?: unknown
  min_height?: unknown
  outfit?: Record<string, unknown>
}

export interface HeightResult {
  code: string
  message: string
  data: HeightData
  queriedAt: Date
  dryRun?: boolean
}

export interface PowChallenge {
  success: boolean
  salt: string
  difficulty: number
  expires: unknown
  signature: string
  algorithm?: string
  message?: string
}

export interface RenderTheme {
  bg: string
  panel: string
  card: string
  border: string
  primary: string
  accent: string
  text: string
  muted: string
}
