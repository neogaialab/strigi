import { types } from '@babel/core';

export type Node = {
    type: "function",
    code: string,
    start?: types.SourceLocation['start'],
    end?: types.SourceLocation['end'],
};
