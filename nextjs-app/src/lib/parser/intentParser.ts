/**
 * Natural language intent parser for SIGNAL_LOSS command terminal.
 *
 * Supported forms:
 *   LONG 500 USDC SOL @ SLIPPAGE 0.5% WITHIN 2 BLOCKS
 *   SHORT 100 SOL JTO @ SLIPPAGE 1% WITHIN 5 BLOCKS
 *   EXECUTE 0xA7F2E9C1
 *   LONG 1.5K USDC SOL
 *   SHORT 500 BONK SOL @ TOLERANCE 2%
 */

export type Direction = 'LONG' | 'SHORT';

export interface ParsedIntent {
  direction: Direction;
  amount: number;             // numeric, in input token units
  tokenIn: string;            // e.g. USDC, SOL
  tokenOut: string;           // e.g. SOL, JTO
  slippageBps: number;        // basis points (0.5% = 50 bps)
  timeDecay: number;          // blocks until expiry
  collateral: number;         // collateral amount in input token (default = amount)
  pair: string;               // e.g. SOL/USDC
  route?: string;             // optional routing hint
  raw: string;                // original command
}

const TOKEN_ALIASES: Record<string, string> = {
  SOL: 'SOL', SOLANA: 'SOL',
  USDC: 'USDC', USDT: 'USDT',
  JTO: 'JTO', JUP: 'JUP',
  WIF: 'WIF', BONK: 'BONK',
  PYTH: 'PYTH', RENDER: 'RENDER', RNDR: 'RENDER',
  JLP: 'JLP', mSOL: 'mSOL', MSOL: 'mSOL',
  bSOL: 'bSOL', BSOL: 'bSOL',
};

/**
 * Parse a numeric string that may include K/M/B suffixes.
 * "1.5K" -> 1500, "2.3M" -> 2_300_000
 */
function parseAmount(s: string): number | null {
  const cleaned = s.replace(/,/g, '').trim();
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*([KkMmBb]?)$/);
  if (!match) return null;
  const n = parseFloat(match[1]);
  const suffix = match[2].toUpperCase();
  if (suffix === 'K') return n * 1_000;
  if (suffix === 'M') return n * 1_000_000;
  if (suffix === 'B') return n * 1_000_000_000;
  return n;
}

function normalizeToken(s: string): string | null {
  const upper = s.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return TOKEN_ALIASES[upper] ?? null;
}

/**
 * Parse a slippage value: "0.5%" -> 50 (bps), "1%" -> 100, "50bps" -> 50
 */
function parseSlippage(s: string): number | null {
  const m = s.match(/^(\d+(?:\.\d+)?)\s*%?$/);
  if (!m) return null;
  const pct = parseFloat(m[1]);
  return Math.round(pct * 100); // percent to bps
}

export function parseIntent(input: string): ParsedIntent | null {
  const raw = input.trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();

  // EXECUTE <id>
  if (upper.startsWith('EXECUTE ')) {
    const id = upper.replace('EXECUTE ', '').trim();
    if (!/^0X[0-9A-F]{6,}$/.test(id)) return null;
    return {
      direction: 'LONG',
      amount: 0,
      tokenIn: 'USDC',
      tokenOut: 'SOL',
      slippageBps: 50,
      timeDecay: 2,
      collateral: 0,
      pair: 'EXECUTE',
      raw,
    };
  }

  // direction amount tokenIn tokenOut @ SLIPPAGE <pct>% [WITHIN N BLOCKS]
  const re = /^(LONG|SHORT)\s+(\d+(?:\.\d+)?[KkMmBb]?)\s+([A-Za-z0-9]+)\s+([A-Za-z0-9]+)(?:\s*@\s*(?:SLIPPAGE|TOLERANCE)\s+(\d+(?:\.\d+)?)\s*%?)?(?:\s+WITHIN\s+(\d+)\s+BLOCKS?)?(?:\s+EXPIRES?\s+(\d+)\s+BLOCKS?)?/i;
  const m = raw.match(re);
  if (!m) return null;

  const direction = m[1].toUpperCase() as Direction;
  const amount = parseAmount(m[2]);
  if (amount === null || amount <= 0) return null;

  const tokenIn = normalizeToken(m[3]);
  const tokenOut = normalizeToken(m[4]);
  if (!tokenIn || !tokenOut) return null;
  if (tokenIn === tokenOut) return null;

  const slippageBps = m[5] ? parseSlippage(m[5]) : 50;
  if (slippageBps === null || slippageBps < 1 || slippageBps > 5000) return null;

  let timeDecay = 2;
  if (m[6]) {
    const n = parseInt(m[6], 10);
    if (n > 0 && n <= 100) timeDecay = n;
  } else if (m[7]) {
    const n = parseInt(m[7], 10);
    if (n > 0 && n <= 100) timeDecay = n;
  }

  return {
    direction,
    amount,
    tokenIn,
    tokenOut,
    slippageBps,
    timeDecay,
    collateral: amount,
    pair: `${tokenOut}/${tokenIn}`,
    route: 'JUP_v6',
    raw,
  };
}

/**
 * Lightweight test helper — quick sanity checks.
 */
export const _testParse = parseIntent;
