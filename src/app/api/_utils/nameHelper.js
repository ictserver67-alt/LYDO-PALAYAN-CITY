/**
 * Utility functions for parsing and formatting scholar names.
 */

const SUFFIX_REGEX = /\b(Jr\.?|Sr\.?|II|III|IV|V|VI)\b$/i;

const SURNAME_PREFIXES_2 = ['de los', 'de la', 'de las', 'delos', 'san'];
const SURNAME_PREFIXES_1 = ['dela', 'del', 'de', 'san', 'santa', 'sto.', 'sta.'];

/**
 * Parses a full name string into firstName, middleName, lastName, and suffix.
 * Useful for backward compatibility with legacy scholar data.
 */
export function parseFullName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', middleName: '', lastName: '', suffix: '' };
  }

  let clean = fullName.trim();
  let suffix = '';

  // Extract suffix if present
  const suffixMatch = clean.match(SUFFIX_REGEX);
  if (suffixMatch) {
    suffix = suffixMatch[0];
    clean = clean.replace(SUFFIX_REGEX, '').trim().replace(/,$/, '').trim();
  }

  // Handle format: "Lastname, Firstname Middlename"
  if (clean.includes(',')) {
    const parts = clean.split(',').map(s => s.trim()).filter(Boolean);
    const lastName = parts[0] || '';
    const remaining = parts[1] ? parts[1].split(/\s+/).filter(Boolean) : [];
    
    if (remaining.length === 0) {
      return { firstName: '', middleName: '', lastName, suffix };
    }
    if (remaining.length === 1) {
      return { firstName: remaining[0], middleName: '', lastName, suffix };
    }
    const middleName = remaining.pop();
    const firstName = remaining.join(' ');
    return { firstName, middleName, lastName, suffix };
  }

  const tokens = clean.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return { firstName: '', middleName: '', lastName: '', suffix };
  }
  if (tokens.length === 1) {
    return { firstName: tokens[0], middleName: '', lastName: '', suffix };
  }
  if (tokens.length === 2) {
    return { firstName: tokens[0], middleName: '', lastName: tokens[1], suffix };
  }

  // Handle compound surnames like "De Los Santos", "Dela Cruz", "San Juan"
  const lowerTokens = tokens.map(t => t.toLowerCase());
  let splitIndex = tokens.length - 1;

  if (tokens.length >= 4) {
    const twoWordPrefix = `${lowerTokens[tokens.length - 3]} ${lowerTokens[tokens.length - 2]}`;
    if (SURNAME_PREFIXES_2.includes(twoWordPrefix)) {
      splitIndex = tokens.length - 3;
    }
  }

  if (splitIndex === tokens.length - 1 && tokens.length >= 3) {
    const oneWordPrefix = lowerTokens[tokens.length - 2];
    if (SURNAME_PREFIXES_1.includes(oneWordPrefix)) {
      splitIndex = tokens.length - 2;
    }
  }

  const lastName = tokens.slice(splitIndex).join(' ');
  const beforeLast = tokens.slice(0, splitIndex);

  let firstName = '';
  let middleName = '';
  if (beforeLast.length === 1) {
    firstName = beforeLast[0];
  } else {
    middleName = beforeLast[beforeLast.length - 1];
    firstName = beforeLast.slice(0, -1).join(' ');
  }

  return { firstName, middleName, lastName, suffix };
}

/**
 * Formats name components into a single clean full name.
 */
export function formatFullName({ firstName = '', middleName = '', lastName = '', suffix = '' }) {
  const parts = [];
  if (firstName && firstName.trim()) parts.push(firstName.trim());
  if (middleName && middleName.trim()) parts.push(middleName.trim());
  if (lastName && lastName.trim()) parts.push(lastName.trim());
  if (suffix && suffix.trim()) parts.push(suffix.trim());
  return parts.join(' ');
}
