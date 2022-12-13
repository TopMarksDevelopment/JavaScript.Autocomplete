import { ISourceData } from '../Interfaces/ISourceData';

export declare type ListItemType<T extends string | unknown> = T extends string
    ? string
    : T;

export declare type SourceReturnTypes<T extends string | unknown> =
    | ListItemType<T>[]
    | Record<string, string>;

export declare type SourceTypes<T extends string | unknown> =
    | string
    | SourceReturnTypes<T>
    | ((data: ISourceData) => SourceReturnTypes<T>);
