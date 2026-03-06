// javax.xml.stream.XMLEventReader 가 Iterator<unknown>로 변환
export interface FragmentEventReader extends Iterator<unknown> {
  markStartFragment(): void;

  markFragmentProcessed(): void;

  reset(): void;
}
