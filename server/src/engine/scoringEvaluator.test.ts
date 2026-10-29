import { evaluateCondition, resolveValue } from './scoringEvaluator.js';

describe('Scoring Evaluator', () => {
  describe('resolveValue', () => {
    it('resolves literal strings and numbers', () => {
      expect(resolveValue('"chor"', {})).toBe('chor');
      expect(resolveValue("'mantri'", {})).toBe('mantri');
      expect(resolveValue('100', {})).toBe(100);
      expect(resolveValue('true', {})).toBe(true);
    });

    it('resolves nested context keys using dot notation', () => {
      const context = {
        mantri: { guess: 'user_456' },
        target: { role: 'chor' },
      };
      expect(resolveValue('mantri.guess', context)).toBe('user_456');
      expect(resolveValue('target.role', context)).toBe('chor');
      expect(resolveValue('nonexistent.key', context)).toBeUndefined();
    });
  });

  describe('evaluateCondition', () => {
    it('evaluates equality conditions correctly', () => {
      const context = {
        mantri: { guess: 'chor' },
        actualRole: 'chor',
      };
      expect(evaluateCondition('mantri.guess == actualRole', context)).toBe(true);
      expect(evaluateCondition('mantri.guess == "chor"', context)).toBe(true);
      expect(evaluateCondition('mantri.guess == "sipahi"', context)).toBe(false);
    });

    it('evaluates inequality conditions correctly', () => {
      const context = {
        mantri: { guess: 'sipahi' },
        targetRole: 'chor',
      };
      expect(evaluateCondition('mantri.guess != targetRole', context)).toBe(true);
      expect(evaluateCondition('mantri.guess != "sipahi"', context)).toBe(false);
    });

    it('evaluates json-logic objects safely without eval', () => {
      const condition = {
        '===': [{ var: 'user.score' }, 100],
      };
      expect(evaluateCondition(condition, { user: { score: 100 } })).toBe(true);
      expect(evaluateCondition(condition, { user: { score: 50 } })).toBe(false);
    });
  });
});

