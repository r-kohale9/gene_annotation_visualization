import { expect } from 'chai';

import { updateContent, Renderer } from '@gqlapp/testing-client-react';

describe('Cell UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  renderer.history.push('/Cell');
  const content = updateContent(app.container);

  it('Cell page renders on mount', () => {
    // tslint:disable:no-unused-expression
    expect(content).to.not.be.empty;
  });

  it('Cell page has title', async () => {
    expect(content.textContent).to.include('Hello, This is the Cell module');
  });
});
