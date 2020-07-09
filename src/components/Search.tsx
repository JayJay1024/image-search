import React, { useState } from 'react';
import './Seach.less';

import axios from 'axios';
import { Button, Input, List } from 'antd';
const { Search } = Input;

const perPageImgCount = 16;  // 4 * 4
// const flickrAPI = 'https://goo.gl/BtPbZW';  // blocked by CORS
const flickrAPI2 = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=kittens';

type DislayType = {
    title: string,
    path: string
}

const generateImgUrl = (farm: string, server: string, id: string, secret: string) => {
    return `http://farm` + farm + `.static.flickr.com/` + server + `/` + id + `_` + secret + `.jpg`;
}

const SearchImage: React.FunctionComponent = (): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [allImgs, setAllImgs] = useState<DislayType[]>([]);          // the filtered images
    const [displayImgs, setDispalyImgs] = useState<DislayType[]>([]);  // display on the current page

    const onSearchHandle = (value: string) => {
        if (value.length <= 0) { return; }
        setLoading(true);

        axios.get(flickrAPI2)
            .then((res) => {
                if (res.status === 200 && res.data.photos && res.data.photos.photo.length) {
                    const tmpImgs: DislayType[] = [];
                    const photoMeta = res.data.photos.photo;

                    photoMeta.forEach((element: any) => {
                        if (element.title.indexOf(value) !== -1) {
                            // add to display
                            const { farm, server, id, secret, title } = element;
                            const imgPath = generateImgUrl(farm, server, id, secret);
                            tmpImgs.push({
                                title: title,
                                path: imgPath
                            });
                        }
                    });
                    
                    if (tmpImgs.length) {
                        const moreImgs = tmpImgs.slice(0, perPageImgCount);
                        tmpImgs.splice(0, perPageImgCount)
                        setAllImgs(tmpImgs);
                        setDispalyImgs(displayImgs.concat(moreImgs));
                        setLoading(false);
                    }
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error(err)
            });
    }

    const onLoadMoreHandle = () => {
        if (allImgs.length) {
            const moreImgs = allImgs.slice(0, perPageImgCount);
            allImgs.splice(0, perPageImgCount)
            setAllImgs(allImgs);
            setDispalyImgs(displayImgs.concat(moreImgs));
            window.dispatchEvent(new Event('resize'));
        }
    }

    const loadMore = allImgs.length ? (
        <div
            style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
            }}
        >
        <Button onClick={onLoadMoreHandle}>loading more</Button>
      </div>
    ) : null;

    return (
        <div className='page'>
            <Search
                className='seach-input'
                placeholder="input search text"
                onSearch={onSearchHandle}
                style={{ width: 520 }}
            />
            <List
                className='seach-display'
                loading={loading}
                loadMore={loadMore}
                itemLayout="horizontal"
                grid={{ gutter: 16, column: 4 }}
                dataSource={displayImgs}
                renderItem={(item: DislayType) => (
                    <List.Item>
                        <img alt={item.title} width={272} src={item.path}></img>
                    </List.Item>
                )}
            />
        </div>
    );
};


export default SearchImage;
