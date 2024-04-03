import { PolyfillTextDecoderStream } from "./TextDecoderStream";

(globalThis as any).TextDecoderStream = PolyfillTextDecoderStream
