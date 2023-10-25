import { getGrade } from 'api/listing/build';
import _ from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';
import { COUNTRY_LIST, DEFAULT_LIST } from 'views/pages/listing-builder/data';

type CountryType = {
    key: string;
    icon: string;
    label: string;
};
type ListType = {
    title: string;
    des: JSX.Element | string;
    placeholder: string;
    type: ListingBuilderEnum;
    maxCharacter: number;
    character: number;
    word: number;
    isOvertop?: boolean;
    value?: string;
    row: number;
    btnText: string;
    enable: boolean;
    keyword: { text: string; recommend: number }[];
};

const ListingContext = createContext<ListingContextType | null>(null);

type keywordHighlightType = {
    text: string;
    num: number;
    type: ListingBuilderEnum;
    fiveType?: string;
}[][];

type ListingContextType = {
    uid: string;
    setUid: (uid: string) => void;
    version: number | undefined;
    setVersion: (version: number) => void;
    country: CountryType;
    setCountry: (country: CountryType) => void;
    list: ListType[];
    setList: (list: any) => void;
    enableAi: boolean;
    setEnableAi: (enableAi: boolean) => void;
    setKeywordHighlight: (keywordHighlight: keywordHighlightType) => void;
    keywordHighlight: keywordHighlightType;
    setUpdate: (update: object) => void;
    update: object;
    setDetail: (detail: any) => void;
    detail: any;
};

export const ListingProvider = ({ children }: { children: React.ReactElement }) => {
    const [uid, setUid] = useState('');
    const [version, setVersion] = useState<number | undefined>();
    const [country, setCountry] = useState({
        key: COUNTRY_LIST?.['0']?.key,
        icon: COUNTRY_LIST?.['0']?.icon,
        label: COUNTRY_LIST?.['0']?.label
    });
    const [list, setList] = useState<ListType[]>(DEFAULT_LIST);
    const [enableAi, setEnableAi] = useState(true);
    const [keywordHighlight, setKeywordHighlight] = useState<keywordHighlightType | []>([]);
    const [detail, setDetail] = useState<any>(null);
    const [update, setUpdate] = useState<object>({});

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryUid = searchParams.get('uid');
    const queryVersion = searchParams.get('version');

    useEffect(() => {
        if (queryVersion && queryUid) {
            setVersion(Number(queryVersion));
            setUid(queryUid);
        }
    }, [queryUid, queryVersion]);

    // 回显推荐关键词 & 是否开启
    useEffect(() => {
        if (detail?.draftConfig) {
            const copyList = _.cloneDeep(list);
            // 标题
            copyList[0].enable = !detail.draftConfig.titleConfig.ignoreUse;
            copyList[0].keyword = detail.draftConfig.titleConfig?.recommendKeys?.map((item: any) => ({ text: item.keyword })) || [];

            //描述
            copyList[detail.draftConfig?.fiveDescNum + 1].enable = !detail.draftConfig.productDescConfig.ignoreUse;
            copyList[detail?.draftConfig.fiveDescNum + 1].keyword =
                detail.draftConfig.productDescConfig.recommendKeys?.map((item: any) => ({
                    text: item.keyword,
                    recommend: 1
                })) || [];

            // 搜索
            copyList[detail.draftConfig?.fiveDescNum + 2].enable = !detail.draftConfig?.searchTermConfig?.ignoreUse;
            copyList[detail.draftConfig?.fiveDescNum + 2].keyword =
                detail.draftConfig?.searchTermConfig.recommendKeys?.map((item: any) => ({
                    text: item.keyword,
                    recommend: 1
                })) || [];

            // // 5点描述
            Object.keys(detail?.draftConfig?.fiveDescConfig).forEach((key) => {
                const index = Number(key);
                copyList[index].enable = !detail.draftConfig?.fiveDescConfig[key]?.ignoreUse;
                copyList[index].keyword =
                    detail.draftConfig?.fiveDescConfig[key]?.recommendKeys?.map((item: any) => ({
                        text: item.keyword
                    })) || [];
            });
            setList(copyList);
        }
    }, [detail]);

    useEffect(() => {
        // const timer = setTimeout(() => {
        //     getGrade({}).then((res) => {});
        // }, 500);
        // return () => {
        //     // 在每次状态变化时，清除之前的计时器
        //     clearTimeout(timer);
        // };
    }, [list]);

    return (
        <ListingContext.Provider
            value={{
                uid,
                setUid,
                version,
                setVersion,
                country,
                setCountry,
                list,
                setList,
                enableAi,
                setEnableAi,
                keywordHighlight,
                setKeywordHighlight,
                setDetail,
                detail,
                setUpdate,
                update
            }}
        >
            {children}
        </ListingContext.Provider>
    );
};

export const useListing = () => {
    const context = useContext(ListingContext);
    return context!;
};
