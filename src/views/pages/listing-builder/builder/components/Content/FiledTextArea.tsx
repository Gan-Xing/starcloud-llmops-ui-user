import { useListing } from 'contexts/ListingContext';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';

const mergeArray = (arr: any[]) => {
    const mergedArray = [];
    // 创建一个对象用于存储合并后的数据
    const mergedData: any = {};

    arr.forEach((item) => {
        const key = item.five_des ? `${item.type}-${item.text}-${item.five_des}` : `${item.type}-${item.text}`;

        if (!mergedData[key]) {
            // 如果当前 key 不存在，创建一个新的对象
            mergedData[key] = { ...item };
        } else {
            // 如果 key 已存在，将 num 相加
            mergedData[key].num += item.num;
        }
    });

    // 将合并后的对象转为数组
    for (const key in mergedData) {
        mergedArray.push(mergedData[key]);
    }

    return mergedArray;
};

const FiledTextArea = ({ rows, value, handleInputChange, placeholder, index, highlightWordList, type }: any) => {
    const [currentList, setCurrentList] = useState<any>([]);
    const { list, setKeywordHighlight } = useListing();

    const resultArray = useMemo(() => {
        const copyHighlightWordList = [...highlightWordList];
        copyHighlightWordList.sort((a: string, b: string) => b.length - a.length);
        const r = `(${copyHighlightWordList.join('|')})`;
        const pattern = new RegExp(r);
        const resultArray = value?.split(pattern).filter((item: string) => item !== '');
        return resultArray;
    }, [highlightWordList, value]);

    useEffect(() => {
        const copyList = _.clone(list);
        const data: any = [];
        resultArray?.map((item: string) => {
            copyList[index].keyword.forEach((item1) => {
                if (item1.text === item) {
                    if (type !== ListingBuilderEnum.FIVE_DES) {
                        data.push({ text: item1.text, type, num: 1 });
                    } else {
                        data.push({
                            text: item1.text,
                            type,
                            num: 1,
                            fiveType: `${ListingBuilderEnum.FIVE_DES}_${index}`
                        });
                    }
                }
            });
        });
        setCurrentList(data);
    }, [resultArray]);

    useEffect(() => {
        const result = mergeArray(currentList);
        setKeywordHighlight(result);
    }, [currentList]);

    const handleChange = (e: any) => {
        handleInputChange(e, index);
    };

    return (
        <div className="relative w-full">
            <div className="break-words w-full h-full absolute p-[2px]">
                {resultArray?.map((item: any) => (
                    <pre
                        className={`${
                            highlightWordList.includes(item)
                                ? 'text-transparent inline whitespace-pre-wrap text-sm font-[monospace] bg-[#ffaca6]'
                                : 'text-transparent inline whitespace-pre-wrap text-sm font-[monospace]'
                        }`}
                    >
                        {item}
                    </pre>
                ))}
            </div>
            <textarea
                rows={rows}
                placeholder={placeholder}
                spellCheck="false"
                value={value}
                onChange={(e) => handleChange(e)}
                style={{ background: 'none' }}
                className="border-[#e6e8ec] border-l-0 border-r-0 text-sm relative z-10 w-full"
            />
        </div>
    );
};

export default React.memo(FiledTextArea);
