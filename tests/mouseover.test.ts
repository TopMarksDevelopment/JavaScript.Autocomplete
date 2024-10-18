import { Autocomplete, AutocompleteStatus } from '../src/index';

jest.useFakeTimers();

describe('Mouseover Tests', () => {
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

        it('has initial state of "stopped"', () =>
            expect(autocomplete.status).toBe(AutocompleteStatus.Stopped));

        it('"start" should not throw', () =>
            expect(autocomplete.start).not.toThrow());

        it('now has "started" state', () =>
            expect(autocomplete.status).toBe(AutocompleteStatus.Started));
    });

    describe('Mouse over', () => {
        beforeEach(() => {
            inputEL.dispatchEvent(new Event('focusout'));
            jest.advanceTimersByTime(251);
        });

        it('popping up under mouse should not change input', () => {
            inputEL.value = 'Test Value';
            inputEL.dispatchEvent(new Event('change'));

            const ul =
                (document.getElementById(
                    inputEL.dataset.acId ?? '',
                ) as HTMLUListElement | null) ?? document.createElement('ul');

            ul.children[0].dispatchEvent(new Event('mouseover'));

            jest.advanceTimersByTime(1);

            const point: [number, number] | undefined =
                //@ts-ignore
                autocomplete._stateData[inputEL.dataset.acId].focusPoint;

            expect(point).toBeDefined();
        });

        it('no initial mouseover should clear the focusPoint', () => {
            inputEL.value = 'Test Value';
            inputEL.dispatchEvent(new Event('change'));

            jest.advanceTimersByTime(334);

            const point: [number, number] | undefined =
                //@ts-ignore
                autocomplete._stateData[inputEL.dataset.acId].focusPoint;

            expect(point).toBeUndefined();
        });
    });
});
