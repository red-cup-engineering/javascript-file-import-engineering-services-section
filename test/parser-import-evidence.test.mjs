import test from 'node:test';
import assert from 'node:assert/strict';
import { readJavascriptFileImports as read } from '@red-cup-engineering/javascript-file-import-engineering-services-section/read-javascript-file-imports';
const reading = text => ({type:'TextFileRead',path:'/source/example.mjs',text});

test('parser refuses malformed syntax rather than manufacturing partial import evidence',()=>{
 assert.throws(()=>read(reading("import './valid.mjs'; import {")),SyntaxError);
});
test('escaped specifiers carry decoded resolution values and authored UTF-16 interior offsets',()=>{
 const text=String.raw`// 😀`+'\r\n'+String.raw`import './\u0061.mjs'; export * from "./b.mjs";`;
 const result=read(reading(text));
 assert.deepEqual(result.imports.map(x=>x.specifier),['./a.mjs','./b.mjs']);
 assert.deepEqual(result.imports.map(x=>text.slice(x.start,x.end)),[String.raw`./\u0061.mjs`,'./b.mjs']);
 assert.ok(Object.isFrozen(result)&&Object.isFrozen(result.imports[0]));
});
test('literal ESM evidence does not infer arbitrary resolution methods or CommonJS requests',()=>{
 const result=read(reading(`const object={resolve:x=>x}; object.resolve('./fiction.mjs'); require('./cjs.cjs'); import(name); import.meta.resolve(name); import.meta.resolve('./real.mjs');`));
 assert.deepEqual(result.imports.map(x=>[x.kind,x.specifier]),[['import-meta-resolve','./real.mjs']]);
});
