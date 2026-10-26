// The demo PR body: the standard body (core's renderStandardPr) plus the colour the issue asked
// for and how to ask for another, so a reviewer knows what to look for in the preview and how to
// drive the feedback loop.
import { z } from '@tyto/core';
import { defineModule, renderStandardPr, STANDARD_SECTIONS, type RunSummary, type Spec } from '@tyto/core';

/** The part of template-demo's detail this body reads (modules stay independent, D36). */
interface DemoDetail {
  colour: string;
  name: string;
}

const Config = z
  .object({
    /** Show the run's cost in the run details. */
    showCost: z.boolean().default(true),
    /** Local production stand-in to compare with the PR preview. */
    productionUrl: z.string().url().optional(),
  })
  .strict();

const SECTIONS = [...STANDARD_SECTIONS.slice(0, -1), 'Colour', STANDARD_SECTIONS.at(-1)!];

const demoDetail = (spec: Spec): DemoDetail | undefined => {
  const d = spec.detail as Partial<DemoDetail> | undefined;
  return d && typeof d.colour === 'string' && typeof d.name === 'string' ? (d as DemoDetail) : undefined;
};

export function demoSections(spec: Spec, productionUrl?: string): Record<string, string> {
  const detail = demoDetail(spec);
  if (!detail) return {};
  return {
    Colour: [
      ...(productionUrl
        ? [
            `Compare the [production demo (dev branch)](${productionUrl}) with this PR’s preview linked above. These are separate local instances; PR changes appear only in the preview.`,
          ]
        : []),
      `The issue asked for **${detail.name}** \`${detail.colour}\`. The preview's page background is that colour, and the bar at the top of every page names it.`,
      'To try another colour, comment here (or on the issue), e.g. "Make the background Mint (#6fe3b4)". The factory wakes the PR, the Judge applies the change, and the preview and the bar follow; the Ledger below records the decision.',
    ].join('\n\n'),
  };
}

export default defineModule({
  type: 'prTemplate',
  id: 'demo',
  version: '0.1.0',
  description: 'The demo PR body: the standard sections plus the requested colour and how to ask for another',
  configSchema: Config,
  create: (config) => ({
    file: () => SECTIONS.map((h) => `## ${h}\n\n<!-- filled by tyto-code -->\n`).join('\n'),
    render: (spec: Spec, summary: RunSummary) =>
      renderStandardPr(spec, summary, {
        showCost: config.showCost,
        extra: demoSections(spec, config.productionUrl),
      }),
  }),
});
