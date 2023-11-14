import {
    AutocompleteEventFunction as EventFunction,
    CloseEventData,
    FocusEventData,
    CreateEventData,
    OpenEventData,
    ResponseEventData,
    SearchEventData,
    SelectEventData,
    UlListEventData,
} from './Types/EventTypes';
import { IPositionData } from './Interfaces/IPositionData';
import { IDefaultOptions, IOptions } from './Interfaces/IOptions';
import { ListItemType } from './Types/SourceTypes';
import { LogLevel } from '@topmarksdevelopment/javascript-logger';
import { position, CollisionHandler } from '@topmarksdevelopment/position';

export enum AutocompleteStatus {
    Started,
    Stopped,
}

export class Autocomplete<T = { label: string; value: string }> {
    private _watchingElements: HTMLInputElement[];
    private _stateData: Record<
        string,
        {
            data: ListItemType<T>[];
            lastTerm: string;
            valueStore?: string;
            focusValue?: string;
        }
    > = {};

    options: IDefaultOptions<T>;

    constructor(classQuery: string, options: IOptions<T>) {
        this._watchingElements = Array.from(
            document.querySelectorAll(classQuery),
        );

        this.options = DefaultOptions as unknown as IDefaultOptions<T>;

        options.renderers = {
            ...this.options.renderers,
            ...options.renderers,
        };

        options.position = {
            ...this.options.position,
            ...options.position,
        };

        this.options = {
            ...this.options,
            ...(options as IDefaultOptions<T>),
        };
    }

    status: AutocompleteStatus = AutocompleteStatus.Stopped;

    /**
     * Start watching for input changes
     */
    start = () => {
        this._traceLog('Autocomplete Starting');

        this._watchingElements.forEach((el) => {
            el.dataset.acId ??= 'ac_' + Math.random().toString().substring(2);
            el.addEventListener('change', this._inputChangeEvent);
            el.addEventListener(
                'keyup',
                this._debrottle(this._inputChangeEvent),
            );
            el.addEventListener('focus', this._inputFocusEvent);
            el.addEventListener('focusout', this._inputFocusOutEvent);
        });

        this.status = AutocompleteStatus.Started;

        this.options.onStart?.();

        this._infoLog('Autocomplete Started');
    };

    /**
     * Stop watching for input changes
     */
    stop = () => {
        this._traceLog('Autocomplete Stopping');

        this._watchingElements.forEach((el) => {
            el.removeEventListener('change', this._inputChangeEvent);
            el.removeEventListener(
                'keyup',
                this._debrottle(this._inputChangeEvent),
            );
            el.removeEventListener('focus', this._inputFocusEvent);
            el.removeEventListener('focusout', this._inputFocusOutEvent);
        });

        this.status = AutocompleteStatus.Stopped;

        this.options.onStop?.();

        this._infoLog('Autocomplete Stopped');
    };

    close: EventFunction<CloseEventData> = (ev, data) => {
        this._traceLog('Closing menu', `Menu id: ${data.ul.id}`);

        data.ul.hidden = true;

        this._infoLog('Closed menu', `Menu id: ${data.ul.id}`);

        this.options.onClose?.(ev, data);
    };

    create: EventFunction<CreateEventData<T>, HTMLUListElement> = (
        ev,
        data,
    ) => {
        this._traceLog('Creating new menu');

        const ul: HTMLUListElement = Autocomplete._createUl(
            ev.target as HTMLInputElement,
        );

        this.options.renderers.menuRenderer({
            ul,
            items: data.items,
            itemRenderer: this.options.renderers.itemRenderer,
        });

        (<HTMLLIElement[]>Array.from(ul.children)).forEach(
            (li: HTMLLIElement) => {
                li.addEventListener('focus', this._itemFocusEvent);
                li.addEventListener('mouseover', this._itemFocusEvent);
                li.addEventListener('click', this._itemClickEvent);
            },
        );

        ul.addEventListener('mouseleave', (subEv) => {
            const ul = <HTMLUListElement>(
                document.getElementById((<HTMLUListElement>subEv.target).id)
            );

            this._removeFocus(ul);

            this.revertInput(ev, { ul });
        });

        this._infoLog('Created new menu');

        this.options.onCreated?.(ev, { ul });

        return ul;
    };

    itemFocus: EventFunction<FocusEventData<T>> = (ev, data) => {
        this._traceLog(
            'Menu item focusing',
            `Item summary: ${(ev.target as HTMLLIElement).innerText}`,
        );

        this.options.onItemFocus?.(ev, data);

        this._removeFocus(data.ul);

        // Focus on the new one
        const liEl = <HTMLLIElement>ev.target,
            newVal = liEl.dataset.value || liEl.innerText;
        liEl.classList.add('focused');

        // Update the input value and store
        if (!this._stateData[data.ul.id].valueStore) {
            this._stateData[data.ul.id].valueStore = data.input.value;
        }

        if (
            !this.options.autoFocus &&
            this._stateData[data.ul.id].focusValue !== newVal
        ) {
            this._stateData[data.ul.id].focusValue = newVal;

            data.input.value = newVal;
        }

        this._infoLog('Menu item focused', `Item summary: ${liEl.innerText}`);
    };

    itemSelect: EventFunction<SelectEventData<T>> = (ev, data) => {
        this._traceLog(
            'Menu item selecting',
            `Item summary: ${(ev.target as HTMLLIElement).innerText}`,
        );

        this.options.onItemSelect?.(ev, data);

        if (typeof (data.item as { link?: string }).link === 'string') {
            window.location.href = (data.item as { link: string }).link;
        } else {
            const liEl = <HTMLLIElement>ev.target;

            // Set input value
            data.input.value = liEl.dataset.value ?? liEl.innerText;
            this._stateData[data.ul.id].valueStore = data.input.value;

            this._clearFocusStore(data.ul.id);

            // Focus the input (if we clicked, it removes focus)
            data.input.focus();
        }

        this._infoLog(
            'Menu item selected',
            `Item summary: ${(ev.target as HTMLLIElement).innerText}`,
        );

        this.close(ev, { ul: data.ul });
    };

    /**
     * Try to open the autocomplete widget
     * Will fail if there are no elements or the term
     */
    open: EventFunction<OpenEventData> = (ev, data) => {
        this._traceLog('Opening menu', `Menu id: ${data.ul.id}`);

        this.options.onOpen?.(ev, data);

        const tL = position({
            target: data.ul,
            anchor: <HTMLElement>ev.target,
            my: this.options.position.my,
            at: this.options.position.at,
            collision: this.options.position.collision,
        });

        data.ul.style.top = tL.top;
        data.ul.style.left = tL.left;
        data.ul.hidden = false;

        if (this.options.autoFocus) {
            data.ul.children[0]?.dispatchEvent(new Event('focus'));
        }

        this._traceLog('Opened menu', `Menu id: ${data.ul.id}`);
    };

    response: EventFunction<ResponseEventData<T>, ListItemType<T>[]> = (
        ev,
        data,
    ) => {
        this._traceLog('Received new data', `Term: ${data.term}`, {
            items: data.items,
        });

        const resultData = Array.isArray(data.items)
            ? data.items
            : this.options.recordMapper(data.items);

        this.options.onResponse?.(ev, { items: resultData });

        const target = <HTMLInputElement>ev.target,
            id = target.dataset.acId!;

        this._stateData[id].data = resultData;

        return resultData;
    };

    revertInput: EventFunction<UlListEventData> = (ev, data) => {
        this._traceLog('Reverting input', `Input ac-id: ${data.ul.id}`);

        const target = <HTMLInputElement>ev.target,
            vS = this._stateData[data.ul.id].valueStore;
        if (typeof vS === 'string' && vS !== target.value) {
            target.value = vS;

            this._stateData[data.ul.id].valueStore = undefined;

            this._infoLog('Reverted input', `Input ac-id: ${data.ul.id}`);
        }
    };

    searchAsync: EventFunction<SearchEventData, Promise<void>> = async (
        ev,
        data,
    ) => {
        this._traceLog('Starting search', `Term: ${data.term}`);

        this.options.onSearch?.(ev, { term: data.term });
        let responseItems: ListItemType<T>[] = [];

        try {
            responseItems = this.response(ev, {
                term: data.term,
                items:
                    typeof this.options.source === 'string'
                        ? await ((
                              await window.fetch(
                                  this.options.source +
                                      '?term=' +
                                      encodeURIComponent(data.term),
                              )
                          ).json() as Promise<ListItemType<T>[]>)
                        : typeof this.options.source === 'function'
                        ? this.options.source({ term: data.term })
                        : this.options.source,
            });
        } catch {
            return;
        }

        this._infoLog(
            'Search complete',
            `Term: "${data.term}" returned ${responseItems.length} results`,
        );

        if (responseItems.length) {
            const ul = this.create(ev, { items: responseItems });

            this.open(ev, { ul });
        }
    };

    private _clearFocusStore = (id: string) => {
        this._traceLog('Clearing focus store', `Menu id: ${id}`);

        this._stateData[id].focusValue = undefined;
    };

    private static _createUl(target: HTMLInputElement) {
        let ul = this._getUl(target);

        if (ul?.tagName === 'UL') {
            ul.replaceChildren();
        } else {
            ul = document.createElement('ul');

            ul.id = target.dataset.acId as string;
            ul.classList.add('autocomplete');

            document.body.insertAdjacentElement('beforeend', ul);
        }

        ul.hidden = true;

        return ul;
    }

    private static _getUl(target: HTMLInputElement | string) {
        return document.getElementById(
            typeof target === 'string'
                ? target
                : (target.dataset.acId as string),
        ) as HTMLUListElement | null;
    }

    private _inputChangeEvent = async (ev: Event) => {
        const target = <HTMLInputElement>ev.target,
            id = target.dataset.acId!,
            targetQuery = target.value;

        this._traceLog('Input changed', `Input ac-id: ${id}`);

        if (
            targetQuery.length >= Math.max(1, this.options.minLength) &&
            this._stateData[id]?.lastTerm !== targetQuery &&
            this._stateData[id]?.focusValue !== targetQuery &&
            this._stateData[id]?.valueStore !== targetQuery
        ) {
            // Update search
            this._stateData[id] = {
                lastTerm: targetQuery,
                data: this._stateData[id]?.data,
            };

            await this.searchAsync(ev, { term: targetQuery });
        }
    };

    private _inputFocusEvent = (ev: FocusEvent) => {
        this._traceLog(
            'Input focused',
            `Input ac-id: ${(<HTMLInputElement>ev.target).dataset.acId}`,
        );

        (ev.target as HTMLInputElement).addEventListener(
            'keydown',
            this._inputKeybindEvent,
        );
    };

    private _inputFocusOutEvent = (ev: FocusEvent) => {
        // Allow click to propagate before triggering this
        setTimeout(() => {
            this._traceLog(
                'Input UN-focused',
                `Input ac-id: ${(<HTMLInputElement>ev.target).dataset.acId}`,
            );

            (ev.target as HTMLInputElement).removeEventListener(
                'keydown',
                this._inputKeybindEvent,
            );

            const ul = Autocomplete._getUl(ev.target as HTMLInputElement);

            if (ul && !ul.hidden) {
                this.close(ev, { ul });
            }
        }, 250);
    };

    private _inputKeybindEvent = (ev: KeyboardEvent) => {
        this._traceLog(
            'Input key pressed',
            `Key: ${ev.code} | Input ac-id: ${
                (<HTMLInputElement>ev.target).dataset.acId
            }`,
        );

        const target = <HTMLInputElement>ev.target,
            ul = Autocomplete._getUl(target);

        if (ul && ul.children.length) {
            if (['ArrowDown', 'ArrowUp'].indexOf(ev.code) > -1) {
                ev.preventDefault();

                if (ul.hidden) {
                    this.open(ev, { ul });

                    return;
                }

                const children = Array.from(ul.children) as HTMLLIElement[],
                    lastIndex = children.length - 1;
                let focusedIndex = children.findIndex((x) =>
                    x.classList.contains('focused'),
                );

                if (focusedIndex === -1) {
                    focusedIndex = ev.code === 'ArrowUp' ? lastIndex : 0;
                } else {
                    (children[focusedIndex] as HTMLLIElement).classList.remove(
                        'focused',
                    );

                    focusedIndex += ev.code === 'ArrowUp' ? -1 : 1;

                    if (focusedIndex > lastIndex) {
                        focusedIndex = -1;
                    }
                }

                if (focusedIndex === -1) {
                    this.revertInput(ev, { ul });
                } else {
                    children[focusedIndex].dispatchEvent(new Event('focus'));
                }
            } else if (ev.code === 'Escape') {
                this.revertInput(ev, { ul });

                if (!ul.hidden) {
                    // Defocus the current item (if any)
                    ul.querySelectorAll('.focused').forEach((li) =>
                        li.classList.remove('focused'),
                    );

                    this.close(ev, { ul });
                }
            } else if (!ul.hidden && ev.code === 'Enter') {
                const children = Array.from(ul.children) as HTMLLIElement[],
                    focusedIndex = children.findIndex((x) =>
                        x.classList.contains('focused'),
                    );

                if (focusedIndex !== -1) {
                    ev.preventDefault();

                    children[focusedIndex].dispatchEvent(new Event('click'));
                } else {
                    this._clearFocusStore(ul.id);

                    this.close(ev, { ul });
                }
            }
        }
    };

    private _itemClickEvent = (ev: MouseEvent) => {
        const li = <HTMLLIElement>ev.target,
            ul = <HTMLUListElement>li.parentElement,
            id = ul.id,
            item =
                this._stateData[id].data[Array.from(ul.children).indexOf(li)],
            input = <HTMLInputElement>(
                document.querySelector(`input[data-ac-id='${id}']`)
            );

        this._traceLog('Menu item clicked', `Item summary: ${li.innerText}`);

        this.itemSelect(ev, { ul, item, input });
    };

    private _itemFocusEvent = (ev: FocusEvent) => {
        const li = <HTMLLIElement>ev.target,
            ul = <HTMLUListElement>li.parentElement,
            id = ul.id,
            item =
                this._stateData[id].data[Array.from(ul.children).indexOf(li)],
            input = <HTMLInputElement>(
                document.querySelector(`input[data-ac-id='${id}']`)
            );

        this._traceLog('Menu item focused', `Item summary: ${li.innerText}`);

        this.itemFocus(ev, { ul, item, input });
    };

    private _removeFocus = (ul: HTMLUListElement) => {
        this._traceLog('Removing focus from any children', `Menu id: ${ul.id}`);

        // Defocus the current item (if any)
        ul.querySelectorAll('.focused').forEach((li) =>
            li.classList.remove('focused'),
        );

        this._infoLog('Removed focus from any children', `Menu id: ${ul.id}`);
    };

    private _log = (
        logLevel: LogLevel,
        title: string,
        message?: string[] | string,
        extraInfo?: unknown,
    ) => this.options.logger?.log(logLevel, title, message, extraInfo);

    private _traceLog = (
        title: string,
        message?: string[] | string,
        extraInfo?: unknown,
    ) => this._log(5, title, message, extraInfo);

    private _infoLog = (
        title: string,
        message?: string[] | string,
        extraInfo?: unknown,
    ) => this._log(3, title, message, extraInfo);

    // Debounce/throttle hybrid:
    // Call first then again after timeout (if called again)
    private _debrottle<F extends { (someEv: Event): void }>(func: F) {
        const that = this;
        let calledAgain: boolean;
        let dTimer: NodeJS.Timer | number | undefined;

        return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
            if (dTimer) {
                calledAgain = true;
            } else {
                const context = this;

                dTimer = setTimeout(() => {
                    if (calledAgain) {
                        calledAgain = false;

                        func.apply(context, args);
                    }

                    dTimer = undefined;
                }, that.options.delay);

                func.apply(context, args);
            }
        };
    }
}

const DefaultOptions: IDefaultOptions<{ label: string; value: string }> = {
    autoFocus: false,
    delay: 300,
    minLength: 2,
    position: {
        my: 'top center',
        at: 'bottom center',
        collision: CollisionHandler.ignore,
    },
    renderers: {
        itemRenderer: function ({ item }) {
            const li = document.createElement('li');

            if (typeof item === 'string') {
                li.innerText = item;
            } else {
                li.dataset.value = item.value || 'CustomType with no value';
                li.innerText =
                    item.label || item.value || 'CustomType with no label';
            }

            return li;
        },
        menuRenderer: ({ ul, items, itemRenderer }) => {
            items.forEach((item) =>
                ul.insertAdjacentElement(
                    'beforeend',
                    itemRenderer({ ul, item }),
                ),
            );
        },
    },
    recordMapper: (input) => {
        return Object.keys(input).map((i) => {
            return { label: i, value: input[i] };
        });
    },
    source: [],
};

export { IOptions, IPositionData };
