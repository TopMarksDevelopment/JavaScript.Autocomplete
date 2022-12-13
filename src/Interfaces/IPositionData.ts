import { Alignment, CollisionHandler } from '@topmarksdevelopment/position';

export interface IPositionData {
    my?: Alignment;
    at?: Alignment;
    collision?: CollisionHandler;
}
