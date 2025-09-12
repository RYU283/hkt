// src/lib/cartStore.js
import { writable } from 'svelte/store';

// 앱 전역에서 접근할 수 있는 장바구니 데이터 저장소
export const cart = writable([]);
export const cartTotal = writable(0);