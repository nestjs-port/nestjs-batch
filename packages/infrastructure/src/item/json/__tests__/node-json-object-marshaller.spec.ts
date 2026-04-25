import { describe, expect, it } from "vitest";
import { NodeJsonObjectMarshaller } from "../node-json-object-marshaller.js";

describe("NodeJsonObjectMarshaller", () => {
  it("test json marshalling", () => {
    // given
    const jsonObjectMarshaller = new NodeJsonObjectMarshaller<Foo>();

    // when
    const foo = jsonObjectMarshaller.marshal(new Foo(1, "foo"));

    // then
    expect(foo).toBe('{"id":1,"name":"foo"}');
  });
});

class Foo {
  constructor(
    public id: number,
    public name: string,
  ) {}
}
