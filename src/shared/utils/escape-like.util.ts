/**
 * Escapes SQL LIKE wildcard characters (%, _) and backslash from user input.
 * Sequelize parameterizes the value (preventing SQL injection), but % and _ are
 * still interpreted as wildcards within a LIKE pattern. Without escaping, a user
 * searching for "%" would match all rows.
 */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}
