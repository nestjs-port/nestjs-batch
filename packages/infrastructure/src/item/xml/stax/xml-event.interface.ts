export interface QName {
  localPart: string;
  namespaceURI?: string | null;
  prefix?: string | null;
}

export interface XMLEvent {
  getEventType(): number;

  isStartElement(): boolean;
  isEndElement(): boolean;
  isStartDocument(): boolean;
  isEndDocument(): boolean;
}

export interface StartElementEvent extends XMLEvent {
  getName(): QName;
}

export interface EndElementEvent extends XMLEvent {
  getName(): QName;
}
