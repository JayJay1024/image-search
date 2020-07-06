import React, { useState } from 'react';
import axios from 'axios';

import { Input } from 'antd';
const { Search } = Input;

// const flickrAPI = 'https://goo.gl/BtPbZW';  // blocked by CORS
const flickrAPI2 = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=kittens';


const generateImgUrl = (farm: string, server: string, id: string, secret: string) => {
    return `http://farm` + farm + `.static.flickr.com/` + server + `/` + id + `_` + secret + `.jpg`;
}

const SearchImage: React.FunctionComponent = (): JSX.Element => {
    const [imgsPath, setImgsPath] = useState<string[]>([]);

    const onSearchHandle = (value: string) => {
        // console.log(value);

        axios.get(flickrAPI2)
            .then((res) => {
                if (res.status === 200 && res.data.photos && res.data.photos.photo.length) {
                    const photoMeta = res.data.photos.photo;
                    photoMeta.forEach((element: any) => {
                        if (element.title.indexOf(value) !== -1) {
                            // add to display
                            const { farm, server, id, secret } = element;
                            const imgPath = generateImgUrl(farm, server, id, secret);
                            setImgsPath((prev) => {
                                prev.push(imgPath)
                                return prev;
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                console.error(err)
            });
    }

    return (
        <div style={{ marginTop: "60px" }}>
            <Search
                placeholder="input search text"
                onSearch={onSearchHandle}
                style={{ width: 520 }}
            />
        </div>
    );
};


export default SearchImage;
