import { expect } from 'chai';

import { updateContent, Renderer } from '@gqlapp/testing-client-react';

describe('Drug UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  renderer.history.push('/Drug');
  const content = updateContent(app.container);

  it('Drug page renders on mount', () => {
    // tslint:disable:no-unused-expression
    expect(content).to.not.be.empty;
  });

  it('Drug page has title', async () => {
    expect(content.textContent).to.include('Hello, This is the Drug module');
  });
});
