// Sleep function
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const calculateDuration = (entryTime: string) => {
  const entry = new Date(entryTime as string)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - entry.getTime()) / 60000)
  return diffInMinutes
} 