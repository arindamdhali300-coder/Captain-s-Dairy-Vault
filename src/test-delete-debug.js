// Debug delete function to test Supabase connection and permissions
import { supabase } from './lib/supabase'

export const testDeleteConnection = async () => {
    console.log('🧪 === DELETE CONNECTION TEST ===')
    
    try {
        // 1. Test basic connection
        const { data: testData, error: testError } = await supabase
            .from('diary_entries')
            .select('id, user_id')
            .limit(1)
        
        console.log('📊 Connection test:', { testData, testError })
        
        if (testError) {
            console.error('❌ Connection failed:', testError)
            return { success: false, error: testError.message }
        }
        
        if (!testData || testData.length === 0) {
            console.log('ℹ️ No entries found to test with')
            return { success: true, message: 'No entries to test' }
        }
        
        const testEntry = testData[0]
        console.log('🎯 Found test entry:', testEntry)
        
        // 2. Test delete permission
        const { error: deleteError } = await supabase
            .from('diary_entries')
            .delete()
            .eq('id', testEntry.id)
        
        console.log('🗑️ Delete test result:', { deleteError })
        
        if (deleteError) {
            console.error('❌ Delete permission failed:', deleteError)
            return { success: false, error: deleteError.message }
        }
        
        console.log('✅ Delete test successful!')
        return { success: true }
        
    } catch (error) {
        console.error('💥 Test error:', error)
        return { success: false, error: error.message }
    }
}

// Auto-run test
testDeleteConnection()
