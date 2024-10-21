'use strict';

import { initialiseEnvironment } from './initialiseEnvironment';

jest.useFakeTimers();

describe('Mouseover Tests', () => {
    const { inputEL, autocomplete } = initialiseEnvironment();

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
