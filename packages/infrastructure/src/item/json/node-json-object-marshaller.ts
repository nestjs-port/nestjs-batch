import type { JsonObjectMarshaller } from "./json-object-marshaller.js";

export class NodeJsonObjectMarshaller<T> implements JsonObjectMarshaller<T> {
  marshal(object: T): string {
    return JSON.stringify(object);
  }
}
