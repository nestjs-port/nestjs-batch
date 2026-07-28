/*
 * Copyright 2002-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ListenerMetaData } from "./listener-meta-data.interface.js";

/**
 * This factory implementation is used to create a job execution listener.
 */
export class JobListenerFactoryBean {
  private _delegate: unknown = null;

  setDelegate(delegate: unknown): void {
    this._delegate = delegate;
  }

  getObject(): unknown {
    return this._delegate;
  }

  getObjectType(): unknown {
    return undefined;
  }

  protected getMetaDataFromPropertyName(
    _propertyName: string,
  ): ListenerMetaData | null {
    return null;
  }

  protected getMetaDataValues(): ListenerMetaData[] {
    return [];
  }

  /**
   * Convenience method to wrap any object and expose the appropriate job listener
   * interfaces.
   * @param delegate a delegate object
   * @return a job listener instance constructed from the delegate
   */
  static getListener(delegate: unknown): unknown {
    const factory = new JobListenerFactoryBean();
    factory.setDelegate(delegate);
    return factory.getObject();
  }

  /**
   * Convenience method to check whether the given object is or can be made into a
   * job listener.
   * @param delegate the object to check
   * @return true if the delegate is a listener object
   */
  static isListener(delegate: unknown): boolean {
    return delegate != null && typeof delegate === "object";
  }
}
