// 버튼 클릭 효과음 관리
class ButtonSoundManager {
	constructor() {
		this.audioContext = null;
		this.isEnabled = true;
		this.initAudioContext();
	}

	// 오디오 컨텍스트 초기화
	initAudioContext() {
		try {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		} catch (e) {
			console.warn('Web Audio API를 지원하지 않는 브라우저입니다.');
		}
	}

	// 터치 효과음 생성 (Web Audio API 사용)
	playTouchSound() {
		if (!this.isEnabled || !this.audioContext) return;

		try {
			// 오디오 컨텍스트가 suspended 상태라면 resume
			if (this.audioContext.state === 'suspended') {
				this.audioContext.resume();
			}

			// 짧은 터치 효과음 생성
			const oscillator = this.audioContext.createOscillator();
			const gainNode = this.audioContext.createGain();

			// 오실레이터 설정
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // 800Hz 주파수
			oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1); // 0.1초에 걸쳐 400Hz로 감소

			// 게인 설정 (볼륨 조절)
			gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
			gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01); // 빠르게 볼륨 증가
			gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1); // 0.1초에 걸쳐 볼륨 감소

			// 연결
			oscillator.connect(gainNode);
			gainNode.connect(this.audioContext.destination);

			// 재생
			oscillator.start(this.audioContext.currentTime);
			oscillator.stop(this.audioContext.currentTime + 0.1); // 0.1초 후 정지

		} catch (error) {
			console.warn('효과음 재생 중 오류가 발생했습니다:', error);
		}
	}

	// 효과음 활성화/비활성화
	setEnabled(enabled) {
		this.isEnabled = enabled;
	}

	// 효과음 상태 반환
	getEnabled() {
		return this.isEnabled;
	}
}

// 전역 인스턴스 생성
export const buttonSoundManager = new ButtonSoundManager();

// 전역 함수로 내보내기
export function playButtonSound() {
	buttonSoundManager.playTouchSound();
}

export function setButtonSoundEnabled(enabled) {
	buttonSoundManager.setEnabled(enabled);
}

export function getButtonSoundEnabled() {
	return buttonSoundManager.getEnabled();
}
