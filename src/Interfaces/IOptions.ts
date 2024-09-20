'use strict';

import { JavascriptLogger } from '@topmarksdevelopment/javascript-logger';
import { IRenderers } from './IDefaultRenderers';
import { ListItemType, SourceTypes } from '../Types/SourceTypes';
import { IPositionData } from './IPositionData';
import {
    AutocompleteEventFunction as EventFunction,
    CloseEventData,
    FocusEventData,
    ItemsType,
    TermEventData,
    OpenEventData,
    SelectEventData,
} from '../Types/EventTypes';

interface IOptionsWithDefaults<T = unknown> {
    /**
     * Automatically focus on the first element when the menu opens
     * @default = false
     */
    autoFocus?: boolean;
    //classes?: Record<K..., string>;

    /**
     * The delay between a keystroke and a search.
     * This acts like a throttle between source calls
     * @default = 300
     */
    delay?: number;

    /**
     * Minimum term entered by the user before we query the source
     * @default = 2
     */
    minLength?: number;

    /**
     * Define how objects shold be mapped
     *
     * Example: { "key": "val", "key2": "val2" }
     * becomes [ { "label: "key", "value": "val"}, { "label: "key2", "value": "val2"} ]
     * @default = Property name => `label` & Property value => `value`
     */
    recordMapper?: (input: Record<string, string>) => ListItemType<T>[];

    /**
     * How shold the autocomplete box positioned
     * @default = { my: "top center", at: "bottom center" }
     */
    position?: IPositionData;

    /**
     * Specify how we render the elements
     * @default = Create standard <ul> and <li> elements
     */
    renderers?: IRenderers<T>;
}

export interface IOptionsWithoutDefaults<T = unknown> {
    /**
     * Append the menu element to this, instead of the body
     */
    appendTo?: HTMLElement;

    /**
     * Log stages of the autocomplete processes
     */
    logger?: JavascriptLogger<unknown>;

    /**
     * The source of the autocompelte data
     *
     * string => a URL that we will query for JSON data
     *
     * OR Record set => an object with string keys and values, treated as label, value respectively
     *
     * OR string[] => an array of strings with each item treated as both the value and label
     *
     * OR `T`[] => an array of the specified generic type
     *
     * OR function => a function that receives `{ term }` and returns one of the above sets
     */
    source: SourceTypes<T>;

    onClose?: EventFunction<CloseEventData>;
    onCreated?: EventFunction<CloseEventData>;
    onItemFocus?: EventFunction<FocusEventData<T>>;
    onOpen?: EventFunction<OpenEventData>;
    onResponse?: EventFunction<ItemsType<T>>;
    onSearch?: EventFunction<TermEventData>;
    onItemSelect?: EventFunction<SelectEventData<T>>;
    onStart?: () => void;
    onStop?: () => void;
}

export interface IOptions<T = unknown>
    extends IOptionsWithDefaults<T>,
        IOptionsWithoutDefaults<T> {}

// Overwrite the two properties as their children are required/defaulted too
export interface IDefaultOptions<T = unknown>
    extends Required<IOptionsWithDefaults<T>>,
        IOptionsWithoutDefaults<T> {
    /**
     * Specify how we render the elements
     */
    renderers: Required<IRenderers<T>>;

    /**
     * How shold the autocomplete box positioned
     */
    position: Required<IPositionData>;
}
