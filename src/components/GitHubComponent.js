import React, { Component } from 'react';
import axios from 'axios';
import { Button, Card, Avatar, message, Modal, Spin, Space } from 'antd';
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
    };
  }

  componentDidMount() {
    axios
      .get(`https://api.github.com/users/${this.props.userName}`)
      .then((res) => {
        if (res.data) {
          this.setState({
            userData: res.data,
            dataload: true,
          });
        }
      })
      .catch((err) => {
        message.error('Invalid username!');
      });
  }
  showModal = () => {
    this.setState({
      isModalOpen: true,
    });
    axios
      .get(`https://api.github.com/users/${this.props.userName}/repos`)
      .then((res) => {
        if (res.data) {
          this.setState({
            repoInfo: res.data,
          });
        }
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
          <div>
            <Card
              key={repo.id}
              style={{
                width: '100%',
                marginBottom: '10px',
                borderRadius: '6px',
              }}
            >
              <p>
                <BookOutlined />
                <a
                  style={{ marginLeft: '8px' }}
                  href={`https://github.com/saifulshihab/${repo.name}.git`}
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
        <div style={{ padding: 50 }}>
          <Card
            style={{ width: 300, margin: '0 auto' }}
            cover={<img alt="example" src={this.state.userData.avatar_url} />}
            actions={[
              <Button type="dashed" onClick={this.showModal}>
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
              style={{ width: '100%' }}
              cover={<img alt="example" src={this.state.userData.avatar_url} />}
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
                  {this.state.userData.blog}
                </p>
              </div>
              <div style={{ marginTop: 30 }}>{this.ReposData()}</div>
            </Card>
          </Modal>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Card style={{ width: 300, margin: '0 auto' }}>
            <Space style={{ paddingTop: 150, paddingBottom: 150 }}>
              <Spin size="large"></Spin>
            </Space>
          </Card>
        </div>
      );
    }
  }
}

export default GHApi;
