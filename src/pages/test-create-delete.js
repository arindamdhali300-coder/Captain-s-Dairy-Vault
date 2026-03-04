// Test create and delete functionality
import { supabase } from '../lib/supabase'

export const testCreateAndDelete = async () => {
    console.log('🧪 === CREATE & DELETE TEST ===')
    
    try {
        // 1. Create test entry
        const { data: createData, error: createError } = await supabase
            .from('diary_entries')
            .insert([{
                text: 'Test entry for delete functionality',
                mood: '🧪',
                tags: ['test'],
                category: 'Test',
                user_id: (await supabase.auth.getUser()).data.user?.id
            }])
            .select()
        
        console.log('📝 Create result:', { createData, createError })
        
        if (createError || !createData || createData.length === 0) {
            console.error('❌ Create failed:', createError)
            return { success: false, error: createError?.message || 'Create failed' }
        }
        
        const testEntry = createData[0]
        console.log('✅ Created test entry:', testEntry.id)
        
        // 2. Delete test entry
        const { error: deleteError } = await supabase
            .from('diary_entries')
            .delete()
            .eq('id', testEntry.id)
        
        console.log('🗑️ Delete result:', { deleteError })
        
        if (deleteError) {
            console.error('❌ Delete failed:', deleteError)
            return { success: false, error: deleteError.message }
        }
        
        console.log('✅ Create & Delete test successful!')
        return { success: true }
        
    } catch (error) {
        console.error('💥 Test error:', error)
        return { success: false, error: error.message }
    }
}
