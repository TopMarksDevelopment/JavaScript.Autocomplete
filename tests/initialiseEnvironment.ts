/* exported initialiseEnvironment */

'use strict';
import { Autocomplete, AutocompleteStatus } from '../src';
import { SourceTypes } from '../src/Types/SourceTypes';

export function initialiseEnvironment(): {
    inputEL: HTMLInputElement;
    autocomplete: Autocomplete<{ label: string; value: string }>;
};
export function initialiseEnvironment(newSource: string): {
    inputEL: HTMLInputElement;
    autocomplete: Autocomplete<{ label: string; value: string }>;
};
export function initialiseEnvironment<T = { label: string; value: string }>(
    newSource?: SourceTypes<T>,
): { inputEL: HTMLInputElement; autocomplete: Autocomplete<T> } {
    let inputEL = document.createElement('input');

    inputEL.classList.add('test');
    inputEL = document.body.insertAdjacentElement(
        'beforeend',
        inputEL,
    ) as HTMLInputElement;

    const autocomplete = new Autocomplete<T>('.test', {
        source:
            newSource ??
            ([
                { label: 'First label', value: 'First Value' },
                { label: 'Second label', value: 'Second Value' },
                { label: 'Third label', value: 'Third Value' },
                { label: 'Final label', value: 'Final Value' },
            ] as SourceTypes<T>),
        onOpen: (e, data) => {
            data.ul.style.width = `${(e.target as HTMLInputElement).width}px`;
        },
    });

    autocomplete.start();

    it('Setup complete with "started" state', () =>
        expect(autocomplete.status).toBe(AutocompleteStatus.Started));

    return { inputEL, autocomplete };
}
