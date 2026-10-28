import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
const {version}=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
let commit=null;
if(process.env.GITHUB_ACTIONS){commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Invalid checkout SHA');}
await writeFile(new URL('../dist/build-info.mjs',import.meta.url),'export const BUILD = '+JSON.stringify({version,commit})+';\n');
