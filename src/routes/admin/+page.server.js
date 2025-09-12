// src/routes/admin/+page.server.js (수정 후)

import { supabase } from '$lib/supabaseClient.js';

export async function load() {
    const [
        { data: orderStats, error: orderStatsError },
        { data: totalRevenueData, error: totalRevenueError }, // 변수 이름을 바꿔서 명확하게 처리
        { data: customers, error: customersError }
    ] = await Promise.all([
        supabase.from('product_order_stats').select('*'),
        supabase.from('total_revenue').select('revenue').single(),
        supabase.from('customers').select('*').order('points', { ascending: false })
    ]);

    if (orderStatsError) console.error('주문 통계 로딩 에러:', orderStatsError.message);
    if (totalRevenueError) console.error('총 매출 로딩 에러:', totalRevenueError.message);
    if (customersError) console.error('고객 정보 로딩 에러:', customersError.message);
    
    // --- ▼▼▼ 여기가 수정된 부분입니다 ▼▼▼ ---
    // 조회된 데이터를 페이지로 넘겨주기 전에, null 또는 undefined일 경우를 대비하여 기본값을 설정합니다.
    return {
        orderStats: orderStats ?? [], // null이면 빈 배열 [] 반환
        totalRevenue: totalRevenueData?.revenue ?? 0, // totalRevenueData가 null이거나 revenue 속성이 없으면 0을 반환
        customers: customers ?? [] // null이면 빈 배열 [] 반환
    };
}