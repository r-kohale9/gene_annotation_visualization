import chart from '@gqlapp/chart-server-ts';
import pathway from '@gqlapp/pathway-server-ts';
import disease from '@gqlapp/disease-server-ts';
import drug from '@gqlapp/drug-server-ts';
import cell from '@gqlapp/cell-server-ts';
import gene from '@gqlapp/gene-server-ts';
import home from '@gqlapp/home-server-ts';
import core from '@gqlapp/core-server-ts';
import i18n from '@gqlapp/i18n-server-ts';
import validation from '@gqlapp/validation-common-react';
import counter from '@gqlapp/counter-server-ts';
import chat from '@gqlapp/chat-server-ts';
import contact from '@gqlapp/contact-server-ts';
import cookies from '@gqlapp/cookies-server-ts';
import post from '@gqlapp/post-server-ts';
import upload from '@gqlapp/upload-server-ts';
import subscription from '@gqlapp/payments-server-ts';
import mailer from '@gqlapp/mailer-server-ts';
import graphqlTypes from '@gqlapp/graphql-types-server-ts';
import authentication from '@gqlapp/authentication-server-ts';
import reports from '@gqlapp/reports-server-ts';
import rest from '@gqlapp/rest-server-ts';
import '@gqlapp/debug-server-ts';

import ServerModule from '@gqlapp/module-server-ts';

const user = require('@gqlapp/user-server-ts').default;

const modules: ServerModule = new ServerModule(
  chart,
  pathway,
  disease,
  drug,
  cell,
  gene,
  home,
  authentication,
  cookies,
  i18n,
  validation,
  counter,
  post,
  subscription,
  user,
  upload,
  contact,
  mailer,
  chat,
  reports,
  rest,
  graphqlTypes,
  core
);

export default modules;
