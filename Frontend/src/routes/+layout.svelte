
<script>
	import { goto } from '$app/navigation';
	import { aiEnabled, listening, interimText, finalText, aiReply, startListening, stopListening, setAutoRestart } from '$lib/voiceAssistant.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { playButtonSound, setButtonSoundEnabled, getButtonSoundEnabled } from '$lib/buttonSound.js';
	function goToHome() { playButtonSound(); goto('/'); }
	function goBack() { playButtonSound(); history.back(); }
	function openCallPopup() { playButtonSound(); showCallPopup = true; }
	function closeCallPopup() { playButtonSound(); showCallPopup = false; }
	let isPaymentRoute = false;
	let isOrderRoute = false;
	let isHomeRoute = false;
	let enabled = false;
	let isListening = false;
	let autoRestart = true;
	let showCallPopup = false;
	onMount(() => {
		enabled = false;
		const unsub1 = aiEnabled.subscribe(v => enabled = v);
		const unsub2 = listening.subscribe(v => isListening = v);
		
		// 전역 버튼 클릭 이벤트 리스너 설정
		setupGlobalButtonSound();
		
		return () => { unsub1(); unsub2(); };
	});
	
	function setupGlobalButtonSound() {
		document.addEventListener('click', (event) => {
			const target = event.target;
			if (target && typeof target === 'object' && 'closest' in target) {
				const button = target.closest('button');
				if (button) {
					playButtonSound();
				}
			}
		});
		
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				const target = event.target;
				if (target && typeof target === 'object' && 'closest' in target) {
					const button = target.closest('button');
					if (button && document.activeElement === button) {
						playButtonSound();
					}
				}
			}
		});
	}
	$: {
		const path = $page.url?.pathname || '';
		isPaymentRoute = path.startsWith('/payment');
		isOrderRoute = path.startsWith('/order');
		isHomeRoute = path === '/';
	}
	function toggleListening() { playButtonSound(); if (isListening) { stopListening(); } else { startListening(); } }
	function toggleAutoRestart() { playButtonSound(); autoRestart = !autoRestart; setAutoRestart(autoRestart); }
</script>

<div class="page-wrapper">
	<div class="content-area">
		<slot />

		{#if enabled && (isHomeRoute || isOrderRoute)}
			<div class="voice-floating {isHomeRoute ? 'pos-topright' : ''} {isOrderRoute ? 'pos-bottomcenter' : ''}">
				<div class="row">
					<button class="mic-btn" on:click={toggleListening}>{isListening ? '말하기 중지' : '말하기 시작'}</button>
					<label class="auto-label"><input type="checkbox" checked={autoRestart} on:change={toggleAutoRestart}/> 자동 재청취</label>
				</div>
				<div class="box">
					<div class="box-title">실시간 인식</div>
					<div class="interim">{$interimText || '...'}</div>
				</div>
				<div class="box">
					<div class="box-title">최종 문장</div>
					<div class="final">{$finalText || '...'}</div>
				</div>
				<div class="box">
					<div class="box-title">AI 응답</div>
					<div class="ai">{$aiReply || '...'}</div>
				</div>
			</div>
		{/if}
	</div>

	<footer class="kiosk-footer">
		<button class="nav-item" on:click={goToHome}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
			<span>처음으로</span>
		</button>
		<button class="nav-item" on:click={openCallPopup}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 13-6-6-6 6"/><path d="m18 7-6-6-6 6"/></svg>
			<span>직원호출</span>
		</button>
		<button class="nav-item" on:click={goBack}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
			<span>뒤로가기</span>
		</button>
	</footer>

	{#if showCallPopup}
		<div class="call-overlay" on:click={closeCallPopup}>
			<div class="call-modal" on:click|stopPropagation>
				<div class="call-title">알림</div>
				<div class="call-message">조금만 기다리시면 직원이 도착합니다</div>
				<button class="call-close" on:click={closeCallPopup}>닫기</button>
			</div>
		</div>
		<style>
			.call-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 1100; }
			.call-modal { width: 320px; max-width: 90vw; background: #fff; border: 1px solid #e9ecef; border-radius: 14px; box-shadow: 0 10px 28px rgba(0,0,0,0.12); padding: 18px; display: flex; flex-direction: column; gap: 12px; }
			.call-title { font-weight: 700; font-size: 1.1rem; color: #212529; }
			.call-message { color: #495057; line-height: 1.5; }
			.call-close { align-self: flex-end; padding: 8px 12px; border: none; border-radius: 10px; background: #1c7ed6; color: #fff; font-weight: 700; cursor: pointer; }
			.call-close:hover { background: #1971c2; }
		</style>
	{/if}

	{#if enabled && !isPaymentRoute}
		<!-- Floating panel styles -->
		<style>
			.voice-floating { position: fixed; width: 300px; max-height: calc(100vh - 160px); overflow: auto; background: #ffffffcc; backdrop-filter: saturate(1.1) blur(3px); border: 1px solid #e9ecef; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); padding: 10px; display: flex; flex-direction: column; gap: 8px; z-index: 1000; }
			.voice-floating.pos-topright { right: 24px; top: 24px; }
			.voice-floating.pos-bottomcenter { left: 50%; transform: translateX(-50%); bottom: 92px; }
			.voice-floating .row { display: flex; align-items: center; gap: 8px; }
			.voice-floating .mic-btn { flex: 1; padding: 8px 10px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; background: #1c7ed6; color: white; font-size: 0.9rem; }
			.voice-floating .auto-label { font-size: 12px; color: #495057; }
			.voice-floating .box { border: 1px solid #f1f3f5; border-radius: 10px; padding: 8px; background: #ffffff; }
			.voice-floating .box-title { font-size: 11px; color: #868e96; margin-bottom: 4px; letter-spacing: .2px; }
			.voice-floating .interim { color: #868e96; min-height: 16px; line-height: 1.4; font-size: 0.9rem; }
			.voice-floating .final { color: #212529; font-weight: 600; min-height: 16px; line-height: 1.4; font-size: 0.95rem; }
			.voice-floating .ai { color: #343a40; min-height: 16px; line-height: 1.4; font-size: 0.95rem; }
		</style>
	{/if}
</div>

<style>
	:global(body, html) {
		margin: 0; padding: 0; height: 100vh;
		overflow: hidden; 
		font-family: 'Pretendard', -apple-system, sans-serif;
		background-color: #f8f9fa; 
	}

	.page-wrapper {
		display: flex; flex-direction: column; height: 100%;
	}
	.content-area {
		flex: 1; 

		overflow-y: auto; 
		position: relative;
	}
	.kiosk-footer {
		flex-shrink: 0;
		display: flex; justify-content: space-around; align-items: center; 
		background-color: #ffffff; 
		border-top: 1px solid #e9ecef; 
		padding: 0.5rem 0; 
	}
	.nav-item { 
		background: none; border: none; cursor: pointer; 
		display: flex; flex-direction: column; align-items: center; 
		gap: 0.2rem; 
		color: #868e96; 
		font-size: 0.75rem; 
		padding: 0.25rem; 
		transition: color 0.15s; 
	}
	.nav-item:hover { color: #212529; }
	.nav-item svg { 
		width: 24px; height: 24px; 
	}
</style>