// Garante que src/components/shared/ continua servindo a qualquer especialidade:
// nada de termos de uma especialidade e nada de ler textos padrão por conta própria
// (os textos chegam por props, vindos do template). Roda em `npm run lint`.
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('../src/components/shared/', import.meta.url);
const RULES = [
  {
    pattern: /psiqui|psicol|psych|endocrin|endocrine|\bCVV\b|ansiedade|depress|diabet|tireo|horm[oô]n|obesid|emagrec|menopaus|l[oó]tus/i,
    reason: 'termo de especialidade (deve vir do template, por props)',
  },
  { pattern: /\bgetCopy\b|lib\/copy/, reason: 'textos padrão devem chegar por props, não pelo getCopy' },
  { pattern: /templates\//, reason: 'componente compartilhado não pode depender de um template' },
];

const problems = [];
for (const file of readdirSync(dir).sort()) {
  readFileSync(new URL(file, dir), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const { pattern, reason } of RULES) {
        const m = line.match(pattern);
        if (m) problems.push(`src/components/shared/${file}:${i + 1}: "${m[0]}" — ${reason}`);
      }
    });
}

if (problems.length) {
  console.error(`[lint] ${problems.length} problema(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('[lint] src/components/shared: ok');
