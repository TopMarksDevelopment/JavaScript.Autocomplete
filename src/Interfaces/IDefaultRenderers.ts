'use strict';

import { ListItemType } from '../Types/SourceTypes';

type ItemRenderer<rT> = (data: {
    ul: HTMLUListElement;
    item: ListItemType<rT>;
}) => HTMLLIElement;

export interface IRenderers<rT> {
    menuRenderer?: (data: {
        ul: HTMLUListElement;
        items: ListItemType<rT>[];
        itemRenderer: ItemRenderer<rT>;
    }) => void;
    itemRenderer?: ItemRenderer<rT>;
}
