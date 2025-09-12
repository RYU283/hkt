<!-- src/routes/payment/+page.svelte (기능 통합 최종본) -->

<script>
    import { goto } from '$app/navigation';
    import { cart, cartTotal } from '$lib/cartStore.js';
    import { supabase } from '$lib/supabaseClient.js';
    
    // --- 추가된 기능 임포트 ---
    // 음성 인식 관련 기능 (결제 페이지에서는 중지시키기 위함)
    import { aiEnabled, stopListening } from '$lib/voiceAssistant.js'; 
    // 버튼 클릭 효과음 재생 함수
    import { playButtonSound } from '$lib/buttonSound.js';

    // $: 는 Svelte의 반응성 선언문입니다.
    // 이 페이지에 들어오면 aiEnabled 스토어 값을 false로 설정하고 음성인식을 중지시킵니다.
    // `typeof window !== 'undefined'`는 코드가 브라우저 환경에서만 실행되도록 보장합니다.
    $: if (typeof window !== 'undefined') { 
        aiEnabled.set(false); 
        stopListening(); 
    }

    // --- 상태 변수 ---
    let paymentStep = 'selection';
    let phoneNumber = '';
    let pointsApplied = false;
    let orderNumber = 0;

    // --- 기능 함수 (효과음 추가) ---
    function handleKeypadInput(num) { 
        playButtonSound(); 
        if (phoneNumber.length < 13) { phoneNumber += num; if (phoneNumber.length === 3 || phoneNumber.length === 8) { phoneNumber += '-'; } } 
    }
    function clearPhoneNumber() { 
        playButtonSound(); 
        phoneNumber = phoneNumber.slice(0, -1); 
    }
    function confirmPoints() { 
        playButtonSound(); 
        if (phoneNumber.length < 12) { alert('올바른 전화번호를 입력해주세요.'); return; } 
        pointsApplied = true; 
        paymentStep = 'selection'; 
    }
    
    async function handlePayment(method) {
        playButtonSound(); // 효과음 추가
        paymentStep = 'processing';
        
        setTimeout(async () => {
            const isSuccess = Math.random() > 0.1;
            if (isSuccess) {
                try {
                    await saveOrderAndPoints(); // DB 저장 함수 호출
                    paymentStep = 'success';
                    orderNumber = Math.floor(Math.random() * 900) + 100;
                    setTimeout(() => { goto('/'); }, 5000);
                } catch (error) {
                    console.error("DB 저장 실패:", error);
                    alert(`결제는 성공했으나 주문 처리 중 오류가 발생했습니다. 직원을 호출해주세요.\n(에러: ${error.message})`);
                    paymentStep = 'failure';
                }
            } else {
                paymentStep = 'failure';
            }
        }, 3000);
    }
    
    // DB 저장 함수 (기존 코드와 동일)
    async function saveOrderAndPoints() {
        if (pointsApplied && phoneNumber) {
            const pointsToAdd = $cartTotal * 0.01;
            const { error: pointsError } = await supabase.rpc('upsert_customer_points', {
                p_phone_number: phoneNumber,
                p_points_to_add: pointsToAdd
            });
            if (pointsError) throw pointsError;
        }

        const { data: orderData, error: orderError } = await supabase.from('orders').insert({ total_amount: $cartTotal, customer_phone: phoneNumber || null }).select().single();
        if (orderError) throw orderError;
        
        const newOrderId = orderData.id;
        const orderItems = $cart.map(item => ({ order_id: newOrderId, product_name: item.name, quantity: item.quantity, price_per_item: item.price }));
        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;
    }

    function retryPayment() { 
        playButtonSound(); // 효과음 추가
        paymentStep = 'selection'; 
        pointsApplied = false; 
    }
</script>

<!-- (HTML 부분은 기존 코드에서 on:click 부분에 효과음 함수를 추가하는 것 외에 큰 변화는 없습니다) -->
<div class="page-layout">
	<div class="payment-card">
		{#if paymentStep === 'selection'}
			<h1 class="title">주문 확인 및 결제</h1>
			<div class="order-summary">
				<div class="summary-header"><span>주문 메뉴</span><span>수량</span></div>
				<div class="summary-items">{#each $cart as item}<div class="summary-item"><span>{item.name}</span><span>{item.quantity}</span></div>{/each}</div>
				<div class="summary-total"><span>총 결제금액</span><span class="total-price">{$cartTotal.toLocaleString()}원</span></div>
			</div>

			{#if pointsApplied}<div class="points-applied-message"><span>✔</span> {phoneNumber} 님, 포인트가 적립됩니다.</div>{/if}

			<div class="main-actions">
				{#if !pointsApplied}
					<button class="action-btn secondary-btn" on:click={() => { playButtonSound(); paymentStep = 'earningPoints'; }}>포인트 적립</button>
				{/if}
				<button class="action-btn primary-btn" on:click={() => handlePayment('카드')}>💳 신용/체크카드 결제</button>
				<button class="action-btn qr-btn" on:click={() => handlePayment('QR')}>📷 QR/바코드 결제</button>
			</div>

		{:else if paymentStep === 'earningPoints'}
			<h1 class="title">포인트 적립</h1>
			<p class="subtitle">휴대폰 번호를 입력해주세요.</p>
			<div class="phone-display">{phoneNumber || '010-XXXX-XXXX'}</div>
			<div class="keypad">
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '확인'] as key}
					{#if key === '확인'}<button class="keypad-btn confirm-btn" on:click={confirmPoints}>{key}</button>
					{:else if key === '←'}<button class="keypad-btn" on:click={clearPhoneNumber}>{key}</button>
					{:else}<button class="keypad-btn" on:click={() => handleKeypadInput(key)}>{key}</button>{/if}
				{/each}
			</div>
			<button class="cancel-btn" on:click={() => { playButtonSound(); paymentStep = 'selection'; }}>적립하지 않고 결제하기</button>

		{:else}
			<div class="status-screen">
				{#if paymentStep === 'processing'}<div class="spinner"></div><h2 class="status-title">결제를 진행중입니다</h2><p class="status-message">카드를 아래 투입구에 끝까지 넣어주세요.</p>
				{:else if paymentStep === 'success'}<div class="icon success-icon">✔</div><h2 class="status-title success-title">결제가 완료되었습니다!</h2>{#if pointsApplied}<p class="status-message points-applied-final">포인트가 정상적으로 적립되었습니다.</p>{/if}<div class="order-number-box"><p>주문번호</p><strong class="order-number">{orderNumber}</strong></div><p class="status-message small">잠시 후 처음 화면으로 돌아갑니다.</p>
				{:else if paymentStep === 'failure'}<div class="icon failure-icon">✖</div><h2 class="status-title failure-title">결제에 실패했습니다</h2><p class="status-message">카드 정보를 확인해주세요.</p><div class="failure-actions"><button class="action-btn secondary-btn" on:click={retryPayment}>다시 시도</button></div>{/if}
			</div>
		{/if}
	</div>
</div>

<!-- (Style 부분은 기존 코드와 동일합니다) -->
<style>
	.page-layout { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; padding: 2.5rem; box-sizing: border-box; }
	.payment-card { width: 100%; max-width: 600px; height: 100%; max-height: 800px; background: #ffffff; border-radius: 24px; display: flex; flex-direction: column; padding: 2.5rem; box-sizing: border-box; }
	.title { flex-shrink: 0; font-size: 2rem; text-align: center; margin: 0 0 1.5rem 0; color: #343a40; font-weight: 600; }
	.subtitle { flex-shrink: 0; font-size: 1.2rem; color: #868e96; text-align: center; margin: -1rem 0 1.5rem 0; }
	.order-summary { flex-shrink: 0; border: 1px solid #e9ecef; border-radius: 16px; margin-bottom: 1.5rem; display: flex; flex-direction: column; max-height: 45%; }
	.summary-header { flex-shrink: 0; display: flex; justify-content: space-between; padding: 0.8rem 1.2rem; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; font-weight: 500; font-size: 0.9rem; color: #868e96; }
	.summary-items { flex-grow: 1; overflow-y: auto; padding: 0.5rem 1.2rem; }
	.summary-item { display: flex; justify-content: space-between; padding: 0.8rem 0; font-size: 1rem; }
	.summary-total { flex-shrink: 0; display: flex; justify-content: space-between; align-items: baseline; padding: 1rem 1.2rem; border-top: 1px solid #e9ecef; font-size: 1.1rem; font-weight: 600; }
	.total-price { color: #d9480f; font-size: 1.6rem; font-weight: 700; }
	.points-applied-message { flex-shrink: 0; text-align: center; padding: 1rem; background-color: #e6fcf5; color: #087f5b; border-radius: 12px; font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; }
	.main-actions { flex-shrink: 0; display: flex; flex-direction: column; gap: 1rem; margin-top: auto; }
	.action-btn { padding: 1.2rem; font-size: 1.2rem; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; }
	.primary-btn { background-color: #1c7ed6; color: white; }
	.secondary-btn { background-color: #f1f3f5; color: #495057; }
	.qr-btn { background-color: #f1f3f5; color: #495057; }
	.phone-display { flex-shrink: 0; font-size: 2rem; text-align: center; background-color: #f8f9fa; padding: 1.2rem; border-radius: 12px; margin-bottom: 1.5rem; letter-spacing: 2px; color: #495057; }
	.keypad { flex-grow: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
	.keypad-btn { height: 100%; font-size: 1.8rem; font-weight: 500; border-radius: 12px; border: 1px solid #dee2e6; background-color: #f8f9fa; cursor: pointer; }
	.confirm-btn { grid-column: 3; grid-row: 4; background-color: #28a745; color: white; border: none;}
	.cancel-btn { flex-shrink: 0; margin-top: 1.5rem; background: none; border: none; font-size: 1rem; color: #868e96; cursor: pointer; text-align: center; }
	.status-screen { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
	.status-title { font-size: 2.2rem; margin: 2rem 0 1rem 0; }
	.status-message { font-size: 1.2rem; color: #495057; line-height: 1.6; }
	.status-message.small { font-size: 1rem; color: #adb5bd; margin-top: 2rem; }
	.points-applied-final { font-size: 1.1rem; color: #087f5b; background-color: #e6fcf5; padding: 0.5rem 1rem; border-radius: 8px; margin-top: -0.5rem; margin-bottom: 2rem; }
	.spinner { width: 60px; height: 60px; border: 6px solid #f1f3f5; border-top-color: #1c7ed6; border-radius: 50%; animation: spin 1s linear infinite; }
	@keyframes spin { to { transform: rotate(360deg); } }
	.icon { font-size: 4rem; width: 80px; height: 80px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; }
	.success-icon { background-color: #28a745; }
	.success-title { color: #28a745; }
	.failure-icon { background-color: #dc3545; padding-bottom: 8px;}
	.failure-title { color: #dc3545; }
	.order-number-box { margin-top: 2rem; background: #f8f9fa; padding: 1rem 2rem; border-radius: 16px; }
	.order-number-box p { margin: 0; font-size: 1.1rem; color: #868e96; }
	.order-number { font-size: 3rem; color: #1c7ed6; font-weight: 700; }
	.failure-actions { margin-top: 2rem; }
</style>