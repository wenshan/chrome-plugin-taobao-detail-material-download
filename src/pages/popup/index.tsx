import React from 'react';
import ReactDOM from 'react-dom/client';
import { Tabs, Alert } from 'antd';
import {
  YoutubeOutlined,
  WindowsOutlined,
  ContainerOutlined,
  PictureOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import Analytics from '../../scripts/google-analytics';
import ImgItemList from './component/imgItemList';
import VideoItemList from './component/videoItemList';
import TxItemList from './component/txItemList';
import './index.scss';

type PropType = {
  taobaoDetail: any;
};

type StateType = {
  activeKey: string;
  taobaoDetail: any;
  tabsItems: any;
};
class PupupPage extends React.Component<PropType, StateType> {
  constructor(props: PropType | Readonly<PropType>) {
    super(props);
    this.state = {
      activeKey: 'mian',
      taobaoDetail: {
        detailImgs: [
          {
            filename: 'main_1.jpg',
            format: 'JPG',
            from: 'main',
            imgSrc:
              'https://gd3.alicdn.com/imgextra/i1/2210949481850/O1CN01DJ7Mpq1PXLU7vCQu4_!!2210949481850.jpg',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://gd3.alicdn.com/imgextra/i1/2210949481850/O1CN01DJ7Mpq1PXLU7vCQu4_!!2210949481850.jpg',
            title: 'main_1',
            type: 'img',
          },
          {
            filename: 'main_2.jpg',
            format: 'JPG',
            from: 'main',
            imgSrc:
              'https://gd1.alicdn.com/imgextra/i1/2210949481850/O1CN01pN7zTj1PXLQgCIY49_!!2210949481850.jpg',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://gd1.alicdn.com/imgextra/i1/2210949481850/O1CN01pN7zTj1PXLQgCIY49_!!2210949481850.jpg',
            title: 'main_2',
            type: 'img',
          },
        ],
        maiImgs: [
          {
            filename: 'main_1.jpg',
            format: 'JPG',
            from: 'main',
            imgSrc:
              'https://gd3.alicdn.com/imgextra/i1/2210949481850/O1CN01DJ7Mpq1PXLU7vCQu4_!!2210949481850.jpg',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://gd3.alicdn.com/imgextra/i1/2210949481850/O1CN01DJ7Mpq1PXLU7vCQu4_!!2210949481850.jpg',
            title: 'main_1',
            type: 'img',
          },
          {
            filename: 'main_2.jpg',
            format: 'JPG',
            from: 'main',
            imgSrc:
              'https://gd1.alicdn.com/imgextra/i1/2210949481850/O1CN01pN7zTj1PXLQgCIY49_!!2210949481850.jpg',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://gd1.alicdn.com/imgextra/i1/2210949481850/O1CN01pN7zTj1PXLQgCIY49_!!2210949481850.jpg',
            title: 'main_2',
            type: 'img',
          },
        ],
        videos: [
          {
            filename: 'main_0.mp4',
            format: 'MP4',
            from: 'main',
            imgSrc:
              'https://www.dreamstep.top/m3u8_download/86siV0it3NjVG3TdoJQ_336860353925_async_m3u8_264_hd_0.mp4',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://img.alicdn.com/imgextra/i3/6000000006281/O1CN01r81iTy1wGkPElE9bW_!!6000000006281-0-tbvideo.jpg',
            title: 'main_0',
            type: 'video',
          },
          {
            filename: 'main_0.mp4',
            format: 'MP4',
            from: 'main',
            imgSrc:
              'https://www.dreamstep.top/m3u8_download/86siV0it3NjVG3TdoJQ_336860353925_async_m3u8_264_hd_0.mp4',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://img.alicdn.com/imgextra/i3/6000000006281/O1CN01r81iTy1wGkPElE9bW_!!6000000006281-0-tbvideo.jpg',
            title: 'main_0',
            type: 'video',
          },
        ],
        attributes: [
          {
            des: ['品牌: limeet', '货号: LT0001-BCDEF', '材质: 实木 桦木 多层板'],
          },
        ],
        classifySkuImgs: [
          {
            filename: 'main_1.jpg',
            format: 'JPG',
            from: 'main',
            imgSrc:
              'https://gd3.alicdn.com/imgextra/i1/2210949481850/O1CN01DJ7Mpq1PXLU7vCQu4_!!2210949481850.jpg',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://gd3.alicdn.com/imgextra/i1/2210949481850/O1CN01DJ7Mpq1PXLU7vCQu4_!!2210949481850.jpg',
            title: 'main_1',
            type: 'img',
          },
          {
            filename: 'main_2.jpg',
            format: 'JPG',
            from: 'main',
            imgSrc:
              'https://gd1.alicdn.com/imgextra/i1/2210949481850/O1CN01pN7zTj1PXLQgCIY49_!!2210949481850.jpg',
            path: '猫咪益智慢食游戏盒猫洞玩具减肥自嗨解闷拼搭木制喂食零食猫玩具-淘宝网',
            size: '800x800',
            src: 'https://gd1.alicdn.com/imgextra/i1/2210949481850/O1CN01pN7zTj1PXLQgCIY49_!!2210949481850.jpg',
            title: 'main_2',
            type: 'img',
          },
        ],
      },
      tabsItems: [
        {
          label: (
            <span>
              <WindowsOutlined />
              主图
            </span>
          ),
          key: 'mian',
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
          data: [],
        },
      ],
    };
  }
  // 点击tab切换
  tabsChange = (activeKey: any) => {
    console.log('activeKey:', activeKey);
    this.setState({
      activeKey,
    });
  };
  // 获取tab item
  componentDidMount() {
    console.log('onload');
    const { tabsItems } = this.state;
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'refresh' });
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('popup sender:', sender);
        if (request && request.taobaoDetail) {
          console.log('popup-taobaoDetail', request);
          // 判断是否存在SKU
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const sequence: ({ key: string } & { data: any })[] = [];
          // eslint-disable-next-line array-callback-return
          tabsItems.map((item: { key: string }) => {
            if (item && item.key) {
              const key = item.key;
              if (request.taobaoDetail[key] && request.taobaoDetail[key].length > 0) {
                sequence.push(Object.assign({}, item, { data: request.taobaoDetail[key] || [] }));
              }
            }
          });
          console.log('sequence:', sequence);

          this.setState({
            tabsItems: sequence,
          });
          // showLinks(request);
          sendResponse(true);
        } else {
          alert('无数据');
        }
      });
      // GA
      // Fire a page view event on load
      window.addEventListener('load', () => {
        Analytics.firePageViewEvent(document.title, document.location.href);
      });

      // Listen globally for all button events
      document.addEventListener('click', (event) => {
        if (event.target instanceof HTMLButtonElement) {
          Analytics.fireEvent('click_button', { id: event.target.id });
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
            {tabData.data[0] && tabData.data[0].msg && (
              <Alert message={tabData.data[0].msg} type="success" showIcon />
            )}
            <ImgItemList data={tabData.data}></ImgItemList>
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
            <ImgItemList data={tabData.data}></ImgItemList>
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
            <ImgItemList data={tabData.data}></ImgItemList>
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
            <VideoItemList data={tabData.data}></VideoItemList>
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
            <ImgItemList data={tabData.data}></ImgItemList>
          </>
        );
        break;
    }
    return html;
  };

  render() {
    console.log('popup-render:', this.state);
    return (
      <>
        <div className="popup-wrap">
          <div className="popup-header">
            <span className="title">
              <FileSearchOutlined style={{ color: '#1677ff', fontSize: '17px' }} /> 淘宝资源
            </span>
            <Tabs
              onChange={this.tabsChange}
              defaultActiveKey={this.state.activeKey}
              items={this.state.tabsItems}
            />
          </div>
          <div className="popup-body">{this.popupBodyHtml()}</div>
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
