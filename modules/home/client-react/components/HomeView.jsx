import React, { Component } from 'react';
import { PageLayout } from '@gqlapp/look-client-react'
import { Input, Typography, message } from 'antd';

const { Search } = Input;
const { Title } = Typography;

const HomeView = (props) => {
  const { history } = props;
  const handleSearch = (value) => {
    if(value && value !==''){
      history.push(`/gene/list?searchQuery=${value}`);

    }else{
      message.error('Please enter your query to continue')
    }
  }
  return (<PageLayout isHome>
    <div style={{ height: '100vh', width: '100%', display: 'grid', placeItems: "center" }}>
      <div style={{ width: '100%', maxWidth: '700px', height: '60vh', }}>
        <Title level={1} style={{ textAlign: 'center' }}>Gene Annotation Visualizer</Title>
        <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>Type in your gene query</Title>
        <Search
          placeholder="input your gene query"
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />

      </div>
    </div>

  </PageLayout>);
}

export default HomeView;