import { expect } from 'chai';

import { updateContent, Renderer } from '@gqlapp/testing-client-react';

describe('Gene UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  renderer.history.push('/Gene');
  const content = updateContent(app.container);

  it('Gene page renders on mount', () => {
    // tslint:disable:no-unused-expression
    expect(content).to.not.be.empty;
  });

  it('Gene page has title', async () => {
    expect(content.textContent).to.include('Hello, This is the Gene module');
  });
});
