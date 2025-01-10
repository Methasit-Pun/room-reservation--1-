export function log(message: string, data?: any) {
  console.log(`[${new Date().toISOString()}] ${message}`, data ? JSON.stringify(data) : '')
}

export function error(message: string, error: any) {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error)
}

