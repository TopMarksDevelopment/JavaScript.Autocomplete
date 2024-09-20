'use strict';

import { ListItemType, SourceReturnTypes } from './SourceTypes';

export declare type UlListEventData = { ul: HTMLUListElement };
type ItemEventData<lT> = UlListEventData & {
    item: ListItemType<lT>;
    input: HTMLInputElement;
};
export declare type TermEventData = { term: string };
export declare type ItemsType<lT> = { items: ListItemType<lT>[] };

export declare type AutocompleteEventFunction<T, rT = void> = (
    event: Event,
    data: T,
) => rT;

export declare type CloseEventData = UlListEventData;
export declare type CreateEventData<lT> = ItemsType<lT>;
export declare type FocusEventData<lT> = ItemEventData<lT>;
export declare type OpenEventData = UlListEventData;
export declare type ResponseEventData<lT> = TermEventData & {
    items: SourceReturnTypes<lT>;
};
export declare type SearchEventData = TermEventData;
export declare type SelectEventData<lT> = ItemEventData<lT>;
