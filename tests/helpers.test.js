/**
 * Tests for utility helper functions
 */

import { 
  validateEmail, 
  validatePhone, 
  formatDate, 
  formatTime, 
  slugify, 
  truncateText,
  debounce,
  throttle
} from '../src/utils/helpers.js';

// Mock DOM for testing
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('Helper Functions', () => {
  describe('validateEmail', () => {
    test('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    test('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test..test@example.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('should validate correct phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('123 456 7890')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validatePhone('abc123')).toBe(false);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = '2025-03-15';
      const formatted = formatDate(date);
      expect(formatted).toContain('March');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2025');
    });
  });

  describe('formatTime', () => {
    test('should format time correctly', () => {
      expect(formatTime('14:30')).toBe('2:30 PM');
      expect(formatTime('09:15')).toBe('9:15 AM');
      expect(formatTime('00:00')).toBe('12:00 AM');
    });
  });

  describe('slugify', () => {
    test('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test & Special Characters!')).toBe('test-special-characters');
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });
  });

  describe('truncateText', () => {
    test('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long...');
    });

    test('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call function multiple times
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Function should not be called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Fast forward time
      jest.advanceTimersByTime(100);

      // Function should be called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    test('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      // Call function multiple times
      throttledFn();
      throttledFn();
      throttledFn();

      // Function should be called once immediately
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Fast forward time
      jest.advanceTimersByTime(100);

      // Call again
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});
