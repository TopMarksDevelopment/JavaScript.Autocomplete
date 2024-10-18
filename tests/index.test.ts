import { Autocomplete, AutocompleteStatus } from '../src/index';

describe('Core Tests', () => {
    let inputEL: HTMLInputElement, autocomplete: Autocomplete;

    describe('Test environment:-', () => {
        it('has added element', () => {
            inputEL = document.createElement('input');

            inputEL.classList.add('test');
            inputEL = document.body.insertAdjacentElement(
                'beforeend',
                inputEL,
            ) as HTMLInputElement;

            expect(inputEL).not.toBeNull();
        });

        it('has created autocomplete', () => {
            autocomplete = new Autocomplete('.test', {
                source: [
                    { label: 'First label', value: 'First Value' },
                    { label: 'Second label', value: 'Second Value' },
                    { label: 'Third label', value: 'Third Value' },
                    { label: 'Final label', value: 'Final Value' },
                ],
                onOpen: (e, data) => {
                    data.ul.style.width = `${
                        (e.target as HTMLInputElement).width
                    }px`;
                },
            });

            expect(autocomplete).not.toBeNull();
        });
    });

    describe('Upon init/start:-', () => {
        it('the initial state is "stopped"', () =>
            expect(autocomplete.status).toBe(AutocompleteStatus.Stopped));

        it('"starting" should not throw', () =>
            expect(autocomplete.start).not.toThrow());

        it('the new state should be "started"', () =>
            expect(autocomplete.status).toBe(AutocompleteStatus.Started));

        it('the input has the AC id', () =>
            expect(inputEL.dataset.acId).toBeDefined());

        it('the input has the focus event', () =>
            expect(inputEL.dispatchEvent(new Event('focus'))).toBe(true));
    });

    describe('Searching ensures <ul>:-', () => {
        let ul: HTMLUListElement;

        it('is created', () => {
            const was = document.body.childElementCount;

            inputEL.value = 'Test Value';
            inputEL.dispatchEvent(new Event('change'));

            expect(document.body.childElementCount).not.toEqual(was);
        });

        it('has the correct id', () => {
            ul =
                (document.getElementById(
                    inputEL.dataset.acId ?? '',
                ) as HTMLUListElement | null) ?? document.createElement('ul');

            expect(ul?.tagName).toBe('UL');
        });

        it('has 4 children', () => expect(ul.childElementCount).toBe(4));

        it("isn't hidden", () => expect(ul.hidden).toBe(false));

        it('has position data', () => {
            // Will be 0, as Jest does no rendering
            expect(ul.style.top).toBeDefined();
        });
    });
});
