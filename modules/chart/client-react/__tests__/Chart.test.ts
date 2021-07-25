import { expect } from 'chai';

import { updateContent, Renderer } from '@gqlapp/testing-client-react';

describe('Chart UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  renderer.history.push('/Chart');
  const content = updateContent(app.container);

  it('Chart page renders on mount', () => {
    // tslint:disable:no-unused-expression
    expect(content).to.not.be.empty;
  });

  it('Chart page has title', async () => {
    expect(content.textContent).to.include('Hello, This is the Chart module');
  });
});
