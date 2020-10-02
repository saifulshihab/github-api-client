import React, { Component } from 'react';
import axios from 'axios';
import { Col, Button, Card, Avatar, message, Modal, Spin, Space } from 'antd';
import {
  EyeOutlined,
  StarOutlined,
  UsergroupAddOutlined,
  PaperClipOutlined,
  HomeOutlined,
  BookOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
const { Meta } = Card;

class GHApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      isModalOpen: false,
      dataload: false,
      repoInfo: [],
      invalidUn: false,
    };
  }
  api_url = `https://api.github.com/users/${this.props.userName}`;
  componentDidMount() {
    const req = axios.get(this.api_url);
    const req2 = axios.get(this.api_url + '/repos');
    axios
      .all([req, req2])
      .then(
        axios.spread((...res) => {
          this.setState({
            userData: res[0].data,
            repoInfo: res[1].data,
            dataload: true,
          });
        })
      )
      .catch((err) => {
        this.setState({
          invalidUn: true,
        });
        if (err.response.status === 404) {
          message.error('Invalid Username!');
        } else {
          message.error(err.message);
        }
      });
  }
  showModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };
  ReposData() {
    if (this.state.repoInfo.length !== 0) {
      const data = this.state.repoInfo.map((repo) => {
        let repo_lang_color;
        if (repo.language === 'JavaScript') {
          repo_lang_color = '#f1e05a';
        } else if (repo.language === 'Python') {
          repo_lang_color = '#3572A5';
        } else if (repo.language === 'HTML') {
          repo_lang_color = '#e34c26';
        } else if (repo.language === 'ASP') {
          repo_lang_color = '#6a40fd';
        } else if (repo.language === 'C') {
          repo_lang_color = '#555555';
        } else if (repo.language === 'Java') {
          repo_lang_color = '#b07219';
        }
        return (
          <Col
            style={{
              display: 'inline-block',
              padding: '2px',
            }}
            xs={24}
            sm={12}
            md={6}
          >
            <div key={repo.id}>
              <Card className="repo_card">
                <p>
                  <BookOutlined />
                  <a
                    style={{ marginLeft: '8px' }}
                    href={`https://github.com/${repo.owner.login}/${repo.name}.git`}
                  >
                    {repo.full_name}
                  </a>
                </p>
                <p>{repo.description}</p>
                <p>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      background: repo_lang_color,
                    }}
                  ></div>
                  <span style={{ marginLeft: '7px', marginRight: '20px' }}>
                    {repo.language}
                  </span>
                  <StarOutlined />
                  <span style={{ marginLeft: '7px', marginRight: '20px' }}>
                    {repo.stargazers_count}
                  </span>
                  <DatabaseOutlined />
                  <span style={{ marginLeft: '7px', marginRight: '20px' }}>
                    {repo.size}KB
                  </span>
                  <EyeOutlined />
                  <span style={{ marginLeft: '7px', marginRight: '20px' }}>
                    {repo.watchers}
                  </span>
                </p>
              </Card>
            </div>
          </Col>
        );
      });
      return data;
    }
  }
  handleOk = (e) => {
    this.setState({
      isModalOpen: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      isModalOpen: false,
    });
  };
  spinOpen() {
    if (this.state.spinActive) {
      return (
        <Space>
          <Spin size="large"></Spin>
        </Space>
      );
    }
  }
  render() {
    if (this.state.dataload) {
      return (
        <div>
          <Card
            className="profile__card"
            cover={<img alt="example" src={this.state.userData.avatar_url} />}
            actions={[
              <Button
                style={{
                  background: 'transparent',
                  borderColor: '#1890ff',
                  color: '#1890ff',
                }}
                type="dashed"
                onClick={this.showModal}
              >
                <EyeOutlined /> View Details
              </Button>,
            ]}
          >
            <Meta
              avatar={<Avatar src={this.state.userData.avatar_url} />}
              title={this.state.userData.name}
              description={this.state.userData.bio}
            />
          </Card>

          <Modal
            title="GitHub Profile"
            visible={this.state.isModalOpen}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Card
              className="profile__card"
              cover={
                <img
                  style={{ width: '20%' }}
                  alt="example"
                  src={this.state.userData.avatar_url}
                />
              }
            >
              <Meta
                avatar={<Avatar src={this.state.userData.avatar_url} />}
                title={this.state.userData.name}
                description={this.state.userData.bio}
              />

              <div className="follow-star" style={{ marginTop: 30 }}>
                <p>
                  <UsergroupAddOutlined style={{ marginRight: '6px' }} />{' '}
                  {this.state.userData.followers} Followers{' '}
                  <span style={{ marginLeft: '8px' }}>
                    {this.state.userData.following} Following
                  </span>
                </p>
                <p>
                  <BookOutlined style={{ marginRight: '6px' }} />
                  <span> {this.state.repoInfo.length} (Repo)</span>
                </p>
              </div>
              <div>
                <p>
                  <HomeOutlined style={{ marginRight: '6px' }} />{' '}
                  {this.state.userData.location}
                </p>
                <p>
                  <PaperClipOutlined style={{ marginRight: '6px' }} />{' '}
                  <a href={this.state.userData.blog}>{this.state.userData.blog}</a>
                </p>
              </div>
              <div style={{ marginTop: 30 }}>{this.ReposData()}</div>
            </Card>
          </Modal>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: 'center' }}>
          {this.state.invalidUn ? (
            <div></div>
          ) : (
            <Card className="profile__card">
              <Space style={{ paddingTop: 150, paddingBottom: 150 }}>
                <Spin size="large"></Spin>
              </Space>
            </Card>
          )}
        </div>
      );
    }
  }
}

export default GHApi;
