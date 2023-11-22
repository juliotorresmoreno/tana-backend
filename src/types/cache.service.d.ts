
import { Callback } from "redis";

export type CacheService = {
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<string>;
    publish(key: string, value: string): Promise<void>;
    subscribe(key: string, fn: (reply: string) => void): Promise<void>;
}
