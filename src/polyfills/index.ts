import { PolyfillTextDecoderStream } from "./TextDecoderStream";

(globalThis as unknown as any).TextDecoderStream = PolyfillTextDecoderStream
