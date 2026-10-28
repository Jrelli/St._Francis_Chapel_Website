import { describe, expect, it } from 'vitest';
import { parseAmount, parseFundraisingCsv, parseSheetDate, percentRaised } from './fundraising';

describe('parseAmount', () => {
  it('accepts plain and formatted dollar amounts', () => {
    expect(parseAmount('32300')).toBe(32300);
    expect(parseAmount('$32,300')).toBe(32300);
    expect(parseAmount(' $1,250.50 ')).toBe(1250.5);
  });

  it('rejects anything that is not an amount', () => {
    expect(parseAmount('')).toBeUndefined();
    expect(parseAmount('32.3k')).toBeUndefined();
    expect(parseAmount('about $30,000')).toBeUndefined();
    expect(parseAmount(undefined)).toBeUndefined();
  });
});

describe('parseSheetDate', () => {
  it('reads ISO and US-style dates', () => {
    expect(parseSheetDate('2026-10-27')).toBe('2026-10-27');
    expect(parseSheetDate('10/27/2026')).toBe('2026-10-27');
    expect(parseSheetDate('1/5/2027')).toBe('2027-01-05');
  });

  it('ignores anything else', () => {
    expect(parseSheetDate('Oct 27')).toBeUndefined();
    expect(parseSheetDate('')).toBeUndefined();
  });
});

describe('parseFundraisingCsv', () => {
  it('reads a published sheet, including quoted amounts with commas', () => {
    const csv = 'Raised,Goal,As of\r\n"$32,300","$300,000",10/27/2026\r\n';
    expect(parseFundraisingCsv(csv)).toEqual({
      raised: 32300,
      goal: 300000,
      asOf: '2026-10-27',
    });
  });

  it('matches headers regardless of case, order and extra columns', () => {
    const csv = 'Notes,AS OF,raised\nfrom the newsletter,2026-11-08,33000';
    expect(parseFundraisingCsv(csv)).toEqual({
      raised: 33000,
      goal: undefined,
      asOf: '2026-11-08',
    });
  });

  it('explains what is wrong when there is no usable "Raised" amount', () => {
    expect(() => parseFundraisingCsv('Total\n32300')).toThrow(/"Raised"/);
    expect(() => parseFundraisingCsv('Raised\nlots')).toThrow(/"Raised"/);
  });
});

describe('percentRaised', () => {
  it('rounds down and caps at 100', () => {
    expect(percentRaised({ raised: 32300, goal: 300000 })).toBe(10);
    expect(percentRaised({ raised: 400000, goal: 300000 })).toBe(100);
    expect(percentRaised({ raised: 100, goal: 0 })).toBe(0);
  });
});
