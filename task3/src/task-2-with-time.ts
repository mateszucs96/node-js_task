/* eslint-disable class-methods-use-this */
import { EventEmitter } from './task-1-event-emitter';

export type Callback = (error: Error | null, data?: any) => void;
export type AsyncFunction = (url: string, ...cbArgs: any[]) => void;

/**
 * Class that manages the execution of asynchronous operations.
 * @extends EventEmitter
 */
export class WithTime extends EventEmitter {
  /**
   * Executes a provided asynchronous function and computes the time it takes to execute it.
   * Emits event "start", event "end" and event "data" for the data received.
   * @param {AsyncFunction} asyncFunc - The asynchronous function to be executed.
   * This function should accept a callback as its last argument.
   * @param {...any[]} args - The arguments to be passed to the asyncFunc, excluding the callback.
   */
  execute(asyncFunc: AsyncFunction, ...args: any[]): void {
    // implementation here
  }
}
