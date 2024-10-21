'use strict';

import { initialiseEnvironment } from './initialiseEnvironment';

//@ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([{ label: 'Test', value: 'Test' }]),
    }),
);

describe('Term Tests', () => {
    describe('simple string (no QS):-', () => {
        const { inputEL } = initialiseEnvironment('https://example.com');

        inputEL.value = 'Test';

        inputEL.dispatchEvent(new Event('change'));

        it('appends "?term="', () =>
            expect(fetch).toHaveBeenCalledWith(
                'https://example.com?term=Test',
            ));
    });

    describe('string with `?`:-', () => {
        const { inputEL } = initialiseEnvironment('https://example.com?test=1');

        inputEL.value = 'Test';

        inputEL.dispatchEvent(new Event('change'));

        it('appends "&term="', () =>
            expect(fetch).toHaveBeenCalledWith(
                'https://example.com?test=1&term=Test',
            ));
    });

    describe('string with `{{term}}`:-', () => {
        const { inputEL } = initialiseEnvironment(
            'https://example.com/search/{{term}}/suffix',
        );

        inputEL.value = 'Test';

        inputEL.dispatchEvent(new Event('change'));

        it('embeds the "term"', () =>
            expect(fetch).toHaveBeenCalledWith(
                'https://example.com/search/Test/suffix',
            ));
    });
});
