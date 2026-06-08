import calculateCartTotal from '@/utils/calculateCartTotal';
import { catchError } from '@/utils/catchError';
import formatPrice from '@/utils/formatPrice';
import { capitalizeFirstLetter, formatDate } from '@/utils/helpers';
import { colors } from '@/utils/theme';

describe('shared utility helpers', () => {
    test('formatPrice formats values with and without separators', () => {
        expect(formatPrice(500)).toBe('P500');
        expect(formatPrice(1234567)).toBe('P1,234,567');
    });

    test('calculateCartTotal returns cart and stripe totals', () => {
        const cartItems = [
            { quantity: 2, product: { price: 19.99 } },
            { quantity: 1, product: { price: 5 } },
        ] as any;

        expect(calculateCartTotal(cartItems)).toEqual({
            cartTotal: 44.98,
            stripeTotal: 4498,
        });
    });

    test('catchError handles response payload messages', () => {
        expect(
            catchError({
                response: {
                    data: {
                        message: 'Validation failed',
                    },
                },
            })
        ).toBe('Validation failed');

        expect(
            catchError({
                response: {
                    data: {
                        error: {
                            message: 'Nested error message',
                        },
                    },
                },
            })
        ).toBe('Nested error message');
    });

    test('catchError handles response status, network errors, and fallback messages', () => {
        expect(
            catchError({
                response: {
                    status: 500,
                },
            })
        ).toBe('Server Error: 500');

        expect(catchError({ request: {} })).toBe('No response from server. Check your network or API URL.');
        expect(catchError({ message: 'Something went wrong' })).toBe('Something went wrong');
        expect(catchError({})).toBe('An unknown error occurred');
    });

    test('capitalizeFirstLetter and formatDate match current UI usage', () => {
        expect(capitalizeFirstLetter('john')).toBe('J');
        expect(capitalizeFirstLetter('')).toBe('');
        expect(formatDate(new Date(2024, 0, 15))).toBe('1/15/2024');
    });

    test('theme colors export expected values', () => {
        expect(colors).toEqual({
            primary: 'var(--color-primary)',
            red: '#d82c23',
        });
    });
});
