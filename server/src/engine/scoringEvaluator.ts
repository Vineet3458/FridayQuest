import jsonLogic from 'json-logic-js';

/**
 * Safe scoring rule evaluator without using eval().
 * Supports JsonLogic objects or string expressions like "actor.guess == target.role".
 */
export function evaluateCondition(condition: unknown, context: Record<string, unknown>): boolean {
  if (condition === true || condition === 'true') return true;
  if (!condition) return false;

  // If it's a JsonLogic object
  if (typeof condition === 'object' && condition !== null) {
    try {
      return Boolean(jsonLogic.apply(condition, context));
    } catch {
      return false;
    }
  }

  // If it's a string expression like "a == b" or "a != b"
  if (typeof condition === 'string') {
    const trimmed = condition.trim();

    // Check for equality == or ===
    if (trimmed.includes('==')) {
      const isStrict = trimmed.includes('===');
      const delimiter = isStrict ? '===' : '==';
      const parts = trimmed.split(delimiter);
      if (parts.length === 2) {
        const leftVal = resolveValue(parts[0].trim(), context);
        const rightVal = resolveValue(parts[1].trim(), context);
        return String(leftVal).toLowerCase() === String(rightVal).toLowerCase();
      }
    }

    // Check for inequality != or !==
    if (trimmed.includes('!=')) {
      const isStrict = trimmed.includes('!==');
      const delimiter = isStrict ? '!==' : '!=';
      const parts = trimmed.split(delimiter);
      if (parts.length === 2) {
        const leftVal = resolveValue(parts[0].trim(), context);
        const rightVal = resolveValue(parts[1].trim(), context);
        return String(leftVal).toLowerCase() !== String(rightVal).toLowerCase();
      }
    }

    // Check for boolean literal
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;

    // Check truthy property
    const val = resolveValue(trimmed, context);
    return Boolean(val);
  }

  return false;
}

/**
 * Resolves dot-notation path like "mantri.guess" from context object,
 * or returns literal string if quotes are present.
 */
export function resolveValue(token: string, context: Record<string, unknown>): unknown {
  // Check for quoted string literal
  if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
    return token.slice(1, -1);
  }

  // Check for numeric literal
  if (!isNaN(Number(token))) {
    return Number(token);
  }

  // Check for boolean literal
  if (token === 'true') return true;
  if (token === 'false') return false;

  // Dot notation lookup in context
  const parts = token.split('.');
  let current: any = context;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

