// Simple utility to force a complete data refresh after AI generation
// This ensures all sustainability data appears immediately

export async function refreshAllDataAfterAI(ideaId, loadIdeaData) {
  console.log('🔄 Starting complete data refresh after AI generation...')
  
  // Wait for database commits to complete
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Multiple reload attempts with delays
  for (let i = 0; i < 3; i++) {
    console.log(`🔄 Data refresh attempt ${i + 1}/3`)
    try {
      await loadIdeaData(ideaId)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.warn(`Refresh attempt ${i + 1} failed:`, error)
    }
  }
  
  console.log('✅ Complete data refresh finished')
}