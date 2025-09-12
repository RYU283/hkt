// src/lib/intentKorean.js
// Simple rule-based Korean intent parser for kiosk actions

export function normalize(text) {
    return (text || '').trim().toLowerCase().replace(/\s+/g, '');
}

export function parseHomeIntent(text) {
    const t = text.trim();
    if (!t) return null;
    const noSpace = normalize(t);
    // dine-in
    if (noSpace.includes('매장식사') || noSpace.includes('매장') || noSpace.includes('먹고갈') || /매장.*(이용|할게|할께)/.test(noSpace)) {
        return { type: 'NAVIGATE_ORDER', mode: 'dine-in' };
    }
    // takeout
    if (noSpace.includes('포장') || noSpace.includes('테이크아웃') || /가져가/.test(noSpace)) {
        return { type: 'NAVIGATE_ORDER', mode: 'takeout' };
    }
    return null;
}

// Build name lookup map from menuItems
export function buildMenuIndex(menuItems) {
    const index = new Map();
    for (const item of menuItems) {
        const key = item.name.replace(/\s+/g, '').toLowerCase();
        index.set(key, item);
    }
    return index;
}

// Parse phrases like "비빔밥 두 개", "김치찌개 하나", "라면 3개 추가", "비빔밥 빼줘"
export function parseOrderIntent(text, menuIndex) {
    const original = (text || '').trim();
    if (!original) return null;
    const t = original.toLowerCase();
    const noSpace = t.replace(/\s+/g, '');

    // payment
    if (noSpace.includes('결제') || /계산(해|할게|할께)/.test(noSpace) || noSpace.includes('주세요결제')) {
        return { type: 'GO_PAYMENT' };
    }

    // clear cart
    if (noSpace.includes('전체취소') || noSpace.includes('전부취소') || /다지워|다삭제|다빼/.test(noSpace)) {
        return { type: 'CLEAR_CART' };
    }

    // remove one item: "비빔밥 빼줘", "비빔밥 하나 빼"
    for (const [key, item] of menuIndex.entries()) {
        if (noSpace.includes(key)) {
            // Quantity detection
            const qty = extractQuantity(t);
            if (/빼|삭제|제거|취소/.test(noSpace)) {
                return { type: 'REMOVE_ITEM', item, quantity: qty || 1 };
            }
            // add (require explicit ordering verb)
            if (/(시켜|주문|추가|넣어|담아|주세요|부탁|주세요\.|달라|줘|해줘)/.test(noSpace)) {
                return { type: 'ADD_ITEM', item, quantity: qty || 1 };
            }
            // If only the name was spoken without an ordering verb, ignore
        }
    }

    return null;
}

export function extractQuantity(text) {
    // Korean numerals and Arabic numerals
    // supports: 하나(1), 두(2), 둘(2), 세(3), 네(4), 다섯(5), 여섯(6), 일곱(7), 여덟(8), 아홉(9), 열(10)
    const map = new Map([
        ['하나', 1], ['한개', 1], ['한', 1],
        ['둘', 2], ['두개', 2], ['두', 2],
        ['셋', 3], ['세개', 3], ['세', 3],
        ['넷', 4], ['네개', 4], ['네', 4],
        ['다섯', 5], ['여섯', 6], ['일곱', 7], ['여덟', 8], ['아홉', 9], ['열', 10]
    ]);
    for (const [k, v] of map.entries()) {
        if (text.includes(k)) return v;
    }
    const m = text.match(/(\d+)\s*(개|번|장)?/);
    if (m) return parseInt(m[1], 10);
    return null;
}


