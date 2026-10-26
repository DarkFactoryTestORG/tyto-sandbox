// The demo issue template: pick a page background colour for Plotline's web app, so the change is
// obvious in the preview, and a reviewer can ask for another colour on the PR (or the issue) to
// watch a Judge round apply it. Sections: Summary, Background colour (both @core), Notes (optional,
// @context). The scope is the template's, not the issue's: the Judge reads it to decide that "make
// it green" on the PR is in scope.
import { defineModule, type IssueForm, type LintError, type RawIssue, type Spec, type SpecSection } from '@tyto/core';

/** The presets the form offers; mid-tone, so Plotline's dark text stays readable on each. */
export const PRESETS = [
  { name: 'Ocean blue', hex: '#4fa3ff' },
  { name: 'Mint', hex: '#6fe3b4' },
  { name: 'Sunflower', hex: '#ffd54f' },
  { name: 'Coral', hex: '#ff8a80' },
  { name: 'Lavender', hex: '#b39ddb' },
] as const;
const CUSTOM = 'Custom (the hex under Custom colour)';

/** The file and the marker the demo-colour brick keeps the colour under. */
export const DEMO_FILE = 'apps/web/src/app/globals.css';
export const SCOPE = {
  in: [`the page background colour and its label in ${DEMO_FILE}, including another colour a reviewer asks for on the PR or the issue`],
  out: ['any other file or style'],
};

export interface DemoDetail {
  colour: string;
  name: string;
}

const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/;

interface Line {
  text: string;
  line: number;
}

function splitSections(body: string): Map<string, { line: number; lines: Line[] }> {
  const sections = new Map<string, { line: number; lines: Line[] }>();
  let current: Line[] | undefined;
  body.split(/\r?\n/).forEach((text, i) => {
    const heading = /^###\s+(.+?)\s*$/.exec(text);
    if (heading && !text.startsWith('####')) {
      current = [];
      sections.set(heading[1]!, { line: i + 1, lines: current });
    } else if (current && text.trim() && text.trim() !== '_No response_' && !text.trim().startsWith('<!--')) {
      current.push({ text: text.trim(), line: i + 1 });
    }
  });
  return sections;
}

function analyse(body: string): { detail: DemoDetail; errors: LintError[]; summary: string; notes: string } {
  const errors: LintError[] = [];
  const sections = splitSections(body);
  const text = (name: string) => (sections.get(name)?.lines ?? []).map((l) => l.text).join(' ');
  const line = (name: string) => sections.get(name)?.line ?? 1;

  const summary = text('Summary');
  if (!summary) errors.push({ rule: 'section.required', section: 'Summary', line: line('Summary'), message: 'section "Summary" is missing or empty' });

  const detail: DemoDetail = { colour: '', name: '' };
  const chosen = text('Background colour');
  if (!chosen) {
    errors.push({ rule: 'section.required', section: 'Background colour', line: line('Background colour'), message: 'section "Background colour" is missing or empty' });
  } else if (chosen.startsWith('Custom')) {
    const hex = HEX.exec(text('Custom colour'))?.[0];
    if (hex) Object.assign(detail, { colour: hex.toLowerCase(), name: 'Custom' });
    else errors.push({ rule: 'colour.custom', section: 'Custom colour', line: line('Custom colour'), message: 'Custom needs a hex colour such as #33aa77 under "Custom colour"' });
  } else {
    const hex = HEX.exec(chosen)?.[0];
    const preset = PRESETS.find((p) => chosen.startsWith(p.name));
    if (hex) Object.assign(detail, { colour: hex.toLowerCase(), name: preset?.name ?? 'Custom' });
    else errors.push({ rule: 'colour.format', section: 'Background colour', line: line('Background colour'), message: `expected a preset such as "${PRESETS[0].name} (${PRESETS[0].hex})" or a hex colour, got "${chosen}"` });
  }

  return { detail, errors, summary, notes: text('Notes') };
}

const VALID = `### Summary
Make the preview obviously ours: an ocean-blue page background.

### Background colour
Ocean blue (#4fa3ff)

### Custom colour
_No response_

### Notes
_No response_
`;

const INVALID = `### Summary

### Background colour
${CUSTOM}

### Custom colour
blue-ish
`;

function form(): IssueForm {
  return {
    name: 'Demo: background colour',
    description: "Plotline's repo-owned demo: choose a background, then review the colour on the PR.",
    title: '[demo] Background colour',
    body: [
      {
        type: 'markdown',
        attributes: {
          value:
            'The factory sets the page background of the web app to this colour and labels it at the top of every page, ' +
            'so the preview shows the change at a glance. To change it again, comment on the PR or this issue, e.g. ' +
            '"Make the background Mint (#6fe3b4)": the factory wakes, the Judge applies it and the preview updates.',
        },
      },
      { type: 'input', id: 'summary', attributes: { label: 'Summary', description: 'One sentence: why this colour.', value: 'Make the preview obviously ours.' }, validations: { required: true } },
      {
        type: 'dropdown',
        id: 'colour',
        attributes: { label: 'Background colour', options: [...PRESETS.map((p) => `${p.name} (${p.hex})`), CUSTOM], default: 0 },
        validations: { required: true },
      },
      { type: 'input', id: 'custom', attributes: { label: 'Custom colour', description: 'Only for Custom: a hex colour, e.g. #33aa77.', placeholder: '#33aa77' } },
      { type: 'textarea', id: 'notes', attributes: { label: 'Notes', description: 'Optional context for the agent.' } },
    ],
  };
}

export default defineModule({
  type: 'template',
  id: 'demo',
  version: '0.1.0',
  description: 'Demo issue template: a page background colour for Plotline (a preset or a hex), visible in the preview',
  fixtures: { validIssue: VALID, invalidIssue: INVALID },
  create: () => ({
    form,
    lint(issue: RawIssue) {
      const { errors } = analyse(issue.body);
      return { ok: errors.length === 0, errors };
    },
    parse(issue: RawIssue): Spec {
      const { detail, summary, notes } = analyse(issue.body);
      const sections: SpecSection[] = [
        { name: 'Summary', group: 'core', markdown: summary },
        { name: 'Background colour', group: 'core', markdown: `${detail.colour} (${detail.name})` },
        { name: 'Scope', group: 'core', markdown: [...SCOPE.in.map((s) => `- In: ${s}`), ...SCOPE.out.map((s) => `- Out: ${s}`)].join('\n') },
        ...(notes ? [{ name: 'Notes', group: 'context' as const, markdown: notes }] : []),
      ];
      return {
        core: { title: issue.title, owner: `@${issue.author}`, summary, scope: SCOPE },
        detail,
        sections,
        tasks: [{ id: 'T1', title: `Set the page background to ${detail.colour}`, dependsOn: [] }],
        has: {},
      };
    },
  }),
});
