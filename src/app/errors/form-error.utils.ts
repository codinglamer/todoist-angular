export enum CustomErrorNames {
  StartsWithLetter = 'startsWithLetter',
  NotAvailable = 'notAvailable',
  Predicate = 'predicate',
  Match = 'match',
}

export interface ErrorMessageGetter {
  (error: any): string;
}

export const ErrorToMessageMap = new Map<string, ErrorMessageGetter>([
  ['required', () => 'Field is required'],
  ['minlength', (error) => `Minimal length is ${error.requiredLength}`],
  ['maxlength', (error) => `Maximal length is ${error.requiredLength}`],
  ['email', () => 'Not a valid email'],
  [CustomErrorNames.StartsWithLetter, (error) => `${error} must start with a letter`],
  [CustomErrorNames.NotAvailable, (error) => `${error} is not available`],
  [CustomErrorNames.Match, (error) => `${error} don't match`],
]);
