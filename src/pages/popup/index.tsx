import React from 'react';
import ReactDOM from 'react-dom/client';
import { Tabs, Alert, Radio, Button } from 'antd';
import {
  YoutubeOutlined,
  WindowsOutlined,
  ContainerOutlined,
  PictureOutlined,
  FileSearchOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import ImgItemList from './component/imgItemList';
import VideoItemList from './component/videoItemList';
import TxItemList from './component/txItemList';
import './index.scss';

type PropType = {
  taobaoDetail: any;
};

type StateType = {
  fileNamePath: string;
  activeKey: string;
  tabsItems: any;
  loadType: number;
  total: number;
  currentAmount: number;
  loading: boolean;
};
class PupupPage extends React.Component<PropType, StateType> {
  constructor(props: PropType | Readonly<PropType>) {
    super(props);
    this.state = {
      fileNamePath: '',
      total: 0,
      currentAmount: 0,
      activeKey: 'mian',
      tabsItems: [
        {
          label: (
            <span>
              <WindowsOutlined />
              主图
            </span>
          ),
          key: 'mian',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <PictureOutlined />
              详情
            </span>
          ),
          key: 'detail',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <PictureOutlined />
              SKU
            </span>
          ),
          key: 'sku',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <YoutubeOutlined />
              视频
            </span>
          ),
          key: 'video',
          currentAmount: 0,
          data: [],
        },
        {
          label: (
            <span>
              <ContainerOutlined />
              文本
            </span>
          ),
          key: 'attr',
          currentAmount: 0,
          data: [],
        },
      ],
      loadType: 1,
      loading: false,
    };
  }
  // 点击tab切换
  tabsChange = (activeKey: any) => {
    console.log('activeKey:', activeKey);
    const { tabsItems } = this.state;
    const tabsObj = {};
    tabsItems.map((item: { key: string }) => {
      // @ts-ignore
      tabsObj[item.key] = item;
    });
    // @ts-ignore
    let currentAmount = tabsObj[activeKey].currentAmount;
    this.setState({
      activeKey,
      currentAmount,
    });
  };
  // 选择
  radioChange = (value: any) => {
    this.setState({
      loadType: value.target.value,
    });
  };
  // 现在按钮事件
  downloadEvent = () => {
    const { loadType, activeKey, tabsItems, fileNamePath } = this.state;
    const urlPath: {}[] = [];
    const tabsItemsObj = {};
    // @ts-ignore
    tabsItems.map((item) => {
      // @ts-ignore
      tabsItemsObj[item.key] = item;
    });
    // @ts-ignore
    if (loadType === 1) {
      // @ts-ignore
      // eslint-disable-next-line array-callback-return
      tabsItems.map((list) => {
        if (list.key) {
          list.data &&
            list.data.length &&
            // eslint-disable-next-line array-callback-return
            list.data.map((item: { src: any; path: string; title: string }) => {
              const obj = {};
              // @ts-ignore
              obj['src'] = item.imgSrc;
              // @ts-ignore
              obj['filename'] = item.filename;
              // @ts-ignore
              obj['filenamePath'] = fileNamePath + '/' + item.from + '/' + item.filename;
              urlPath.push(obj);
            });
        }
      });
    } else {
      if (activeKey) {
        // @ts-ignore
        const tabsData = tabsItemsObj[activeKey] && tabsItemsObj[activeKey].data;
        // eslint-disable-next-line array-callback-return
        tabsData.map((item: { src: any; path: string; title: string }) => {
          const obj = {};
          // @ts-ignore
          obj['src'] = item.imgSrc;
          // @ts-ignore
          obj['filename'] = item.filename;
          // @ts-ignore
          obj['filenamePath'] = fileNamePath + '/' + item.from + '/' + item.filename;
          urlPath.push(obj);
        });
      }
    }
    console.log('urlPath:', urlPath);
    if (urlPath && urlPath.length) {
      if (chrome && chrome.downloads) {
        // eslint-disable-next-line array-callback-return
        urlPath.map((item) => {
          console.log('chrome.downloads:', item);
          chrome.downloads.download(
            {
              // @ts-ignore
              url: item.src,
              // @ts-ignore
              filename: item.filenamePath,
              saveAs: false,
              conflictAction: 'overwrite',
            },
            function (downloadId: number) {
              console.log(downloadId);
            }
          );
        });
      }
      this.setState(
        {
          loading: true,
        },
        () => {
          setTimeout(() => {
            this.setState({
              loading: false,
            });
          }, 5000);
        }
      );
    } else {
      console.log('不存在下载资源');
    }
  };
  // 列表下载
  itemDownloadEvent = (item: any) => {
    console.log('item:', item);
    if (item && item.imgSrc && chrome && chrome.downloads) {
      chrome.downloads.download(
        {
          // @ts-ignore
          url: item.imgSrc,
          // @ts-ignore
          filename: item.filenamePath,
          saveAs: false,
        },
        function (downloadId: number) {
          console.log(downloadId);
        }
      );
    }
  };
  // 打开新窗口
  openTargeWindow = (item: { imgSrc: string }) => {
    window.open(item.imgSrc, '_blank');
  };

  // 获取tab item
  async componentDidMount() {
    console.log('onload');
    const { tabsItems, activeKey } = this.state;
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'popup-refresh' }, (res) => {
        console.log('popup-refresh-res-1:', res);
      });
      console.log('onload-refresh', 'componentDidMount');
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('popup sender:', sender);
        if (request.type === 'content-data') {
          console.log('popup-content-data-taobaoDetail', request);
          sendResponse(request);
          // 判断是否存在SKU
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const sequence: ({ key: string; currentAmount: number } & { data: any })[] = [];
          // eslint-disable-next-line array-callback-return
          tabsItems.map((item: { key: string }) => {
            if (item && item.key) {
              const key = item.key;
              if (request.taobaoDetail[key] && request.taobaoDetail[key].length > 0) {
                sequence.push(
                  Object.assign({}, item, {
                    data: request.taobaoDetail[key] || [],
                    currentAmount:
                      (request.taobaoDetail[key] && request.taobaoDetail[key].length) || 0,
                  })
                );
              }
            }
          });
          let total = 0;
          let tabsObj = {};
          // eslint-disable-next-line array-callback-return
          sequence.map((item) => {
            total = total + item.currentAmount;
            console.log('total:', total);
            // @ts-ignore
            tabsObj[item.key] = item;
          });

          this.setState({
            tabsItems: sequence,
            fileNamePath: request.fileNamePath,
            total,
            // @ts-ignore
            currentAmount: tabsObj[activeKey].currentAmount,
          });
        }
        if (request.type === 'download') {
          sendResponse(request);
          this.setState({
            loading: request.loading || false,
          });
        }
      });
    }
  }

  // popup-body render html
  popupBodyHtml = () => {
    let html;
    const { activeKey, tabsItems } = this.state;
    const tabsItemsNew = {};

    tabsItems.map((item: { key: string }) => {
      // @ts-ignore
      tabsItemsNew[item.key] = item;
    });
    // @ts-ignore
    const tabData = tabsItemsNew[activeKey];
    console.log('tabData:', tabData);
    switch (activeKey) {
      case 'mian':
        // @ts-ignore
        html = (
          <>
            {tabData && tabData.data[0] && tabData.data[0].msg && (
              <Alert message={'123456'} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
      case 'detail':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
      case 'sku':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
      case 'video':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <VideoItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></VideoItemList>
          </>
        );
        break;
      case 'attr':
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <TxItemList data={tabData.data}></TxItemList>
          </>
        );
        break;
      default:
        // @ts-ignore
        html = (
          <>
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <ImgItemList
              data={tabData.data}
              itemDownloadEvent={this.itemDownloadEvent}
              openTargeWindow={this.openTargeWindow}
            ></ImgItemList>
          </>
        );
        break;
    }
    return html;
  };

  render() {
    return (
      <>
        <div className="popup-wrap">
          <div className="popup-header">
            <span className="title">
              <FileSearchOutlined style={{ color: '#1677ff', fontSize: '17px' }} /> 当前页面资源
            </span>
            <Tabs
              onChange={this.tabsChange}
              defaultActiveKey={this.state.activeKey}
              items={this.state.tabsItems}
            />
          </div>
          <div className="popup-tool">
            <span className="title"></span>
            <span className="dlbox">
              <span>
                <Radio.Group size="small" onChange={this.radioChange} value={this.state.loadType}>
                  <Radio value={1}>全部</Radio>
                  <Radio value={2}>当前</Radio>
                </Radio.Group>
              </span>
              <span className="num">
                {this.state.currentAmount}/{this.state.total}
              </span>
              <span>
                <Button
                  size="small"
                  type="primary"
                  onClick={this.downloadEvent}
                  loading={this.state.loading}
                  icon={<DownloadOutlined />}
                >
                  下载
                </Button>
              </span>
            </span>
          </div>
          <div className="popup-body">{this.popupBodyHtml()}</div>
          <div className="popup-footer">
            <span>
              <ExclamationCircleOutlined style={{ color: '#333', fontSize: '20px' }} />
            </span>
            <span>
              <SettingOutlined style={{ color: '#333', fontSize: '20px' }} />
            </span>
          </div>
        </div>
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PupupPage taobaoDetail={{ key: 'popup' }} />
  </React.StrictMode>
);
