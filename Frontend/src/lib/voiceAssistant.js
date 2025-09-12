// src/lib/voiceAssistant.js
import { writable, get } from 'svelte/store';

export const aiEnabled = writable(false);
export const listening = writable(false);
export const interimText = writable('');
export const finalText = writable('');
export const aiReply = writable('');

let recognition;
let voices = [];
let kioskContext = [];
let autoRestart = true;

function ensureRecognition() {
    if (typeof window === 'undefined') return;
    if (recognition) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        let interim = '';
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript.trim();
            if (event.results[i].isFinal) {
                finalStr += transcript + ' ';
            } else {
                interim += transcript + ' ';
            }
        }
        if (interim) interimText.set(interim);
        if (finalStr) {
            const trimmed = finalStr.trim();
            finalText.set(trimmed);
            interimText.set('');
            callAssistant(trimmed);
        }
    };

    recognition.onerror = (e) => {
        interimText.set(`인식 오류: ${e.error}`);
        listening.set(false);
    };

    recognition.onend = () => {
        listening.set(false);
        if (autoRestart && get(aiEnabled)) {
            startListening();
        }
    };
}

function loadVoices() {
    if (typeof window === 'undefined') return;
    voices = window.speechSynthesis?.getVoices?.() || [];
}
if (typeof window !== 'undefined') {
    window.speechSynthesis && (window.speechSynthesis.onvoiceschanged = loadVoices);
    loadVoices();
}

export function setAutoRestart(value) {
    autoRestart = !!value;
}

export function speak(text) {
    if (typeof window === 'undefined' || !text) return;
    const utter = new SpeechSynthesisUtterance(text);
    const koVoice = voices.find(v => v.lang?.startsWith('ko'));
    if (koVoice) utter.voice = koVoice;
    utter.rate = 1.2;
    utter.pitch = 1.0;
    try { window.speechSynthesis.cancel(); } catch (_) {}
    window.speechSynthesis.speak(utter);
}

export async function callAssistant(userText) {
    aiReply.set('생각 중...');
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userText, kioskContext })
        });
        const data = await res.json();
        if (data.error) {
            aiReply.set(`에러: ${data.detail || data.error}`);
            return;
        }
        const answer = data.text || '';
        aiReply.set(answer);
        kioskContext.push({ role: 'user', content: userText });
        kioskContext.push({ role: 'assistant', content: answer });
        if (kioskContext.length > 8) kioskContext = kioskContext.slice(-8);
        speak(answer);
    } catch (e) {
        aiReply.set('네트워크 에러');
    }
}

export function startListening() {
    if (typeof window === 'undefined') return;
    ensureRecognition();
    if (!recognition) return;
    if (get(listening)) return;
    try {
        try { window.speechSynthesis.cancel(); } catch (_) {}
        recognition.start();
        listening.set(true);
        interimText.set('');
    } catch (_) {
        // ignore
    }
}

export function stopListening() {
    if (!recognition) return;
    try { recognition.stop(); } catch (_) {}
    listening.set(false);
}

export function toggleAiEnabled() {
    aiEnabled.update(v => {
        const next = !v;
        if (!next) {
            stopListening();
        }
        return next;
    });
}


