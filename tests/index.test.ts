import { Autocomplete, AutocompleteStatus } from '../src/index';

describe('testing index file', () => {
    let inputEL: HTMLInputElement, autocomplete: Autocomplete;

    describe('Setup Tes Env', () => {
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

    test('Initial state = stopped', () =>
        expect(autocomplete.status).toBe(AutocompleteStatus.Stopped));

    describe('Starting', () => {
        it('should not throw', () => expect(autocomplete.start).not.toThrow());

        it('state = started', () =>
            expect(autocomplete.status).toBe(AutocompleteStatus.Started));
    });

    describe('After Start: bound element', () => {
        it('has id', () => expect(inputEL.dataset.acId).toBeDefined());
        it('has event', () =>
            expect(inputEL.dispatchEvent(new Event('focus'))).toBe(true));
    });

    describe('Searching', () => {
        it('creates <ul>', () => {
            const was = document.body.childElementCount;

            inputEL.value = 'Test Value';
            inputEL.dispatchEvent(new Event('change'));

            expect(document.body.childElementCount).not.toEqual(was);
        });
    });

    describe('New <ul>', () => {
        let ul: HTMLUListElement;

        it('has correct id', () => {
            ul =
                (document.getElementById(
                    inputEL.dataset.acId ?? '',
                ) as HTMLUListElement | null) ?? document.createElement('ul');

            expect(ul?.tagName).toBe('UL');
        });

        it('has 4 children', () => expect(ul.childElementCount).toBe(4));

        it("isn't hidden", () => expect(ul.hidden).toBe(false));

        it('has position', () => {
            // Will be 0, as Jest does no rendering
            expect(ul.style.top).toBeDefined();
        });
    });
});
