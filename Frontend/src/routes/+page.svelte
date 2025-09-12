
<script>
	import { goto } from '$app/navigation';
	import { aiEnabled, toggleAiEnabled, finalText } from '$lib/voiceAssistant.js';
	import { parseHomeIntent } from '$lib/intentKorean.js';
	import { onMount } from 'svelte';
	import { playButtonSound } from '$lib/buttonSound.js';
	let isAiEnabled = false;
	onMount(() => {
		const stored = localStorage.getItem('aiEnabled');
		if (stored) {
			aiEnabled.set(stored === 'true');
		}
		const unsub = aiEnabled.subscribe((v) => {
			isAiEnabled = v;
			localStorage.setItem('aiEnabled', String(v));
		});
		return () => unsub();
	});
	function toggleAiFeature() { playButtonSound(); toggleAiEnabled(); }
	function handleSelection(type) { playButtonSound(); goto('/order'); }
	onMount(() => {
		const unsub = finalText.subscribe((t) => {
			if (!t || !isAiEnabled) return;
			const intent = parseHomeIntent(t);
			if (intent?.type === 'NAVIGATE_ORDER') {
				goto('/order');
				finalText.set('');
			}
		});
		return () => unsub();
	});
</script>

<div class="page-layout">
	<header class="kiosk-header">
		<img src="/knu-logo.svg" alt="경북대학교" style="height: calc(3cm + 28px); width: auto;" />
		<span style="font-size: calc(1.25rem + 5pt); color: #000000;">처음처럼 식당</span>
	</header>

	<main class="kiosk-content">
		<div class="welcome-text">
			<h1>안녕하세요!<br>무엇을 도와드릴까요?</h1>
		</div>
		<div class="button-grid">
			<button class="grid-button primary" on:click={() => handleSelection('매장 식사')}>
				<div class="button-text">
					<span class="main-text">매장 식사</span>
					<span class="sub-text">Dine in</span>
				</div>
				<div class="button-icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.98 2.33a2.49 2.49 0 0 0-2.31 0l-5.69 2.84a2.5 2.5 0 0 0-1.96 2.32V10h-2V7.5a2.5 2.5 0 0 0-2.5-2.5S3 5 3 7.5V10H1v10h2v-4h18v4h2V10h-2v-.01a2.5 2.5 0 0 0-1.02-1.99zM5 7.5c0-.28.22-.5.5-.5s.5.22.5.5V10H5V7.5zm14 2.5V10h-6v-.01l5-2.5c.34-.17.73-.17 1.07 0l-.07.01z"/></svg>
				</div>
			</button>
			<button class="grid-button primary" on:click={() => handleSelection('포장 주문')}>
				<div class="button-text">
					<span class="main-text">포장 주문</span>
					<span class="sub-text">Takeout</span>
				</div>
				<div class="button-icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/></svg>
				</div>
			</button>
			<div class="grid-button secondary ai-toggle-container" on:click={toggleAiFeature} on:keydown={(e) => e.key === 'Enter' && toggleAiFeature()} role="button" tabindex="0">
				<div class="button-text">
					<span class="main-text">AI 주문 도우미</span>
					<span class="sub-text">{#if isAiEnabled}현재 활성화됨{:else}터치하여 활성화{/if}</span>
				</div>
				<div class="toggle-switch" class:active={isAiEnabled}>
					<div class="toggle-handle"></div>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.page-layout {
		width: 100%;
		max-width: 1400px; /* 최대 너비 제한 */
		margin: 0 auto; /* 중앙 정렬 */
		padding: 4rem 4rem 2rem 4rem;
		box-sizing: border-box;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.kiosk-header {
		display: flex; align-items: center; gap: 0.75rem;
		flex-shrink: 0; font-weight: 600; font-size: 1.25rem; color: #495057;
	}
	.kiosk-content {
		flex: 1; display: flex; flex-direction: column;
		justify-content: center; /* 콘텐츠를 수직 중앙에 배치 */
	}
	.welcome-text h1 {
		font-size: 4rem; font-weight: 700; color: #212529;
		line-height: 1.3; margin-bottom: 3rem;
	}
	.button-grid {
		display: grid;
		/* 2개의 메인 버튼과 1개의 보조 버튼 레이아웃 */
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}
	.grid-button {
		border-radius: 20px;
		padding: 2rem;
		display: flex; justify-content: space-between; align-items: center;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}
	.grid-button:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}
	.grid-button.primary {
		background-color: #1c7ed6; color: white; border: none;
	}
	.grid-button.secondary {
		background-color: #ffffff; color: #343a40; border: 1px solid #e9ecef;
		grid-column: 1 / -1; /* 가로 전체를 차지 */
	}

	.button-text { display: flex; flex-direction: column; }
	.main-text { font-size: 2rem; font-weight: 700; }
	.sub-text { font-size: 1.1rem; font-weight: 400; opacity: 0.8; }
	
	.button-icon { opacity: 0.8; }
	.button-icon svg { width: 48px; height: 48px; }

	.ai-toggle-container .main-text { font-size: 1.5rem; }
	.ai-toggle-container .sub-text { font-size: 1rem; }

	.toggle-switch {
		width: 60px; height: 32px; background-color: #dee2e6;
		border-radius: 16px; position: relative;
		transition: background-color 0.2s ease-in-out;
	}
	.toggle-switch.active { background-color: #1c7ed6; }
	.toggle-handle {
		width: 26px; height: 26px; background-color: white; border-radius: 50%;
		position: absolute; top: 3px; left: 3px;
		transition: transform 0.2s ease-in-out;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
	}
	.toggle-switch.active .toggle-handle { transform: translateX(28px); }
</style>