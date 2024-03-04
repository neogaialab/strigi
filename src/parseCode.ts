import { parse, traverse } from '@babel/core';
import generate from "@babel/generator";
import { Node } from './types';

async function parseCode(code: string) {
    const ast = parse(code, {
        sourceType: 'module',
        presets: [
            "@babel/preset-typescript"
        ],
        filename: "script.ts"
    });

    const comments: Node[] = [];

    // @ts-ignore
    traverse(ast, {
        FunctionDeclaration(path) {
            const { node } = path;
            const { loc } = node;

            if (node.id && node.id.name) {
                comments.push({
                    code: generate(node).code,
                    type: 'function',
                    start: loc?.start,
                    end: loc?.end,
                });
            }
        },
    });

    return comments;
}

export default parseCode;
