/* eslint-disable react/display-name */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { translate } from "@gqlapp/i18n-client-react";
import { Spin, Input, Divider } from "antd";
import { Table, Button, PageLayout } from "@gqlapp/look-client-react";

const { Search } = Input;

const GeneListView = ({
  deleteUser,
  orderBy,
  onOrderBy,
  loading,
  genes,
  t,
  history,
  loadDataGenes
}) => {
  const fetchMoreData = async () => {
    const hasMore = genes.pageInfo.hasNextPage;
    const endCursor = genes.pageInfo.endCursor;
    const totalCount = genes.totalCount;
    if (!hasMore) {
      return;
    } else {
      await loadDataGenes(endCursor + 1, "add");
    }
  };
  // const [errors, setErrors] = useState([]);

  // const handleDeleteUser = async id => {
  //   const result = await deleteUser(id);
  //   if (result && result.errors) {
  //     setErrors(result.errors);
  //   } else {
  //     setErrors([]);
  //   }
  // };

  // const renderOrderByArrow = name => {
  //   if (orderBy && orderBy.column === name) {
  //     if (orderBy.order === 'desc') {
  //       return <span className="badge badge-primary">&#8595;</span>;
  //     } else {
  //       return <span className="badge badge-primary">&#8593;</span>;
  //     }
  //   } else {
  //     return <span className="badge badge-secondary">&#8645;</span>;
  //   }
  // };

  // const handleOrderBy = (e, name) => {
  //   e.preventDefault();

  //   let order = 'asc';
  //   if (orderBy && orderBy.column === name) {
  //     if (orderBy.order === 'asc') {
  //       order = 'desc';
  //     } else if (orderBy.order === 'desc') {
  //       return onOrderBy({
  //         column: '',
  //         order: ''
  //       });
  //     }
  //   }

  //   return onOrderBy({ column: name, order });
  // };

  const handleSearch = (value)=>{
    history.push(`/gene/list?searchQuery=${value}`);
  }
  const columns = [
    {
      title: <b>Gene Id</b>,
      dataIndex: "node.geneId",
      key: "geneId",
    },
    {
      title: <b>Gene Symbol</b>,
      dataIndex: "node.geneSymbol",
      key: "geneSymbol",
    },
    {
      title: <b>Gene Name</b>,
      dataIndex: "node.geneName",
      key: "geneName",
    },
    {
      title: <b>Status</b>,
      dataIndex: "node.status",
      key: "status",
    },
    {
      title: <b>Ensembl Id</b>,
      dataIndex: "node.ensemblId",
      key: "ensemblId",
    },
    {
      title: <b>Action</b>,
      key: "actions",
      render: (text, record) => (
        <Button
          color="primary"
          size="sm"
          onClick={() => history.push(`/chart/${record.node.geneId}`)}
        >
          View Gene Annotation
        </Button>
      ),
    },
  ];

  return (
    <PageLayout>
      {loading && !genes ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Search
            placeholder="Search another query.."
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Divider />
          {/* {errors &&
            errors.map(error => (
              <div className="alert alert-danger" role="alert" key={error.field}>
                {error.message}
              </div>
            ))} */}
          <Table dataSource={genes.edges} columns={columns} />
          <br />
          <Button onClick={fetchMoreData}>Load More</Button>
        </>
      )}
    </PageLayout>
  );
};

GeneListView.propTypes = {
  loading: PropTypes.bool.isRequired,
  genes: PropTypes.array,
  orderBy: PropTypes.object,
  onOrderBy: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default translate("user")(GeneListView);
