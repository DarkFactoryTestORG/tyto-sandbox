import { describe, expect, it } from 'vitest';
import { searchKey, slugify } from '../index.js';

describe('textkit binding', () => {
  it('slugifies through the native module', () => {
    expect(slugify('Project Alpha')).toBe('project-alpha');
  });

  it('builds search keys through the native module', () => {
    expect(searchKey('Café: Weekly REPORT')).toBe('cafe weekly report');
  });
});
