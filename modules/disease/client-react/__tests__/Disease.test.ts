import { expect } from 'chai';

import { updateContent, Renderer } from '@gqlapp/testing-client-react';

describe('Disease UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  renderer.history.push('/Disease');
  const content = updateContent(app.container);

  it('Disease page renders on mount', () => {
    // tslint:disable:no-unused-expression
    expect(content).to.not.be.empty;
  });

  it('Disease page has title', async () => {
    expect(content.textContent).to.include('Hello, This is the Disease module');
  });
});
