export const isRequiredMessage = () => [{ id: 'ValidationMessage.NotEmpty' }];
export const minLengthMessage = (length) => [{ id: 'ValidationMessage.MinLength' }, { length }];
export const maxLengthMessage = (length) => [{ id: 'ValidationMessage.MaxLength' }, { length }];
export const minValueMessage = (length) => [{ id: 'ValidationMessage.MinValue' }, { length }];
export const maxValueMessage = (length) => [{ id: 'ValidationMessage.MaxValue' }, { length }];
export const invalidDateMessage = () => [{ id: 'ValidationMessage.InvalidDate' }];
export const invalidIntegerMessage = (text) => [{ id: 'ValidationMessage.InvalidInteger' }, { text }];
export const invalidDecimalMessage = (text) => [{ id: 'ValidationMessage.InvalidDecimal' }, { text }];
export const dateNotBeforeOrEqualMessage = (limit) => [{ id: 'ValidationMessage.DateNotBeforeOrEqual' }, { limit }];
export const dateNotAfterOrEqualMessage = (limit) => [{ id: 'ValidationMessage.DateNotAfterOrEqual' }, { limit }];
export const dateRangesOverlappingMessage = () => [{ id: 'ValidationMessage.DateRangesOverlapping' }];
export const datesNotEqual = (value) => [{ id: 'ValidationMessage.DatesNotEqual' }, { value }];
export const invalidFodselsnummerFormatMessage = () => [{ id: 'ValidationMessage.InvalidFodselsnummerFormat' }];
export const invalidEmailMessage = () => [{ id: 'ValidationMessage.InvalidEmail' }];
export const invalidFodselsnummerMessage = () => [{ id: 'ValidationMessage.InvalidFodselsnummer' }];
export const sammeFodselsnummerSomSokerMessage = () => [{ id: 'ValidationMessage.SammeFodselsnummerSomSoker' }];
export const invalidSaksnummerOrFodselsnummerFormatMessage = () => [
	{ id: 'ValidationMessage.InvalidSaksnummerOrFodselsnummerFormat' },
];
export const invalidSaksnummerOrJournalpostIdFormatMessage = () => [
	{ id: 'ValidationMessage.InvalidSaksnummerFormat' },
];
export const invalidTextMessage = (text) => [{ id: 'ValidationMessage.InvalidText' }, { text }];
export const invalidValueMessage = (value) => [{ id: 'ValidationMessage.InvalidValue' }, { value }];
export const arrayMinLengthMessage = (length) => [{ id: 'ValidationMessage.ArrayMinLength' }, { length }];
export const invalidDatesInPeriodMessage = () => [{ id: 'ValidationMessage.InvalidDatesInPeriod' }];
export const invalidPeriodMessage = () => [{ id: 'ValidationMessage.InvalidPeriod' }];
export const invalidPeriodRangeMessage = () => [{ id: 'ValidationMessage.InvalidPeriodRange' }];
export const invalidNumberMessage = (text) => [{ id: 'ValidationMessage.InvalidNumber' }, { text }];
