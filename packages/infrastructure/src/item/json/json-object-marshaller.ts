export interface JsonObjectMarshaller<T> {
  marshal(object: T): string;
}
