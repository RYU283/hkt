

import { supabase } from '$lib/supabaseClient.js';

export async function load() {
    const [
        { data: orderStats, error: orderStatsError },
        { data: totalRevenueData, error: totalRevenueError },
        { data: customers, error: customersError }
    ] = await Promise.all([
        supabase.from('product_order_stats').select('*'),
        supabase.from('total_revenue').select('revenue').single(),
        supabase.from('customers').select('*').order('points', { ascending: false })
    ]);

    if (orderStatsError) console.error('주문 통계 로딩 에러:', orderStatsError.message);
    if (totalRevenueError) console.error('총 매출 로딩 에러:', totalRevenueError.message);
    if (customersError) console.error('고객 정보 로딩 에러:', customersError.message);
    
    return {
        orderStats: orderStats ?? [], // null이면 빈 배열 [] 반환
        totalRevenue: totalRevenueData?.revenue ?? 0, // totalRevenueData가 null이거나 revenue 속성이 없으면 0을 반환
        customers: customers ?? [] // null이면 빈 배열 [] 반환
    };
}