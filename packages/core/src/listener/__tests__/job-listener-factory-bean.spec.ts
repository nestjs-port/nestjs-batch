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

import { describe, expect, it } from "vitest";

import { AfterJob } from "../../annotation/after-job.decorator.js";
import { BeforeJob } from "../../annotation/before-job.decorator.js";
import type { JobExecution } from "../../job/job-execution.js";
import { JobListenerFactoryBean } from "../job-listener-factory-bean.js";
import type { JobExecutionListener } from "../job-execution-listener.interface.js";

const jobExecution = {} as JobExecution;

describe("JobListenerFactoryBean", () => {
  it("test with interface", () => {
    const delegate = new JobListenerWithInterface();
    const factory = new JobListenerFactoryBean();
    factory.setDelegate(delegate);

    const listener = factory.getObject();
    listener.beforeJob?.(jobExecution);
    listener.afterJob?.(jobExecution);

    expect(delegate.beforeJobCalled).toBe(true);
    expect(delegate.afterJobCalled).toBe(true);
  });

  it("test with annotations", () => {
    const delegate = new AnnotatedTestClass();
    const listener = JobListenerFactoryBean.getListener(delegate);

    listener.beforeJob?.(jobExecution);
    listener.afterJob?.(jobExecution);

    expect(delegate.beforeJobCalled).toBe(true);
    expect(delegate.afterJobCalled).toBe(true);
  });

  it("test factory method", () => {
    const delegate = new JobListenerWithInterface();
    const listener = JobListenerFactoryBean.getListener(delegate);

    expect(JobListenerFactoryBean.isListener(listener)).toBe(true);
    listener.afterJob?.(jobExecution);
    expect(delegate.afterJobCalled).toBe(true);
  });

  it("test vanilla interface with proxy", () => {
    const delegate = new JobListenerWithInterface();
    const proxy = new Proxy(delegate, {});
    const listener = JobListenerFactoryBean.getListener(proxy);

    expect(JobListenerFactoryBean.isListener(listener)).toBe(true);
  });

  it("test use in set", () => {
    const delegate = new JobListenerWithInterface();
    const listener = JobListenerFactoryBean.getListener(delegate);
    const listeners = new Set<JobExecutionListener>();
    listeners.add(listener);
    listeners.add(listener);

    expect(listeners.has(listener)).toBe(true);
    expect(listeners.size).toBe(1);
  });

  it("test annotations is listener", () => {
    const delegate = new AnnotatedTestClass();
    expect(JobListenerFactoryBean.isListener(delegate)).toBe(true);
  });

  it("test interface is listener", () => {
    expect(
      JobListenerFactoryBean.isListener(new JobListenerWithInterface()),
    ).toBe(true);
  });

  it("test equality of proxies", () => {
    const delegate = new JobListenerWithInterface();
    const listener = JobListenerFactoryBean.getListener(delegate);
    const other = JobListenerFactoryBean.getListener(delegate);

    // Java proxies delegate equality to the target; JavaScript proxies do not.
    expect(listener).not.toBe(other);
  });
});

class JobListenerWithInterface implements JobExecutionListener {
  beforeJobCalled = false;
  afterJobCalled = false;

  beforeJob(_jobExecution: JobExecution): void {
    this.beforeJobCalled = true;
  }

  afterJob(_jobExecution: JobExecution): void {
    this.afterJobCalled = true;
  }
}

class AnnotatedTestClass {
  beforeJobCalled = false;
  afterJobCalled = false;

  @BeforeJob()
  before(_jobExecution: JobExecution): void {
    this.beforeJobCalled = true;
  }

  @AfterJob()
  after(_jobExecution: JobExecution): void {
    this.afterJobCalled = true;
  }
}
